// config/db.js
// This file connects our app to MongoDB using Mongoose.
import mongoose from "mongoose";


export async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    if (!uri) {
      throw new Error("MONGO_URI is not set. Did you create a .env file?");
    }

    await mongoose.connect(uri);
    console.log("✅ MongoDB connected");
  } catch (error) {
    console.error(" MongoDB connection error:", error.message);
    
    process.exit(1);
  }
}
