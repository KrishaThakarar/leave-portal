
import "dotenv/config"; // loads variables from .env into process.env
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import leaveRoutes from "./routes/leaveRoutes.js";

const app = express();

// --- Middleware that runs for every request ---
app.use(cors());            // allow the React app (different port) to call this API
app.use(express.json());    // parse JSON request bodies into req.body

// --- Health check: a simple route to confirm the server is alive ---
app.get("/", (req, res) => {
  res.json({ message: "Leave Portal API is running 🚀" });
});

// --- Feature routes ---
app.use("/api/auth", authRoutes);
app.use("/api/leaves", leaveRoutes);

// --- Fallback for unknown routes ---
app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

const PORT = process.env.PORT || 3000;

// Connect to the database first, THEN start listening for requests.
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server listening on http://localhost:${PORT}`);
  });
});
