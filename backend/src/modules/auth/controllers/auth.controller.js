const jwt = require("jsonwebtoken");
const User = require("../../../models/User");
const Customer = require("../../../models/Customer");
const Tailor = require("../../../models/Tailor");
const Delivery = require("../../../models/Delivery");
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");

/**
 * Generate JWT Token
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || "30d",
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/v1/auth/register
 * @access  Public
 */
exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, phoneNumber, password, role, shopName, experienceInYears, coordinates, specializations } = req.body;

  // 1. Validate Role
  const allowedRoles = ["customer", "tailor", "delivery"];
  const finalRole = allowedRoles.includes(role?.toLowerCase()) ? role.toLowerCase() : "customer";

  // 2. Check for existing user (Redundant if using Mongoose unique index, but good for custom error messages)
  const userExists = await User.findOne({ $or: [{ email }, { phoneNumber }] });
  if (userExists) {
    const conflictField = userExists.email === email ? "email" : "phone number";
    return next(new ErrorResponse(`A user with this ${conflictField} already exists`, 400));
  }

  // 3. Create User
  const user = await User.create({
    name,
    email,
    phoneNumber,
    password,
    role: finalRole,
  });

  let profile = null;

  // 4. Create Role-Specific Profile
  try {
    switch (finalRole) {
      case "customer":
        profile = await Customer.create({ 
          user: user._id 
        });
        break;
      case "tailor":
        profile = await Tailor.create({ 
          user: user._id,
          shopName: shopName || `${name}'s Boutique`,
          experienceInYears: experienceInYears || 0,
          specializations: specializations || [],
          location: {
            type: "Point",
            coordinates: coordinates || [0, 0] // [longitude, latitude]
          }
        });
        break;
      case "delivery":
        profile = await Delivery.create({ 
          user: user._id,
          vehicleType: req.body.vehicleType || "bike",
          currentLocation: {
            type: "Point",
            coordinates: coordinates || [0, 0]
          }
        });
        break;
    }
  } catch (err) {
    // Cleanup: Remove user if profile creation fails (Atomic work-around)
    await User.findByIdAndDelete(user._id);
    return next(new ErrorResponse(`Failed to create ${finalRole} profile: ${err.message}`, 500));
  }

  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      profile: profile
    },
  });
});

/**
 * @desc    Backward compatibility for registerCustomer
 */
exports.registerCustomer = exports.register;

/**
 * @desc    Login user
 * @route   POST /api/v1/auth/login
 * @access  Public
 */
exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email and password
  if (!email || !password) {
    return next(new ErrorResponse("Please provide email and password", 400));
  }

  // Check for user
  const user = await User.findOne({ email }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return next(new ErrorResponse("Invalid credentials", 401));
  }

  const token = generateToken(user._id);

  let profile = null;
  if (user.role === 'tailor') {
    profile = await Tailor.findOne({ user: user._id });
  }

  res.status(200).json({
    success: true,
    token,
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profile: profile
    },
  });
});
