const Service = require("../../../models/Service");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get all services
 * @route   GET /api/v1/services
 * @access  Public
 */
exports.getServices = asyncHandler(async (req, res, next) => {
  // Convert string 'true'/'false' to boolean, default to true
  const isActive = req.query.isActive === 'false' ? false : true;
  
  let query = { isActive };

  if (req.query.tailor) query.tailor = req.query.tailor;
  if (req.query.category) query.category = req.query.category;

  // We want to only show services from ACTIVE and VERIFIED tailors
  const services = await Service.find(query)
    .populate({
      path: "tailor",
      match: { isAvailable: true }, // Only populate if tailor is available
      select: "shopName rating location user",
      populate: { 
        path: "user", 
        match: { isActive: true }, // Only populate if user is active
        select: "name profileImage" 
      }
    })
    .populate("category", "name")
    .lean();

  // Filter out services where tailor or tailor's user was not found due to match conditions
  const filteredServices = services.filter(service => 
    service.tailor && service.tailor.user
  );

  res.status(200).json({
    success: true,
    count: filteredServices.length,
    data: filteredServices,
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
