/**
 * Worker Entry Point
 *
 * Initializes and starts the Kafka consumer worker.
 */
import { config } from "./config.js";
import { connectDatabase } from "./src/infrastructure/database/connection.js";
import { KafkaConsumer } from "./src/infrastructure/kafka/consumer.js";
import { logRepository } from "./src/infrastructure/database/LogRepository.js";

async function processLogMessage(logData) {
  console.log(`Consumer: Received log from ${logData.source}`);

  try {
    await logRepository.save(logData);
    console.log("Consumer: Log saved to MongoDB successfully");
  } catch (error) {
    console.error("Consumer: Error saving log:", error);
  }
}

(async () => {
  try {
    await connectDatabase(config.database.connectionString);

    const kafkaConsumer = new KafkaConsumer(config.kafka.brokers);
    await kafkaConsumer.connect();
    await kafkaConsumer.subscribe();

    await kafkaConsumer.run(processLogMessage);
  } catch (error) {
    console.error("Consumer: Fatal error:", error);
    process.exit(1);
  }
})();
