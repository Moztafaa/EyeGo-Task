import mongoose from "mongoose";

export async function connectDatabase(connectionString) {
  try {
    await mongoose.connect(connectionString);
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
}

export async function disconnectDatabase() {
  await mongoose.connection.close();
  console.log("MongoDB disconnected");
}
