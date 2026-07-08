// routes/authRoutes.js
// Maps auth-related URLs to their controller functions.
import express from "express";
import { register, login, me } from "../controllers/authController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/register", register); // POST /api/auth/register
router.post("/login", login);       // POST /api/auth/login
router.get("/me", requireAuth, me); // GET  /api/auth/me  (must be logged in)

export default router;
