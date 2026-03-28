const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      name: {
  type: String,
  required: true,
  trim: true,
},
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      department: {
  type: String,
  default: "",
},

status: {
  type: String,
  enum: ["active", "inactive"],
  default: "active",
},
      type: String,
      enum: ["admin", "staff"],
      default: "admin",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);