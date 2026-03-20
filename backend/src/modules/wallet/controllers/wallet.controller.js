const WalletTransaction = require("../../../models/WalletTransaction");
const Tailor = require("../../../models/Tailor");
const Delivery = require("../../../models/Delivery");
const Payout = require("../../../models/Payout"); // Assuming Payout model exists for withdrawal requests
const asyncHandler = require("../../../utils/asyncHandler");
const ErrorResponse = require("../../../utils/errorResponse");
const crypto = require("crypto");

/**
 * @desc    Get current wallet balance and stats
 * @route   GET /api/v1/wallet/balance
 * @access  Private (Tailor/Delivery)
 */
exports.getWalletBalance = asyncHandler(async (req, res, next) => {
  let balance = 0;
  let totalWithdrawn = 0;

  if (req.user.role === "tailor") {
    const profile = await Tailor.findOne({ user: req.user.id });
    if (profile) {
      balance = profile.walletBalance;
      totalWithdrawn = profile.totalWithdrawn;
    }
  } else if (req.user.role === "delivery") {
    const profile = await Delivery.findOne({ user: req.user.id });
    if (profile) {
      balance = profile.walletBalance;
      totalWithdrawn = profile.totalWithdrawn;
    }
  }

  res.status(200).json({
    success: true,
    data: {
      balance,
      totalWithdrawn,
      currency: "INR"
    }
  });
});

/**
 * @desc    Get wallet transaction history
 * @route   GET /api/v1/wallet/transactions
 * @access  Private (Tailor/Delivery)
 */
exports.getWalletTransactions = asyncHandler(async (req, res, next) => {
  const transactions = await WalletTransaction.find({ user: req.user.id })
    .sort("-createdAt")
    .populate("order", "orderId totalAmount");

  res.status(200).json({
    success: true,
    count: transactions.length,
    data: transactions
  });
});

/**
 * @desc    Request withdrawal
 * @route   POST /api/v1/wallet/withdraw
 * @access  Private (Tailor/Delivery)
 */
exports.requestWithdrawal = asyncHandler(async (req, res, next) => {
  const { amount, method, bankDetails } = req.body;

  if (!amount || amount <= 0) {
    return next(new ErrorResponse("Please provide a valid withdrawal amount", 400));
  }

  let profile;
  if (req.user.role === "tailor") {
    profile = await Tailor.findOne({ user: req.user.id });
  } else if (req.user.role === "delivery") {
    profile = await Delivery.findOne({ user: req.user.id });
  }

  if (!profile || profile.walletBalance < amount) {
    return next(new ErrorResponse("Insufficient wallet balance", 400));
  }

  // Use a transaction to ensure atomicity
  const mongoose = require("mongoose");
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 1. Deduct from wallet balance immediately (hold)
    profile.walletBalance -= amount;
    await profile.save({ session });

    // 2. Create Payout record
    const payoutId = `PAY-${crypto.randomBytes(4).toString("hex").toUpperCase()}`;
    const payout = await Payout.create([{
      payoutId,
      tailor: req.user.id, // The model uses 'tailor' field for the user ref, maybe should be generic 'user'
      amount,
      method: method || "bank_transfer",
      bankDetails: bankDetails || profile.bankDetails,
      status: "pending"
    }], { session });

    // 3. Create Debit Transaction
    await WalletTransaction.create([{
      user: req.user.id,
      amount: amount,
      type: "debit",
      category: "withdrawal",
      status: "pending",
      description: `Withdrawal request ${payoutId}`
    }], { session });

    await session.commitTransaction();
    
    res.status(200).json({
      success: true,
      message: "Withdrawal request submitted successfully",
      data: payout[0]
    });
  } catch (error) {
    await session.abortTransaction();
    return next(new ErrorResponse("Withdrawal request failed", 500));
  } finally {
    session.endSession();
  }
});
