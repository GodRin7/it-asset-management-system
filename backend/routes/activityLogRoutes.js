const express = require("express");
const router = express.Router();
const ActivityLog = require("../models/ActivityLog");
const verifyToken = require("../middleware/authMiddleware");

router.use(verifyToken);

router.get("/", async (req, res) => {
  try {
    const logs = await ActivityLog.find()
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;