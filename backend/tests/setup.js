import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Connect to database before all tests
beforeAll(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      dbName: "PulseIQ_Test", // Use separate test database
    });
    console.log("Test database connected");

    // Drop all collections to clear stale validators/indexes
    const collections = await mongoose.connection.db.listCollections().toArray();
    for (const col of collections) {
      await mongoose.connection.db.dropCollection(col.name);
    }
    console.log("Test collections cleared");
  } catch (error) {
    console.error("Test database connection failed:", error.message);
    process.exit(1);
  }
});

// Disconnect after all tests
afterAll(async () => {
  await mongoose.connection.close();
  console.log("Test database disconnected");
});
