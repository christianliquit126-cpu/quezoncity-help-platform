import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Settings, Camera, CheckCircle, Bookmark, User, Bell, Shield, LayoutDashboard, LogOut, ChevronRight, Pencil, Heart, Calendar, Lock, Loader } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo, initials, avatarColor } from '../utils/format'
import BottomNav from '../components/BottomNav'

export default function ProfilePage() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [signingOut, setSigningOut] = useState(false)

  const handleSignOut = async () => {
    setSigningOut(true)
    await signOut()
    navigate('/')
  }

  if (!user || !profile) {
    return (
      <div className="shell">
        <div className="inner-nav">
          <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <h2 className="inner-title">Profile</h2>
          <div style={{ width: 36 }} />
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}><Loader size={32} className="spin" /></div>
      </div>
    )
  }

  const displayName = profile.displayName || user.displayName || 'User'
  const av = avatarColor(user.uid)
  const nameInitials = initials(displayName)
  const joinedDate = profile.joinedAt ? new Date(profile.joinedAt).toLocaleDateString('en-PH', { month: 'short', year: 'numeric' }) : null

  const MENU_SECTIONS = [
    {
      title: 'My Activity',
      items: [
        { icon: Pencil,    color: 'blue',   label: 'My Posts',       sub: `${profile.postCount || 0} posts shared`,       path: '/home' },
        { icon: Heart,     color: 'pink',   label: 'People Helped',  sub: `${profile.helpedCount || 0} incidents resolved` },
        { icon: Bookmark,  color: 'purple', label: 'Saved Posts',    sub: 'View bookmarked posts' },
      ]
    },
    {
      title: 'Account Settings',
      items: [
        { icon: Bell,           color: 'blue',   label: 'Notification Preferences', sub: 'Manage alerts' },
        { icon: Lock,           color: 'pink',   label: 'Privacy & Security',        sub: 'Account security settings' },
        ...(profile.role === 'admin' || profile.role === 'superadmin' ? [
          { icon: LayoutDashboard, color: 'purple', label: 'Admin Dashboard', sub: 'Manage reports and users', path: '/dashboard' },
          { icon: Shield,          color: 'orange', label: 'Admin Panel',     sub: 'Posts, users, analytics',  path: '/admin' },
        ] : []),
        { icon: LogOut, color: 'red', label: 'Sign Out', danger: true, action: handleSignOut },
      ]
    }
  ]

  const COLOR_MAP = {
    blue:   { bg: '#EFF6FF', color: '#2563EB' },
    green:  { bg: '#F0FDF4', color: '#059669' },
    purple: { bg: '#F5F3FF', color: '#7C3AED' },
    orange: { bg: '#FFFBEB', color: '#D97706' },
    pink:   { bg: '#FDF2F8', color: '#DB2777' },
    red:    { bg: '#FEF2F2', color: '#DC2626' },
  }

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Profile</h2>
        <button className="icon-btn"><Settings size={20} /></button>
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div style={{ width: 88, height: 88, borderRadius: '50%', background: av.bg, color: av.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 30, border: `3px solid ${av.bg}`, boxShadow: '0 4px 16px rgba(0,0,0,.10)' }}>
              {user.photoURL
                ? <img src={user.photoURL} alt="Avatar" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                : nameInitials}
            </div>
            <button className="avatar-edit"><Camera size={12} /></button>
          </div>

          <h2 className="profile-name">{displayName}</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 6 }}>
            {profile.verified && <div className="profile-verified-badge"><CheckCircle size={12} /> Verified Resident</div>}
            {(profile.role === 'admin' || profile.role === 'superadmin') && <div className="profile-admin-badge"><Shield size={12} /> Admin</div>}
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 10, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap' }}>
            {profile.barangay && <div className="profile-loc"><MapPin size={12} /> {profile.barangay}, Quezon City</div>}
            {joinedDate && <div className="profile-loc"><Calendar size={12} /> Member since {joinedDate}</div>}
          </div>

          <div className="profile-stats-row">
            <div className="p-stat-card" style={{ background: '#EFF6FF' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.7)', marginBottom: 6 }}><Pencil size={16} color="#2563EB" /></div>
              <span className="p-stat-num">{profile.postCount || 0}</span>
              <span className="p-stat-lbl">Posts</span>
            </div>
            <div className="p-stat-card" style={{ background: '#FDF2F8' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.7)', marginBottom: 6 }}><Heart size={16} color="#DB2777" /></div>
              <span className="p-stat-num">{profile.helpedCount || 0}</span>
              <span className="p-stat-lbl">Helped</span>
            </div>
            <div className="p-stat-card" style={{ background: '#FFFBEB' }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.7)', marginBottom: 6 }}><Star size={16} color="#D97706" /></div>
              <span className="p-stat-num">{profile.reputation || 0}</span>
              <span className="p-stat-lbl">Points</span>
            </div>
          </div>

          <div style={{ fontSize: 12, color: 'var(--text-3)', marginTop: 10 }}>
            {user.email} · {profile.signInMethod || 'email'}
          </div>
        </div>

        <div className="profile-body">
          {MENU_SECTIONS.map(s => (
            <div key={s.title}>
              <div className="profile-section-title">{s.title}</div>
              <div className="pmenu-list">
                {s.items.map((item, i) => {
                  const Icon = item.icon
                  const c = COLOR_MAP[item.color] || { bg: 'var(--bg)', color: 'var(--text-2)' }
                  return (
                    <div
                      key={i}
                      className={`pmenu-item ${item.danger ? 'danger' : ''}`}
                      onClick={() => {
                        if (item.action) item.action()
                        else if (item.path) navigate(item.path)
                      }}
                      style={{ cursor: (item.path || item.action) ? 'pointer' : 'default' }}
                    >
                      <div className="pmenu-icon" style={{ background: c.bg }}>
                        {signingOut && item.danger ? <Loader size={17} className="spin" color={c.color} /> : <Icon size={17} color={c.color} />}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div className="pmenu-label" style={{ color: item.danger ? '#DC2626' : undefined }}>{item.label}</div>
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
