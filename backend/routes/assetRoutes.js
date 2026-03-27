const express = require("express");
const router = express.Router();
const Asset = require("../models/Asset");
const verifyToken = require("../middleware/authMiddleware");
const logActivity = require("../utils/logActivity");

router.use(verifyToken);

// CREATE
router.post("/", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const asset = new Asset(req.body);
    await asset.save();

    await logActivity({
      action: "CREATE_ASSET",
      assetId: asset._id,
      assetName: asset.name,
      userId: req.user.userId,
      userName: req.user.email,
      details: `Created asset ${asset.name}${asset.assetTag ? ` (${asset.assetTag})` : ""}`,
    });

    res.status(201).json(asset);
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
    const asset = await Asset.findById(req.params.id);

    if (!asset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await Asset.findByIdAndDelete(req.params.id);

    await logActivity({
      action: "DELETE_ASSET",
      assetId: asset._id,
      assetName: asset.name,
      userId: req.user.userId,
      userName: req.user.email,
      details: `Deleted asset ${asset.name}${asset.assetTag ? ` (${asset.assetTag})` : ""}`,
    });

    res.json({ message: "Asset deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// UPDATE
router.put("/:id", async (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const updatedAsset = await Asset.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedAsset) {
      return res.status(404).json({ message: "Asset not found" });
    }

    await logActivity({
      action: "UPDATE_ASSET",
      assetId: updatedAsset._id,
      assetName: updatedAsset.name,
      userId: req.user.userId,
      userName: req.user.email,
      details: `Updated asset ${updatedAsset.name}${updatedAsset.assetTag ? ` (${updatedAsset.assetTag})` : ""}`,
    });

    res.json(updatedAsset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;