import express from "express";
import connectDB from "./config/db.js";

// Load environment variables (optional if already loaded in db.js)
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => res.send("API running..."));

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
