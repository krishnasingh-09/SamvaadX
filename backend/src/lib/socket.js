import { Server } from "socket.io";
import http from "http";
import express from "express";
import { ENV } from "./env.js";
import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

const app = express();
const server = http.createServer(app);

const corsOptions = {
  origin: (origin, callback) => {
    const allowedOrigins = [
      // Development
      "http://localhost:5173",
      "http://localhost:3000",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:3000",
      // Production - Vercel Frontend
      "https://samvaad-x-zxnv1.vercel.app",
      // Production - Render Backend
      "https://samvaadx-backend.onrender.com",
    ];
    
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST"],
};

const io = new Server(server, {
  cors: corsOptions,
});

// apply authentication middleware to all socket connections
io.use(socketAuthMiddleware);

// we will use this function to check if the user is online or not
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// this is for storig online users
const userSocketMap = {}; // {userId:socketId}

io.on("connection", (socket) => {
  console.log("A user connected", socket.user.fullName);

  const userId = socket.userId;
  userSocketMap[userId] = socket.id;

  // io.emit() is used to send events to all connected clients
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // with socket.on we listen for events from clients
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.user.fullName);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { io, app, server };



// import { Server } from "socket.io";
// import http from "http";
// import express from "express";
// import { ENV } from "./env.js";
// import { socketAuthMiddleware } from "../middleware/socket.auth.middleware.js";

// const app = express();
// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: [ENV.CLIENT_URL],
//     credentials: true,
//   },
// });

// // apply authentication middleware to all socket connections
// io.use(socketAuthMiddleware);

// // we will use this function to check if the user is online or not
// export function getReceiverSocketId(userId) {
//   return userSocketMap[userId];
// }

// // this is for storig online users
// const userSocketMap = {}; // {userId:socketId}

// io.on("connection", (socket) => {
//   console.log("A user connected", socket.user.fullName);

//   const userId = socket.userId;
//   userSocketMap[userId] = socket.id;

//   // io.emit() is used to send events to all connected clients
//   io.emit("getOnlineUsers", Object.keys(userSocketMap));

//   // with socket.on we listen for events from clients
//   socket.on("disconnect", () => {
//     console.log("A user disconnected", socket.user.fullName);
//     delete userSocketMap[userId];
//     io.emit("getOnlineUsers", Object.keys(userSocketMap));
//   });
// });

// export { io, app, server };
