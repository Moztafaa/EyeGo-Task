import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import { Kafka } from "kafkajs";
import ProcessedLog from "./Schema/ProcessedLog.js";

// load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Kafka Configuration
const kafka = new Kafka({
  clientId: "eyego-api",
  brokers: (process.env.KAFKA_BROKERS || "localhost:9092").split(","),
});

const producer = kafka.producer();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Sample route
app.get("/", (req, res) => {
  res.send("Welcome to EyeGo Backend Task API");
});

// POST /test-log: Takes a JSON body and sends it to Kafka topic.
app.post("/test-log", async (req, res) => {
  try {
    const { level, message, timestamp, source } = req.body;

    const logData = {
      level,
      message,
      timestamp,
      source,
    };

    // Send message to Kafka
    await producer.send({
      topic: "user-activity-logs",
      messages: [
        {
          value: JSON.stringify(logData),
        },
      ],
    });

    res.status(202).json({
      status: "accepted",
      message: "Log sent to Kafka for processing",
      data: logData,
    });
  } catch (error) {
    console.error("Failed to send log to Kafka:", error);
    res.status(500).json({ error: "Failed to send log to Kafka" });
  }
});

// GET /test-log: Fetches all logs from MongoDB.
app.get("/test-log", async (req, res) => {
  // try {
  //   const logs = await ProcessedLog.find();
  //   res.status(200).json(logs);
  // } catch (error) {
  //   res.status(500).json({ error: "Failed to fetch logs" });
  // }
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // build the filter object
    const filter = {};
    if (req.query.level) {
      filter.level = req.query.level;
    }
    if (req.query.source) {
      filter.source = req.query.source;
    }

    const logs = await ProcessedLog.find(filter)
      .sort({ timestamp: -1 }) // sort by timestamp descending
      .skip(skip)
      .limit(limit);

    const total = await ProcessedLog.countDocuments(filter);

    res.status(200).json({
      status: "success",
      results: logs.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: logs,
    });
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
});

// Initialize connections and start server
(async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    console.log("MongoDB connected");

    // Connect to Kafka Producer with simple retry
    let kafkaConnected = false;
    for (let i = 0; i < 10; i++) {
      try {
        await producer.connect();
        console.log("Kafka Producer connected");
        kafkaConnected = true;
        break;
      } catch (error) {
        console.log(`Waiting for Kafka... (${i + 1}/10)`);
        await new Promise((resolve) => setTimeout(resolve, 3000));
      }
    }

    if (!kafkaConnected) {
      throw new Error("Could not connect to Kafka");
    }

    // Start server only after connections are ready
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
