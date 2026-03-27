const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);

// CREATE
router.post("/", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const asset = new Asset(req.body);
    await asset.save();
    res.json(asset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// READ
router.get("/", async (req, res) => {
  try {
    const assets = await Asset.find();
    res.json(assets);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE

router.delete("/:id", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
router.delete("/:id", async (req, res) => {
  try {
    await Asset.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updatedAsset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;