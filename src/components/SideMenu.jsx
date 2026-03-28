import React from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Home, Map, MessageCircle, Activity, User, LayoutDashboard,
  Phone, FileText, LogOut, X, MapPin, Box, Handshake, BarChart2,
  Search, Cloud, Building2, Flag, Settings, Shield, Bell,
  ChevronRight
} from 'lucide-react'

const NAV_SECTIONS = [
  {
    title: 'Community',
    items: [
      { icon: Home, label: 'Home Feed', path: '/home' },
      { icon: Map, label: 'Resource Map', path: '/map' },
      { icon: MessageCircle, label: 'Messages', path: '/chat' },
      { icon: Activity, label: 'Activity', path: '/activity' },
    ]
  },
  {
    title: 'Discover',
    items: [
      { icon: Box, label: 'Supplies & Resources', path: null },
      { icon: Handshake, label: 'Community Partners', path: null },
      { icon: BarChart2, label: 'Impact Dashboard', path: '/dashboard' },
      { icon: Search, label: 'Lost & Found', path: null },
      { icon: Cloud, label: 'Weather (PAGASA)', path: null },
      { icon: Building2, label: 'Nearby Services', path: null },
      { icon: Flag, label: "Gov't Services", path: null },
      { icon: Phone, label: 'Emergency Contacts', path: null },
      { icon: FileText, label: 'Guidelines', path: null },
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: User, label: 'My Profile', path: '/profile' },
      { icon: Bell, label: 'Notifications', path: '/activity' },
      { icon: LayoutDashboard, label: 'Admin Dashboard', path: '/dashboard' },
      { icon: Settings, label: 'Settings', path: null },
    ]
  }
]

export default function SideMenu({ onClose }) {
  const navigate = useNavigate()

  const go = (path) => {
    onClose()
    if (path) navigate(path)
  }

  return (
    <>
      <div className="side-menu-overlay" onClick={onClose} />
      <div className="side-menu">
        <div className="side-header">
          <div className="side-logo-row">
            <div className="logo-dot" style={{ width: 30, height: 30, borderRadius: 9 }}>
              <MapPin size={14} />
            </div>
            <span className="logo-name" style={{ fontSize: 16 }}>QCHelp</span>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="side-user-card">
          <div style={{
            width: 46, height: 46, borderRadius: '50%',
            background: '#DBEAFE', color: '#1D4ED8',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 800, fontSize: 16, flexShrink: 0
          }}>JC</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)', display: 'flex', alignItems: 'center', gap: 6 }}>
              Juan dela Cruz
              <span className="side-admin-badge"><Shield size={9} /> Admin</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-3)', marginTop: 1 }}>
              <MapPin size={11} /> Batasan Hills, Quezon City
            </div>
          </div>
          <ChevronRight size={16} style={{ color: 'var(--text-3)', cursor: 'pointer' }} onClick={() => go('/profile')} />
        </div>

        <div className="side-nav-scroll">
          {NAV_SECTIONS.map(section => (
            <div key={section.title}>
              <div className="side-section-label">{section.title}</div>
              {section.items.map(item => {
                const Icon = item.icon
                return (
                  <button
                    key={item.label}
                    className="side-nav-item"
                    onClick={() => go(item.path)}
                    style={{ opacity: item.path ? 1 : 0.55 }}
                  >
                    <Icon size={17} />
                    <span>{item.label}</span>
                    {!item.path && <span style={{ marginLeft: 'auto', fontSize: 10, background: 'var(--border)', padding: '2px 6px', borderRadius: 99, color: 'var(--text-3)', fontWeight: 600 }}>Soon</span>}
                  </button>
                )
              })}
            </div>
          ))}

          <div className="side-divider" />
          <button className="side-nav-item danger" onClick={() => go('/')}>
            <LogOut size={17} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </>
  )
}
