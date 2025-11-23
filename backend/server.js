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

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
