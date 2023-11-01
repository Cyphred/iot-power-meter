import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";

// Loads .env data
dotenv.config();

console.log("Attempting to connect to mongodb...");

// Connect to db
await mongoose.connect(process.env.MONGO_URI);

// Create express app
const app = express();

// Enables parsing of incoming data into json
app.use(express.json());

// Logs incoming requests to console
app.use((req, res, next) => {
  console.log(req.path, req.method);
  next();
});

// IMPORTANT NOTE
// Change the origin to the domain during production
app.use(
  cors({
    origin: "*",
  })
);

// Load in root router
// app.use("/api", rootRouter);

// Fetch port from .env or use default
const port: number = process.env.PORT ? parseInt(process.env.PORT) : 8000;

// Start listening for requests
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});

export default app;
