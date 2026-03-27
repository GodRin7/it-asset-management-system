require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const assetRoutes = require("./routes/assetRoutes");
const authRoutes = require("./routes/authRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use("/assets", assetRoutes);
app.use("/auth", authRoutes);

// MongoDB connection
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