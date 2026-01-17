"use client"

import { useEffect, useRef } from "react"
import { useAuthStore } from "../store/useAuthStore"
import { useChatStore } from "../store/useChatStore"
import ChatHeader from "./ChatHeader"
import NoChatHistoryPlaceholder from "./NoChatHistoryPlaceholder"
import MessageInput from "./MessageInput"
import MessagesLoadingSkeleton from "./MessagesLoadingSkeleton"
import SendChatRequestPrompt from "./SendChatRequestPrompt"

function ChatContainer() {
  const {
    selectedUser,
    getMessagesByUserId,
    messages,
    isMessagesLoading,
    subscribeToMessages,
    unsubscribeFromMessages,
    chatStatus,
    isChatStatusLoading,
    checkChatStatus,
  } = useChatStore()
  const { authUser } = useAuthStore()
  const messageEndRef = useRef(null)

  useEffect(() => {
    getMessagesByUserId(selectedUser._id)
    checkChatStatus(selectedUser._id)
    subscribeToMessages()

    return () => unsubscribeFromMessages()
  }, [selectedUser, getMessagesByUserId, checkChatStatus, subscribeToMessages, unsubscribeFromMessages])

  useEffect(() => {
    if (messageEndRef.current) {
      messageEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  const canMessage = chatStatus?.canMessage

  return (
    <>
      <ChatHeader />
      <div className="flex-1 px-6 overflow-y-auto py-8">
        {messages.length > 0 && !isMessagesLoading ? (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((msg) => (
              <div key={msg._id} className={`chat ${msg.senderId === authUser._id ? "chat-end" : "chat-start"}`}>
                <div
                  className={`chat-bubble relative ${
                    msg.senderId === authUser._id ? "bg-cyan-600 text-white" : "bg-slate-800 text-slate-200"
                  }`}
                >
                  {msg.image && (
                    <img src={msg.image || "/placeholder.svg"} alt="Shared" className="rounded-lg h-48 object-cover" />
                  )}
                  {msg.text && <p className="mt-2">{msg.text}</p>}
                  <p className="text-xs mt-1 opacity-75 flex items-center gap-1">
                    {new Date(msg.createdAt).toLocaleTimeString(undefined, {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messageEndRef} />
          </div>
        ) : isMessagesLoading ? (
          <MessagesLoadingSkeleton />
        ) : (
          <NoChatHistoryPlaceholder name={selectedUser.fullName} />
        )}
      </div>

      {isChatStatusLoading ? (
        <div className="p-4 border-t border-slate-700/50 text-center text-slate-400">Loading...</div>
      ) : canMessage ? (
        <MessageInput />
      ) : (
        <SendChatRequestPrompt chatStatus={chatStatus} selectedUser={selectedUser} />
      )}
    </>
  )
}

export default ChatContainer
