import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Menu, Search, Bell, CloudRain, Plus, MapPin, MessageCircle,
  Activity, ChevronRight, Pencil, HelpCircle, Folder, GraduationCap,
  HeartPulse, AlertTriangle, Megaphone, ChevronLeft
} from 'lucide-react'
import BottomNav from '../components/BottomNav'
import PostCard from '../components/PostCard'
import SideMenu from '../components/SideMenu'
import { SAMPLE_POSTS, ANNOUNCEMENTS } from '../constants/barangays'

const CATS = ['All', 'Flood', 'Medical', 'Traffic', 'Fire', 'Lost & Found', 'Crime', 'Info']

const ALERT_ICONS = {
  'cloud-rain': CloudRain,
  'graduation': GraduationCap,
  'health': HeartPulse,
}

const ALERT_COLORS = {
  warning: { bg: '#EFF6FF', border: '#2563EB', iconColor: '#2563EB', labelColor: '#1D4ED8' },
  info: { bg: '#F5F3FF', border: '#7C3AED', iconColor: '#7C3AED', labelColor: '#5B21B6' },
  health: { bg: '#F0FDF4', border: '#059669', iconColor: '#059669', labelColor: '#065F46' },
}

export default function Home() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)
  const [alertIdx, setAlertIdx] = useState(0)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchVal, setSearchVal] = useState('')

  useEffect(() => {
    const t = setInterval(() => setAlertIdx(i => (i + 1) % ANNOUNCEMENTS.length), 4000)
    return () => clearInterval(t)
  }, [])

  const filtered = activeCat === 'All'
    ? SAMPLE_POSTS
    : SAMPLE_POSTS.filter(p => {
        if (activeCat === 'Lost & Found') return p.category === 'lost'
        return p.category === activeCat.toLowerCase()
      })

  const alert = ANNOUNCEMENTS[alertIdx]
  const AlertIcon = ALERT_ICONS[alert.icon] || Megaphone
  const colors = ALERT_COLORS[alert.type] || ALERT_COLORS.info

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
            <span className="nav-badge" />
          </button>
          <div className="nav-avatar-circle" onClick={() => navigate('/profile')}>JC</div>
        </div>
      </div>

      {searchOpen && (
        <div style={{ padding: '8px 14px', background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
          <div className="search-bar" style={{ background: 'var(--bg)', borderRadius: 10, padding: '9px 14px' }}>
            <Search size={16} />
            <input
              type="search"
              placeholder="Search posts, barangays, incidents..."
              autoFocus
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
            />
          </div>
        </div>
      )}

      <div className="screen-body">
        <div className="alert-carousel" style={{ background: colors.bg, borderLeft: `3px solid ${colors.border}` }}>
          <div className="alert-carousel-inner">
            <div className="alert-icon" style={{ color: colors.iconColor }}>
              <AlertIcon size={18} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="alert-source" style={{ color: colors.labelColor }}>{alert.source}</div>
              <div className="alert-title-main">{alert.title}</div>
              <p className="alert-text">{alert.body}</p>
            </div>
            <div className="alert-nav-col">
              <span className="alert-time">{alert.time}</span>
              <div style={{ display: 'flex', gap: 2, marginTop: 6 }}>
                {ANNOUNCEMENTS.map((_, i) => (
                  <div
                    key={i}
                    onClick={() => setAlertIdx(i)}
                    style={{
                      width: i === alertIdx ? 14 : 6, height: 6,
                      borderRadius: 99, cursor: 'pointer',
                      background: i === alertIdx ? colors.border : 'rgba(0,0,0,.15)',
                      transition: 'width .3s'
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="section-head" style={{ paddingTop: 14 }}>
          <span className="section-title">Quick Actions</span>
        </div>
        <div className="quick-grid">
          <button className="q-tile blue" onClick={() => navigate('/post/create')}>
            <Pencil size={20} /><span>Post Update</span>
          </button>
          <button className="q-tile pink" onClick={() => navigate('/post/create')}>
            <HelpCircle size={20} /><span>Ask for Help</span>
          </button>
          <button className="q-tile purple" onClick={() => navigate('/map')}>
            <MapPin size={20} /><span>View Map</span>
          </button>
          <button className="q-tile green" onClick={() => navigate('/chat')}>
            <MessageCircle size={20} /><span>Messages</span>
          </button>
        </div>

        <div className="section-head">
          <span className="section-title">QC Gov't Announcements</span>
          <button className="section-more">See all <ChevronRight size={14} /></button>
        </div>
        <div style={{ padding: '0 14px 4px', display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ANNOUNCEMENTS.map(a => {
            const Icon = ALERT_ICONS[a.icon] || Megaphone
            const c = ALERT_COLORS[a.type] || ALERT_COLORS.info
            return (
              <div key={a.id} className="ann-card" style={{ borderLeft: `3px solid ${c.border}`, background: c.bg }}>
                <div style={{ color: c.iconColor, flexShrink: 0 }}><Icon size={16} /></div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 11, fontWeight: 700, color: c.labelColor, textTransform: 'uppercase', letterSpacing: '.4px' }}>{a.source}</div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginTop: 1 }}>{a.title}</div>
                </div>
                <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>{a.time}</span>
              </div>
            )
          })}
        </div>

        <div className="section-head" style={{ paddingTop: 14 }}>
          <span className="section-title">Community Feed</span>
          <button className="section-more">See all <ChevronRight size={14} /></button>
        </div>

        <div className="cat-scroll">
          {CATS.map(c => (
            <button key={c} className={`cat-chip ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state">
            <Folder size={36} />
            <p>No posts in this category yet.</p>
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
