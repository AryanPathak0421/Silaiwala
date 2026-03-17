const Order = require("../../../models/Order");
const User = require("../../../models/User");
const Tailor = require("../../../models/Tailor");
const { getIO } = require("../../../config/socket");
const crypto = require("crypto");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");
const { sendNotification } = require("../../../utils/notification");

const PromoCode = require("../../../models/PromoCode");

/**
 * @desc    Create a new order
 * @route   POST /api/v1/orders
 * @access  Private (Customer)
 */
exports.createOrder = asyncHandler(async (req, res, next) => {
  const { tailorId, items, totalAmount, deliveryAddress, promoCode } = req.body;

  // 1. Validation: Ensure tailor exists and is active (Check both User and Tailor Profile IDs)
  let tailor = await User.findOne({ _id: tailorId, role: "tailor" });
  
  if (!tailor) {
    // If not found in User, check if it's a Tailor Profile ID
    const tailorProfile = await Tailor.findById(tailorId).populate("user");
    if (tailorProfile && tailorProfile.user) {
      tailor = tailorProfile.user;
    }
  }

  if (!tailor) {
    return next(new ErrorResponse("Tailor account not found or invalid", 404));
  }

  const targetTailorUserId = tailor._id;

  // 2. Optimization: Map items to ensure structure matches updated schema
  // In a real production environment, we would also verify basePrice and delivery charges here
  const formattedItems = items.map(item => ({
    product: item.product || null,
    service: item.service || null,
    fabricSource: item.fabricSource || (item.product ? 'platform' : 'customer'),
    deliveryType: item.deliveryType || 'standard',
    selectedFabric: item.selectedFabric || null,
    quantity: item.quantity || 1,
    price: item.price,
    measurements: item.measurements || {}
  }));

  // 3. Generate unique order ID
  const orderId = `ORD-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;

  // 4. Check if fabric pickup is required
  const fabricPickupRequired = formattedItems.some(item => item.fabricSource === 'customer');
  const initialStatus = "pending";

  // 5. Handle Promo Code / Coupon
  let discountAmount = 0;
  let finalAmount = totalAmount;

  if (promoCode) {
    const promo = await PromoCode.findOne({ code: promoCode, isActive: true });
    if (promo) {
      // Check dates
      const now = new Date();
      const isActive = promo.startDate <= now && (!promo.endDate || promo.endDate >= now);
      const isWithinLimit = promo.usedCount < promo.usageLimit;
      const isMinAmountMet = totalAmount >= promo.minOrderAmount;

      if (isActive && isWithinLimit && isMinAmountMet) {
        if (promo.discountType === "percentage") {
          discountAmount = (totalAmount * promo.discountValue) / 100;
          if (promo.maxDiscountAmount && discountAmount > promo.maxDiscountAmount) {
            discountAmount = promo.maxDiscountAmount;
          }
        } else {
          discountAmount = promo.discountValue;
        }
        finalAmount = totalAmount - discountAmount;
        
        // Increment used count
        promo.usedCount += 1;
        await promo.save();
      }
    }
  }

  // 6. Create Order with optimized object
  const order = await Order.create({
    orderId,
    customer: req.user.id,
    tailor: targetTailorUserId,
    items: formattedItems,
    totalAmount: finalAmount,
    discountAmount,
    couponCode: promoCode,
    deliveryAddress,
    status: initialStatus,
    fabricPickupRequired,
    trackingHistory: [{ 
        status: initialStatus, 
        message: fabricPickupRequired 
            ? "Order placed. Fabric pickup task created." 
            : "Order placed successfully" 
    }],
  });

  // 6. Notify tailor via Persistent & Real-time Notification
  await sendNotification({
    recipient: targetTailorUserId,
    type: "ORDER_CREATED",
    title: "New Request Received!",
    message: `You have received a new order ${order.orderId}. ${fabricPickupRequired ? 'Wait for fabric delivery from customer.' : 'You can start processing once accepted.'}`,
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
  let query = {};

  // Role-based filtering
  if (req.user.role === "customer") {
    query = { customer: req.user.id };
  } else if (req.user.role === "tailor") {
    query = { tailor: req.user.id };
  } else if (req.user.role === "delivery") {
    // Delivery partners see orders they are currently delivering
    query = { deliveryPartner: req.user.id };
  }

  const orders = await Order.find(query)
    .populate("tailor", "name shopName profileImage")
    .populate("customer", "name phoneNumber")
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
    .populate("deliveryPartner", "name phoneNumber profileImage")
    .lean();

  if (!order) {
    return next(new ErrorResponse("Order not found", 404));
  }

  // Check ownership
  if (
    order.customer?._id?.toString() !== req.user.id &&
    order.tailor?._id?.toString() !== req.user.id &&
    order.deliveryPartner?.toString() !== req.user.id &&
    req.user.role !== "admin"
  ) {
    return next(new ErrorResponse("Not authorized to view this order", 403));
  }

  res.status(200).json({
    success: true,
    data: order,
  });
});
