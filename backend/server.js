require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/assets", assetRoutes);
app.use("/auth", authRoutes);

// Root test route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// MongoDB connection and server start
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error.message);
  });