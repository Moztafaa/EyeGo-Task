import { Kafka } from "kafkajs";

export function createKafka(brokers) {
  return new Kafka({
    clientId: "eyego-api",
    brokers: brokers.split(","),
  });
}

export const TOPIC_USER_ACTIVITY_LOGS = "user-activity-logs";
