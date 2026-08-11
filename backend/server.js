const express = require("express");
const app = express();
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");
require("dotenv").config();

require("./model/db");

const bookingRoutes = require("./routes/bookingTableRoute");
const menuRoutes = require("./routes/menuRoute");
const authRoutes = require("./routes/authRoutes");

// ✅ 1. CORS Configuration (Allows requests & Authorization headers from Vite)
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ 2. Middleware with increased payload limits for Base64 Profile Photos (Fixes 413 Payload Too Large)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Create server
const server = http.createServer(app);

// ✅ Socket setup
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

// ✅ Make io accessible in controllers
app.set("io", io);

// ✅ Routes
app.use("/api", bookingRoutes);
app.use("/api", menuRoutes);
app.use("/api", authRoutes);

// ✅ Start Server
const port=process.env.PORT;
server.listen(port, () => {
  console.log("Server running on port:",port);
});