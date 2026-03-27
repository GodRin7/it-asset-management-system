const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect("mongodb+srv://admin:123@cluster0.2mbectl.mongodb.net/assetsDB?retryWrites=true&w=majority")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: String,
  serialNumber: String,
  assignedTo: String,
  status: String,
  dateAdded: { type: Date, default: Date.now }
});

const Asset = mongoose.model("Asset", AssetSchema);

// CREATE
app.post("/assets", async (req, res) => {
  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
app.get("/assets", async (req, res) => {
  const assets = await Asset.find();
  res.json(assets);
});

// DELETE
app.delete("/assets/:id", async (req, res) => {
  await Asset.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

app.listen(5000, () => console.log("Server running on port 5000")); 