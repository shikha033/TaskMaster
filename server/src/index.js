import "dotenv/config";
import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { errorHandler, notFound } from "./middleware/errorHandler.js";

const { PORT = 5000, MONGODB_URI, JWT_SECRET, CLIENT_URL } = process.env;

if (!MONGODB_URI || !JWT_SECRET) {
  console.error("Missing MONGODB_URI or JWT_SECRET. Copy server/.env.example to server/.env and fill it in.");
  process.exit(1);
}

const app = express();

app.use(cors({ origin: CLIENT_URL || "http://localhost:8080" }));
app.use(express.json());

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

app.use(notFound);
app.use(errorHandler);

connectDB(MONGODB_URI)
  .then(() => app.listen(PORT, () => console.log(`API running at http://localhost:${PORT}`)))
  .catch((err) => {
    console.error("Could not connect to MongoDB:", err.message);
    process.exit(1);
  });
