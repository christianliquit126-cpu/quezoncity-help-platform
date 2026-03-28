import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Heart, MessageCircle, Bell, CheckCircle, UserPlus, Share2,
  Star, Filter, User, ThumbsUp, Flag, Clock
} from 'lucide-react'
import BottomNav from '../components/BottomNav'

const ALL_ACTIVITIES = [
  {
    id: 1, type: 'reaction', tab: 'Reactions',
    Icon: ThumbsUp, color: 'blue',
    text: <><strong>Pedro Lim</strong> and <strong>18 others</strong> reacted to your flood report in Batasan Hills.</>,
    time: '2 minutes ago', ts: Date.now() - 120000, read: false,
  },
  {
    id: 2, type: 'comment', tab: 'Mentions',
    Icon: MessageCircle, color: 'green',
    text: <><strong>Rosa Bautista</strong> commented on your post: "I have the life vests ready at the evacuation center."</>,
    time: '8 minutes ago', ts: Date.now() - 480000, read: false,
  },
  {
    id: 3, type: 'system', tab: 'System',
    Icon: Bell, color: 'purple',
    text: <><strong>QCDRRMO</strong> issued a new flood advisory for Batasan Hills and Commonwealth areas. Rainfall Advisory #2.</>,
    time: '15 minutes ago', ts: Date.now() - 900000, read: false,
  },
  {
    id: 4, type: 'resolve', tab: 'System',
    Icon: CheckCircle, color: 'green',
    text: <>Your post about the stranded family in <strong>Batasan Hills</strong> was marked as <strong>resolved</strong> by Admin.</>,
    time: '1 hour ago', ts: Date.now() - 3600000, read: true,
  },
  {
    id: 5, type: 'follow', tab: 'Mentions',
    Icon: UserPlus, color: 'blue',
    text: <><strong>Noel Garcia</strong> mentioned you in a comment: "@JuandelaCruz please check the Fairview update."</>,
    time: '3 hours ago', ts: Date.now() - 10800000, read: true,
  },
  {
    id: 6, type: 'share', tab: 'Reactions',
    Icon: Share2, color: 'pink',
    text: <><strong>Ana Villanueva</strong> shared your traffic alert post about EDSA-Cubao to the QC Community group.</>,
    time: '5 hours ago', ts: Date.now() - 18000000, read: true,
  },
  {
    id: 7, type: 'points', tab: 'System',
    Icon: Star, color: 'orange',
    text: <>You earned <strong>+15 reputation points</strong> for helping resolve the Payatas road incident.</>,
    time: 'Yesterday, 4:12 PM', ts: Date.now() - 86400000, read: true,
  },
  {
    id: 8, type: 'reaction', tab: 'Reactions',
    Icon: Heart, color: 'pink',
    text: <><strong>Carlos Mendoza</strong> and <strong>4 others</strong> reacted to your comment on the lost dog post in Fairview.</>,
    time: 'Yesterday, 2:30 PM', ts: Date.now() - 90000000, read: true,
  },
  {
    id: 9, type: 'system', tab: 'System',
    Icon: Flag, color: 'red',
    text: <>Admin reviewed your <strong>Sauyo flooding</strong> report and escalated it to QCDRRMO for immediate response.</>,
    time: '2 days ago', ts: Date.now() - 172800000, read: true,
  },
]

const TABS = ['All Activity', 'Mentions', 'Reactions', 'System']

const TAB_COLORS = { blue: '#2563EB', green: '#059669', purple: '#7C3AED', orange: '#D97706', pink: '#DB2777', red: '#DC2626' }
const TAB_BGS = { blue: '#EFF6FF', green: '#F0FDF4', purple: '#F5F3FF', orange: '#FFFBEB', pink: '#FDF2F8', red: '#FEF2F2' }

export default function ActivityPage() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('All Activity')

  const visible = tab === 'All Activity'
    ? ALL_ACTIVITIES
    : ALL_ACTIVITIES.filter(a => a.tab === tab)

  const unread = ALL_ACTIVITIES.filter(a => !a.read).length

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="inner-title">
          Activity
          {unread > 0 && <span className="act-unread-badge">{unread}</span>}
        </h2>
        <button className="icon-btn"><Filter size={18} /></button>
      </div>

      <div className="act-tabs">
        {TABS.map(t => (
          <button key={t} className={`act-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>
            {t}
          </button>
        ))}
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        {visible.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <User size={40} />
            <p style={{ marginTop: 12, fontWeight: 600, color: 'var(--text-2)' }}>No activity yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Start engaging with the community!</p>
          </div>
        ) : (
          <div className="act-list">
            {visible.map(a => {
              const Icon = a.Icon
              return (
                <div key={a.id} className={`act-item ${!a.read ? 'unread' : ''}`}>
                  <div
                    className="act-icon"
                    style={{ background: TAB_BGS[a.color], color: TAB_COLORS[a.color] }}
                  >
                    <Icon size={17} />
                  </div>
                  <div className="act-content">
                    <p className="act-text">{a.text}</p>
                    <span className="act-time"><Clock size={11} /> {a.time}</span>
                  </div>
                  {!a.read && <span className="act-dot" />}
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
