import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import ProcessedLog from "./Schema/ProcessedLog.js";

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MongoDB connection
mongoose
  .connect(process.env.DB_CONNECTION_STRING)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to EyeGo Backend Task API");
});

// POST /test-log: Takes a JSON body and saves a new ProcessedLog to MongoDB.
app.post("/test-log", async (req, res) => {
  try {
    const { level, message, timestamp, source } = req.body;

    const newLog = new ProcessedLog({
      level,
      message,
      timestamp,
      source,
    });

    const savedLog = await newLog.save();
    res.status(201).json(savedLog);
  } catch (error) {
    res.status(500).json({ error: "Failed to save log" });
  }
});

// GET /test-log: Fetches all logs from MongoDB.
app.get("/test-log", async (req, res) => {
  try {
    const logs = await ProcessedLog.find();
    res.status(200).json(logs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
