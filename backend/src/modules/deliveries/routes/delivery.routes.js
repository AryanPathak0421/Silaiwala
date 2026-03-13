const express = require("express");
const router = express.Router();
const {
  getMyProfile,
  getDashboardStats,
  updateProfile,
  updateStatus,
  getAssignedOrders,
  getAvailableOrders,
  acceptOrder,
  updateDeliveryStatus,
} = require("../controllers/delivery.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

// All routes are protected and for delivery partners only
router.use(protect);
router.use(authorize("delivery"));

router.get("/me", getMyProfile);
router.get("/stats", getDashboardStats);
router.patch("/profile", updateProfile);
router.patch("/status", updateStatus);
router.get("/orders", getAssignedOrders);
router.get("/available-orders", getAvailableOrders);
router.post("/orders/:id/accept", acceptOrder);
router.patch("/orders/:id/status", updateDeliveryStatus);

module.exports = router;
