export class ActivityLog {
  constructor({ level, message, timestamp, source }) {
    this.level = level;
    this.message = message;
    this.timestamp = timestamp || new Date();
    this.source = source;
  }

  validate() {
    if (!this.level || typeof this.level !== "string") {
      throw new Error("Level is required and must be a string");
    }

    if (!this.message || typeof this.message !== "string") {
      throw new Error("Message is required and must be a string");
    }

    if (!this.source || typeof this.source !== "string") {
      throw new Error("Source is required and must be a string");
    }

    if (
      !(this.timestamp instanceof Date) &&
      typeof this.timestamp !== "string"
    ) {
      throw new Error("Timestamp must be a valid date");
    }
  }

  toJSON() {
    return {
      level: this.level,
      message: this.message,
      timestamp: this.timestamp,
      source: this.source,
    };
  }
}
