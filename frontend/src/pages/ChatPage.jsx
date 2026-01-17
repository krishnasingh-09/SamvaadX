"use client"

import { useChatStore } from "../store/useChatStore"
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react"

import BorderAnimatedContainer from "../components/BorderAnimatedContainer"
import ProfileHeader from "../components/ProfileHeader"
import ActiveTabSwitch from "../components/ActiveTabSwitch"
import ChatsList from "../components/ChatsList"
import ContactList from "../components/ContactList"
import ChatContainer from "../components/ChatContainer"
import NoConversationPlaceholder from "../components/NoConversationPlaceholder"
import ChatRequestsPanel from "../components/ChatRequestsPanel"

function ChatPage() {
  const { activeTab, selectedUser, getPendingRequests, subscribeToChatRequests, unsubscribeFromChatRequests } =
    useChatStore()
  const { socket } = useAuthStore()
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    if (socket && socket.connected) {
      getPendingRequests()
      subscribeToChatRequests()
      setIsInitialized(true)
    }

    return () => {
      if (isInitialized) {
        unsubscribeFromChatRequests()
      }
    }
  }, [socket, isInitialized, getPendingRequests, subscribeToChatRequests, unsubscribeFromChatRequests])

  return (
    <div className="fixed inset-0 flex items-center justify-center p-4 bg-slate-900 overflow-hidden">
      <BorderAnimatedContainer>
        {/* LEFT SIDE */}
        <div className="w-80 bg-slate-800/50 backdrop-blur-sm flex flex-col">
          <ProfileHeader />
          <ActiveTabSwitch />

          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {activeTab === "chats" ? <ChatsList /> : activeTab === "contacts" ? <ContactList /> : <ChatRequestsPanel />}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="flex-1 flex flex-col bg-slate-900/50 backdrop-blur-sm">
          {selectedUser ? <ChatContainer /> : <NoConversationPlaceholder />}
        </div>
      </BorderAnimatedContainer>
    </div>
  )
}
export default ChatPage
