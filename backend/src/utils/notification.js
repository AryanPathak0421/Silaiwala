const Notification = require("../models/Notification");
const { getIO } = require("../config/socket");

/**
 * Service to create and send real-time notifications
 * @param {Object} options - Notification options
 * @param {String} options.recipient - Target User ID
 * @param {String} options.type - Notification type
 * @param {String} options.title - Notification title
 * @param {String} options.message - Notification body
 * @param {Object} [options.data] - Extra data (orderId, url)
 */
const sendNotification = async (options) => {
  try {
    const { recipient, type, title, message, data } = options;

    // 1. Save to Database
    const notification = await Notification.create({
      recipient,
      type,
      title,
      message,
      data
    });

    // 2. Emit Real-time via Socket.io
    const io = getIO();
    if (io) {
      io.to(`user_${recipient}`).emit("new_notification", notification);
      
      // Also emit specific type events if needed
      if (type === "ORDER_CREATED") {
          io.to(`user_${recipient}`).emit("new_order", {
              orderId: data?.orderId,
              message: title
          });
      }
    }

    return notification;
  } catch (error) {
    console.error("❌ Notification Error:", error.message);
  }
};

module.exports = { sendNotification };
