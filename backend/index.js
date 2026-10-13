
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();
const PORT = process.env.PORT || 5000;
const contactRoutes = require("./routes/contactRoutes");

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
}));
app.use(express.json());

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Health check
app.get("/", (req, res) => {
  res.send("WorkFlowX Backend is running!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "WorkFlowX backend is running",
  });
});

// Authentication routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/contact", contactRoutes);
// Not found
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

// Start server after database connects
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
