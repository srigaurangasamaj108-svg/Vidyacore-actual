const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { pool } = require("./db"); // Parallel Postgres Engine

dotenv.config();

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

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/goals", goalRoutes);
app.get("/", (req,res) => {
  res.send({
    activeStatus:true,
    postgresStatus: "Connected",
    error:false,
  })
})

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    // Verify Postgres Connection
    try {
      const client = await pool.connect();
      console.log("PostgreSQL connected successfully (VidyaCore Master Schema)");
      client.release();
    } catch (err) {
      console.error("PostgreSQL connection error:", err.message);
    }

    app.listen(PORT, () => console.log(`Server running on port: http://localhost:${PORT}`));
  })
  .catch(err => console.error("MongoDB connection error:", err));
