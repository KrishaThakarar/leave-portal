
import express from "express";
import {
  applyLeave,
  getMyLeaves,
  getAllLeaves,
  updateLeaveStatus,
} from "../controllers/leaveController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();


router.post("/", requireAuth, applyLeave);        // employee applies for leave
router.get("/my", requireAuth, getMyLeaves);      // employee's own history


router.get("/", requireAuth, requireAdmin, getAllLeaves);
router.patch("/:id/status", requireAuth, requireAdmin, updateLeaveStatus);

export default router;
