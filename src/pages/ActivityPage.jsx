import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, MessageCircle, Bell, CheckCircle, UserPlus, Share2, Star, Filter, ThumbsUp, Flag, Clock, Loader } from 'lucide-react'
import { ref, onValue, update } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo } from '../utils/format'
import BottomNav from '../components/BottomNav'

const TABS = ['All Activity', 'Mentions', 'Reactions', 'System']

const TYPE_CONFIG = {
  like:    { Icon: Heart,          color: 'pink',   tab: 'Reactions' },
  reaction:{ Icon: ThumbsUp,       color: 'blue',   tab: 'Reactions' },
  comment: { Icon: MessageCircle,  color: 'green',  tab: 'Mentions' },
  mention: { Icon: UserPlus,       color: 'blue',   tab: 'Mentions' },
  share:   { Icon: Share2,         color: 'pink',   tab: 'Reactions' },
  resolve: { Icon: CheckCircle,    color: 'green',  tab: 'System' },
  system:  { Icon: Bell,           color: 'purple', tab: 'System' },
  points:  { Icon: Star,           color: 'orange', tab: 'System' },
  flag:    { Icon: Flag,           color: 'red',    tab: 'System' },
}

const COLOR_MAP = {
  blue:   { bg: '#EFF6FF', color: '#2563EB' },
  green:  { bg: '#F0FDF4', color: '#059669' },
  purple: { bg: '#F5F3FF', color: '#7C3AED' },
  orange: { bg: '#FFFBEB', color: '#D97706' },
  pink:   { bg: '#FDF2F8', color: '#DB2777' },
  red:    { bg: '#FEF2F2', color: '#DC2626' },
}

export default function ActivityPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [activities, setActivities] = useState([])
  const [tab, setTab] = useState('All Activity')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const unsub = onValue(ref(db, `activity/${user.uid}`), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => list.push({ id: child.key, ...child.val() }))
        list.sort((a, b) => b.createdAt - a.createdAt)
        setActivities(list)
      } else {
        setActivities([])
      }
      setLoading(false)
    })
    return unsub
  }, [user])

  const markRead = async (id) => {
    if (!user) return
    await update(ref(db, `activity/${user.uid}/${id}`), { read: true })
  }

  const cfg = (type) => TYPE_CONFIG[type] || TYPE_CONFIG.system

  const visible = tab === 'All Activity'
    ? activities
    : activities.filter(a => cfg(a.type).tab === tab)

  const unread = activities.filter(a => !a.read).length

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
          <button key={t} className={`act-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>
        ))}
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        {loading ? (
          <div className="empty-state" style={{ paddingTop: 60 }}><Loader size={32} className="spin" /><p>Loading activity…</p></div>
        ) : visible.length === 0 ? (
          <div className="empty-state" style={{ paddingTop: 60 }}>
            <Bell size={40} />
            <p style={{ fontWeight: 600, color: 'var(--text-2)', marginTop: 12 }}>No activity yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Start engaging with the community!</p>
          </div>
        ) : (
          <div className="act-list">
            {visible.map(a => {
              const { Icon, color } = cfg(a.type)
              const c = COLOR_MAP[color] || COLOR_MAP.blue
              return (
                <div
                  key={a.id}
                  className={`act-item ${!a.read ? 'unread' : ''}`}
                  onClick={() => {
                    markRead(a.id)
                    if (a.postId) navigate(`/post/${a.postId}`)
                  }}
                  style={{ cursor: a.postId ? 'pointer' : 'default' }}
                >
                  <div className="act-icon" style={{ background: c.bg, color: c.color }}>
                    <Icon size={17} />
                  </div>
                  <div className="act-content">
                    <p className="act-text">{a.text}</p>
                    <span className="act-time"><Clock size={11} /> {timeAgo(a.createdAt)}</span>
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
