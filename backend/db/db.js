import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const connectDB = async () => {
  try {
    const connectInstance = await mongoose.connect(process.env.MONGO_URL, {
      dbName: "PulseIQ",
    });

    console.log(`MongoDB connected: ${connectInstance.connection.host}`);
  } catch (error) {
    console.log(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
