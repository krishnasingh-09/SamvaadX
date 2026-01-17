"use client"

import { useChatStore } from "../store/useChatStore"
import { Mail } from "lucide-react"

function ActiveTabSwitch() {
  const { activeTab, setActiveTab, pendingRequests = [] } = useChatStore()

  return (
    <div className="tabs tabs-boxed bg-transparent p-2 m-2 flex gap-1">
      <button
        onClick={() => setActiveTab("chats")}
        className={`tab ${activeTab === "chats" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
      >
        Chats
      </button>

      <button
        onClick={() => setActiveTab("contacts")}
        className={`tab ${activeTab === "contacts" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
      >
        Contacts
      </button>

      <button
        onClick={() => setActiveTab("requests")}
        className={`tab relative ${activeTab === "requests" ? "bg-cyan-500/20 text-cyan-400" : "text-slate-400"}`}
      >
        <div className="flex items-center gap-2">
          <Mail className="w-4 h-4" />
          Requests
          {(pendingRequests || []).length > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {pendingRequests.length}
            </span>
          )}
        </div>
      </button>
    </div>
  )
}
export default ActiveTabSwitch
