const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const app = express();

// ─── Security Middlewares ────────────────────────────────────────────────────

// Set secure HTTP headers
app.use(helmet());

// CORS – allow frontend origin
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Global Rate Limiter – 100 requests per 15 min per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use(globalLimiter);

// ─── Body Parsers ────────────────────────────────────────────────────────────

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// ─── HTTP Request Logger ─────────────────────────────────────────────────────

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
} else {
  app.use(morgan("combined"));
}

// ─── Health Check ────────────────────────────────────────────────────────────

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Tailor Platform API is running 🚀",
    environment: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use("/api/v1/auth", require("./modules/auth/routes/auth.routes"));
app.use("/api/v1/customers", require("./modules/customers/routes/customer.routes"));
app.use("/api/v1/orders", require("./modules/orders/routes/order.routes"));
app.use("/api/v1/products", require("./modules/products/routes/product.routes"));
app.use("/api/v1/measurements", require("./modules/measurements/routes/measurement.routes"));
app.use("/api/v1/reviews", require("./modules/reviews/routes/review.routes"));
app.use("/api/v1/services", require("./modules/services/routes/service.routes"));
app.use("/api/v1/notifications", require("./modules/notifications/routes/notification.routes"));
app.use("/api/v1/tailors", require("./modules/tailors/routes/tailor.routes"));
app.use("/api/v1/deliveries", require("./modules/deliveries/routes/delivery.routes"));

// ─── 404 Handler ─────────────────────────────────────────────────────────────

app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Global Error Handler ────────────────────────────────────────────────────

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error(`[ERROR] ${err.message}`);
  console.error(err.stack);

  // Mongoose validation error
  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: messages,
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({
      success: false,
      message: `${field} already exists.`,
    });
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") {
    return res.status(401).json({ success: false, message: "Invalid token." });
  }
  if (err.name === "TokenExpiredError") {
    return res.status(401).json({ success: false, message: "Token expired." });
  }

  // Default server error
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;
