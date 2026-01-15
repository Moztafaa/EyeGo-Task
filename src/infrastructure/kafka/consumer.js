import { createKafka, TOPIC_USER_ACTIVITY_LOGS } from "./config.js";

export class KafkaConsumer {
  constructor(brokers, groupId = "log-processors") {
    this.kafka = createKafka(brokers);
    this.consumer = this.kafka.consumer({ groupId });
    this.connected = false;
  }

  async connect(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.consumer.connect();
        this.connected = true;
        console.log("Consumer: Connected to Kafka");
        return;
      } catch (error) {
        console.log(`Consumer: Waiting for Kafka... (${i + 1}/${retries})`);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error("Consumer: Could not connect to Kafka");
  }

  async subscribe() {
    await this.consumer.subscribe({
      topic: TOPIC_USER_ACTIVITY_LOGS,
      fromBeginning: true,
    });
    console.log("Consumer: Subscribed to user-activity-logs");
  }

  async run(messageHandler) {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        try {
          const rawData = message.value.toString();
          const logData = JSON.parse(rawData);
          await messageHandler(logData);
        } catch (error) {
          console.error("Consumer: Error processing message:", error);
        }
      },
    });
  }

  async disconnect() {
    if (this.connected) {
      await this.consumer.disconnect();
      this.connected = false;
      console.log("Consumer: Disconnected from Kafka");
    }
  }
}
