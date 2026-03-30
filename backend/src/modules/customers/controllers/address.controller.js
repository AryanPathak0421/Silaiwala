const Customer = require("../../../models/Customer");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * @desc    Get all saved addresses for customer
 * @route   GET /api/v1/customers/addresses
 * @access  Private (Customer)
 */
exports.getAddresses = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findOne({ user: req.user.id });
  
  // Auto-create profile if role is customer/admin but profile is missing
  if (!customer) {
    customer = await Customer.create({ user: req.user.id });
  }

  if (!customer) {
    // If it's an admin or other authorized role, return empty data instead of error
    return res.status(200).json({
      success: true,
      count: 0,
      data: [],
    });
  }

  res.status(200).json({
    success: true,
    count: customer.addresses.length,
    data: customer.addresses,
  });
});

/**
 * @desc    Add new address
 * @route   POST /api/v1/customers/addresses
 * @access  Private (Customer)
 */
exports.addAddress = asyncHandler(async (req, res, next) => {
  let customer = await Customer.findOne({ user: req.user.id });
  
  // Auto-create profile if role is customer/admin but profile is missing
  if (!customer) {
    customer = await Customer.create({ user: req.user.id });
  }

  if (!customer) {
    return next(new ErrorResponse("Customer profile not found", 404));
  }

  // If this is set as default, unset others first
  if (req.body.isDefault) {
    customer.addresses.forEach(addr => addr.isDefault = false);
  } else if (customer.addresses.length === 0) {
    req.body.isDefault = true; // First address is always default
  }

  customer.addresses.push(req.body);
  await customer.save();

  res.status(201).json({
    success: true,
    data: customer.addresses,
  });
});

/**
 * @desc    Update an address
 * @route   PATCH /api/v1/customers/addresses/:id
 * @access  Private (Customer)
 */
exports.updateAddress = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });
  if (!customer) {
    return next(new ErrorResponse("Customer profile not found", 404));
  }

  const address = customer.addresses.id(req.params.id);
  if (!address) {
    return next(new ErrorResponse("Address not found", 404));
  }

  // If setting as default, unset others
  if (req.body.isDefault) {
    customer.addresses.forEach(addr => addr.isDefault = false);
  }

  Object.assign(address, req.body);
  await customer.save();

  res.status(200).json({
    success: true,
    data: customer.addresses,
  });
});

/**
 * @desc    Delete an address
 * @route   DELETE /api/v1/customers/addresses/:id
 * @access  Private (Customer)
 */
exports.deleteAddress = asyncHandler(async (req, res, next) => {
  const customer = await Customer.findOne({ user: req.user.id });
  if (!customer) {
    return next(new ErrorResponse("Customer profile not found", 404));
  }

  customer.addresses = customer.addresses.filter(
    (addr) => addr._id.toString() !== req.params.id
  );

  // If deleted address was default, set another one as default
  if (customer.addresses.length > 0 && !customer.addresses.some(a => a.isDefault)) {
    customer.addresses[0].isDefault = true;
  }

  await customer.save();

  res.status(200).json({
    success: true,
    data: customer.addresses,
  });
});
