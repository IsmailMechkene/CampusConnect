import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import authRoutes from "./routes/auth";
import userRoutes from "./routes/users";

dotenv.config();

const app = express();

// Middleware CORS
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// Routes
app.get("/", (_req, res) => {
  res.json({ message: "Hello from backend!" });
});

// Handle 404
app.use("*", (_req, res) => {
  res.status(404).json({ error: "Route not found" });
});

export default app;
