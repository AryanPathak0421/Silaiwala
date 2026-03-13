const Delivery = require("../../../models/Delivery");
const Order = require("../../../models/Order");
const User = require("../../../models/User");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get currently logged-in delivery partner profile
 * @route   GET /api/v1/deliveries/me
 * @access  Private (Delivery)
 */
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findOne({ user: req.user.id }).populate(
    "user",
    "name email phoneNumber profileImage"
  );

  if (!delivery) {
    return next(new ErrorResponse("Delivery profile not found", 404));
  }

  res.status(200).json({
    success: true,
    data: delivery,
  });
});

/**
 * @desc    Update delivery profile
 * @route   PATCH /api/v1/deliveries/profile
 * @access  Private (Delivery)
 */
exports.updateProfile = asyncHandler(async (req, res, next) => {
  const { vehicleType, vehicleNumber, name, email, phoneNumber, bankDetails } = req.body;

  let delivery = await Delivery.findOne({ user: req.user.id });

  if (!delivery) {
    return next(new ErrorResponse("Delivery profile not found", 404));
  }

  // Update Delivery fields
  if (vehicleType) delivery.vehicleType = vehicleType;
  if (vehicleNumber) delivery.vehicleNumber = vehicleNumber;
  if (bankDetails) {
    delivery.bankDetails = {
      ...delivery.bankDetails,
      ...bankDetails
    };
  }

  await delivery.save();

  // Update User fields if provided
  if (name || email || phoneNumber) {
    const user = await User.findById(req.user.id);
    if (!user) return next(new ErrorResponse("User not found", 404));

    if (name) user.name = name;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    await user.save();
  }

  const updatedProfile = await Delivery.findOne({ user: req.user.id }).populate(
    "user",
    "name email phoneNumber profileImage"
  );

  res.status(200).json({
    success: true,
    data: updatedProfile,
  });
});

/**
 * @desc    Toggle availability and update location
 * @route   PATCH /api/v1/deliveries/status
 * @access  Private (Delivery)
 */
exports.updateStatus = asyncHandler(async (req, res, next) => {
  const { isAvailable, status, lat, lng } = req.body;

  let delivery = await Delivery.findOne({ user: req.user.id });

  if (!delivery) {
    return next(new ErrorResponse("Delivery profile not found", 404));
  }

  if (isAvailable !== undefined) delivery.isAvailable = isAvailable;
  if (status) delivery.status = status;

  if (lat && lng) {
    delivery.currentLocation = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)],
    };
  }

  await delivery.save();

  res.status(200).json({
    success: true,
    data: delivery,
  });
});

/**
 * @desc    Get assigned orders for the delivery partner
 * @route   GET /api/v1/deliveries/orders
 * @access  Private (Delivery)
 */
exports.getAssignedOrders = asyncHandler(async (req, res, next) => {
  const { status } = req.query;
  const query = { deliveryPartner: req.user.id };

  if (status) {
    query.status = status;
  } else {
    // Default show active deliveries
    query.status = { $in: ["ready-for-pickup", "out-for-delivery"] };
  }

  const orders = await Order.find(query)
    .populate("customer", "name phoneNumber profileImage")
    .populate("tailor", "shopName address location phone")
    .sort("-updatedAt");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Get delivery partner dashboard statistics
 * @route   GET /api/v1/deliveries/stats
 * @access  Private (Delivery)
 */
exports.getDashboardStats = asyncHandler(async (req, res, next) => {
  const delivery = await Delivery.findOne({ user: req.user.id });
  
  if (!delivery) {
    return next(new ErrorResponse("Delivery profile not found", 404));
  }

  const stats = await Order.aggregate([
    { $match: { deliveryPartner: req.user.id } },
    {
      $group: {
        _id: null,
        totalDeliveries: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 1, 0] } },
        activeDeliveries: { $sum: { $cond: [{ $in: ["$status", ["ready-for-pickup", "out-for-delivery"]] }, 1, 0] } },
        totalEarnings: { $sum: { $cond: [{ $eq: ["$status", "delivered"] }, 20, 0] } } // Dummy earning per delivery
      }
    }
  ]);

  const dashboardStats = stats[0] || { totalDeliveries: 0, activeDeliveries: 0, totalEarnings: 0 };

  res.status(200).json({
    success: true,
    data: {
      ...dashboardStats,
      rating: delivery.rating,
      isAvailable: delivery.isAvailable
    }
  });
});

/**
 * @desc    Update delivery status of an order
 * @route   PATCH /api/v1/deliveries/orders/:id/status
 * @access  Private (Delivery)
 */
exports.updateDeliveryStatus = asyncHandler(async (req, res, next) => {
  const { status, message, proof } = req.body;
  const allowedStatuses = ["out-for-delivery", "delivered", "failed-delivery"];

  if (!allowedStatuses.includes(status)) {
    return next(new ErrorResponse("Invalid delivery status", 400));
  }

  const order = await Order.findOne({
    _id: req.params.id,
    deliveryPartner: req.user.id,
  });

  if (!order) {
    return next(new ErrorResponse("Order not found or not assigned to you", 404));
  }

  // Update logic
  order.status = status;
  if (status === "delivered") {
    order.deliveredAt = new Date();
    if (proof) order.deliveryProof = proof;
    
    // Increment stats on delivery profile
    await Delivery.findOneAndUpdate(
      { user: req.user.id },
      { $inc: { totalDeliveries: 1 } }
    );
  }

  order.trackingHistory.push({
    status: `delivery-${status}`,
    message: message || `Delivery status updated to ${status}`,
    timestamp: new Date(),
    proof: proof,
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});

/**
 * @desc    Get orders waiting for a delivery partner
 * @route   GET /api/v1/deliveries/available-orders
 * @access  Private (Delivery)
 */
exports.getAvailableOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({
    status: "ready-for-pickup",
    deliveryPartner: null,
  })
    .populate("customer", "name phoneNumber profileImage")
    .populate("tailor", "shopName address location phone")
    .sort("-updatedAt");

  res.status(200).json({
    success: true,
    count: orders.length,
    data: orders,
  });
});

/**
 * @desc    Accept/Claim an available order
 * @route   POST /api/v1/deliveries/orders/:id/accept
 * @access  Private (Delivery)
 */
exports.acceptOrder = asyncHandler(async (req, res, next) => {
  let order = await Order.findById(req.params.id);

  if (!order) {
    return next(new ErrorResponse("Order not found", 404));
  }

  if (order.deliveryPartner) {
    return next(new ErrorResponse("Order already has a delivery partner", 400));
  }

  if (order.status !== "ready-for-pickup") {
    return next(new ErrorResponse("Order is not ready for pickup", 400));
  }

  // Assign partner
  order.deliveryPartner = req.user.id;
  
  order.trackingHistory.push({
    status: "delivery-partner-assigned",
    message: `Delivery partner ${req.user.name} has accepted the order`,
    timestamp: new Date(),
  });

  await order.save();

  res.status(200).json({
    success: true,
    data: order,
  });
});
