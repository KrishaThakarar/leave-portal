// middleware/auth.js
// Middleware = small functions that run BEFORE your route handler.
// These check that the request has a valid login token (JWT).
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// requireAuth: allows the request through only if a valid JWT is present.
// It also attaches the logged-in user to req.user so route handlers can use it.
export async function requireAuth(req, res, next) {
  try {
    // The frontend sends the token in a header like:  Authorization: Bearer <token>
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : null;

    if (!token) {
      return res.status(401).json({ message: "No token provided. Please log in." });
    }

    // Verify the token was signed by us and has not expired.
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Load the user from the database (without the password hash).
    const user = await User.findById(decoded.id).select("-passwordHash");
    if (!user) {
      return res.status(401).json({ message: "User no longer exists." });
    }

    req.user = user; // now available inside the route handler
    next(); // continue to the next function / route handler
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}

// requireAdmin: use AFTER requireAuth to restrict a route to admins only.
export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }
  next();
}
