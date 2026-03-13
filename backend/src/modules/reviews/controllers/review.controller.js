const Review = require("../../../models/Review");
const Product = require("../../../models/Product");
const Tailor = require("../../../models/Tailor");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Create a new review
 * @route   POST /api/v1/reviews
 * @access  Private
 */
exports.createReview = asyncHandler(async (req, res, next) => {
  const { rating, comment, targetType, targetId } = req.body;

  // Check if review already exists from this user for this target
  const existingReview = await Review.findOne({
    user: req.user.id,
    targetId,
    targetType,
  });

  if (existingReview) {
    return next(new ErrorResponse("You have already reviewed this", 400));
  }

  const review = await Review.create({
    user: req.user.id,
    name: req.user.name,
    rating: Number(rating),
    comment,
    targetType,
    targetId,
  });

  // Update average rating for Product or Tailor
  if (targetType === "Product") {
    const product = await Product.findById(targetId);
    if (product) {
      const reviews = await Review.find({ targetId, targetType: "Product" });
      product.numOfReviews = reviews.length;
      product.ratings = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await product.save();
    }
  } else if (targetType === "Tailor") {
    const tailor = await Tailor.findOne({ user: targetId });
    if (tailor) {
      const reviews = await Review.find({ targetId, targetType: "Tailor" });
      tailor.totalReviews = reviews.length;
      tailor.rating = reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length;
      await tailor.save();
    }
  }

  res.status(201).json({
    success: true,
    data: review,
  });
});

/**
 * @desc    Get reviews for a target
 * @route   GET /api/v1/reviews/:targetType/:targetId
 * @access  Public
 */
exports.getReviews = asyncHandler(async (req, res, next) => {
  const { targetType, targetId } = req.params;
  const reviews = await Review.find({ targetType, targetId })
    .populate("user", "name profileImage")
    .sort("-createdAt")
    .lean();

  res.status(200).json({
    success: true,
    count: reviews.length,
    data: reviews,
  });
});
