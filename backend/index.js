import "dotenv/config";
import express from "express";
import http from "http";
import mongoose from "mongoose";
import cors from "cors";

import farmlandRoutes from "./routes/farmlands.js";
import employeeRoutes from "./routes/employees.js";
import transactionRoutes from "./routes/transactions.js";
import cropRoutes from "./routes/crops.js";
import dashboardRoutes from "./routes/dashboard.js";
import { notFound, errorHandler } from "./middleware/errorHandler.js";
import { ensureDummyUser } from "./services/dummyUser.js";
import { seedCropsIfEmpty } from "./services/seedCrops.js";

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: process.env.CORS_ORIGIN ?? "*",
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/api/farmlands", farmlandRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/crops", cropRoutes);
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


