const Cart = require("../../../models/Cart");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get user cart
 * @route   GET /api/v1/customers/cart
 * @access  Private
 */
exports.getCart = asyncHandler(async (req, res, next) => {
  let cart = await Cart.findOne({ user: req.user.id })
    .populate("items.product", "name title price image")
    .populate("items.service", "title basePrice image");

  if (!cart) {
    cart = await Cart.create({ user: req.user.id, items: [] });
  }

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc    Add or Update item in cart
 * @route   POST /api/v1/customers/cart
 * @access  Private
 */
exports.addToCart = asyncHandler(async (req, res, next) => {
  const { productId, serviceId, quantity, price, config } = req.body;

  let cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    cart = new Cart({ user: req.user.id, items: [] });
  }

  // Check if item already exists
  const itemIndex = cart.items.findIndex(item => 
    (productId && item.product?.toString() === productId) || 
    (serviceId && item.service?.toString() === serviceId)
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += (quantity || 1);
    if (config) cart.items[itemIndex].config = config;
  } else {
    cart.items.push({
      product: productId,
      service: serviceId,
      quantity: quantity || 1,
      price,
      config
    });
  }

  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});

/**
 * @desc    Remove item from cart
 * @route   DELETE /api/v1/customers/cart/:itemId
 * @access  Private
 */
exports.removeFromCart = asyncHandler(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user.id });

  if (!cart) {
    return next(new ErrorResponse("Cart not found", 404));
  }

  cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);
  await cart.save();

  res.status(200).json({
    success: true,
    data: cart,
  });
});
