import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Home, Map, MessageCircle, Activity, User, LayoutDashboard,
  Box, Handshake, BarChart2, Search, Cloud, Building2, Flag, Settings,
  Shield, Bell, LogOut, FileText, Users, AlertCircle, CheckCircle,
  TrendingUp, Send, Pencil, ChevronRight, Clock, AlertTriangle,
  Phone, X, Menu
} from 'lucide-react'
import { BARANGAY_STATS, SAMPLE_POSTS } from '../constants/barangays'

const SIDEBAR_SECTIONS = [
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
      { icon: BarChart2, label: 'Impact Dashboard', path: '/dashboard', active: true },
      { icon: Search, label: 'Lost & Found', path: null },
      { icon: Cloud, label: 'Weather (PAGASA)', path: null },
      { icon: Building2, label: 'Nearby Services', path: null },
      { icon: Flag, label: "Gov't Services", path: null },
      { icon: Phone, label: 'Emergency Contacts', path: null },
    ]
  },
  {
    title: 'Admin',
    items: [
      { icon: LayoutDashboard, label: 'Admin Panel', path: '/admin' },
      { icon: Settings, label: 'Settings', path: null },
    ]
  }
]

const WIDGET_DATA = [
  { label: 'Total Posts This Week', value: '1,248', change: '+14%', Icon: FileText, color: 'blue', bg: '#EFF6FF', iconColor: '#2563EB' },
  { label: 'Active Urgent Requests', value: '24', change: '+3 today', Icon: AlertCircle, color: 'red', bg: '#FEF2F2', iconColor: '#DC2626' },
  { label: 'Resolved Cases in QC', value: '892', change: '+67 this week', Icon: CheckCircle, color: 'green', bg: '#F0FDF4', iconColor: '#059669' },
  { label: 'Active Community Users', value: '3,587', change: '+228 this month', Icon: Users, color: 'purple', bg: '#F5F3FF', iconColor: '#7C3AED' },
]

const CATEGORY_BREAKDOWN = [
  { label: 'Flood', pct: 34, color: '#2563EB', count: 424 },
  { label: 'Medical', pct: 22, color: '#DB2777', count: 274 },
  { label: 'Traffic', pct: 18, color: '#D97706', count: 225 },
  { label: 'Info', pct: 12, color: '#059669', count: 150 },
  { label: 'Lost & Found', pct: 8, color: '#7C3AED', count: 100 },
  { label: 'Fire', pct: 4, color: '#DC2626', count: 50 },
  { label: 'Crime', pct: 2, color: '#9F1239', count: 25 },
]

const MONTHLY_TREND = [
  { month: 'Oct', posts: 420 }, { month: 'Nov', posts: 580 },
  { month: 'Dec', posts: 370 }, { month: 'Jan', posts: 690 },
  { month: 'Feb', posts: 850 }, { month: 'Mar', posts: 1248 },
]

const maxPosts = Math.max(...MONTHLY_TREND.map(m => m.posts))

export default function MainDashboard() {
  const navigate = useNavigate()
  const [sideCollapsed, setSideCollapsed] = useState(false)

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
          <button className="icon-btn" style={{ marginLeft: sideCollapsed ? 0 : 'auto' }} onClick={() => setSideCollapsed(s => !s)}>
            <Menu size={18} />
          </button>
        </div>

        {!sideCollapsed && (
          <div className="ds-user-card">
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>JC</div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Juan dela Cruz</div>
              <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}>
                <Shield size={10} /> Admin · Batasan Hills
              </div>
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
                  <button
                    key={item.label}
                    className={`ds-nav-item ${item.active ? 'active' : ''}`}
                    title={item.label}
                    onClick={() => item.path && navigate(item.path)}
                    style={{ opacity: item.path ? 1 : 0.5 }}
                  >
                    <Icon size={18} />
                    {!sideCollapsed && <span>{item.label}</span>}
                  </button>
                )
              })}
            </div>
          ))}
        </nav>

        {!sideCollapsed && (
          <button className="ds-nav-item danger" style={{ marginTop: 'auto' }} onClick={() => navigate('/')}>
            <LogOut size={18} /><span>Sign Out</span>
          </button>
        )}
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <h1 className="dash-page-title">Impact Dashboard</h1>
            <p className="dash-page-sub">Real-time overview of QCHelp community activity across Quezon City</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="btn btn-outline btn-sm" onClick={() => navigate('/admin')}>
              <LayoutDashboard size={15} /> Admin Panel
            </button>
            <button className="btn btn-primary btn-sm" onClick={() => navigate('/post/create')}>
              <Pencil size={15} /> New Post
            </button>
          </div>
        </div>

        <div className="dash-widgets-grid">
          {WIDGET_DATA.map(w => {
            const Icon = w.Icon
            return (
              <div key={w.label} className="dash-widget">
                <div className="dash-widget-icon" style={{ background: w.bg }}>
                  <Icon size={22} color={w.iconColor} />
                </div>
                <div>
                  <div className="dash-widget-val">{w.value}</div>
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
              <div className="dash-card-title">Monthly Post Volume</div>
              <div className="dash-card-sub">Last 6 months — Firebase data query</div>
            </div>
            <div className="dash-bar-chart">
              {MONTHLY_TREND.map(m => (
                <div key={m.month} className="dash-bar-col">
                  <div className="dash-bar-label-top">{m.posts.toLocaleString()}</div>
                  <div className="dash-bar-wrap">
                    <div
                      className="dash-bar-fill"
                      style={{ height: `${(m.posts / maxPosts) * 100}%`, background: 'var(--primary)' }}
                    />
                  </div>
                  <div className="dash-bar-label">{m.month}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-chart-card" style={{ flex: 1 }}>
            <div className="dash-card-head">
              <div className="dash-card-title">Reports by Category</div>
              <div className="dash-card-sub">All time · QC-wide</div>
            </div>
            <div className="dash-cat-breakdown">
              {CATEGORY_BREAKDOWN.map(c => (
                <div key={c.label} className="dash-cat-row">
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4, fontSize: 13 }}>
                    <span style={{ fontWeight: 600, color: 'var(--text)' }}>{c.label}</span>
                    <span style={{ color: 'var(--text-3)' }}>{c.count}</span>
                  </div>
                  <div style={{ height: 7, background: 'var(--border)', borderRadius: 99, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${c.pct}%`, background: c.color, borderRadius: 99, transition: 'width .5s' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="dash-charts-row">
          <div className="dash-chart-card" style={{ flex: 1 }}>
            <div className="dash-card-head">
              <div className="dash-card-title">Top Barangays by Activity</div>
              <div className="dash-card-sub">Posts reported · Firebase node: /posts</div>
            </div>
            <div className="dash-brgy-table">
              <div className="dash-brgy-header">
                <span>Barangay</span>
                <span>Posts</span>
                <span>Resolved</span>
                <span>Coverage</span>
              </div>
              {BARANGAY_STATS.map(b => (
                <div key={b.name} className="dash-brgy-row">
                  <span style={{ fontWeight: 600, fontSize: 13 }}>{b.name}</span>
                  <span>{b.posts}</span>
                  <span style={{ color: 'var(--green)' }}>{b.resolved}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ flex: 1, height: 6, background: 'var(--border)', borderRadius: 99 }}>
                      <div style={{ height: '100%', width: `${b.coverage}%`, background: 'var(--primary)', borderRadius: 99 }} />
                    </div>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', width: 32 }}>{b.coverage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="dash-chart-card" style={{ flex: 1 }}>
            <div className="dash-card-head">
              <div className="dash-card-title">Quick Actions</div>
              <div className="dash-card-sub">Admin tools</div>
            </div>
            <div className="dash-quick-actions">
              <button className="dash-q-btn blue" onClick={() => navigate('/admin')}>
                <Bell size={18} />
                <div>
                  <div className="dq-label">Send Community Alert</div>
                  <div className="dq-sub">Push via Firebase Cloud Messaging</div>
                </div>
                <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </button>
              <button className="dash-q-btn green" onClick={() => navigate('/admin')}>
                <CheckCircle size={18} />
                <div>
                  <div className="dq-label">Review Pending Posts</div>
                  <div className="dq-sub">24 posts awaiting moderation</div>
                </div>
                <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </button>
              <button className="dash-q-btn orange" onClick={() => navigate('/admin')}>
                <Users size={18} />
                <div>
                  <div className="dq-label">Manage Users</div>
                  <div className="dq-sub">3,587 registered residents</div>
                </div>
                <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </button>
              <button className="dash-q-btn purple" onClick={() => navigate('/admin')}>
                <Pencil size={18} />
                <div>
                  <div className="dq-label">Update Resources</div>
                  <div className="dq-sub">Evacuation centers & supplies</div>
                </div>
                <ChevronRight size={16} style={{ marginLeft: 'auto', flexShrink: 0 }} />
              </button>
            </div>

            <div style={{ marginTop: 16 }}>
              <div className="dash-card-title" style={{ fontSize: 14, marginBottom: 10 }}>Recent Activity</div>
              {[
                { text: 'Maria Santos posted a flood alert in Batasan Hills', time: '5m ago', Icon: AlertTriangle, color: '#DC2626' },
                { text: 'QCDRRMO responded to flood report via official chat', time: '12m ago', Icon: Shield, color: '#2563EB' },
                { text: 'Rosa Bautista\'s lost dog post marked as resolved', time: '1h ago', Icon: CheckCircle, color: '#059669' },
              ].map((item, i) => {
                const Icon = item.Icon
                return (
                  <div key={i} className="dash-recent-item">
                    <Icon size={14} color={item.color} style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: 13, color: 'var(--text)', flex: 1 }}>{item.text}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-3)', flexShrink: 0 }}><Clock size={11} /> {item.time}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
