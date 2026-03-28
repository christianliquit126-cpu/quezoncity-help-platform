import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bell, CheckCircle, UserPlus, Share2, Star, MoreHorizontal } from 'lucide-react'

const ACTIVITIES = [
  { id: 1, icon: Heart, color: 'blue', text: <><strong>Pedro Lim</strong> and <strong>18 others</strong> reacted to your flood report in Batasan Hills.</>, time: '2 minutes ago' },
  { id: 2, icon: MessageCircle, color: 'green', text: <><strong>Rosa Bautista</strong> commented on your post: "I have the life vests ready..."</>, time: '8 minutes ago' },
  { id: 3, icon: Bell, color: 'purple', text: <><strong>QC DRRMO</strong> issued a new flood advisory for Batasan Hills and Commonwealth areas.</>, time: '15 minutes ago' },
  { id: 4, icon: CheckCircle, color: 'orange', text: <>Your post about the stranded family in <strong>Batasan Hills</strong> has been marked as resolved.</>, time: '1 hour ago' },
  { id: 5, icon: UserPlus, color: 'blue', text: <><strong>Noel Garcia</strong> started following you in the community.</>, time: '3 hours ago' },
  { id: 6, icon: Share2, color: 'pink', text: <><strong>Ana Villanueva</strong> shared your traffic alert post about EDSA-Cubao.</>, time: '5 hours ago' },
  { id: 7, icon: Star, color: 'green', text: <>You earned <strong>+15 reputation points</strong> for helping resolve the Fairview incident.</>, time: 'Yesterday' },
  { id: 8, icon: Heart, color: 'blue', text: <><strong>Carlos Mendoza</strong> and <strong>4 others</strong> reacted to your comment on the lost dog post.</>, time: 'Yesterday' },
]

const TABS = ['All', 'Mentions', 'Reactions']

export default function ActivityPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('All')

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Activity Feed</h2>
        <button className="icon-btn"><MoreHorizontal size={20} /></button>
      </div>

      <div className="act-tabs">
        {TABS.map(t => (
          <button key={t} className={`act-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="screen-body">
        <div className="act-list">
          {ACTIVITIES.map(a => {
            const Icon = a.icon
            return (
              <div key={a.id} className="act-item">
                <div className={`act-icon ${a.color}`}><Icon size={18} /></div>
                <div className="act-content">
                  <p>{a.text}</p>
                  <span className="act-time">{a.time}</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
