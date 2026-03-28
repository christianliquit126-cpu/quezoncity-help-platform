import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Bell, FileText, Users, AlertCircle, CheckCircle, Send, UserX,
  Flag, BarChart2, Shield, MapPin, Check, Trash2, AlertTriangle,
  Pencil, Lock, ChevronLeft, LayoutDashboard, TrendingUp,
  Clock, Filter, ChevronDown, X
} from 'lucide-react'
import {
  ADMIN_POSTS_TABLE, ADMIN_USERS_TABLE, BARANGAY_STATS, QC_BARANGAYS
} from '../constants/barangays'

const TABS = [
  { id: 'posts', label: 'Manage Posts', Icon: FileText },
  { id: 'users', label: 'User Management', Icon: Users },
  { id: 'analytics', label: 'Analytics', Icon: BarChart2 },
  { id: 'alerts', label: 'Send Alert', Icon: Bell },
]

const CAT_COLORS = {
  flood: { bg: '#DBEAFE', color: '#1D4ED8' },
  medical: { bg: '#FCE7F3', color: '#9D174D' },
  traffic: { bg: '#FEF3C7', color: '#92400E' },
  fire: { bg: '#FEE2E2', color: '#991B1B' },
  lost: { bg: '#EDE9FE', color: '#5B21B6' },
  crime: { bg: '#FFE4E6', color: '#9F1239' },
  info: { bg: '#ECFDF5', color: '#065F46' },
  other: { bg: '#F1F5F9', color: '#475569' },
}

const STATUS_COLORS = {
  open: { bg: '#DBEAFE', color: '#1D4ED8' },
  resolved: { bg: '#D1FAE5', color: '#065F46' },
  in_progress: { bg: '#FEF3C7', color: '#92400E' },
}

const PEAK_HOURS = [
  { hour: '6AM', count: 12 }, { hour: '8AM', count: 45 }, { hour: '10AM', count: 78 },
  { hour: '12PM', count: 92 }, { hour: '2PM', count: 110 }, { hour: '4PM', count: 134 },
  { hour: '6PM', count: 156 }, { hour: '8PM', count: 98 }, { hour: '10PM', count: 44 },
]
const maxPeak = Math.max(...PEAK_HOURS.map(h => h.count))

const LOGIN_STATS = [
  { method: 'Google', pct: 52, count: '1,865 users', color: '#4285F4' },
  { method: 'Email/Password', pct: 33, count: '1,184 users', color: '#2563EB' },
  { method: 'Facebook', pct: 15, count: '538 users', color: '#1877F2' },
]

export default function AdminPanel() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('posts')
  const [posts, setPosts] = useState(ADMIN_POSTS_TABLE)
  const [users, setUsers] = useState(ADMIN_USERS_TABLE)
  const [alertForm, setAlertForm] = useState({ title: '', message: '', targetBarangay: 'all', category: 'info', expiresAt: '' })
  const [alertSent, setAlertSent] = useState(false)

  const removePost = (postId) => setPosts(p => p.filter(r => r.postId !== postId))
  const deactivateUser = (uid) => setUsers(u => u.map(r => r.uid === uid ? { ...r, role: 'deactivated' } : r))
  const verifyUser = (uid) => setUsers(u => u.map(r => r.uid === uid ? { ...r, verified: true } : r))

  const sendAlert = (e) => {
    e.preventDefault()
    setAlertSent(true)
    setTimeout(() => setAlertSent(false), 3000)
    setAlertForm({ title: '', message: '', targetBarangay: 'all', category: 'info', expiresAt: '' })
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" style={{ width: 240 }}>
        <div className="ds-logo-row">
          <div className="logo-dot" style={{ width: 30, height: 30, borderRadius: 9 }}><MapPin size={14} /></div>
          <span className="logo-name" style={{ fontSize: 16 }}>QCHelp</span>
        </div>
        <div className="ds-user-card">
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>JC</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>Juan dela Cruz</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><Shield size={10} /> Admin · Batasan Hills</div>
          </div>
        </div>
        <nav className="ds-nav" style={{ gap: 2 }}>
          <button className="ds-nav-item" onClick={() => navigate('/home')}><FileText size={17} /><span>Home Feed</span></button>
          <button className="ds-nav-item" onClick={() => navigate('/dashboard')}><LayoutDashboard size={17} /><span>Impact Dashboard</span></button>
          <div className="ds-section-label">Admin Panel</div>
          {TABS.map(t => {
            const Icon = t.Icon
            return (
              <button
                key={t.id}
                className={`ds-nav-item ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <Icon size={17} /><span>{t.label}</span>
              </button>
            )
          })}
        </nav>
        <button className="ds-nav-item danger" style={{ marginTop: 'auto' }} onClick={() => navigate('/')}>
          <UserX size={17} /><span>Sign Out</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <h1 className="dash-page-title">{TABS.find(t => t.id === tab)?.label}</h1>
            <p className="dash-page-sub">Quezon City Community Management — Firebase Realtime Database</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="admin-stat-mini blue"><FileText size={14} /> {posts.length} Posts</div>
            <div className="admin-stat-mini green"><Users size={14} /> {users.length} Users</div>
          </div>
        </div>

        {tab === 'posts' && (
          <div className="dash-chart-card" style={{ overflow: 'auto' }}>
            <div className="dash-card-head">
              <div>
                <div className="dash-card-title">Community Posts</div>
                <div className="dash-card-sub">Firebase: /posts — manage, approve, or escalate</div>
              </div>
              <button className="btn btn-outline btn-sm"><Filter size={14} /> Filter</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Post ID</th>
                  <th>User Name</th>
                  <th>Barangay</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Priority</th>
                  <th>Timestamp</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {posts.map(r => {
                  const cat = CAT_COLORS[r.category] || CAT_COLORS.other
                  const st = STATUS_COLORS[r.status] || STATUS_COLORS.open
                  return (
                    <tr key={r.postId}>
                      <td><code style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 5px', borderRadius: 4 }}>{r.postId}</code></td>
                      <td style={{ fontWeight: 600 }}>{r.userName}</td>
                      <td><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} color="var(--text-3)" />{r.barangay}</div></td>
                      <td><span className="tbl-badge" style={{ background: cat.bg, color: cat.color }}>{r.category}</span></td>
                      <td><span className="tbl-badge" style={{ background: st.bg, color: st.color }}>{r.status.replace('_', ' ')}</span></td>
                      <td>
                        {r.priority === 'urgent'
                          ? <span className="tbl-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>Urgent</span>
                          : <span className="tbl-badge" style={{ background: 'var(--bg)', color: 'var(--text-3)' }}>Normal</span>}
                      </td>
                      <td style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}>
                        <Clock size={11} /> {r.timestamp}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 6 }}>
                          <button className="tbl-action-btn green" title="Approve"><Check size={14} /></button>
                          <button className="tbl-action-btn orange" title="Mark Urgent"><AlertTriangle size={14} /></button>
                          <button className="tbl-action-btn red" title="Remove" onClick={() => removePost(r.postId)}><Trash2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'users' && (
          <div className="dash-chart-card" style={{ overflow: 'auto' }}>
            <div className="dash-card-head">
              <div>
                <div className="dash-card-title">Registered Users</div>
                <div className="dash-card-sub">Firebase: /users — manage roles, verify, deactivate</div>
              </div>
              <button className="btn btn-outline btn-sm"><Filter size={14} /> Filter</button>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email</th>
                  <th>Barangay</th>
                  <th>Role</th>
                  <th>Verified</th>
                  <th>Sign-In Method</th>
                  <th>Joined</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.uid}>
                    <td><code style={{ fontSize: 11, background: 'var(--bg)', padding: '2px 5px', borderRadius: 4 }}>{u.uid}</code></td>
                    <td style={{ fontWeight: 600 }}>{u.name}</td>
                    <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{u.email}</td>
                    <td style={{ fontSize: 13 }}>{u.barangay}</td>
                    <td>
                      <span className="tbl-badge" style={{
                        background: u.role === 'admin' ? '#EFF6FF' : u.role === 'deactivated' ? '#FEF2F2' : '#F0FDF4',
                        color: u.role === 'admin' ? '#1D4ED8' : u.role === 'deactivated' ? '#DC2626' : '#059669'
                      }}>
                        {u.role === 'admin' && <Shield size={10} />} {u.role}
                      </span>
                    </td>
                    <td>
                      {u.verified
                        ? <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle size={14} /> Yes</span>
                        : <span style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><X size={14} /> No</span>}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12 }}>
                        {u.signInMethod === 'google' && (
                          <svg width="14" height="14" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                        )}
                        {u.signInMethod === 'facebook' && (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                        )}
                        {u.signInMethod === 'email' && <Lock size={12} color="var(--text-3)" />}
                        {u.signInMethod}
                      </div>
                    </td>
                    <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{u.joinedAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <button className="tbl-action-btn blue" title="Edit Role"><Pencil size={14} /></button>
                        {!u.verified && <button className="tbl-action-btn green" title="Verify" onClick={() => verifyUser(u.uid)}><Check size={14} /></button>}
                        <button className="tbl-action-btn red" title="Deactivate" onClick={() => deactivateUser(u.uid)}><Lock size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'analytics' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="dash-charts-row">
              <div className="dash-chart-card" style={{ flex: 1 }}>
                <div className="dash-card-head">
                  <div className="dash-card-title">Peak Reporting Hours</div>
                  <div className="dash-card-sub">Post activity by hour — QC-wide</div>
                </div>
                <div className="dash-bar-chart" style={{ height: 160 }}>
                  {PEAK_HOURS.map(h => (
                    <div key={h.hour} className="dash-bar-col">
                      <div className="dash-bar-label-top" style={{ fontSize: 10 }}>{h.count}</div>
                      <div className="dash-bar-wrap">
                        <div
                          className="dash-bar-fill"
                          style={{ height: `${(h.count / maxPeak) * 100}%`, background: '#7C3AED' }}
                        />
                      </div>
                      <div className="dash-bar-label" style={{ fontSize: 10 }}>{h.hour}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="dash-chart-card" style={{ flex: 1 }}>
                <div className="dash-card-head">
                  <div className="dash-card-title">Sign-In Method Distribution</div>
                  <div className="dash-card-sub">Firebase Auth providers — 3,587 users</div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 8 }}>
                  {LOGIN_STATS.map(s => (
                    <div key={s.method}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                        <span style={{ fontWeight: 600 }}>{s.method}</span>
                        <span style={{ color: 'var(--text-3)' }}>{s.pct}% · {s.count}</span>
                      </div>
                      <div style={{ height: 10, background: 'var(--border)', borderRadius: 99 }}>
                        <div style={{ height: '100%', width: `${s.pct}%`, background: s.color, borderRadius: 99 }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="dash-chart-card">
              <div className="dash-card-head">
                <div className="dash-card-title">Barangay Coverage Report</div>
                <div className="dash-card-sub">Engagement percentage per barangay — filtered from Firebase</div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12, paddingTop: 8 }}>
                {BARANGAY_STATS.map(b => (
                  <div key={b.name} style={{ background: 'var(--bg)', borderRadius: 10, padding: '12px 14px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{b.name}</span>
                      <span style={{ fontSize: 12, fontWeight: 700, color: b.coverage >= 70 ? 'var(--green)' : b.coverage >= 50 ? 'var(--orange)' : 'var(--red)' }}>{b.coverage}%</span>
                    </div>
                    <div style={{ height: 7, background: 'var(--border)', borderRadius: 99, marginBottom: 6 }}>
                      <div style={{ height: '100%', width: `${b.coverage}%`, background: b.coverage >= 70 ? 'var(--green)' : b.coverage >= 50 ? 'var(--orange)' : 'var(--red)', borderRadius: 99 }} />
                    </div>
                    <div style={{ display: 'flex', gap: 10, fontSize: 11, color: 'var(--text-3)' }}>
                      <span>{b.posts} posts</span>
                      <span style={{ color: 'var(--green)' }}>{b.resolved} resolved</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {tab === 'alerts' && (
          <div style={{ maxWidth: 640 }}>
            <div className="dash-chart-card">
              <div className="dash-card-head">
                <div className="dash-card-title">Send Community Alert</div>
                <div className="dash-card-sub">Broadcast via Firebase Cloud Messaging (FCM) to selected barangays</div>
              </div>

              {alertSent && (
                <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <CheckCircle size={18} color="var(--green)" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>Alert sent via Firebase Cloud Messaging successfully!</span>
                </div>
              )}

              <form onSubmit={sendAlert} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Alert Title</label>
                  <div className="input-wrap no-icon">
                    <input
                      type="text"
                      placeholder="e.g. AGASA Rainfall Advisory #3 — Quezon City"
                      value={alertForm.title}
                      onChange={e => setAlertForm(f => ({ ...f, title: e.target.value }))}
                      required
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: alerts/{'{alertId}'}/title: string</div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Message</label>
                  <div className="input-wrap no-icon">
                    <textarea
                      rows={4}
                      placeholder="Alert message for community residents..."
                      className="post-textarea"
                      style={{ width: '100%' }}
                      value={alertForm.message}
                      onChange={e => setAlertForm(f => ({ ...f, message: e.target.value }))}
                      required
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: alerts/{'{alertId}'}/message: string</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Target Audience</label>
                    <div className="input-wrap">
                      <MapPin size={16} className="i-left" />
                      <select
                        value={alertForm.targetBarangay}
                        onChange={e => setAlertForm(f => ({ ...f, targetBarangay: e.target.value }))}
                      >
                        <option value="all">All Barangays (QC-wide)</option>
                        {QC_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: targetBarangay: string | "all"</div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Alert Category</label>
                    <div className="input-wrap">
                      <Bell size={16} className="i-left" />
                      <select
                        value={alertForm.category}
                        onChange={e => setAlertForm(f => ({ ...f, category: e.target.value }))}
                      >
                        <option value="weather">Weather (PAGASA/AGASA)</option>
                        <option value="emergency">Emergency</option>
                        <option value="health">Health (QC Health Dept.)</option>
                        <option value="info">General Information</option>
                      </select>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: category: string</div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Alert Expiry Date & Time</label>
                  <div className="input-wrap no-icon">
                    <input
                      type="datetime-local"
                      value={alertForm.expiresAt}
                      onChange={e => setAlertForm(f => ({ ...f, expiresAt: e.target.value }))}
                    />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: expiresAt: timestamp (number)</div>
                </div>

                <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#1D4ED8' }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={14} /> Firebase Cloud Messaging</div>
                  This alert will be broadcast via FCM push notifications to all devices with the QCHelp app installed in the selected barangay(s). The alert is also stored in the Firebase Realtime Database under <code>/alerts/</code> for in-app display.
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }}>
                  <Send size={16} /> Send Alert
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
