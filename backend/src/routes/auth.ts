import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();
const prisma = new PrismaClient();

interface LoginBody {
  email: string;
  password: string;
}

interface SignupBody {
  username: string;
  email: string;
  password: string;
}

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password }: SignupBody = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }
    // Validation de l'email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // Validation du mot de passe
    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    // Check if user already exists
    const existingUser = await prisma.users.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = await prisma.users.create({
      data: {
        email,
        password: hashedPassword,
        username,
      },
    });

    // Generate JWT token
    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );
    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.username,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

async function checkLoginAttempts(email: string) {
  const record = await prisma.login_attempts.findUnique({
    where: { email },
  });

  // Aucun enregistrement → OK
  if (!record) return { allowed: true };

  // Si bloqué
  if (record.blocked_until && new Date(record.blocked_until) > new Date()) {
    return {
      allowed: false,
      remaining: Math.ceil(
        (new Date(record.blocked_until).getTime() - Date.now()) / 1000
      ),
    };
  }

  return { allowed: true };
}

async function incrementLoginAttempts(email: string) {
  const record = await prisma.login_attempts.findUnique({ where: { email } });

  if (!record) {
    // Premier échec
    await prisma.login_attempts.create({
      data: {
        email,
        attempts: 1,
      },
    });
    return;
  }

  // Si déjà 2 échecs → bloquer
  if (record.attempts + 1 >= 3) {
    await prisma.login_attempts.update({
      where: { email },
      data: {
        attempts: 3,
        blocked_until: new Date(Date.now() + 60 * 1000), // 1 minute
      },
    });
    return;
  }

  // Sinon incrémenter simplement
  await prisma.login_attempts.update({
    where: { email },
    data: { attempts: record.attempts + 1 },
  });
}

async function resetLoginAttempts(email: string) {
  await prisma.login_attempts
    .delete({
      where: { email },
    })
    .catch(() => {}); // ignore si n'existe pas
}

router.post("/login", async (req, res) => {
  try {
    const { email, password }: LoginBody = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Vérifier si l'utilisateur est bloqué
    const attemptStatus = await checkLoginAttempts(email);
    if (!attemptStatus.allowed) {
      return res.status(429).json({
        message: `Too many attempts. Try again in ${attemptStatus.remaining} seconds`,
      });
    }

    const user = await prisma.users.findUnique({ where: { email } });
    if (!user) {
      await incrementLoginAttempts(email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      await incrementLoginAttempts(email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Login OK → reset attempts
    await resetLoginAttempts(email);

    const jwtToken = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "24h" }
    );

    return res.json({
      token: jwtToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.username,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
