import express from "express";
import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { authenticateJWT, AuthRequest } from "../middleware/auth";

const router = express.Router();
const prisma = new PrismaClient();

router.get("/users", async (req, res) => {
  try {
    const users = await prisma.users.findMany({
      orderBy: { created_at: "desc" },
      take: 100,
      select: { id: true, username: true, email: true, created_at: true },
    });
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/me", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    res.json(req.user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/has-shop", authenticateJWT, async (req: AuthRequest, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(400).json({ error: "User ID missing" });
    }

    const shop = await prisma.stores.findFirst({
      where: { owner_id: userId },
      select: { id: true, name: true },
    });

    if (!shop) {
      return res.json({ hasShop: false });
    }

    return res.json({
      hasShop: true,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
