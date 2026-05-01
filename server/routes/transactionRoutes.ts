import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createTransaction,
  getTransactions,
  deleteTransaction,
} from "../controllers/transactionController";

const router = express.Router();

router.post("/", authMiddleware as any, createTransaction as any);
router.get("/", authMiddleware as any, getTransactions as any);
router.delete("/:id", authMiddleware as any, deleteTransaction as any);

export default router;
