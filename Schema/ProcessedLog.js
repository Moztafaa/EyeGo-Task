// mongoose schema for processed logs have: lever, message, timestamp, source
import mongoose from "mongoose";

const ProcessedLogSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
  },
  source: {
    type: String,
    required: true,
  },
});

const ProcessedLog = mongoose.model("ProcessedLog", ProcessedLogSchema);

export default ProcessedLog;
