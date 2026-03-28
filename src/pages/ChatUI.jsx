import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Phone, MoreVertical, Paperclip, Send, Loader, Shield } from 'lucide-react'
import { ref, onValue, push, update, serverTimestamp } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo, initials, avatarColor } from '../utils/format'

export default function ChatUI() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [chat, setChat] = useState(null)
  const [messages, setMessages] = useState([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    const unsub = onValue(ref(db, `chats/${id}`), snap => {
      if (snap.exists()) setChat({ id: snap.key, ...snap.val() })
      setLoading(false)
    })
    return unsub
  }, [id])

  useEffect(() => {
    const unsub = onValue(ref(db, `chats/${id}/messages`), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => list.push({ id: child.key, ...child.val() }))
        list.sort((a, b) => a.sentAt - b.sentAt)
        setMessages(list)
      } else {
        setMessages([])
      }
    })
    return unsub
  }, [id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!text.trim() || sending) return
    setSending(true)
    const msgData = {
      senderId: user.uid,
      senderName: profile?.displayName || user.displayName || 'Anonymous',
      text: text.trim(),
      sentAt: Date.now(),
      readBy: { [user.uid]: true },
    }
    await push(ref(db, `chats/${id}/messages`), msgData)
    await update(ref(db, `chats/${id}`), {
      lastMessage: text.trim(),
      lastMessageAt: Date.now(),
    })
    setText('')
    setSending(false)
  }

  if (loading) {
    return (
      <div className="chat-ui-shell">
        <div className="empty-state" style={{ paddingTop: 80 }}><Loader size={32} className="spin" /></div>
      </div>
    )
  }

  const chatName = chat?.name || chat?.otherUserName || 'Chat'
  const av = avatarColor(id)
  const userAv = avatarColor(user?.uid)

  let lastDate = ''

  return (
    <div className="chat-ui-shell">
      <div className="chat-nav">
        <button className="back-btn" onClick={() => navigate('/chat')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: chat?.isAdminChat ? '#DBEAFE' : av.bg, color: chat?.isAdminChat ? '#1D4ED8' : av.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {chat?.isAdminChat ? <Shield size={18} /> : initials(chatName)}
        </div>
        <div className="chat-nav-info">
          <span className="chat-nav-name">{chatName}</span>
          {chat?.isAdminChat && <span className="chat-online">QCHelp Official Support</span>}
        </div>
        <button className="icon-btn"><MoreVertical size={20} /></button>
      </div>

      <div className="chat-messages">
        {messages.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--text-3)', fontSize: 13, padding: '40px 20px' }}>
            No messages yet. Start the conversation!
          </div>
        )}

        {messages.map(msg => {
          const isSent = msg.senderId === user?.uid
          const msgDate = new Date(msg.sentAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
          const showDate = msgDate !== lastDate
          lastDate = msgDate
          const msgAv = isSent ? userAv : avatarColor(msg.senderId)

          return (
            <React.Fragment key={msg.id}>
              {showDate && <div className="date-divider">{msgDate}</div>}
              <div className={`msg ${isSent ? 'sent' : 'received'}`}>
                {!isSent && (
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: msgAv.bg, color: msgAv.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 10, flexShrink: 0 }}>
                    {initials(msg.senderName)}
                  </div>
                )}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start', gap: 2 }}>
                  {!isSent && <span style={{ fontSize: 11, color: 'var(--text-3)', marginBottom: 2 }}>{msg.senderName}</span>}
                  <div className="msg-bubble">{msg.text}</div>
                  <span className="msg-time">{timeAgo(msg.sentAt)}</span>
                </div>
              </div>
            </React.Fragment>
          )
        })}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <button className="icon-btn"><Paperclip size={18} /></button>
        <input
          type="text"
          placeholder="Type a message…"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
        />
        <button className="send-primary" onClick={sendMessage} disabled={sending}>
          {sending ? <Loader size={14} className="spin" /> : <Send size={16} />}
        </button>
      </div>
    </div>
  )
}
