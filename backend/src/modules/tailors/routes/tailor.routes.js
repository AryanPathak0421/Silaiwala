const express = require("express");
const { 
  getTailors, 
  getTailorDetails, 
  getMyProfile, 
  updateProfile, 
  getDashboardData, 
  getOrders,
  updateOrderStatus,
  withdrawFunds
} = require("../controllers/tailor.controller");
const {
  getMyWorkSamples,
  createWorkSample,
  updateWorkSample,
  deleteWorkSample
} = require("../controllers/workSample.controller");
const {
  getMyProducts,
  createProduct,
  updateProduct,
  deleteProduct
} = require("../controllers/tailorProduct.controller");
const {
  getMyServices,
  createService: createTailorService,
  updateService: updateTailorService,
  deleteService: deleteTailorService
} = require("../controllers/tailorService.controller");
const { protect, authorize } = require("../../../middlewares/auth.middleware");

const router = express.Router();

// ─── PUBLIC LISTING ROUTE ───────────────────────────────────────────────────
router.get("/", getTailors);

// ─── PROTECTED TAILOR ROUTES (STATIC PATHS FIRST) ───────────────────────────
router.use(protect);

// Specific GET routes MUST come before /:id
router.get("/me", authorize("tailor"), getMyProfile);
router.get("/dashboard", authorize("tailor"), getDashboardData);
router.get("/orders", authorize("tailor"), getOrders);
router.get("/work-samples", authorize("tailor"), getMyWorkSamples);
router.get("/products", authorize("tailor"), getMyProducts);
router.get("/services", authorize("tailor"), getMyServices);

// ─── PUBLIC DETAILS ROUTE (DYNAMIC PATH) ────────────────────────────────────
// Moving this AFTER the specific static routes to prevent shadowing
router.get("/:id", getTailorDetails);

// ─── OTHER PROTECTED TAILOR ACTIONS ──────────────────────────────────────────
router.use(authorize("tailor"));

router.patch("/profile", updateProfile);
router.post("/withdraw", withdrawFunds);
router.patch("/orders/:id/status", updateOrderStatus);

// Work Samples Actions
router.post("/work-samples", createWorkSample);
router.patch("/work-samples/:id", updateWorkSample);
router.delete("/work-samples/:id", deleteWorkSample);

// Fabric Products Actions
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

// Tailor Services Actions
router.post("/services", createTailorService);
router.patch("/services/:id", updateTailorService);
router.delete("/services/:id", deleteTailorService);

module.exports = router;
