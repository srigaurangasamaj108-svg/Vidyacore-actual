import dotenv from "dotenv";
import express, { Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import { pool } from "./db/index"; // Parallel Postgres Engine

import * as trpcExpress from '@trpc/server/adapters/express';
import { appRouter } from './trpc/routers/index';
import { createContext } from './trpc/trpc';

dotenv.config();

// Standard Express Routes (Importing as JS modules for now)
const authRoutes = require("./routes/authRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const goalRoutes = require("./routes/goalRoutes");

console.log("JWT_SECRET is:", process.env.JWT_SECRET);
const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// tRPC Middleware (The Success Tunnel)
app.use(
  '/trpc',
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

// Legacy Routes
app.use("/api/auth", authRoutes);

app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);

app.get("/", (req: Request, res: Response) => {
  res.send({
    activeStatus: true,
    postgresStatus: "Connected",
    project: "VidyaCore Actual",
    error: false,
  });
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI!)
  .then(async () => {
    // Verify Postgres Connection
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected successfully (VidyaCore Master Schema)");
      client.release();
    } catch (err: any) {
      console.error("PostgreSQL connection error:", err.message);
    }

    app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));

