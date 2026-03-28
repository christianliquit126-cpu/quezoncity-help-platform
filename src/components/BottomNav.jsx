import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Map, Bell, User, Plus } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const items = [
    { icon: Home,  label: 'Home',     path: '/home' },
    { icon: Map,   label: 'Map',      path: '/map' },
    null,
    { icon: Bell,  label: 'Activity', path: '/activity' },
    { icon: User,  label: 'Profile',  path: '/profile' },
  ]

  return (
    <div className="bottom-nav">
      {items.map((item, i) =>
        item === null ? (
          <button key="fab" className="fab-nav" onClick={() => navigate('/post/create')}>
            <Plus size={24} />
          </button>
        ) : (
          <button key={item.path} className={`nav-item ${pathname === item.path ? 'active' : ''}`} onClick={() => navigate(item.path)}>
            <item.icon size={22} />
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>
  )
}
