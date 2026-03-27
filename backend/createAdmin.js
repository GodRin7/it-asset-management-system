require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/User");

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected");

    const email = "admin@example.com";
    const plainPassword = "admin123";

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      console.log("Admin already exists");
      process.exit();
    }

    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const adminUser = new User({
      email,
      password: hashedPassword,
      role: "admin",
    });

    await adminUser.save();

    console.log("Admin created successfully");
    console.log("Email:", email);
    console.log("Password:", plainPassword);

    process.exit();
  } catch (error) {
    console.error("Error creating admin:", error.message);
    process.exit(1);
  }
};
role: "staff"
createAdmin();