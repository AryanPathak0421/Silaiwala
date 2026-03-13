const express = require("express");
const router = express.Router();
const { 
  getProfile, 
  updateProfile, 
  getTailors,
  getWishlist,
  wishlistToggle,
  applyPromoCode,
  getReferralStats
} = require("../controllers/customer.controller");
const { 
  getAddresses, 
  addAddress, 
  updateAddress, 
  deleteAddress 
} = require("../controllers/address.controller");
const {
  getCart,
  addToCart,
  removeFromCart
} = require("../controllers/cart.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

router.use(protect);
router.use(authorize("customer"));

router.get("/profile", getProfile);
router.patch("/profile", updateProfile);
router.get("/tailors", getTailors);

// Address Management
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.patch("/addresses/:id", updateAddress);
router.delete("/addresses/:id", deleteAddress);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist/toggle", wishlistToggle);

// Promo
router.post("/apply-promo", applyPromoCode);

// Refer & Earn
router.get("/referral-stats", getReferralStats);

// Cart Management
router.get("/cart", getCart);
router.post("/cart", addToCart);
router.delete("/cart/:itemId", removeFromCart);

module.exports = router;
