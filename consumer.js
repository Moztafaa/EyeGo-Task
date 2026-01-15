import { Kafka } from "kafkajs";
import mongoose from "mongoose";
import dotenv from "dotenv";
import ProcessedLog from "./Schema/ProcessedLog.js";

dotenv.config();

const kafka = new Kafka({
  clientId: 'eyego-consumer',
  brokers: (process.env.KAFKA_BROKERS || 'localhost:9092').split(','),
});

const consumer = kafka.consumer({ groupId: 'log-processors' });

const run = async () => {
  // Connect to MongoDB
  await mongoose.connect(process.env.DB_CONNECTION_STRING);
  console.log("Consumer: MongoDB connected");

  // 2. Connect to Kafka with retry
  let kafkaConnected = false;
  for (let i = 0; i < 10; i++) {
    try {
      await consumer.connect();
      console.log("Consumer: Connected to Kafka");
      kafkaConnected = true;
      break;
    } catch (error) {
      console.log(`Consumer: Waiting for Kafka... (${i + 1}/10)`);
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }

  if (!kafkaConnected) {
    throw new Error('Consumer: Could not connect to Kafka');
  }

  await consumer.subscribe({ topic: 'user-activity-logs', fromBeginning: true });
  console.log("Consumer: Subscribed to user-activity-logs");

  // 3. Process each message
  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const rawData = message.value.toString();
      const logData = JSON.parse(rawData);

      console.log(`Consumer: Received log from ${logData.source}`);

      try {
        // Here we finally save it to the DB
        const newLog = new ProcessedLog(logData);
        await newLog.save();
        console.log("Consumer: Log saved to MongoDB successfully");
      } catch (err) {
        console.error("Consumer: Error saving log:", err);
      }
    },
  });
};

run().catch(console.error);