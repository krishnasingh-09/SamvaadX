import express from "express";
import cookieParser from "cookie-parser";
import path from "path";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import chatRequestRoutes from "./routes/chat-request.route.js";
import { connectDB } from "./lib/db.js";
import { ENV } from "./lib/env.js";
import { app, server } from "./lib/socket.js";

const __dirname = path.resolve();
const PORT = ENV.PORT || 3000;

// ---------- CORS FIX ----------
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://samvaad-x-zxnv1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        console.error("Blocked by CORS:", origin);
        return callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
// --------------------------------

app.use(express.json({ limit: "5mb" }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/chat-requests", chatRequestRoutes);

// Serve frontend in production (Render fullstack)
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../frontend/dist/index.html"));
  });
}

server.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
  connectDB();
});


// import express from "express"
// import cookieParser from "cookie-parser"
// import path from "path"
// import cors from "cors"

// import authRoutes from "./routes/auth.route.js"
// import messageRoutes from "./routes/message.route.js"
// import chatRequestRoutes from "./routes/chat-request.route.js"
// import { connectDB } from "./lib/db.js"
// import { ENV } from "./lib/env.js"
// import { app, server } from "./lib/socket.js"

// const __dirname = path.resolve()

// const PORT = ENV.PORT || 3000

// app.use(express.json({ limit: "5mb" })) // req.body
// app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }))
// app.use(cookieParser())

// app.use("/api/auth", authRoutes)
// app.use("/api/messages", messageRoutes)
// app.use("/api/chat-requests", chatRequestRoutes)

// // make ready for deployment
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../frontend/dist")))

//   app.get("*", (_, res) => {
//     res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"))
//   })
// }

// server.listen(PORT, () => {
//   console.log("Server running on port: " + PORT)
//   connectDB()
// })
