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

    // 1. Save to Database (Skip if broadcast to delivery_partners)
    let notification = null;
    if (recipient !== "delivery_partners") {
      notification = await Notification.create({
        recipient,
        type,
        title,
        message,
        data
      });
    }

    // 2. Emit Real-time via Socket.io
    const io = getIO();
    if (io) {
      const recipientId = recipient.toString();
      io.to(`user_${recipientId}`).emit("new_notification", notification);
      
      // Also emit specific type events if needed
      if (type === "ORDER_CREATED") {
          io.to(`user_${recipientId}`).emit("new_order", {
              orderId: data?.orderId,
              message: title
          });
      }

      // Real-time tracking for a specific order
      if (data?.orderId) {
          io.to(`order_${data.orderId}`).emit("order_status_updated", {
              status: type, // Using type or status from data
              message: message,
              orderId: data.orderId
          });
      }

      // Fleet-wide broadcast for delivery partners
      if (recipient === "delivery_partners") {
          io.to("delivery_partners").emit("new_notification", {
              title,
              message,
              type,
              data
          });
          io.to("delivery_partners").emit("new_task", {
              title,
              message,
              data
          });
      }
    }

    return notification;
  } catch (error) {
    console.error("❌ Notification Error:", error.message);
  }
};

module.exports = { sendNotification };
