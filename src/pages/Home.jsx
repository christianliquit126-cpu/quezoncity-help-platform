import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, Search, Bell, CloudRain, Plus, MapPin as MapPinIcon, MessageCircle, Activity, ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'
import PostCard from '../components/PostCard'
import SideMenu from '../components/SideMenu'
import { SAMPLE_POSTS } from '../constants/barangays'

const CATS = ['All', 'Flood', 'Medical', 'Traffic', 'Fire', 'Lost & Found', 'Crime', 'Info']

export default function Home() {
  const navigate = useNavigate()
  const [activeCat, setActiveCat] = useState('All')
  const [menuOpen, setMenuOpen] = useState(false)

  const filtered = activeCat === 'All'
    ? SAMPLE_POSTS
    : SAMPLE_POSTS.filter(p => p.category === activeCat.toLowerCase().replace(' & found', '').replace(' & ', ''))

  return (
    <div className="shell">
      {menuOpen && <SideMenu onClose={() => setMenuOpen(false)} />}
      <div className="top-nav">
        <div className="nav-left">
          <button className="icon-btn" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <div className="logo-row">
            <div className="logo-dot" style={{ width: 28, height: 28, borderRadius: 8 }}><MapPinIcon size={14} /></div>
            <span className="logo-name" style={{ fontSize: 16 }}>QCHelp</span>
          </div>
        </div>
        <div className="nav-right">
          <button className="icon-btn"><Search size={20} /></button>
          <button className="icon-btn" style={{ position: 'relative' }} onClick={() => navigate('/activity')}>
            <Bell size={20} />
            <span className="nav-badge" />
          </button>
          <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, cursor: 'pointer' }} onClick={() => navigate('/profile')}>JC</div>
        </div>
      </div>

      <div className="screen-body">
        <div className="alert-banner flood">
          <div className="alert-icon"><CloudRain size={18} /></div>
          <div style={{ flex: 1 }}>
            <div className="alert-title">PAGASA Warning</div>
            <p className="alert-text">Moderate to heavy rains expected over Quezon City. Low-lying barangays on alert.</p>
          </div>
          <span className="alert-time">2m ago</span>
        </div>

        <div className="section-head">
          <span className="section-title">Quick Actions</span>
        </div>
        <div className="quick-grid">
          <button className="q-tile blue" onClick={() => navigate('/post/create')}>
            <Plus size={22} /><span>Post Help</span>
          </button>
          <button className="q-tile pink" onClick={() => navigate('/map')}>
            <MapPinIcon size={22} /><span>View Map</span>
          </button>
          <button className="q-tile purple" onClick={() => navigate('/chat')}>
            <MessageCircle size={22} /><span>Messages</span>
          </button>
          <button className="q-tile green" onClick={() => navigate('/activity')}>
            <Activity size={22} /><span>Activity</span>
          </button>
        </div>

        <div className="section-head">
          <span className="section-title">Community Feed</span>
          <button className="section-more">See all <ChevronRight size={14} /></button>
        </div>

        <div className="cat-scroll">
          {CATS.map(c => (
            <button key={c} className={`cat-chip ${activeCat === c ? 'active' : ''}`} onClick={() => setActiveCat(c)}>{c}</button>
          ))}
        </div>

        <div style={{ paddingBottom: 80 }}>
          {filtered.map(p => <PostCard key={p.id} post={p} />)}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
