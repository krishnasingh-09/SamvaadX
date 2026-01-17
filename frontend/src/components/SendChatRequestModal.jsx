"use client"

import { useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { X, Send } from "lucide-react"

function SendChatRequestModal({ user, onClose }) {
  const { sendChatRequest } = useChatStore()
  const [message, setMessage] = useState("Let's chat!")
  const [isSending, setIsSending] = useState(false)

  const handleSend = async () => {
    if (!message.trim()) return
    setIsSending(true)
    await sendChatRequest(user._id, message)
    setIsSending(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 rounded-lg p-6 max-w-md w-full mx-4 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">Send Chat Request</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullName}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-white">{user.fullName}</p>
              <p className="text-sm text-slate-400">{user.email}</p>
            </div>
          </div>

          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Add a message..."
            maxLength={200}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 resize-none"
            rows={3}
          />
          <p className="text-xs text-slate-400 mt-1">{message.length}/200 characters</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSend}
            disabled={isSending || !message.trim()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-700 text-white rounded transition disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default SendChatRequestModal
