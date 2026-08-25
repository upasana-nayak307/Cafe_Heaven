const express = require("express");
const router = express.Router();
const {getNotifications,markAllRead,clearAllNotifications}=require("../controller/notificationController");
router.get("/notifications", getNotifications);
router.patch("/notifications/mark-read", markAllRead);
router.delete("/notifications", clearAllNotifications);

module.exports=router;