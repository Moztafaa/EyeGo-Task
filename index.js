/**
 * API Entry Point
 *
 * Initializes and starts the Express API server.
 */
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { config } from "./config.js";
import { connectDatabase } from "./src/infrastructure/database/connection.js";
import { KafkaProducer } from "./src/infrastructure/kafka/producer.js";
import { createRoutes } from "./src/api/routes.js";

const app = express();

app.use(bodyParser.json());
app.use(cors());

(async () => {
  try {
    await connectDatabase(config.database.connectionString);

    const kafkaProducer = new KafkaProducer(config.kafka.brokers);
    await kafkaProducer.connect();

    app.use(createRoutes(kafkaProducer));

    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
