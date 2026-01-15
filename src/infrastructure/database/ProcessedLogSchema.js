import mongoose from "mongoose";

const ProcessedLogSchema = new mongoose.Schema({
  level: {
    type: String,
    required: true,
    index: true,
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
    default: Date.now,
    index: true,
  },
  source: {
    type: String,
    required: true,
    index: true,
  },
});

// Compound index for level and source
ProcessedLogSchema.index({ level: 1, source: 1 });

const ProcessedLog = mongoose.model("ProcessedLog", ProcessedLogSchema);

export default ProcessedLog;
