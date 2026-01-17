import express from "express"
import {
  sendChatRequest,
  getPendingRequests,
  acceptChatRequest,
  rejectChatRequest,
} from "../controllers/chat-request.controller.js"
import { protectRoute } from "../middleware/auth.middleware.js"
import { arcjetProtection } from "../middleware/arcjet.middleware.js"

const router = express.Router()

router.use(arcjetProtection, protectRoute)

router.post("/send/:receiverId", sendChatRequest)
router.get("/pending", getPendingRequests)
router.put("/accept/:requestId", acceptChatRequest)
router.put("/reject/:requestId", rejectChatRequest)

export default router
