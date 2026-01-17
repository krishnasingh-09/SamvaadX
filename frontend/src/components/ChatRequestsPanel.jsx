"use client"

import { useEffect, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import { Check, X, Loader } from "lucide-react"

function ChatRequestsPanel() {
  const {
    pendingRequests = [],
    isRequestsLoading,
    getPendingRequests,
    acceptChatRequest,
    rejectChatRequest,
  } = useChatStore()

  const [loadingRequestIds, setLoadingRequestIds] = useState(new Set())

  useEffect(() => {
    getPendingRequests()
  }, [])

  const handleAccept = async (requestId) => {
    setLoadingRequestIds((prev) => new Set(prev).add(requestId))
    try {
      await acceptChatRequest(requestId)
    } finally {
      setLoadingRequestIds((prev) => {
        const next = new Set(prev)
        next.delete(requestId)
        return next
      })
    }
  }

  const handleReject = async (requestId) => {
    setLoadingRequestIds((prev) => new Set(prev).add(requestId))
    try {
      await rejectChatRequest(requestId)
    } finally {
      setLoadingRequestIds((prev) => {
        const next = new Set(prev)
        next.delete(requestId)
        return next
      })
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const diff = now - new Date(date)
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return "Just now"
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`

    return new Date(date).toLocaleDateString()
  }

  if (isRequestsLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader className="w-5 h-5 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!pendingRequests || pendingRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-slate-400">
        <p className="text-sm">No pending requests</p>
        <p className="text-xs mt-1">Chat requests will appear here</p>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {pendingRequests.map((request) => (
        <div
          key={request._id}
          className="p-3 bg-slate-700/50 rounded-lg border border-slate-600/50 hover:border-cyan-500/50 transition"
        >
          <div className="flex items-start gap-3 mb-2">
            <img
              src={request.senderId?.profilePic || "/avatar.png"}
              alt={request.senderId?.fullName || "User"}
              className="w-10 h-10 rounded-full object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-sm font-semibold text-white">{request.senderId?.fullName || "Unknown User"}</p>
                <p className="text-xs text-slate-500">{formatTime(request.createdAt)}</p>
              </div>
              <p className="text-xs text-slate-400 mt-1 break-words">{request.message}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => handleAccept(request._id)}
              disabled={loadingRequestIds.has(request._id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-cyan-600 hover:bg-cyan-700 disabled:bg-cyan-600/50 disabled:cursor-not-allowed text-white rounded transition text-sm"
            >
              {loadingRequestIds.has(request._id) ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <Check className="w-4 h-4" />
              )}
              Accept
            </button>
            <button
              onClick={() => handleReject(request._id)}
              disabled={loadingRequestIds.has(request._id)}
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-700/50 disabled:cursor-not-allowed text-slate-300 rounded transition text-sm"
            >
              {loadingRequestIds.has(request._id) ? (
                <Loader className="w-4 h-4 animate-spin" />
              ) : (
                <X className="w-4 h-4" />
              )}
              Reject
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChatRequestsPanel
