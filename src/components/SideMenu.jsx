import React from 'react'
import { useNavigate } from 'react-router-dom'
import { X, MapPin, Home, Map, MessageCircle, Activity, User, LayoutDashboard, Box, Handshake, BarChart2, Search, Cloud, Building2, Flag, Settings, Shield, LogOut, Phone } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { initials, avatarColor } from '../utils/format'

const SECTIONS = [
  { title: 'Community', items: [
    { icon: Home,         label: 'Home Feed',            path: '/home' },
    { icon: Map,          label: 'Resource Map',          path: '/map' },
    { icon: MessageCircle,label: 'Messages',              path: '/chat' },
    { icon: Activity,     label: 'Activity',              path: '/activity' },
    { icon: User,         label: 'Profile',               path: '/profile' },
  ]},
  { title: 'Discover', items: [
    { icon: Box,          label: 'Supplies & Resources',  path: null },
    { icon: Handshake,    label: 'Community Partners',    path: null },
    { icon: BarChart2,    label: 'Impact Dashboard',      path: '/dashboard' },
    { icon: Search,       label: 'Lost & Found',          path: null },
    { icon: Cloud,        label: 'Weather (PAGASA)',       path: null },
    { icon: Building2,    label: 'Nearby Services',       path: null },
    { icon: Flag,         label: "Gov't Services",        path: null },
    { icon: Phone,        label: 'Emergency Contacts',    path: null },
  ]},
]

export default function SideMenu({ onClose }) {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()

  const goTo = (path) => {
    onClose()
    if (path) navigate(path)
  }

  const handleSignOut = async () => {
    onClose()
    await signOut()
    navigate('/')
  }

  const displayName = profile?.displayName || user?.displayName || 'User'
  const av = avatarColor(user?.uid || '')
  const isAdmin = profile?.role === 'admin' || profile?.role === 'superadmin'

  return (
    <>
      <div className="side-menu-overlay" onClick={onClose} />
      <div className="side-menu">
        <div className="side-header">
          <div className="side-logo-row">
            <div className="logo-dot" style={{ width: 28, height: 28, borderRadius: 8 }}><MapPin size={13} /></div>
            <span className="logo-name">QCHelp</span>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {user && (
          <div className="side-user-card" style={{ cursor: 'pointer' }} onClick={() => goTo('/profile')}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: av.bg, color: av.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
              {user.photoURL
                ? <img src={user.photoURL} alt="avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : initials(displayName)}
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{displayName}</div>
              <div style={{ fontSize: 12, color: 'var(--text-3)', display: 'flex', gap: 6, alignItems: 'center' }}>
                {isAdmin && <span className="side-admin-badge"><Shield size={9} /> Admin</span>}
                {profile?.barangay && <span>{profile.barangay}</span>}
              </div>
            </div>
          </div>
        )}

        <div className="side-nav-scroll">
          {SECTIONS.map(s => (
            <div key={s.title}>
              <div className="side-section-label">{s.title}</div>
              {s.items.map(item => {
                const Icon = item.icon
                return (
                  <button key={item.label} className="side-nav-item" style={{ opacity: item.path ? 1 : 0.45 }} onClick={() => goTo(item.path)}>
                    <Icon /><span>{item.label}</span>
                  </button>
                )
              })}
            </div>
          ))}

          {isAdmin && (
            <>
              <div className="side-divider" />
              <div className="side-section-label">Admin</div>
              <button className="side-nav-item" onClick={() => goTo('/dashboard')}><BarChart2 /><span>Impact Dashboard</span></button>
              <button className="side-nav-item" onClick={() => goTo('/admin')}><LayoutDashboard /><span>Admin Panel</span></button>
            </>
          )}

          <div className="side-divider" />
          <button className="side-nav-item" style={{ opacity: 0.45 }}><Settings /><span>Settings</span></button>
          <button className="side-nav-item danger" onClick={handleSignOut}><LogOut /><span>Sign Out</span></button>
        </div>
      </div>
    </>
  )
}
