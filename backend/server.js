require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
app.use(cors());
app.use(express.json());

// Use DATABASE_URL from .env (Neon connection string)
const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

// Create pool with SSL support (Neon requires TLS)
const pool = new Pool({
  connectionString,
  ssl: {
    // Node's pg needs this for some managed providers. Good for development.
    rejectUnauthorized: false
  }
});

// ensure users table exists (run once on startup)
async function ensureTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      username TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS login_attempts (
      email TEXT PRIMARY KEY,
      attempts INT NOT NULL DEFAULT 0,
      blocked_until TIMESTAMPTZ
    );
  `);
}

pool.connect()
  .then(async (client) => {
    client.release();
    console.log("Connected to Neon Postgres");
    await ensureTable();
  })
  .catch(err => {
    console.error("Unable to connect to Neon:", err);
    process.exit(1);
  });

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    if (exists.rowCount > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at;`,
      [username, email, password]
    );

    res.json({ success: true, user: result.rows[0] });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/users', async (req, res) => {
  try {
    const r = await pool.query('SELECT id, username, email, created_at FROM users ORDER BY id DESC LIMIT 100');
    res.json(r.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

// LOGIN endpoint with lockout protection
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // 1. Check if this email is blocked
    const attemptRes = await pool.query(
      'SELECT attempts, blocked_until FROM login_attempts WHERE email = $1',
      [email]
    );

    if (attemptRes.rowCount > 0) {
      const { attempts, blocked_until } = attemptRes.rows[0];

      // If blocked_until is in the future → block
      if (blocked_until && new Date(blocked_until) > new Date()) {
        const minutesLeft = Math.ceil(
          (new Date(blocked_until) - new Date()) / 60000
        );
        return res.status(403).json({
          error: `Too many attempts. Try again in ${minutesLeft} minutes.`,
        });
      }
    }

    // 2. Check if user exists
    const q =
      'SELECT id, username, email, password FROM users WHERE email = $1';
    const r = await pool.query(q, [email]);

    if (r.rowCount === 0) {
      await recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = r.rows[0];  

    // (for now raw password, as requested)
    if (user.password !== password) {
      await recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // 3. SUCCESS → reset attempts
    await pool.query(
      'DELETE FROM login_attempts WHERE email = $1',
      [email]
    );

    delete user.password;

    return res.json({ success: true, user });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

// Function that handles failed attempts
async function recordFailedAttempt(email) {
  const existing = await pool.query(
    'SELECT attempts FROM login_attempts WHERE email = $1',
    [email]
  );

  if (existing.rowCount === 0) {
    // insert first attempt
    await pool.query(
      'INSERT INTO login_attempts (email, attempts) VALUES ($1, 1)',
      [email]
    );
  } else {
    const attempts = existing.rows[0].attempts + 1;

    if (attempts >= 5) {
      // block for 5 minutes
      const blockedUntil = new Date(Date.now() + 5 * 60 * 1000);
      await pool.query(
        'UPDATE login_attempts SET attempts = $1, blocked_until = $2 WHERE email = $3',
        [attempts, blockedUntil, email]
      );
    } else {
      // just increment attempts
      await pool.query(
        'UPDATE login_attempts SET attempts = $1 WHERE email = $2',
        [attempts, email]
      );
    }
  }
}


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
