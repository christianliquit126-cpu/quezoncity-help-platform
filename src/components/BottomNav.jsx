import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Map, Plus, MessageCircle, User } from 'lucide-react'

export default function BottomNav() {
  const navigate = useNavigate()
  const { pathname } = useLocation()

  const isActive = (path) => pathname === path

  return (
    <nav className="bottom-nav">
      <button className={`nav-item ${isActive('/home') ? 'active' : ''}`} onClick={() => navigate('/home')}>
        <Home size={22} /><span>Home</span>
      </button>
      <button className={`nav-item ${isActive('/map') ? 'active' : ''}`} onClick={() => navigate('/map')}>
        <Map size={22} /><span>Map</span>
      </button>
      <button className="fab-nav" onClick={() => navigate('/post/create')}>
        <Plus size={24} />
      </button>
      <button className={`nav-item ${isActive('/chat') ? 'active' : ''}`} onClick={() => navigate('/chat')}>
        <MessageCircle size={22} /><span>Chat</span>
      </button>
      <button className={`nav-item ${isActive('/profile') ? 'active' : ''}`} onClick={() => navigate('/profile')}>
        <User size={22} /><span>Profile</span>
      </button>
    </nav>
  )
}
