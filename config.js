import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Server
  port: process.env.PORT || 3000,

  // Database
  database: {
    connectionString:
      process.env.DB_CONNECTION_STRING ||
      "mongodb://localhost:27017/eyego-activity-logs",
  },

  // Kafka
  kafka: {
    brokers: process.env.KAFKA_BROKERS || "localhost:9092",
  },
};
