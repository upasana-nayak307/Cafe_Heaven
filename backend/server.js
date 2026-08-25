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

// 1. Allowed origins configuration (Included both old & new Vercel domains)
const allowedOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://dailycafe-portal.vercel.app",
  "https://cafe-heaven-red.vercel.app",
  process.env.FRONTEND_URL,
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, or curl)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false); // Return false instead of throwing Error to prevent preflight crash
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  optionsSuccessStatus: 200,
};

// 2. Enable CORS middleware & handle Preflight across all routes
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// 3. Body Parsing Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// 4. Create Server & WebSockets
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

// 5. Routes
app.use("/api", bookingRoutes);
app.use("/api", menuRoutes);
app.use("/api", authRoutes);

// 6. Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error Handler:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// 7. Start Server
const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});