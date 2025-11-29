require('dotenv').config();
console.log('DATABASE_URL exists:', !!process.env.DATABASE_URL);
console.log('JWT_SECRET exists:', !!process.env.JWT_SECRET);
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  console.error("Missing DATABASE_URL in .env");
  process.exit(1);
}

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false,
    require: true
  },
  connectionTimeoutMillis: 10000,
});

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
    try {
      await ensureTable();
      console.log("Connected to Neon Postgres and ensured tables exist");
    } finally {
      client.release();
    }
  })
  .catch(err => {
    console.error("Unable to connect to Neon:", err);
    process.exit(1);
  });

// JWT secret (fail fast if missing)
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
  console.error('Missing JWT_SECRET in .env');
  process.exit(1);
}

function signToken(payload, opts = {}) {
  const signOptions = Object.assign({ expiresIn: '1h' }, opts);
  return jwt.sign(payload, jwtSecret, signOptions);
}

async function recordFailedAttempt(email) {
  const existing = await pool.query(
    'SELECT attempts FROM login_attempts WHERE email = $1',
    [email]
  );

  if (existing.rowCount === 0) {
    await pool.query(
      'INSERT INTO login_attempts (email, attempts) VALUES ($1, 1)',
      [email]
    );
  } else {
    const attempts = existing.rows[0].attempts + 1;

    if (attempts >= 5) {
      const blockedUntil = new Date(Date.now() + 5 * 60 * 1000);
      await pool.query(
        'UPDATE login_attempts SET attempts = $1, blocked_until = $2 WHERE email = $3',
        [attempts, blockedUntil, email]
      );
    } else {
      await pool.query(
        'UPDATE login_attempts SET attempts = $1 WHERE email = $2',
        [attempts, email]
      );
    }
  }
}

app.post('/signup', async (req, res) => {
  try {
    console.log('Signup request body:', req.body); // Add this
    
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    console.log('Checking if email exists...'); // Add this
    const exists = await pool.query('SELECT id FROM users WHERE email=$1', [email]);
    
    if (exists.rowCount > 0) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    console.log('Inserting new user...'); // Add this
    const result = await pool.query(
      `INSERT INTO users (username, email, password)
       VALUES ($1, $2, $3)
       RETURNING id, username, email, created_at;`,
      [username, email, password]
    );

    console.log('User created:', result.rows[0]); // Add this
    // ... rest of code
  } catch (err) {
    console.error("Signup error:", err); // This should show the actual error
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

app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const attemptRes = await pool.query(
      'SELECT attempts, blocked_until FROM login_attempts WHERE email = $1',
      [email]
    );

    if (attemptRes.rowCount > 0) {
      const { attempts, blocked_until } = attemptRes.rows[0];
      if (blocked_until && new Date(blocked_until) > new Date()) {
        const minutesLeft = Math.ceil(
          (new Date(blocked_until) - new Date()) / 60000
        );
        return res.status(403).json({
          error: `Too many attempts. Try again in ${minutesLeft} minutes.`,
        });
      }
    }

    const q = 'SELECT id, username, email, password FROM users WHERE email = $1';
    const r = await pool.query(q, [email]);

    if (r.rowCount === 0) {
      await recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = r.rows[0];

    if (user.password !== password) {
      await recordFailedAttempt(email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    await pool.query('DELETE FROM login_attempts WHERE email = $1', [email]);

    const safeUser = {
      id: user.id,
      username: user.username,
      email: user.email,
      created_at: user.created_at || null
    };

    const token = signToken({ id: user.id, email: user.email });

    return res.json({ success: true, user: safeUser, token });

  } catch (err) {
    console.error('Login error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
});

function authenticateToken(req, res, next) {
  const auth = req.headers['authorization'];
  if (!auth) return res.status(401).json({ error: 'No token provided' });
  const parts = auth.split(' ');
  if (parts.length !== 2) return res.status(401).json({ error: 'Malformed token' });
  const scheme = parts[0];
  const token = parts[1];
  if (!/^Bearer$/i.test(scheme)) return res.status(401).json({ error: 'Malformed token' });

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ error: 'Invalid or expired token' });
    req.user = decoded;
    next();
  });
}

app.get('/me', authenticateToken, async (req, res) => {
  try {
    const r = await pool.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [req.user.id]);
    if (r.rowCount === 0) return res.status(404).json({ error: 'User not found' });
    res.json(r.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));