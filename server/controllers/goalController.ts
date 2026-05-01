import { Request, Response } from "express";
import Goal from "../models/Goal";

export const createGoal = async (req: any, res: Response) => {
  try {
    const { name, targetAmount, deadline } = req.body;
    const goal = await Goal.create({
      user: req.user.id,
      name,
      targetAmount,
      deadline,
    });
    res.status(201).json(goal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getGoals = async (req: any, res: Response) => {
  try {
    const goals = await Goal.find({ user: req.user.id });
    res.json(goals);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const updateGoalProgress = async (req: any, res: Response) => {
  try {
    const { currentAmount } = req.body;
    const goal = await Goal.findByIdAndUpdate(
      req.params.id,
      { currentAmount },
      { new: true }
    );
    res.json(goal);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteGoal = async (req: any, res: Response) => {
  try {
    await Goal.findByIdAndDelete(req.params.id);
    res.json({ message: "Goal deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
