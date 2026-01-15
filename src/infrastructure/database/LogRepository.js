import ProcessedLog from "./ProcessedLogSchema.js";

export class LogRepository {
  async save(logData) {
    const newLog = new ProcessedLog(logData);
    return await newLog.save();
  }

  async findAll() {
    return await ProcessedLog.find();
  }

  async findWithPagination({ page = 1, limit = 10, level, source }) {
    const skip = (page - 1) * limit;

    const filter = {};
    if (level) filter.level = level;
    if (source) filter.source = source;

    const logs = await ProcessedLog.find(filter)
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit);

    const total = await ProcessedLog.countDocuments(filter);

    return {
      status: "success",
      results: logs.length,
      total,
      page,
      totalPages: Math.ceil(total / limit),
      data: logs,
    };
  }

  async findBySource(source) {
    return await ProcessedLog.find({ source });
  }

  async findByLevel(level) {
    return await ProcessedLog.find({ level });
  }
}

export const logRepository = new LogRepository();
