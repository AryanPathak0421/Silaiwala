const Product = require("../../../models/Product");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get all fabric products for logged in tailor
 * @route   GET /api/v1/tailors/products
 * @access  Private (Tailor)
 */
exports.getMyProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ tailor: req.user.id }).populate("category", "name").sort("-createdAt");

  res.status(200).json({
    success: true,
    count: products.length,
    data: products,
  });
});

/**
 * @desc    Create a fabric product
 * @route   POST /api/v1/tailors/products
 * @access  Private (Tailor)
 */
exports.createProduct = asyncHandler(async (req, res, next) => {
  req.body.tailor = req.user.id;
  
  // Force it to be active by default
  req.body.isActive = true;

  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Update a product
 * @route   PATCH /api/v1/tailors/products/:id
 * @access  Private (Tailor)
 */
exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findOne({ _id: req.params.id, tailor: req.user.id });

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: product,
  });
});

/**
 * @desc    Delete a product
 * @route   DELETE /api/v1/tailors/products/:id
 * @access  Private (Tailor)
 */
exports.deleteProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findOne({ _id: req.params.id, tailor: req.user.id });

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  await product.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
