const Order = require("../../../models/Order");
const User = require("../../../models/User");
const { getIO } = require("../../../config/socket");
const crypto = require("crypto");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");
const { sendNotification } = require("../../../utils/notification");

/**
 * @desc    Create a new order
 * @route   POST /api/v1/orders
 * @access  Private (Customer)
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { tailorId, items, totalAmount, deliveryAddress } = req.body;

  // 1. Validation: Ensure tailor exists and is active
  const tailor = await User.findOne({ _id: tailorId, role: "tailor" });
  if (!tailor) {
    return next(new ErrorResponse("Tailor not found or invalid", 404));
  }

  // 2. Optimization: Map items to ensure structure matches updated schema
  // In a real production environment, we would also verify basePrice and delivery charges here
  const formattedItems = items.map(item => ({
    product: item.product || null,
    service: item.service || null,
    fabricSource: item.fabricSource || 'customer',
    deliveryType: item.deliveryType || 'standard',
    selectedFabric: item.selectedFabric || null,
    quantity: item.quantity || 1,
    price: item.price,
    measurements: item.measurements || {}
  }));

  // 3. Generate unique order ID
  const orderId = `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  // 4. Create Order with optimized object
  const order = await Order.create({
    orderId,
    customer: req.user.id,
    tailor: tailorId,
    items: formattedItems,
    totalAmount,
    deliveryAddress,
    status: "pending",
    trackingHistory: [{ status: "pending", message: "Order placed successfully" }],
  });

  // 5. Notify tailor via Persistent & Real-time Notification
  await sendNotification({
    recipient: tailorId,
    type: "ORDER_CREATED",
    title: "New Request Received!",
    message: `You have received a new order ${order.orderId} for ${order.items[0]?.service?.title || 'custom stitching'}.`,
    data: { orderId: order._id, targetUrl: "/partner/orders" }
  });

  res.status(201).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Get customer orders
 * @route   GET /api/v1/orders/my-orders
 * @access  Private (Customer)
 */
exports.getMyOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({ customer: req.user.id })
    .populate("tailor", "name shopName profileImage")
    .sort("-createdAt")
    .lean();

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Get single order details
 * @route   GET /api/v1/orders/:id
 * @access  Private (Customer/Tailor)
 */
exports.getOrderDetails = asyncHandler(async (req, res, next) => {
  const order = await Order.findById(req.params.id)
    .populate("customer", "name phoneNumber")
    .populate("tailor", "name shopName phoneNumber")
    .lean();

  if (!order) {
    return next(new ErrorResponse("Order not found", 404));
  }

  // Check ownership
  if (
    order.customer._id.toString() !== req.user.id &&
    order.tailor._id.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorResponse("Not authorized to view this order", 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});
