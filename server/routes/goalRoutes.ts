import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  createGoal,
  getGoals,
  updateGoalProgress,
  deleteGoal,
} from "../controllers/goalController";

const router = express.Router();

router.post("/", authMiddleware as any, createGoal as any);
router.get("/", authMiddleware as any, getGoals as any);
router.patch("/:id", authMiddleware as any, updateGoalProgress as any);
router.delete("/:id", authMiddleware as any, deleteGoal as any);

export default router;
