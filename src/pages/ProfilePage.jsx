import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Star, Settings, Camera, CheckCircle, Bookmark,
  User, Bell, Shield, LayoutDashboard, LogOut, ChevronRight,
  Pencil, Heart, Calendar, Lock
} from 'lucide-react'
import BottomNav from '../components/BottomNav'

const MENU_SECTIONS = [
  {
    title: 'My Activity',
    items: [
      { icon: Pencil, color: 'blue', label: 'My Posts', sub: '47 posts shared', path: '/home' },
      { icon: CheckCircle, color: 'green', label: 'Resolved Cases', sub: '38 incidents resolved' },
      { icon: Bookmark, color: 'purple', label: 'Saved Posts', sub: '12 posts saved' },
    ]
  },
  {
    title: 'Account Settings',
    items: [
      { icon: User, color: 'orange', label: 'Edit Profile', sub: 'Update name, photo, contact' },
      { icon: Bell, color: 'blue', label: 'Notification Preferences', sub: 'Manage push & in-app alerts' },
      { icon: Lock, color: 'pink', label: 'Privacy & Security', sub: 'Account security settings' },
      { icon: LayoutDashboard, color: 'purple', label: 'Admin Dashboard', sub: 'Manage reports and users', path: '/dashboard' },
      { icon: LogOut, color: 'red', label: 'Sign Out', danger: true, path: '/' },
    ]
  }
]

const STAT_CARDS = [
  { icon: Pencil, label: 'Posts', value: '47', color: 'blue', bg: '#EFF6FF', iconColor: '#2563EB' },
  { icon: Heart, label: 'People Helped', value: '213', color: 'pink', bg: '#FDF2F8', iconColor: '#DB2777' },
  { icon: Star, label: 'Points Earned', value: '142', color: 'orange', bg: '#FFFBEB', iconColor: '#D97706' },
]

export default function ProfilePage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('Posts')

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="inner-title">Profile</h2>
        <button className="icon-btn" onClick={() => navigate('/dashboard')}><Settings size={20} /></button>
      </div>

      <div className="screen-body" style={{ paddingBottom: 80 }}>
        <div className="profile-hero">
          <div className="profile-avatar-wrap">
            <div style={{
              width: 88, height: 88, borderRadius: '50%',
              background: '#DBEAFE', color: '#1D4ED8',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 800, fontSize: 30,
              border: '3px solid #BFDBFE', boxShadow: '0 4px 16px rgba(37,99,235,.15)'
            }}>JC</div>
            <button className="avatar-edit"><Camera size={12} /></button>
          </div>

          <h2 className="profile-name">Juan dela Cruz</h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center', flexWrap: 'wrap', marginTop: 4 }}>
            <div className="profile-verified-badge"><CheckCircle size={12} /> Verified Resident</div>
            <div className="profile-admin-badge"><Shield size={12} /> Admin</div>
          </div>

          <div style={{ display: 'flex', gap: 16, marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
            <div className="profile-loc"><MapPin size={12} /> Batasan Hills, Quezon City</div>
            <div className="profile-loc"><Calendar size={12} /> Member since Nov 2025</div>
          </div>

          <div className="profile-stats-row">
            {STAT_CARDS.map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="p-stat-card" style={{ background: s.bg }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,.7)', marginBottom: 6 }}>
                    <Icon size={16} color={s.iconColor} />
                  </div>
                  <span className="p-stat-num">{s.value}</span>
                  <span className="p-stat-lbl">{s.label}</span>
                </div>
              )
            })}
          </div>

          <button className="btn btn-outline btn-sm" style={{ marginTop: 14 }} onClick={() => {}}>
            <Pencil size={14} /> Edit Profile
          </button>
        </div>

        <div className="profile-body">
          {MENU_SECTIONS.map(s => (
            <div key={s.title}>
              <div className="profile-section-title">{s.title}</div>
              <div className="pmenu-list">
                {s.items.map((item, i) => {
                  const Icon = item.icon
                  const COLOR_MAP = {
                    blue: { bg: '#EFF6FF', color: '#2563EB' },
                    green: { bg: '#F0FDF4', color: '#059669' },
                    purple: { bg: '#F5F3FF', color: '#7C3AED' },
                    orange: { bg: '#FFFBEB', color: '#D97706' },
                    pink: { bg: '#FDF2F8', color: '#DB2777' },
                    red: { bg: '#FEF2F2', color: '#DC2626' },
                  }
                  const c = COLOR_MAP[item.color] || { bg: 'var(--bg)', color: 'var(--text-2)' }
                  return (
                    <div
                      key={i}
                      className={`pmenu-item ${item.danger ? 'danger' : ''}`}
                      onClick={() => item.path && navigate(item.path)}
                      style={{ cursor: item.path ? 'pointer' : 'default' }}
                    >
                      <div className="pmenu-icon" style={{ background: c.bg }}>
                        <Icon size={17} color={c.color} />
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
