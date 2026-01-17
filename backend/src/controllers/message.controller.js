import cloudinary from "../lib/cloudinary.js"
import { getReceiverSocketId, io } from "../lib/socket.js"
import Message from "../models/Message.js"
import User from "../models/User.js"
import ChatRequest from "../models/ChatRequest.js"

export const getAllContacts = async (req, res) => {
  try {
    const loggedInUserId = req.user._id
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password")

    res.status(200).json(filteredUsers)
  } catch (error) {
    console.log("Error in getAllContacts:", error)
    res.status(500).json({ message: "Server error" })
  }
}

export const getMessagesByUserId = async (req, res) => {
  try {
    const myId = req.user._id
    const { id: userToChatId } = req.params

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    })

    res.status(200).json(messages)
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body
    const { id: receiverId } = req.params
    const senderId = req.user._id

    if (!text && !image) {
      return res.status(400).json({ message: "Text or image is required." })
    }
    if (senderId.equals(receiverId)) {
      return res.status(400).json({ message: "Cannot send messages to yourself." })
    }
    const receiverExists = await User.exists({ _id: receiverId })
    if (!receiverExists) {
      return res.status(404).json({ message: "Receiver not found." })
    }

    const acceptedRequest = await ChatRequest.findOne({
      $or: [
        { senderId: senderId, receiverId: receiverId, status: "accepted" },
        { senderId: receiverId, receiverId: senderId, status: "accepted" },
      ],
    })

    if (!acceptedRequest) {
      return res.status(403).json({
        message: "You need an accepted chat request to send messages to this user.",
      })
    }

    let imageUrl
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image)
      imageUrl = uploadResponse.secure_url
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    })

    await newMessage.save()

    const receiverSocketId = getReceiverSocketId(receiverId)
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage)
    }

    res.status(201).json(newMessage)
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const checkChatRequestStatus = async (req, res) => {
  try {
    const { id: otherUserId } = req.params
    const currentUserId = req.user._id

    const chatRequest = await ChatRequest.findOne({
      $or: [
        { senderId: currentUserId, receiverId: otherUserId },
        { senderId: otherUserId, receiverId: currentUserId },
      ],
    }).populate("senderId", "fullName profilePic")

    if (!chatRequest) {
      return res.status(200).json({ status: "none", canMessage: false })
    }

    res.status(200).json({
      status: chatRequest.status,
      canMessage: chatRequest.status === "accepted",
      requestId: chatRequest._id,
      isSender: chatRequest.senderId._id.toString() === currentUserId.toString(),
    })
  } catch (error) {
    console.log("Error in checkChatRequestStatus: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}

export const getChatPartners = async (req, res) => {
  try {
    const loggedInUserId = req.user._id

    // Get all accepted chat requests where user is either sender or receiver
    const acceptedRequests = await ChatRequest.find({
      $or: [
        { senderId: loggedInUserId, status: "accepted" },
        { receiverId: loggedInUserId, status: "accepted" },
      ],
    })

    // Extract partner IDs from accepted requests
    const chatPartnerIds = acceptedRequests.map((request) =>
      request.senderId.toString() === loggedInUserId.toString()
        ? request.receiverId.toString()
        : request.senderId.toString(),
    )

    // Remove duplicates
    const uniquePartnerIds = [...new Set(chatPartnerIds)]

    const chatPartners = await User.find({ _id: { $in: uniquePartnerIds } }).select("-password")

    res.status(200).json(chatPartners)
  } catch (error) {
    console.error("Error in getChatPartners: ", error.message)
    res.status(500).json({ error: "Internal server error" })
  }
}
