const TailorWorkSample = require("../../../models/TailorWorkSample");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get all work samples for logged in tailor
 * @route   GET /api/v1/tailors/work-samples
 * @access  Private (Tailor)
 */
exports.getMyWorkSamples = asyncHandler(async (req, res, next) => {
  const samples = await TailorWorkSample.find({ tailor: req.user.id })
    .populate("category", "name")
    .sort("-createdAt");

  res.status(200).json({
    success: true,
    count: samples.length,
    data: samples,
  });
});

/**
 * @desc    Create a work sample
 * @route   POST /api/v1/tailors/work-samples
 * @access  Private (Tailor)
 */
exports.createWorkSample = asyncHandler(async (req, res, next) => {
  req.body.tailor = req.user.id;

  const sample = await TailorWorkSample.create(req.body);

  res.status(201).json({
    success: true,
    data: sample,
  });
});

/**
 * @desc    Update a work sample
 * @route   PATCH /api/v1/tailors/work-samples/:id
 * @access  Private (Tailor)
 */
exports.updateWorkSample = asyncHandler(async (req, res, next) => {
  let sample = await TailorWorkSample.findOne({ _id: req.params.id, tailor: req.user.id });

  if (!sample) {
    return next(new ErrorResponse("Work sample not found", 404));
  }

  sample = await TailorWorkSample.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: sample,
  });
});

/**
 * @desc    Delete a work sample
 * @route   DELETE /api/v1/tailors/work-samples/:id
 * @access  Private (Tailor)
 */
exports.deleteWorkSample = asyncHandler(async (req, res, next) => {
  const sample = await TailorWorkSample.findOne({ _id: req.params.id, tailor: req.user.id });

  if (!sample) {
    return next(new ErrorResponse("Work sample not found", 404));
  }

  await sample.deleteOne();

  res.status(200).json({
    success: true,
    data: {},
  });
});
