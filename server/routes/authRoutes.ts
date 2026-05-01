import express, { Request, Response } from "express";
import { register, login } from "../controllers/authController";
import { authMiddleware } from "../middleware/authMiddleware";
import User from "../models/User";

const router = express.Router();

router.post("/register", register as any);
router.post("/login", login as any);

// Get current user
router.get("/me", authMiddleware as any, async (req: any, res: Response) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
