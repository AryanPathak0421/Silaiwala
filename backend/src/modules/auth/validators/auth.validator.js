const { body } = require('express-validator');

exports.validateRegister = [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ max: 50 }).withMessage('Name cannot exceed 50 characters'),
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('phoneNumber').notEmpty().withMessage('Phone number is required').matches(/^\+?[\d\s-]{10,}$/).withMessage('Please provide a valid phone number'),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
  body('role').optional().isIn(['customer', 'tailor', 'delivery']).withMessage('Invalid role'),
  
  // Tailor specific fields (conditional validation could be added, but manual check in controller is also fine for complex logic)
  body('shopName').optional().trim().isLength({ max: 100 }).withMessage('Shop name too long'),
  body('experienceInYears').optional().isInt({ min: 0 }).withMessage('Experience must be a positive number'),
];

exports.validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required'),
];
