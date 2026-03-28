import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Home, Map, MessageCircle, Activity, User, LayoutDashboard, Box, Handshake, BarChart2, Search, Cloud, Building2, Flag, Settings, Shield, Bell, LogOut, FileText, Users, AlertCircle, CheckCircle, TrendingUp, ChevronRight, Clock, AlertTriangle, Phone, Menu, Pencil, Loader } from 'lucide-react'
import { ref, onValue, query, orderByChild, limitToLast } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { initials } from '../utils/format'

const SIDEBAR_SECTIONS = [
  { title: 'Community', items: [
    { icon: Home, label: 'Home Feed', path: '/home' },
    { icon: Map, label: 'Resource Map', path: '/map' },
    { icon: MessageCircle, label: 'Messages', path: '/chat' },
    { icon: Activity, label: 'Activity', path: '/activity' },
  ]},
  { title: 'Discover', items: [
    { icon: BarChart2, label: 'Impact Dashboard', path: '/dashboard', active: true },
    { icon: Cloud, label: 'Weather (PAGASA)', path: null },
    { icon: Building2, label: 'Nearby Services', path: null },
    { icon: Flag, label: "Gov't Services", path: null },
    { icon: Phone, label: 'Emergency Contacts', path: null },
  ]},
  { title: 'Admin', items: [
    { icon: LayoutDashboard, label: 'Admin Panel', path: '/admin' },
    { icon: Settings, label: 'Settings', path: null },
  ]},
]

export default function MainDashboard() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [sideCollapsed, setSideCollapsed] = useState(false)

  useEffect(() => {
    const unsub = onValue(ref(db, 'posts'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(c => list.push({ id: c.key, ...c.val() }))
        setPosts(list)
      } else { setPosts([]) }
      setLoading(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = onValue(ref(db, 'users'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(c => list.push({ uid: c.key, ...c.val() }))
        setUsers(list)
      } else { setUsers([]) }
    })
    return unsub
  }, [])

  useEffect(() => {
    const unsub = onValue(ref(db, 'alerts'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(c => list.push({ id: c.key, ...c.val() }))
        setAlerts(list)
      } else { setAlerts([]) }
    })
    return unsub
  }, [])

  const handleSignOut = async () => { await signOut(); navigate('/') }

  const urgentPosts = posts.filter(p => p.priority === 'urgent' || p.priority === 'critical')
  const resolvedPosts = posts.filter(p => p.status === 'resolved')

  const catCounts = {}
  posts.forEach(p => { catCounts[p.category] = (catCounts[p.category] || 0) + 1 })
  const catEntries = Object.entries(catCounts).sort((a, b) => b[1] - a[1])
  const maxCat = catEntries[0]?.[1] || 1

  const CAT_COLORS_MAP = {
    flood: '#2563EB', medical: '#DB2777', traffic: '#D97706',
    fire: '#DC2626', lost: '#7C3AED', crime: '#9F1239', info: '#059669', other: '#94A3B8'
  }

  const WIDGETS = [
    { label: 'Total Posts', value: posts.length, change: 'All time', Icon: FileText, bg: '#EFF6FF', iconColor: '#2563EB' },
    { label: 'Active Urgent', value: urgentPosts.filter(p => p.status !== 'resolved').length, change: 'Open cases', Icon: AlertCircle, bg: '#FEF2F2', iconColor: '#DC2626' },
    { label: 'Resolved Cases', value: resolvedPosts.length, change: `${Math.round((resolvedPosts.length / (posts.length || 1)) * 100)}% rate`, Icon: CheckCircle, bg: '#F0FDF4', iconColor: '#059669' },
    { label: 'Registered Users', value: users.length, change: 'Firebase /users', Icon: Users, bg: '#F5F3FF', iconColor: '#7C3AED' },
  ]

  const displayName = profile?.displayName || user?.displayName || 'Admin'

  return (
    <div className="dashboard-shell">
      <aside className={`dashboard-sidebar ${sideCollapsed ? 'collapsed' : ''}`}>
        <div className="ds-logo-row">
          {!sideCollapsed && (
            <>
              <div className="logo-dot" style={{ width: 30, height: 30, borderRadius: 9 }}><MapPin size={14} /></div>
              <span className="logo-name" style={{ fontSize: 16 }}>QCHelp</span>
            </>
          )}
          <button className="icon-btn" style={{ marginLeft: sideCollapsed ? 0 : 'auto' }} onClick={() => setSideCollapsed(s => !s)}><Menu size={18} /></button>
        </div>

        {!sideCollapsed && (
          <div className="ds-user-card">
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
              {initials(displayName)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>{displayName}</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><Shield size={10} /> {profile?.role || 'resident'} · {profile?.barangay || ''}</div>
            </div>
          </div>
        )}

        <nav className="ds-nav">
          {SIDEBAR_SECTIONS.map(section => (
            <div key={section.title}>
              {!sideCollapsed && <div className="ds-section-label">{section.title}</div>}
              {section.items.map(item => {
                const Icon = item.icon
                return (
                  <button key={item.label} className={`ds-nav-item ${item.active ? 'active' : ''}`} title={item.label} onClick={() => item.path && navigate(item.path)} style={{ opacity: item.path ? 1 : 0.5 }}>
                    <Icon size={18} />
                    {!sideCollapsed && <span>{item.label}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {!sideCollapsed && (
          <button className="ds-nav-item danger" style={{ marginTop: 'auto' }} onClick={handleSignOut}>
            <LogOut size={18} /><span>Sign Out</span>
          </button>
        )}
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <h1 className="dash-page-title">Impact Dashboard</h1>
            <p className="dash-page-sub">Live data from Firebase · qc-help-support</p>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}><LayoutDashboard size={15} /> Admin Panel</button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/post/create')}><Pencil size={15} /> New Post</button>
          </div>
        </div>

        {loading ? (
          <div className="empty-state" style={{ paddingTop: 80 }}><Loader size={32} className="spin" /><p>Loading live data…</p></div>
        ) : (
          <>
            <div className="dash-widgets-grid">
              {WIDGETS.map(w => {
                const Icon = w.Icon
                return (
                  <div key={w.label} className="dash-widget">
                    <div className="dash-widget-icon" style={{ background: w.bg }}><Icon size={22} color={w.iconColor} /></div>
                    <div>
                      <div className="dash-widget-val">{w.value.toLocaleString()}</div>
                      <div className="dash-widget-label">{w.label}</div>
                      <div className="dash-widget-change"><TrendingUp size={12} /> {w.change}</div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="dash-charts-row">
              <div className="dash-chart-card" style={{ flex: 2 }}>
                <div className="dash-card-head">
                  <div className="dash-card-title">Posts by Category</div>
                  <div className="dash-card-sub">Live from Firebase /posts · {posts.length} total</div>
                </div>
                {catEntries.length === 0 ? (
                  <div className="empty-state"><FileText size={28} /><p>No posts yet.</p></div>
                ) : (
                  <div className="dash-bar-chart">
                    {catEntries.map(([cat, count]) => (
                      <div key={cat} className="dash-bar-col">
                        <div className="dash-bar-label-top">{count}</div>
                        <div className="dash-bar-wrap">
                          <div className="dash-bar-fill" style={{ height: `${(count / maxCat) * 100}%`, background: CAT_COLORS_MAP[cat] || '#94A3B8' }} />
                        </div>
                        <div className="dash-bar-label">{cat}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="dash-chart-card" style={{ flex: 1 }}>
                <div className="dash-card-head">
                  <div className="dash-card-title">Post Status</div>
                  <div className="dash-card-sub">Live breakdown</div>
                </div>
                {[
                  { label: 'Open',        count: posts.filter(p => p.status === 'open').length, color: '#2563EB' },
                  { label: 'In Progress', count: posts.filter(p => p.status === 'in_progress').length, color: '#D97706' },
                  { label: 'Resolved',    count: posts.filter(p => p.status === 'resolved').length, color: '#059669' },
                ].map(s => {
                  const pct = Math.round((s.count / (posts.length || 1)) * 100)
                  return (
                    <div key={s.label} style={{ marginBottom: 12 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 600 }}>{s.label}</span>
                        <span style={{ color: 'var(--text-3)' }}>{s.count} · {pct}%</span>
                      </div>
                      <div style={{ height: 10, background: 'var(--border)', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: s.color, borderRadius: 99 }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="dash-charts-row">
              <div className="dash-chart-card" style={{ flex: 1 }}>
                <div className="dash-card-head">
                  <div className="dash-card-title">Recent Posts</div>
                  <div className="dash-card-sub">Latest from /posts</div>
                </div>
                {posts.slice(0, 5).map(p => (
                  <div key={p.id} className="dash-recent-item" style={{ cursor: 'pointer' }} onClick={() => navigate(`/post/${p.id}`)}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS_MAP[p.category] || '#94A3B8', flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{p.authorName} — {p.barangay}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}>
                      {p.createdAt ? new Date(p.createdAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                ))}
                {posts.length === 0 && <div className="empty-state"><FileText size={28} /><p>No posts yet.</p></div>}
              </div>

              <div className="dash-chart-card" style={{ flex: 1 }}>
                <div className="dash-card-head">
                  <div className="dash-card-title">Quick Actions</div>
                </div>
                <div className="dash-quick-actions">
                  <button className="dash-q-btn blue" onClick={() => navigate('/admin?tab=alerts')}>
                    <Bell size={18} />
                    <div><div className="dq-label">Send Community Alert</div><div className="dq-sub">Push to Firebase /alerts</div></div>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </button>
                  <button className="dash-q-btn green" onClick={() => navigate('/admin')}>
                    <CheckCircle size={18} />
                    <div><div className="dq-label">Manage Posts</div><div className="dq-sub">{urgentPosts.filter(p => p.status !== 'resolved').length} urgent open</div></div>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </button>
                  <button className="dash-q-btn orange" onClick={() => navigate('/admin?tab=users')}>
                    <Users size={18} />
                    <div><div className="dq-label">Manage Users</div><div className="dq-sub">{users.length} registered residents</div></div>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </button>
                  <button className="dash-q-btn purple" onClick={() => navigate('/post/create')}>
                    <Pencil size={18} />
                    <div><div className="dq-label">Create Post</div><div className="dq-sub">Share an update or alert</div></div>
                    <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}
