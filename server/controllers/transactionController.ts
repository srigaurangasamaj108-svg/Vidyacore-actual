import { Request, Response } from "express";
import Transaction from "../models/Transaction";

export const createTransaction = async (req: any, res: Response) => {
  try {
    const { amount, category, type, date, description } = req.body;
    const transaction = await Transaction.create({
      user: req.user.id,
      amount,
      category,
      type,
      date,
      description,
    });
    res.status(201).json(transaction);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const getTransactions = async (req: any, res: Response) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};

export const deleteTransaction = async (req: any, res: Response) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
};
