const Notification=require("../model/notification");
// GET /api/notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find().sort({ createdAt: -1 }).limit(50);
    // Format _id as id for frontend compatibility
    const formatted = notifications.map((n) => ({
      id: n._id,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      time: n.time || new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }));
    res.status(200).json(formatted);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// PATCH /api/notifications/mark-read
const markAllRead = async (req, res) => {
  try {
    await Notification.updateMany({ read: false }, { $set: { read: true } });
    res.status(200).json({ success: true, message: "All marked as read" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// DELETE /api/notifications
const clearAllNotifications = async (req, res) => {
  try {
    await Notification.deleteMany({});
    res.status(200).json({ success: true, message: "All notifications cleared" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getNotifications, markAllRead, clearAllNotifications };