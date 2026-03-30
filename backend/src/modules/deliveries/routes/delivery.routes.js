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
  submitDocuments,
  notifyNearbyPartners,
} = require("../controllers/delivery.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

router.use(protect);

// Routes accessible by customers and tailors
router.post("/ping-nearby", authorize("customer", "tailor", "admin"), notifyNearbyPartners);

// Routes restricted to delivery partners only
router.use(authorize("delivery"));

router.get("/me", getMyProfile);
router.get("/stats", getDashboardStats);
router.patch("/profile", updateProfile);
router.patch("/status", updateStatus);
router.get("/orders", getAssignedOrders);
router.get("/available-orders", getAvailableOrders);
router.post("/orders/:id/accept", acceptOrder);
router.patch("/orders/:id/status", updateDeliveryStatus);
router.post("/documents", submitDocuments);

module.exports = router;
