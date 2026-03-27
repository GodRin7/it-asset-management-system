const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  assetTag: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    trim: true,
  },
  serialNumber: {
    type: String,
    trim: true,
  },
  assignedTo: {
    type: String,
    trim: true,
  },
  department: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Asset", assetSchema);