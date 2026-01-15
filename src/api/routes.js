/**
 * API Routes
 *
 * Define HTTP routes for the application.
 */
import express from "express";
import { createLog, getLogs, getLogsBySource } from "./controllers.js";

export function createRoutes(kafkaProducer) {
  const router = express.Router();

  // Health check
  router.get("/", (req, res) => {
    res.send("Welcome to EyeGo Backend Task API");
  });

  // Kubernetes health check endpoint
  router.get("/health", (req, res) => {
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      service: "eyego-task-api"
    });
  });

  // Create a new log
  router.post("/test-log", (req, res) => createLog(req, res, kafkaProducer));

  // Get all logs
  router.get("/test-log", getLogs);

  // Get logs by source
  router.get("/test-log/source/:source", getLogsBySource);

  return router;
}
