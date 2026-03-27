const ActivityLog = require("../models/ActivityLog");

const logActivity = async ({
  action,
  assetId = null,
  assetName = "",
  userId = null,
  userName = "Unknown User",
  details = "",
}) => {
  try {
    await ActivityLog.create({
      action,
      assetId,
      assetName,
      userId,
      userName,
      details,
    });
  } catch (error) {
    console.error("Activity logging failed:", error.message);
  }
};

module.exports = logActivity;