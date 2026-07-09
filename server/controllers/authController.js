// controllers/authController.js
// Handles registration and login logic.
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Creates a signed JWT that proves who the user is.
function createToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role }, // data stored inside the token
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

// POST /api/auth/register
export async function register(req, res) {
  try {
    const { name, email, password, role } = req.body;

    // Basic validation.
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required." });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters." });
    }

    // Make sure the email is not already taken.
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: "An account with this email already exists." });
    }

    // Turn the plain password into a secure hash.
    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash,
      
      role: role === "admin" ? "admin" : "employee",
    });

    const token = createToken(user);
    return res.status(201).json({ token, user: user.toSafeObject() });
  } catch (error) {
    console.error("register error:", error);
    return res.status(500).json({ message: "Something went wrong during registration." });
  }
}

// POST /api/auth/login
export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    // Compare the typed password with the stored hash.
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password." });
    }

    const token = createToken(user);
    return res.json({ token, user: user.toSafeObject() });
  } catch (error) {
    console.error("login error:", error);
    return res.status(500).json({ message: "Something went wrong during login." });
  }
}

// GET /api/auth/me  — returns the currently logged-in user (used to restore session).
export async function me(req, res) {
  // req.user was set by the requireAuth middleware.
  return res.json({ user: req.user.toSafeObject() });
}
