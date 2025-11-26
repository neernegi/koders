import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Routes
import authRoutes from "./routes/auth.route.js";
import eventRoutes from "./routes/event.route.js";
import bookingRoutes from "./routes/booking.route.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check route - MAKE SURE THIS COMES BEFORE OTHER ROUTES
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'EventEase API is running',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/bookings", bookingRoutes);

export default app;
