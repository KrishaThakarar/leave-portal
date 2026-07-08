// routes/leaveRoutes.js
// Maps leave-related URLs to their controller functions.
import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// Every route below requires the user to be logged in.
router.post("/", requireAuth, applyLeave);        // employee applies for leave
router.get("/my", requireAuth, getMyLeaves);      // employee's own history

// Admin-only routes: logged in AND role === "admin".
router.get("/", requireAuth, requireAdmin, getAllLeaves);
router.patch("/:id/status", requireAuth, requireAdmin, updateLeaveStatus);

export default router;
