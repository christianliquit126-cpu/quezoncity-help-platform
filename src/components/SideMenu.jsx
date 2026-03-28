import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Home, Map, MessageCircle, Activity, User, LayoutDashboard, Phone, Info, LogOut, X, MapPin } from 'lucide-react'

export default function SideMenu({ onClose }) {
  const navigate = useNavigate()

  const go = (path) => { onClose(); navigate(path) }

  return (
    <>
      <div className="side-menu-overlay" onClick={onClose} />
      <div className="side-menu">
        <div className="side-header">
          <div className="side-user">
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16 }}>JC</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Juan dela Cruz</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-3)' }}>
                <MapPin size={11} /> Batasan Hills
              </div>
            </div>
          </div>
          <button className="icon-btn" onClick={onClose}><X size={18} /></button>
        </div>
        <nav className="side-nav">
          <button className="side-nav-item" onClick={() => go('/home')}><Home size={18} /> Home Feed</button>
          <button className="side-nav-item" onClick={() => go('/map')}><Map size={18} /> Incident Map</button>
          <button className="side-nav-item" onClick={() => go('/chat')}><MessageCircle size={18} /> Messages</button>
          <button className="side-nav-item" onClick={() => go('/activity')}><Activity size={18} /> Activity</button>
          <button className="side-nav-item" onClick={() => go('/profile')}><User size={18} /> My Profile</button>
          <div className="side-divider" />
          <button className="side-nav-item" onClick={() => go('/admin')}><LayoutDashboard size={18} /> Admin Panel</button>
          <button className="side-nav-item"><Phone size={18} /> Emergency Contacts</button>
          <button className="side-nav-item"><Info size={18} /> About QCHelp</button>
          <div className="side-divider" />
          <button className="side-nav-item danger" onClick={() => go('/')}><LogOut size={18} /> Sign Out</button>
        </nav>
      </div>
    </>
  )
}
