// models/User.js
// Defines the shape of a "user" document stored in MongoDB.
import mongoose from "mongoose";
import { DEFAULT_LEAVE_BALANCE } from "../config/leaveTypes.js";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true, // no two users can share an email
      lowercase: true,
      trim: true,
    },
    
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["employee", "admin"],
      default: "employee",
    },
    // Remaining leave days for THIS user, tracked separately per type.
    // Example: { casual: 12, sick: 10, earned: 15 }
    leaveBalance: {
      casual: { type: Number, default: DEFAULT_LEAVE_BALANCE.casual },
      sick: { type: Number, default: DEFAULT_LEAVE_BALANCE.sick },
      earned: { type: Number, default: DEFAULT_LEAVE_BALANCE.earned },
    },
  },
  {
    
    timestamps: true,
  }
);

// A small helper so we never accidentally send the password hash to the browser.
userSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    leaveBalance: this.leaveBalance,
    createdAt: this.createdAt,
  };
};

const User = mongoose.model("User", userSchema);
export default User;
