import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";
import cookieParser from "cookie-parser";

import farmlandRoutes from "./routes/farmlands.js";
import employeeRoutes from "./routes/employees.js";
import transactionRoutes from "./routes/transactions.js";
import cropRoutes from "./routes/crops.js";
import dashboardRoutes from "./routes/dashboard.js";
import authRoutes from "./routes/auth.js";
import taskRoutes from "./routes/tasks.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { ensureDummyUser } from "./services/dummyUser.js";
import { seedCropsIfEmpty } from "./services/seedCrops.js";

const app = express();
const server = http.createServer(app);

// Enable CORS for any origin. `origin: true` reflects the request origin
// in the Access-Control-Allow-Origin header which allows requests from
// anywhere while still supporting credentials.
// Enable CORS for all routes from any origin
app.use((req, res, next) => {
  const origin = req.headers.origin;
  res.header("Access-Control-Allow-Origin", origin || "*");
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Vary", "Origin");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
      return res.sendStatus(200);
  }

  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Health check endpoint
app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// middleware to console.log request
app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.url}`);
  next();
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/farmlands", farmlandRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/crops", cropRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.use(notFound);
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3000);
const mongoUrl = process.env.MONGO_URL;

if (!mongoUrl) {
  console.error("MONGO_URL must be set");
  process.exit(1);
}

mongoose
  .connect(mongoUrl)
  .then(async () => {
    console.log("Connected to MongoDB");
    await ensureDummyUser();
    await seedCropsIfEmpty();

    server.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1);
  });

export { app, server };


