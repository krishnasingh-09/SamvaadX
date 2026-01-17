"use client"

import { useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { SendIcon, Clock, CheckCircle } from "lucide-react"

function SendChatRequestPrompt({ chatStatus, selectedUser }) {
  const { sendChatRequest, checkChatStatus } = useChatStore()
  const [message, setMessage] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendRequest = async () => {
    if (!selectedUser) return
    setIsSending(true)
    await sendChatRequest(selectedUser._id, message || "Hey! I'd like to chat with you.")
    await checkChatStatus(selectedUser._id)
    setMessage("")
    setIsSending(false)
  }

  // Request is pending - user sent a request
  if (chatStatus?.status === "pending" && chatStatus?.isSender) {
    return (
      <div className="p-4 border-t border-slate-700/50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 py-4">
          <Clock className="w-8 h-8 text-amber-500" />
          <p className="text-slate-300 text-center">
            Your chat request is pending approval from{" "}
            <span className="font-semibold text-cyan-400">{selectedUser?.fullName}</span>
          </p>
          <p className="text-slate-500 text-sm">You'll be able to message once they accept.</p>
        </div>
      </div>
    )
  }

  // Request is pending - user received a request (they need to accept)
  if (chatStatus?.status === "pending" && !chatStatus?.isSender) {
    return (
      <div className="p-4 border-t border-slate-700/50">
        <div className="max-w-3xl mx-auto flex flex-col items-center gap-2 py-4">
          <CheckCircle className="w-8 h-8 text-cyan-500" />
          <p className="text-slate-300 text-center">
            <span className="font-semibold text-cyan-400">{selectedUser?.fullName}</span> has sent you a chat request.
          </p>
          <p className="text-slate-500 text-sm">Accept the request in the Requests tab to start chatting.</p>
        </div>
      </div>
    )
  }

  // No request exists - show send request form
  return (
    <div className="p-4 border-t border-slate-700/50">
      <div className="max-w-3xl mx-auto">
        <p className="text-slate-400 text-center mb-3">
          Send a chat request to <span className="font-semibold text-cyan-400">{selectedUser?.fullName}</span> to start
          messaging
        </p>
        <div className="flex space-x-4">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 bg-slate-800/50 border border-slate-700/50 rounded-lg py-2 px-4 text-slate-200 placeholder-slate-500"
            placeholder="Add a message (optional)..."
          />
          <button
            onClick={handleSendRequest}
            disabled={isSending}
            className="bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg px-6 py-2 font-medium hover:from-cyan-600 hover:to-cyan-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            <SendIcon className="w-4 h-4" />
            {isSending ? "Sending..." : "Send Request"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default SendChatRequestPrompt
