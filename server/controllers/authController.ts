import { Request, Response } from "express";
import User from "../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../db/index";
import { usersInVidya } from "../db/schema";
import { eq } from "drizzle-orm";

const JWT_SECRET = process.env.JWT_SECRET!;

export const register = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    // 1. Check existing in Mongo
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);

    // 2. PRIMARY WRITE: MongoDB (Legacy)
    const mongoUser = await User.create({ name, email, password: hashed });

    // 3. SHADOW WRITE: PostgreSQL (VidyaCore)
    try {
      await db.insert(usersInVidya).values({
        username: name || email.split('@')[0], // Map name to username
        email: email,
        passwordHash: hashed,
        role: 'SEEKER',
        isActive: true,
        metadata: { full_name: name, source: "migration_shadow_write" }
      });
      console.log(`[Shadow Write] User ${email} synced to PostgreSQL successfully.`);
    } catch (pgErr: any) {
      console.error(`[Shadow Write Error] Failed to sync ${email} to Postgres:`, pgErr.message);
      // We don't block the response if Postgres fails during this transition phase
    }

    const token = jwt.sign({ id: mongoUser._id }, JWT_SECRET, { expiresIn: "7d" });
    res.status(201).json({ token, user: { id: mongoUser._id, name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Current Login still uses Mongo as source of truth
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Login failed" });
  }
};
