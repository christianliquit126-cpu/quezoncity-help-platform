import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Settings, Camera, Activity, CheckCircle, Bookmark, User, Bell, Shield, LayoutDashboard, LogOut, ChevronRight } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const MENU_SECTIONS = [
  {
    title: 'My Activity',
    items: [
      { icon: Activity, color: 'blue', label: 'Recent Posts', sub: '47 posts shared', path: '/home' },
      { icon: CheckCircle, color: 'green', label: 'Resolved Cases', sub: '38 incidents resolved' },
      { icon: Bookmark, color: 'purple', label: 'Saved Posts', sub: '12 posts saved' },
    ]
  },
  {
    title: 'Account',
    items: [
      { icon: User, color: 'orange', label: 'Edit Profile' },
      { icon: Bell, color: 'blue', label: 'Notifications' },
      { icon: Shield, color: 'pink', label: 'Privacy & Security' },
      { icon: LayoutDashboard, color: 'purple', label: 'Admin Dashboard', path: '/admin' },
      { icon: LogOut, color: 'red', label: 'Sign Out', danger: true, path: '/' },
    ]
  }
]

export default function ProfilePage() {
  const navigate = useNavigate()

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Profile</h2>
        <button className="icon-btn" onClick={() => navigate('/admin')}><Settings size={20} /></button>
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div style={{ width: 84, height: 84, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 28, border: '3px solid #BFDBFE' }}>JC</div>
            <button className="avatar-edit"><Camera size={12} /></button>
          </div>
          <h2 className="profile-name">Juan dela Cruz</h2>
          <p className="profile-brgy"><MapPin size={12} /> Batasan Hills, Quezon City</p>
          <div className="profile-rep"><Star size={13} /><span>142 Reputation Points</span></div>
          <div className="profile-stats">
            <div className="p-stat"><span className="p-stat-num">47</span><span className="p-stat-lbl">Posts</span></div>
            <div className="p-stat-div" />
            <div className="p-stat"><span className="p-stat-num">213</span><span className="p-stat-lbl">Helped</span></div>
            <div className="p-stat-div" />
            <div className="p-stat"><span className="p-stat-num">38</span><span className="p-stat-lbl">Resolved</span></div>
          </div>
        </div>

        <div className="profile-body">
          {MENU_SECTIONS.map(s => (
            <div key={s.title}>
              <div className="profile-section-title">{s.title}</div>
              <div className="pmenu-list">
                {s.items.map((item, i) => {
                  const Icon = item.icon
                  return (
                    <div key={i} className={`pmenu-item ${item.danger ? 'danger' : ''}`} onClick={() => item.path && navigate(item.path)}>
                      <div className={`pmenu-icon ${item.color}`}><Icon size={17} /></div>
                      <div style={{ flex: 1 }}>
                        <div className="pmenu-label">{item.label}</div>
                        {item.sub && <div className="pmenu-sub">{item.sub}</div>}
                      </div>
                      <ChevronRight size={16} className="pmenu-arrow" />
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
      <BottomNav />
    </div>
  )
}
