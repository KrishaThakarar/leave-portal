// models/LeaveRequest.js
// Defines the shape of a "leave request" document stored in MongoDB.
import mongoose from "mongoose";
import { LEAVE_TYPES } from "../config/leaveTypes.js";

const leaveRequestSchema = new mongoose.Schema(
  {
    // Which employee made this request (a reference to a User document).
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: LEAVE_TYPES, // must be "casual", "sick", or "earned"
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    reason: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    // How many leave days this request covers (start and end inclusive).
    // Stored so we know how much to deduct on approval.
    days: {
      type: Number,
      required: true,
      min: 1,
    },
    // Which admin approved/rejected it (filled in when reviewed).
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestSchema);
export default LeaveRequest;
