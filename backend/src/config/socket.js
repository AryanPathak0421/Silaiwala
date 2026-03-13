const { Server } = require("socket.io");

let io;

/**
 * Initialize Socket.io with an HTTP server instance.
 * @param {import("http").Server} httpServer
 * @returns {import("socket.io").Server}
 */
const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
    pingTimeout: 60000,
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // ── Join a room by userId for targeted notifications ─────────────────────
    socket.on("join_user_room", (userId) => {
      socket.join(`user_${userId}`);
      console.log(`👤 User ${userId} joined their notification room`);
    });

    socket.on("join", (room) => {
      socket.join(room);
      console.log(`🏢 Socket ${socket.id} joined room: ${room}`);
    });

    // ── Join a room by orderId for real-time order tracking ──────────────────
    socket.on("join_order_room", (orderId) => {
      socket.join(`order_${orderId}`);
      console.log(`📦 Socket ${socket.id} joined room: order_${orderId}`);
    });

    // ── Leave an order room ──────────────────────────────────────────────────
    socket.on("leave_order_room", (orderId) => {
      socket.leave(`order_${orderId}`);
      console.log(`🚪 Socket ${socket.id} left room: order_${orderId}`);
    });

    // ── Admin joins a global admin room ──────────────────────────────────────
    socket.on("join_admin_room", () => {
      socket.join("admin_room");
      console.log(`👑 Admin socket ${socket.id} joined admin_room`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`❌ Socket disconnected: ${socket.id} | Reason: ${reason}`);
    });
  });

  return io;
};

/**
 * Get the initialized Socket.io instance anywhere in the app.
 * @returns {import("socket.io").Server}
 */
const getIO = () => {
  if (!io) {
    throw new Error("Socket.io not initialized! Call initSocket(server) first.");
  }
  return io;
};

module.exports = { initSocket, getIO };
