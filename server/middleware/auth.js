// middleware/auth.js

import jwt from "jsonwebtoken";
import User from "../models/User.js";


export async function requireAuth(req, res, next) {
  try {
    
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

    req.user = user; 
    next(); 
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token." });
  }
}


export function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Admin access only." });
  }
  next();
}
