/**
 * Log Controllers
 *
 * Handle HTTP requests for activity logs.
 */
import { ActivityLog } from "../domain/ActivityLog.js";
import { logRepository } from "../infrastructure/database/LogRepository.js";

export const createLog = async (req, res, kafkaProducer) => {
  try {
    const log = new ActivityLog(req.body);
    log.validate();

    await kafkaProducer.sendLog(log.toJSON());

    res.status(202).json({
      status: "accepted",
      message: "Log sent to Kafka for processing",
      data: log.toJSON(),
    });
  } catch (error) {
    console.error("Failed to send log to Kafka:", error);
    res.status(500).json({ error: error.message });
  }
};

export const getLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const { level, source } = req.query;

    const result = await logRepository.findWithPagination({
      page,
      limit,
      level,
      source,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch logs:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};

export const getLogsBySource = async (req, res) => {
  try {
    const { source } = req.params;
    const logs = await logRepository.findBySource(source);
    res.status(200).json(logs);
  } catch (error) {
    console.error("Failed to fetch logs by source:", error);
    res.status(500).json({ error: "Failed to fetch logs" });
  }
};
