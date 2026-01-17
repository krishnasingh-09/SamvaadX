import { create } from "zustand"
import { axiosInstance } from "../lib/axios"
import toast from "react-hot-toast"
import { useAuthStore } from "./useAuthStore"

export const useChatStore = create((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled")) === true,
  pendingRequests: [],
  isRequestsLoading: false,
  chatStatus: null,
  isChatStatusLoading: false,

  toggleSound: () => {
    localStorage.setItem("isSoundEnabled", !get().isSoundEnabled)
    set({ isSoundEnabled: !get().isSoundEnabled })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedUser: (selectedUser) => set({ selectedUser, chatStatus: null }),

  getAllContacts: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/messages/contacts")
      set({ allContacts: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },
  getMyChatPartners: async () => {
    set({ isUsersLoading: true })
    try {
      const res = await axiosInstance.get("/messages/chats")
      set({ chats: res.data })
    } catch (error) {
      toast.error(error.response.data.message)
    } finally {
      set({ isUsersLoading: false })
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/${userId}`)
      set({ messages: res.data })
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong")
    } finally {
      set({ isMessagesLoading: false })
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, chatStatus } = get()
    const { authUser } = useAuthStore.getState()

    if (!chatStatus?.canMessage) {
      toast.error("You need an accepted chat request to send messages")
      return
    }

    const tempId = `temp-${Date.now()}`

    const optimisticMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date().toISOString(),
      isOptimistic: true,
    }
    set({ messages: [...messages, optimisticMessage] })

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData)
      set({ messages: messages.concat(res.data) })
    } catch (error) {
      set({ messages: messages })
      toast.error(error.response?.data?.message || "Something went wrong")
    }
  },

  getPendingRequests: async () => {
    set({ isRequestsLoading: true })
    try {
      const res = await axiosInstance.get("/chat-requests/pending")
      set({ pendingRequests: res.data })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch requests")
    } finally {
      set({ isRequestsLoading: false })
    }
  },

  sendChatRequest: async (receiverId, message) => {
    try {
      await axiosInstance.post(`/chat-requests/send/${receiverId}`, { message })
      toast.success("Chat request sent!")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send request")
    }
  },

  acceptChatRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/chat-requests/accept/${requestId}`)
      set({
        pendingRequests: get().pendingRequests.filter((r) => r._id !== requestId),
      })
      toast.success("Request accepted!")
      get().getMyChatPartners()
      const { selectedUser } = get()
      if (selectedUser) {
        get().checkChatStatus(selectedUser._id)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to accept request")
    }
  },

  rejectChatRequest: async (requestId) => {
    try {
      await axiosInstance.put(`/chat-requests/reject/${requestId}`)
      set({
        pendingRequests: get().pendingRequests.filter((r) => r._id !== requestId),
      })
      toast.success("Request rejected")
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to reject request")
    }
  },

  subscribeToChatRequests: () => {
    const socket = useAuthStore.getState().socket
    if (!socket) return

    socket.on("newChatRequest", (newRequest) => {
      set({ pendingRequests: [...get().pendingRequests, newRequest] })
      if (get().isSoundEnabled) {
        const notificationSound = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/SamvaadX/frontend/public/sounds/notification-aGAv7Fb785MIoaUsvfBASVm2EeW7Pz.mp3")
        notificationSound.play().catch((e) => console.log("Audio play failed:", e))
      }
      toast.success(`New chat request from ${newRequest.senderId?.fullName || "someone"}`)
    })

    socket.on("chatRequestAccepted", ({ user }) => {
      toast.success(`${user?.fullName || "Someone"} is now your chat partner!`)
      get().getMyChatPartners()
      // Update chat status if we have a selected user
      const { selectedUser } = get()
      if (selectedUser && selectedUser._id === user._id) {
        get().checkChatStatus(selectedUser._id)
      }
    })
  },

  unsubscribeFromChatRequests: () => {
    const socket = useAuthStore.getState().socket
    if (!socket) return
    socket.off("newChatRequest")
    socket.off("chatRequestAccepted")
  },

  subscribeToMessages: () => {
    const { selectedUser, isSoundEnabled } = get()
    if (!selectedUser) return

    const socket = useAuthStore.getState().socket

    socket.on("newMessage", (newMessage) => {
      const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
      if (!isMessageSentFromSelectedUser) return

      const currentMessages = get().messages
      set({ messages: [...currentMessages, newMessage] })

      if (isSoundEnabled) {
        const notificationSound = new Audio("https://hebbkx1anhila5yf.public.blob.vercel-storage.com/files-blob/SamvaadX/frontend/public/sounds/notification-aGAv7Fb785MIoaUsvfBASVm2EeW7Pz.mp3")

        notificationSound.currentTime = 0 // reset to start
        notificationSound.play().catch((e) => console.log("Audio play failed:", e))
      }
    })
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket
    socket.off("newMessage")
  },

  checkChatStatus: async (userId) => {
    set({ isChatStatusLoading: true })
    try {
      const res = await axiosInstance.get(`/messages/chat-status/${userId}`)
      set({ chatStatus: res.data })
      return res.data
    } catch (error) {
      console.log("Error checking chat status:", error)
      set({ chatStatus: { status: "none", canMessage: false } })
    } finally {
      set({ isChatStatusLoading: false })
    }
  },
}))
