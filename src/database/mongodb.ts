import mongoose from "mongoose";
import { MONGODB_URL } from "../config/constant";

const connectDB = async (): Promise<void> => {
  try {
    if (!MONGODB_URL) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    await mongoose.connect(MONGODB_URL);
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection failed:", error);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️  MongoDB disconnected");
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB reconnected");
});

export default connectDB;
