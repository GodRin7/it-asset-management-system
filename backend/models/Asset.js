const mongoose = require("mongoose");

const assetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  serialNumber: String,
  assignedTo: String,
  status: String,
  dateAdded: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Asset", assetSchema);