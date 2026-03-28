import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Search, MessageCircle, Loader, Plus, Shield } from 'lucide-react'
import { ref, onValue, push, set } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo, initials, avatarColor } from '../utils/format'
import BottomNav from '../components/BottomNav'

export default function ChatList() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [chats, setChats] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = onValue(ref(db, 'chats'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => {
          const c = child.val()
          if (c.participants && c.participants[user.uid]) {
            list.push({ id: child.key, ...c })
          }
        })
        list.sort((a, b) => (b.lastMessageAt || 0) - (a.lastMessageAt || 0))
        setChats(list)
      } else {
        setChats([])
      }
      setLoading(false)
    })
    return unsub
  }, [user])

  const startAdminChat = async () => {
    const existingAdminChat = chats.find(c => c.isAdminChat)
    if (existingAdminChat) { navigate(`/chat/${existingAdminChat.id}`); return }
    const chatData = {
      participants: { [user.uid]: true },
      lastMessage: '',
      lastMessageAt: Date.now(),
      type: 'group',
      name: 'QCHelp Support',
      isAdminChat: true,
      createdAt: Date.now(),
    }
    const newRef = await push(ref(db, 'chats'), chatData)
    navigate(`/chat/${newRef.key}`)
  }

  const displayName = profile?.displayName || user?.displayName || 'User'

  return (
    <div className="shell">
      <div className="inner-nav">
        <div className="logo-row">
          <span className="inner-title">Messages</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <button className="icon-btn"><Search size={20} /></button>
          <button className="icon-btn" onClick={startAdminChat}><Edit size={20} /></button>
        </div>
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        <div style={{ padding: '10px 14px' }}>
          <button
            className="dash-q-btn blue"
            style={{ width: '100%', justifyContent: 'flex-start', marginBottom: 8 }}
            onClick={startAdminChat}
          >
            <div style={{ width: 36, height: 36, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Shield size={16} />
            </div>
            <div>
              <div className="dq-label">QCHelp Support</div>
              <div className="dq-sub">Chat with our admin team</div>
            </div>
          </button>
        </div>

        {loading ? (
          <div className="empty-state"><Loader size={32} className="spin" /><p>Loading messages…</p></div>
        ) : chats.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 48 }}>
            <MessageCircle size={48} />
            <p style={{ fontWeight: 600, color: 'var(--text-2)', marginTop: 12 }}>No conversations yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4, textAlign: 'center' }}>Start a conversation with QCHelp Support or connect with other residents.</p>
          </div>
        ) : (
          <div className="chat-list">
            {chats.map(chat => {
              const chatName = chat.name || chat.otherUserName || 'Chat'
              const av = avatarColor(chat.id)
              const unread = chat.unreadCount?.[user.uid] || 0
              return (
                <div key={chat.id} className={`chat-item ${unread > 0 ? 'unread' : ''}`} onClick={() => navigate(`/chat/${chat.id}`)}>
                  <div style={{ position: 'relative', flexShrink: 0 }}>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: chat.isAdminChat ? '#DBEAFE' : av.bg, color: chat.isAdminChat ? '#1D4ED8' : av.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>
                      {chat.isAdminChat ? <Shield size={20} /> : initials(chatName)}
                    </div>
                    {chat.online && <div style={{ position: 'absolute', bottom: 2, right: 2, width: 10, height: 10, borderRadius: '50%', background: 'var(--green)', border: '2px solid var(--surface)' }} />}
                  </div>
                  <div className="chat-info">
                    <div className="chat-row">
                      <span className="chat-name">{chatName}</span>
                      <span className="chat-time">{timeAgo(chat.lastMessageAt)}</span>
                    </div>
                    <div className="chat-row" style={{ marginTop: 2 }}>
                      {chat.isAdminChat && <span className="admin-badge-chat"><Shield size={10} /> Official</span>}
                      <span className="chat-preview">{chat.lastMessage || 'No messages yet'}</span>
                      {unread > 0 && <span className="unread-badge">{unread}</span>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
