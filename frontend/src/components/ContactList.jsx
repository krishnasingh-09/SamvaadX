"use client"

import { useEffect, useState } from "react"
import { useChatStore } from "../store/useChatStore"
import UsersLoadingSkeleton from "./UsersLoadingSkeleton"
import { useAuthStore } from "../store/useAuthStore"
import SendChatRequestModal from "./SendChatRequestModal"
import { MessageCirclePlus as MessagePlus } from "lucide-react"

function ContactList() {
  const { getAllContacts, allContacts, setSelectedUser, isUsersLoading } = useChatStore()
  const { onlineUsers } = useAuthStore()
  const [selectedUser, setSelectedUserState] = useState(null)
  const [showRequestModal, setShowRequestModal] = useState(false)

  useEffect(() => {
    getAllContacts()
  }, [getAllContacts])

  if (isUsersLoading) return <UsersLoadingSkeleton />

  return (
    <>
      {allContacts.map((contact) => (
        <div key={contact._id} className="bg-cyan-500/10 p-4 rounded-lg hover:bg-cyan-500/20 transition-colors group">
          <div className="flex items-center gap-3 justify-between">
            <div className="flex items-center gap-3 cursor-pointer flex-1" onClick={() => setSelectedUser(contact)}>
              <div className={`avatar ${onlineUsers.includes(contact._id) ? "online" : "offline"}`}>
                <div className="size-12 rounded-full">
                  <img src={contact.profilePic || "/avatar.png"} />
                </div>
              </div>
              <h4 className="text-slate-200 font-medium">{contact.fullName}</h4>
            </div>

            <button
              onClick={() => {
                setSelectedUserState(contact)
                setShowRequestModal(true)
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-cyan-500/30 rounded"
              title="Send chat request"
            >
              <MessagePlus className="w-5 h-5 text-cyan-400" />
            </button>
          </div>
        </div>
      ))}

      {showRequestModal && selectedUser && (
        <SendChatRequestModal
          user={selectedUser}
          onClose={() => {
            setShowRequestModal(false)
            setSelectedUserState(null)
          }}
        />
      )}
    </>
  )
}
export default ContactList
