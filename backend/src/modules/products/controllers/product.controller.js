const Product = require("../../../models/Product");
const Category = require("../../../models/Category");
const Review = require("../../../models/Review");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

exports.getProducts = asyncHandler(async (req, res, next) => {
  const { category, search, minPrice, maxPrice, sort, page = 1, limit = 10 } = req.query;

  let query = { isActive: true };

  // 1. Advanced Search (Text Index)
  if (search) {
    query.$text = { $search: search };
  }

  // 2. Category Filtering (Handles both Name and Slug if added later)
  if (category && category !== "All") {
    const categoryDoc = await Category.findOne({ name: category });
    if (categoryDoc) query.category = categoryDoc._id;
  }

  // 3. Optimized Price Range
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = Number(minPrice);
    if (maxPrice) query.price.$lte = Number(maxPrice);
  }

  // 4. Pagination Logic
  const skip = (page - 1) * limit;

  let productQuery = Product.find(query)
    .populate("category", "name")
    .populate("tailor", "name shopName")
    .skip(skip)
    .limit(Number(limit));

  // 5. Senior Sorting Options
  if (sort) {
    const sortBy = sort.split(",").join(" ");
    productQuery = productQuery.sort(sortBy);
  } else {
    productQuery = productQuery.sort("-createdAt");
  }

  const [products, total] = await Promise.all([
    productQuery.lean(),
    Product.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    total,
    page: Number(page),
    pages: Math.ceil(total / limit),
    count: products.length,
    data: products,
  });
});

exports.getProductDetails = asyncHandler(async (req, res, next) => {
  const product = await Product.findById(req.params.id)
    .populate("category", "name")
    .populate("tailor", "name shopName profileImage bio")
    .lean();

  if (!product) {
    return next(new ErrorResponse("Product not found", 404));
  }

  // Optimization: Fetch reviews and related products in parallel
  const [reviews, relatedProducts] = await Promise.all([
    Review.find({ targetId: product._id, targetType: "Product" })
      .populate("user", "name profileImage")
      .sort("-createdAt")
      .limit(5)
      .lean(),
    Product.find({ 
      category: product.category._id, 
      _id: { $ne: product._id },
      isActive: true 
    })
      .limit(4)
      .select("name title price originalPrice image discount")
      .lean()
  ]);

  res.status(200).json({
    success: true,
    data: {
      ...product,
      reviews,
      relatedProducts
    },
  });
});

/**
 * @desc    Get featured products for Store Home
 * @route   GET /api/v1/products/featured
 * @access  Public
 */
exports.getFeaturedProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find({ isFeatured: true, isActive: true })
    .populate("category", "name")
    .limit(8)
    .lean();

  res.status(200).json({
    success: true,
    data: products,
  });
});

/**
 * @desc    Get all categories
 * @route   GET /api/v1/products/categories
 * @access  Public
 */
exports.getCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find({ isActive: true }).lean();
  res.status(200).json({
    success: true,
    data: categories,
  });
});
