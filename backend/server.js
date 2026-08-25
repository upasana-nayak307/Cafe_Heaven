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

// 1. Allowed origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dailycafe-portal.vercel.app",
  "https://cafe-heaven-red.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

// 2. Permissive CORS Middleware
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (Postman/Curl) or if listed in allowedOrigins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["*"], // Allows all headers including Authorization, x-auth-token, token
    optionsSuccessStatus: 200,
  })
);

// 3. Fallback Preflight & Header Fix
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, token, x-auth-token"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }
  next();
});

// 4. Body Parsing
app.use(express.json({ limit: "25mb" }));
app.use(express.urlencoded({ limit: "25mb", extended: true }));

// 5. Server & Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socket.on("disconnect", () => console.log("User disconnected"));
});

app.set("io", io);

// 6. Routes
app.use("/api", bookingRoutes);
app.use("/api", menuRoutes);
app.use("/api", authRoutes);

// 7. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 8. Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});