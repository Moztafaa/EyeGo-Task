import { createKafka, TOPIC_USER_ACTIVITY_LOGS } from "./config.js";

export class KafkaProducer {
  constructor(brokers) {
    this.kafka = createKafka(brokers);
    this.producer = this.kafka.producer();
    this.connected = false;
  }

  async connect(retries = 10, delay = 3000) {
    for (let i = 0; i < retries; i++) {
      try {
        await this.producer.connect();
        this.connected = true;
        console.log("Kafka Producer connected");
        return;
      } catch (error) {
        console.log(`Waiting for Kafka... (${i + 1}/${retries})`);
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
    throw new Error("Could not connect to Kafka Producer");
  }

  async sendLog(log) {
    if (!this.connected) {
      throw new Error("Producer is not connected");
    }

    await this.producer.send({
      topic: TOPIC_USER_ACTIVITY_LOGS,
      messages: [
        {
          value: JSON.stringify(log),
        },
      ],
    });
  }

  async disconnect() {
    if (this.connected) {
      await this.producer.disconnect();
      this.connected = false;
      console.log("Kafka Producer disconnected");
    }
  }
}
