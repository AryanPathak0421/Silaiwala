const Service = require("../../../models/Service");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get all services
 * @route   GET /api/v1/services
 * @access  Public
 */
exports.getServices = asyncHandler(async (req, res, next) => {
  const { tailor, category, isActive = true } = req.query;
  
  let query = { isActive };

  if (tailor) query.tailor = tailor;
  if (category) query.category = category;

  const services = await Service.find(query)
    .populate("category", "name")
    .populate({
      path: "tailor",
      select: "shopName rating location",
      populate: { path: "user", select: "name profileImage" }
    })
    .lean();

  res.status(200).json({
    success: true,
    count: services.length,
    data: services,
  });
});

/**
 * @desc    Get single service
 * @route   GET /api/v1/services/:id
 * @access  Public
 */
exports.getServiceById = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id)
    .populate("category", "name description")
    .lean();

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Create new service (Admin Utility)
 * @route   POST /api/v1/services
 * @access  Private (Admin - logic omitted for simplicity or can be added later)
 */
exports.createService = asyncHandler(async (req, res, next) => {
  const service = await Service.create(req.body);

  res.status(201).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Update service
 * @route   PUT /api/v1/services/:id
 * @access  Private (Admin)
 */
exports.updateService = asyncHandler(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  res.status(200).json({
    success: true,
    data: service,
  });
});

/**
 * @desc    Delete service
 * @route   DELETE /api/v1/services/:id
 * @access  Private (Admin)
 */
exports.deleteService = asyncHandler(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new ErrorResponse(`Service not found with id of ${req.params.id}`, 404));
  }

  await service.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
