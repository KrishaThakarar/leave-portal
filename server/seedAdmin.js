// seedAdmin.js
// A one-time helper script to create an admin account so you can log in to the
// Admin Dashboard. Run it with:  npm run seed:admin
//
// It reads the email/password/name from the command line, or uses defaults.
// Example: node seedAdmin.js admin@company.com secret123 "Admin User"
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import User from "./models/User.js";

async function run() {
  await connectDB();

  const email = (process.argv[2] || "admin@company.com").toLowerCase();
  const password = process.argv[3] || "admin123";
  const name = process.argv[4] || "Admin User";

  const existing = await User.findOne({ email });
  if (existing) {
    // If the account exists, just make sure it is an admin.
    existing.role = "admin";
    await existing.save();
    console.log(`ℹ️  User ${email} already existed — promoted to admin.`);
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await User.create({ name, email, passwordHash, role: "admin" });
    console.log(`✅ Admin created:  ${email}  /  ${password}`);
  }

  await mongoose.disconnect();
  process.exit(0);
}

run().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
