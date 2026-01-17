import ChatRequest from "../models/ChatRequest.js"
import User from "../models/User.js"
import { getReceiverSocketId, io } from "../lib/socket.js"

export const sendChatRequest = async (req, res) => {
  try {
    const senderId = req.user._id
    const { receiverId } = req.params
    const { message } = req.body

    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send request to yourself" })
    }

    const receiverExists = await User.exists({ _id: receiverId })
    if (!receiverExists) {
      return res.status(404).json({ message: "User not found" })
    }

    // Check if request already exists
    const existingRequest = await ChatRequest.findOne({
      senderId,
      receiverId,
      status: "pending",
    })

    if (existingRequest) {
      return res.status(400).json({ message: "Request already sent" })
    }

    const chatRequest = new ChatRequest({
      senderId,
      receiverId,
      message: message || "Let's chat!",
    })

    await chatRequest.save()

    // Populate sender info and notify receiver via socket
    await chatRequest.populate("senderId", "-password")
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newChatRequest", chatRequest)
    }

    res.status(201).json(chatRequest)
  } catch (error) {
    console.log("Error in sendChatRequest:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getPendingRequests = async (req, res) => {
  try {
    const receiverId = req.user._id

    const requests = await ChatRequest.find({
      receiverId,
      status: "pending",
    }).populate("senderId", "-password")

    res.status(200).json(requests)
  } catch (error) {
    console.log("Error in getPendingRequests:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const acceptChatRequest = async (req, res) => {
  try {
    const receiverId = req.user._id
    const { requestId } = req.params

    const chatRequest = await ChatRequest.findById(requestId)

    if (!chatRequest) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (!chatRequest.receiverId.equals(receiverId)) {
      return res.status(403).json({ message: "Not authorized" })
    }

    chatRequest.status = "accepted"
    await chatRequest.save()

    // Get both users' info
    const receiver = await User.findById(receiverId).select("-password")
    const sender = await User.findById(chatRequest.senderId).select("-password")

    // Notify sender via socket that their request was accepted
    const senderSocketId = getReceiverSocketId(chatRequest.senderId)
    if (senderSocketId) {
      io.to(senderSocketId).emit("chatRequestAccepted", {
        requestId,
        user: receiver,
      })
    }

    // Notify receiver (current user) to refresh their chat list
    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("chatRequestAccepted", {
        requestId,
        user: sender,
      })
    }

    res.status(200).json({ message: "Request accepted", user: sender })
  } catch (error) {
    console.log("Error in acceptChatRequest:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const rejectChatRequest = async (req, res) => {
  try {
    const receiverId = req.user._id
    const { requestId } = req.params

    const chatRequest = await ChatRequest.findById(requestId)

    if (!chatRequest) {
      return res.status(404).json({ message: "Request not found" })
    }

    if (!chatRequest.receiverId.equals(receiverId)) {
      return res.status(403).json({ message: "Not authorized" })
    }

    chatRequest.status = "rejected"
    await chatRequest.save()

    res.status(200).json({ message: "Request rejected" })
  } catch (error) {
    console.log("Error in rejectChatRequest:", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}
