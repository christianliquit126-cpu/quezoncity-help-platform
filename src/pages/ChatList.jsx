import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Edit, Search } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const CHATS = [
  { id: 1, name: 'Pedro Lim', av: 'PL', avBg: '#ECFDF5', avColor: '#065F46', preview: "We're heading there now with 2 boats...", time: '2m', unread: 2 },
  { id: 2, name: 'QC DRRMO Hotline', av: 'QD', avBg: '#DBEAFE', avColor: '#1D4ED8', preview: 'Your report has been acknowledged. Units are on the way.', time: '1h', unread: 0 },
  { id: 3, name: 'Rosa Bautista', av: 'RB', avBg: '#EDE9FE', avColor: '#5B21B6', preview: 'I have the life vests ready at the evacuation center.', time: '2h', unread: 1 },
  { id: 4, name: 'Noel Garcia', av: 'NG', avBg: '#FFF7ED', avColor: '#9A3412', preview: 'Let me know if you need more supplies tomorrow.', time: '5h', unread: 0 },
  { id: 5, name: 'Batasan Hills Neighbors', av: 'BH', avBg: '#FEF3C7', avColor: '#92400E', preview: 'Maria: Thank you everyone for the support!', time: 'Yesterday', unread: 0 },
  { id: 6, name: 'Ana Villanueva', av: 'AV', avBg: '#FDF2F8', avColor: '#9D174D', preview: 'Did you manage to find your dog?', time: 'Yesterday', unread: 0 },
]

export default function ChatList() {
  const navigate = useNavigate()
  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Messages</h2>
        <button className="icon-btn"><Edit size={20} /></button>
      </div>

      <div style={{ padding: '10px 16px 6px' }}>
        <div className="search-bar">
          <Search size={16} />
          <input type="search" placeholder="Search conversations..." />
        </div>
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        <div className="chat-list">
          {CHATS.map(c => (
            <div key={c.id} className={`chat-item ${c.unread > 0 ? 'unread' : ''}`} onClick={() => navigate(`/chat/${c.id}`)}>
              <div style={{ width: 46, height: 46, borderRadius: '50%', background: c.avBg, color: c.avColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{c.av}</div>
              <div className="chat-info">
                <div className="chat-row">
                  <span className="chat-name">{c.name}</span>
                  <span className="chat-time">{c.time}</span>
                </div>
                <div className="chat-row">
                  <p className="chat-preview">{c.preview}</p>
                  {c.unread > 0 && <span className="unread-badge">{c.unread}</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
