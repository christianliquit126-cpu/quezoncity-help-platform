import React, { useState, useRef, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Phone, MoreVertical, Paperclip, Send } from 'lucide-react'

const INIT_MSGS = [
  { id: 1, type: 'received', text: 'Hi, I saw your flood report. We can help!', time: '2:35' },
  { id: 2, type: 'sent', text: 'Thank you so much! The water level is rising fast. We have 3 families stranded.', time: '2:36' },
  { id: 3, type: 'received', text: "We're heading there now with 2 boats. ETA 20 minutes.", time: '2:37' },
  { id: 4, type: 'sent', text: 'Please hurry, there are elderly people and a baby. We\'re near the bridge at Batasan Road.', time: '2:38' },
  { id: 5, type: 'received', text: 'Understood. Stay elevated and signal us with a light or cloth. We will find you.', time: '2:39' },
]

export default function ChatUI() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [messages, setMessages] = useState(INIT_MSGS)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const send = () => {
    if (!input.trim()) return
    const now = new Date()
    setMessages(m => [...m, { id: Date.now(), type: 'sent', text: input, time: `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}` }])
    setInput('')
  }

  return (
    <div className="chat-ui-shell">
      <div className="chat-nav">
        <button className="back-btn" onClick={() => navigate('/chat')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13 }}>PL</div>
        <div className="chat-nav-info">
          <span className="chat-nav-name">Pedro Lim</span>
          <span className="chat-online">Online</span>
        </div>
        <button className="icon-btn"><Phone size={18} /></button>
        <button className="icon-btn"><MoreVertical size={18} /></button>
      </div>

      <div className="chat-messages">
        <div className="date-divider">Today, 2:35 PM</div>
        {messages.map(m => (
          <div key={m.id} className={`msg ${m.type}`}>
            {m.type === 'received' && (
              <div style={{ width: 26, height: 26, borderRadius: '50%', background: '#ECFDF5', color: '#065F46', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 9, flexShrink: 0 }}>PL</div>
            )}
            <div className="msg-bubble">{m.text}</div>
            <span className="msg-time">{m.time}</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="chat-input-bar">
        <button className="icon-btn"><Paperclip size={18} /></button>
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && send()}
        />
        <button className="send-primary" onClick={send}><Send size={16} /></button>
      </div>
    </div>
  )
}
