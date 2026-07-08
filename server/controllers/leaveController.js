// controllers/leaveController.js
// Handles applying for leave, listing requests, and approving/rejecting them.
import LeaveRequest from "../models/LeaveRequest.js";
import User from "../models/User.js";
import { LEAVE_TYPES } from "../config/leaveTypes.js";

// Counts the number of days between two dates, INCLUDING both ends.
// Example: Mon -> Wed = 3 days.
function countDays(startDate, endDate) {
  const oneDay = 1000 * 60 * 60 * 24; // milliseconds in a day
  const start = new Date(startDate);
  const end = new Date(endDate);
  // Zero out the time part so partial days don't cause off-by-one errors.
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  const diff = Math.round((end - start) / oneDay);
  return diff + 1; // +1 because both start and end days count
}

// POST /api/leaves  (employee applies for leave)
export async function applyLeave(req, res) {
  try {
    const { type, startDate, endDate, reason } = req.body;

    // Validate the leave type.
    if (!LEAVE_TYPES.includes(type)) {
      return res.status(400).json({ message: "Invalid leave type." });
    }
    if (!startDate || !endDate) {
      return res.status(400).json({ message: "Start and end dates are required." });
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid dates." });
    }
    if (end < start) {
      return res.status(400).json({ message: "End date cannot be before the start date." });
    }

    const days = countDays(start, end);

    // Optional friendly check: warn early if they clearly don't have enough balance.
    const currentBalance = req.user.leaveBalance[type];
    if (days > currentBalance) {
      return res.status(400).json({
        message: `You only have ${currentBalance} ${type} day(s) left, but requested ${days}.`,
      });
    }

    const leave = await LeaveRequest.create({
      userId: req.user._id,
      type,
      startDate: start,
      endDate: end,
      reason: reason || "",
      days,
      status: "pending",
    });

    return res.status(201).json(leave);
  } catch (error) {
    console.error("applyLeave error:", error);
    return res.status(500).json({ message: "Could not submit leave request." });
  }
}

// GET /api/leaves/my  (employee's own history)
export async function getMyLeaves(req, res) {
  try {
    const leaves = await LeaveRequest.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(leaves);
  } catch (error) {
    console.error("getMyLeaves error:", error);
    return res.status(500).json({ message: "Could not load your leave requests." });
  }
}

// GET /api/leaves  (admin sees all; supports ?status= and ?type= filters)
export async function getAllLeaves(req, res) {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    if (req.query.type) filter.type = req.query.type;

    const leaves = await LeaveRequest.find(filter)
      .populate("userId", "name email") // include the employee's name/email
      .sort({ createdAt: -1 });

    return res.json(leaves);
  } catch (error) {
    console.error("getAllLeaves error:", error);
    return res.status(500).json({ message: "Could not load leave requests." });
  }
}

// PATCH /api/leaves/:id/status  (admin approves or rejects)
export async function updateLeaveStatus(req, res) {
  try {
    const { status } = req.body; // expected: "approved" or "rejected"
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ message: 'Status must be "approved" or "rejected".' });
    }

    const leave = await LeaveRequest.findById(req.params.id);
    if (!leave) {
      return res.status(404).json({ message: "Leave request not found." });
    }
    if (leave.status !== "pending") {
      return res.status(400).json({
        message: `This request was already ${leave.status}.`,
      });
    }

    // If approving, deduct the days from the employee's balance for that type.
    if (status === "approved") {
      const employee = await User.findById(leave.userId);
      if (!employee) {
        return res.status(404).json({ message: "Employee not found." });
      }

      const balance = employee.leaveBalance[leave.type];
      if (leave.days > balance) {
        return res.status(400).json({
          message: `Employee only has ${balance} ${leave.type} day(s) left, but request needs ${leave.days}.`,
        });
      }

      employee.leaveBalance[leave.type] = balance - leave.days;
      await employee.save();
    }

    leave.status = status;
    leave.reviewedBy = req.user._id;
    await leave.save();

    return res.json(leave);
  } catch (error) {
    console.error("updateLeaveStatus error:", error);
    return res.status(500).json({ message: "Could not update the leave request." });
  }
}
