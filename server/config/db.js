// config/db.js
// This file connects our app to MongoDB using Mongoose.
import mongoose from "mongoose";

// connectDB() is called once when the server starts.
// If the connection fails, we stop the app because it cannot work without a database.
export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set. Did you create a .env file?");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error.message);
    // Exit the process with a "failure" code so we notice something is wrong.
    process.exit(1);
  }
}
