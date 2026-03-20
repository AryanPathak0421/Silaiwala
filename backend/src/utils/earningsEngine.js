const WalletTransaction = require("../models/WalletTransaction");
const Tailor = require("../models/Tailor");
const Delivery = require("../models/Delivery");
const Order = require("../models/Order");
const mongoose = require("mongoose");

/**
 * Distributes earnings to tailor and delivery partner upon successful delivery
 * @param {string} orderId - MongoDB ID of the order
 */
const distributeEarnings = async (orderId) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findById(orderId).session(session);
    if (!order || order.status !== "delivered") {
      throw new Error("Invalid order or order not delivered");
    }

    if (order.paymentStatus !== "paid") {
      // In a real app, you might want to handle COD payments here as well
      // For now, only distributing if paid online or marked as paid
      return;
    }

    const { tailor, deliveryPartner, totalAmount, platformFee, deliveryFee } = order;

    // 1. Calculate Tailor Share
    const tailorShare = totalAmount - platformFee - deliveryFee;

    // 2. Credit Tailor
    const tailorProfile = await Tailor.findOne({ user: tailor }).session(session);
    if (tailorProfile) {
      tailorProfile.walletBalance += tailorShare;
      await tailorProfile.save({ session });

      await WalletTransaction.create([
        {
          user: tailor,
          amount: tailorShare,
          type: "credit",
          category: "order_earnings",
          order: orderId,
          description: `Earnings for order ${order.orderId}`,
        },
      ], { session });
    }

    // 3. Credit Delivery Partner (if exists)
    if (deliveryPartner) {
      const deliveryProfile = await Delivery.findOne({ user: deliveryPartner }).session(session);
      if (deliveryProfile) {
        deliveryProfile.walletBalance += deliveryFee;
        await deliveryProfile.save({ session });

        await WalletTransaction.create([
          {
            user: deliveryPartner,
            amount: deliveryFee,
            type: "credit",
            category: "order_earnings",
            order: orderId,
            description: `Delivery fee for order ${order.orderId}`,
          },
        ], { session });
      }
    }

    await session.commitTransaction();
    console.log(`Earnings distributed for order ${order.orderId}`);
  } catch (error) {
    await session.abortTransaction();
    console.error("Earnings distribution failed:", error);
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { distributeEarnings };
