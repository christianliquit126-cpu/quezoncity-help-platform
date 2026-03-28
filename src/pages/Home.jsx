import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, Plus, MapPin, MessageCircle, Activity, ChevronRight, Pencil, HelpCircle, Folder, AlertTriangle, Megaphone, CloudRain, GraduationCap, HeartPulse, Loader } from 'lucide-react'
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import BottomNav from '../components/BottomNav'
import PostCard from '../components/PostCard'
import SideMenu from '../components/SideMenu'

const CATS = ['All', 'Flood', 'Medical', 'Traffic', 'Fire', 'Lost & Found', 'Crime', 'Info']

const CAT_ICON_MAP = { weather: CloudRain, graduation: GraduationCap, health: HeartPulse }
const ALERT_COLORS = {
  warning: { bg: '#EFF6FF', border: '#2563EB', iconColor: '#2563EB', labelColor: '#1D4ED8' },
  info:    { bg: '#F5F3FF', border: '#7C3AED', iconColor: '#7C3AED', labelColor: '#5B21B6' },
  health:  { bg: '#F0FDF4', border: '#059669', iconColor: '#059669', labelColor: '#065F46' },
  emergency:{ bg: '#FEF2F2', border: '#DC2626', iconColor: '#DC2626', labelColor: '#991B1B' },
}

export default function Home() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [posts, setPosts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [activeCat, setActiveCat] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [alertIdx, setAlertIdx] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    const q = query(ref(db, 'posts'), orderByChild('createdAt'), limitToLast(50))
    const unsub = onValue(q, snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => list.unshift({ id: child.key, ...child.val() }))
        setPosts(list)
      } else {
        setPosts([])
      }
      setLoadingPosts(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    const now = Date.now()
    const unsub = onValue(ref(db, 'alerts'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => {
          const a = child.val()
          if (!a.expiresAt || a.expiresAt > now) list.push({ id: child.key, ...a })
        })
        list.sort((a, b) => b.createdAt - a.createdAt)
        setAlerts(list)
      } else {
        setAlerts([])
      }
    })
    return unsub
  }, [])

  useEffect(() => {
    if (alerts.length <= 1) return
    const t = setInterval(() => setAlertIdx(i => (i + 1) % alerts.length), 4000)
    return () => clearInterval(t)
  }, [alerts.length])

  const filtered = activeCat === 'All'
    ? (searchVal ? posts.filter(p => p.content?.toLowerCase().includes(searchVal.toLowerCase()) || p.barangay?.toLowerCase().includes(searchVal.toLowerCase())) : posts)
    : posts.filter(p => {
        const cat = activeCat === 'Lost & Found' ? 'lost' : activeCat.toLowerCase()
        return p.category === cat
      })

  const displayName = profile?.displayName || user?.displayName || 'User'
  const nameInitials = displayName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()

  const currentAlert = alerts[alertIdx]
  const alertColors = currentAlert ? (ALERT_COLORS[currentAlert.category] || ALERT_COLORS.info) : null
  const AlertIcon = currentAlert ? (CAT_ICON_MAP[currentAlert.category] || Megaphone) : Megaphone

  return (
    <div className="shell">
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}

      <div className="top-nav">
        <div className="nav-left">
          <button className="icon-btn" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <div className="logo-row">
            <div className="logo-dot" style={{ width: 28, height: 28, borderRadius: 8 }}><MapPin size={13} /></div>
            <span className="logo-name" style={{ fontSize: 16 }}>QCHelp</span>
          </div>
        </div>
        <div className="nav-right">
          <button className="icon-btn" onClick={() => setSearchOpen(s => !s)}><Search size={20} /></button>
          <button className="icon-btn" style={{ position: 'relative' }} onClick={() => navigate('/activity')}>
            <Bell size={20} />
          </button>
          <div className="nav-avatar-circle" onClick={() => navigate('/profile')}>{nameInitials}</div>
        </div>
      </div>

      {searchOpen && (
        <div style={{ padding: '8px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div className="search-bar">
            <Search size={16} />
            <input type="search" placeholder="Search posts, barangays..." autoFocus value={searchVal} onChange={e => setSearchVal(e.target.value)} />
          </div>
        </div>
      )}

      <div className="screen-body">
        {alerts.length > 0 && currentAlert && (
          <div className="alert-carousel" style={{ background: alertColors.bg, borderLeft: `3px solid ${alertColors.border}` }}>
            <div className="alert-carousel-inner">
              <div className="alert-icon" style={{ color: alertColors.iconColor }}><AlertIcon size={18} /></div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="alert-source" style={{ color: alertColors.labelColor }}>{currentAlert.source || 'QCHelp Alert'}</div>
                <div className="alert-title-main">{currentAlert.title}</div>
                <p className="alert-text">{currentAlert.message}</p>
              </div>
              <div className="alert-nav-col">
                <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                  {alerts.map((_, i) => (
                    <div key={i} onClick={() => setAlertIdx(i)} style={{ width: i === alertIdx ? 14 : 6, height: 6, borderRadius: 99, cursor: 'pointer', background: i === alertIdx ? alertColors.border : 'rgba(0,0,0,.15)', transition: 'width .3s' }} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="section-head" style={{ paddingTop: 14 }}>
          <span className="section-title">Quick Actions</span>
        </div>
        <div className="quick-grid">
          <button className="q-tile blue" onClick={() => navigate('/post/create')}><Pencil size={20} /><span>Post Update</span></button>
          <button className="q-tile pink" onClick={() => navigate('/post/create')}><HelpCircle size={20} /><span>Ask for Help</span></button>
          <button className="q-tile purple" onClick={() => navigate('/map')}><MapPin size={20} /><span>View Map</span></button>
          <button className="q-tile green" onClick={() => navigate('/chat')}><MessageCircle size={20} /><span>Messages</span></button>
        </div>

        <div className="section-head">
          <span className="section-title">Community Feed</span>
          <span style={{ fontSize: 12, color: 'var(--text-3)' }}>{filtered.length} posts</span>
        </div>

        <div className="cat-scroll">
          {CATS.map(c => (
            <button key={c} className={`cat-chip ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>

        {loadingPosts ? (
          <div className="empty-state"><Loader size={32} className="spin" /><p>Loading posts…</p></div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <Folder size={36} />
            <p style={{ fontWeight: 600, color: 'var(--text-2)' }}>No posts yet</p>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 4 }}>Be the first to share an update in your barangay.</p>
            <button className="btn btn-primary btn-sm" style={{ marginTop: 16 }} onClick={() => navigate('/post/create')}>
              <Plus size={14} /> Create Post
            </button>
          </div>
        ) : (
          <div style={{ paddingBottom: 80 }}>
            {filtered.map(p => <PostCard key={p.id} post={p} />)}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
