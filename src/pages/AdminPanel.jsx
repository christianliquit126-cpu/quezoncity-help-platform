import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, FileText, Users, BarChart2, AlertCircle, CheckCircle, Send, UserX, Flag, Shield, MapPin, Check, Trash2, AlertTriangle, Pencil, Lock, LayoutDashboard, Clock, Filter, X, Loader } from 'lucide-react'
import { ref, onValue, update, remove, push } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate as useNav } from 'react-router-dom'
import { QC_BARANGAYS } from '../constants/barangays'
import { timeAgo, initials, avatarColor } from '../utils/format'

const TABS = [
  { id: 'posts',    label: 'Manage Posts',    Icon: FileText },
  { id: 'users',    label: 'User Management', Icon: Users },
  { id: 'analytics',label: 'Analytics',       Icon: BarChart2 },
  { id: 'alerts',   label: 'Send Alert',      Icon: Bell },
]

const CAT_COLORS = {
  flood:   { bg: '#DBEAFE', color: '#1D4ED8' },
  medical: { bg: '#FCE7F3', color: '#9D174D' },
  traffic: { bg: '#FEF3C7', color: '#92400E' },
  fire:    { bg: '#FEE2E2', color: '#991B1B' },
  lost:    { bg: '#EDE9FE', color: '#5B21B6' },
  crime:   { bg: '#FFE4E6', color: '#9F1239' },
  info:    { bg: '#ECFDF5', color: '#065F46' },
  other:   { bg: '#F1F5F9', color: '#475569' },
}

const STATUS_COLORS = {
  open:        { bg: '#DBEAFE', color: '#1D4ED8' },
  resolved:    { bg: '#D1FAE5', color: '#065F46' },
  in_progress: { bg: '#FEF3C7', color: '#92400E' },
}

export default function AdminPanel() {
  const navigate = useNavigate()
  const { user, profile, signOut } = useAuth()
  const [tab, setTab] = useState('posts')
  const [posts, setPosts] = useState([])
  const [users, setUsers] = useState([])
  const [loadingPosts, setLoadingPosts] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [alertForm, setAlertForm] = useState({ title: '', message: '', targetBarangay: 'all', category: 'info', expiresAt: '' })
  const [alertSent, setAlertSent] = useState(false)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const unsub = onValue(ref(db, 'posts'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => list.unshift({ id: child.key, ...child.val() }))
        setPosts(list)
      } else { setPosts([]) }
      setLoadingPosts(false)
    })
    return unsub
  }, [])

  useEffect(() => {
    if (tab !== 'users') return
    const unsub = onValue(ref(db, 'users'), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => list.push({ uid: child.key, ...child.val() }))
        setUsers(list)
      } else { setUsers([]) }
      setLoadingUsers(false)
    })
    return unsub
  }, [tab])

  const removePost = async (postId) => {
    if (!window.confirm('Remove this post permanently?')) return
    await remove(ref(db, `posts/${postId}`))
  }

  const updatePostStatus = async (postId, status) => {
    await update(ref(db, `posts/${postId}`), { status, updatedAt: Date.now() })
  }

  const deactivateUser = async (uid) => {
    await update(ref(db, `users/${uid}`), { role: 'deactivated' })
  }

  const verifyUser = async (uid) => {
    await update(ref(db, `users/${uid}`), { verified: true })
  }

  const sendAlert = async (e) => {
    e.preventDefault()
    setSending(true)
    await push(ref(db, 'alerts'), {
      title: alertForm.title,
      message: alertForm.message,
      targetBarangay: alertForm.targetBarangay,
      category: alertForm.category,
      expiresAt: alertForm.expiresAt ? new Date(alertForm.expiresAt).getTime() : null,
      createdBy: user.uid,
      createdAt: Date.now(),
      sentViaPush: false,
      source: profile?.displayName || 'QCHelp Admin',
    })
    setAlertSent(true)
    setSending(false)
    setAlertForm({ title: '', message: '', targetBarangay: 'all', category: 'info', expiresAt: '' })
    setTimeout(() => setAlertSent(false), 4000)
  }

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dashboard-shell">
      <aside className="dashboard-sidebar" style={{ width: 240 }}>
        <div className="ds-logo-row">
          <div className="logo-dot" style={{ width: 30, height: 30, borderRadius: 9 }}><MapPin size={14} /></div>
          <span className="logo-name" style={{ fontSize: 16 }}>QCHelp</span>
        </div>
        <div className="ds-user-card">
          <div style={{ width: 38, height: 38, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>
            {initials(profile?.displayName || 'Admin')}
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>{profile?.displayName || 'Admin'}</div>
            <div style={{ fontSize: 11, color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><Shield size={10} /> {profile?.role || 'admin'} · {profile?.barangay || ''}</div>
          </div>
        </div>
        <nav className="ds-nav" style={{ gap: 2 }}>
          <button className="ds-nav-item" onClick={() => navigate('/home')}><FileText size={17} /><span>Home Feed</span></button>
          <button className="ds-nav-item" onClick={() => navigate('/dashboard')}><LayoutDashboard size={17} /><span>Impact Dashboard</span></button>
          <div className="ds-section-label">Admin Panel</div>
          {TABS.map(t => {
            const Icon = t.Icon
            return (
              <button key={t.id} className={`ds-nav-item ${tab === t.id ? 'active' : ''}`} onClick={() => setTab(t.id)}>
                <Icon size={17} /><span>{t.label}</span>
              </button>
            )
          })}
        </nav>
        <button className="ds-nav-item danger" style={{ marginTop: 'auto' }} onClick={handleSignOut}>
          <UserX size={17} /><span>Sign Out</span>
        </button>
      </aside>

      <main className="dashboard-main">
        <div className="dashboard-topbar">
          <div>
            <h1 className="dash-page-title">{TABS.find(t => t.id === tab)?.label}</h1>
            <p className="dash-page-sub">Firebase: qc-help-support-default-rtdb.asia-southeast1.firebasedatabase.app</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <div className="admin-stat-mini blue"><FileText size={14} /> {posts.length} Posts</div>
            <div className="admin-stat-mini green"><Users size={14} /> {users.length} Users</div>
          </div>
        </div>

        {tab === 'posts' && (
          <div style={{ padding: '20px 24px' }}>
            <div className="dash-chart-card" style={{ overflow: 'auto' }}>
              <div className="dash-card-head">
                <div>
                  <div className="dash-card-title">Community Posts</div>
                  <div className="dash-card-sub">Firebase: /posts — live real-time data</div>
                </div>
                <button className="btn btn-outline btn-sm"><Filter size={14} /> Filter</button>
              </div>
              {loadingPosts ? (
                <div className="empty-state"><Loader size={28} className="spin" /></div>
              ) : posts.length === 0 ? (
                <div className="empty-state"><FileText size={36} /><p>No posts yet.</p></div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr><th>Author</th><th>Barangay</th><th>Category</th><th>Status</th><th>Priority</th><th>Posted</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {posts.map(p => {
                      const cat = CAT_COLORS[p.category] || CAT_COLORS.other
                      const st = STATUS_COLORS[p.status] || STATUS_COLORS.open
                      return (
                        <tr key={p.id}>
                          <td style={{ fontWeight: 600 }}>{p.authorName || 'Unknown'}</td>
                          <td><div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><MapPin size={12} color="var(--text-3)" />{p.barangay}</div></td>
                          <td><span className="tbl-badge" style={{ background: cat.bg, color: cat.color }}>{p.category}</span></td>
                          <td><span className="tbl-badge" style={{ background: st.bg, color: st.color }}>{p.status?.replace('_', ' ')}</span></td>
                          <td>
                            {p.priority === 'urgent' || p.priority === 'critical'
                              ? <span className="tbl-badge" style={{ background: '#FEF3C7', color: '#92400E' }}>{p.priority}</span>
                              : <span className="tbl-badge" style={{ background: 'var(--bg)', color: 'var(--text-3)' }}>Normal</span>}
                          </td>
                          <td style={{ fontSize: 12, color: 'var(--text-3)', whiteSpace: 'nowrap' }}><Clock size={11} /> {timeAgo(p.createdAt)}</td>
                          <td>
                            <div style={{ display: 'flex', gap: 6 }}>
                              <button className="tbl-action-btn green" title="Mark Resolved" onClick={() => updatePostStatus(p.id, 'resolved')}><Check size={14} /></button>
                              <button className="tbl-action-btn orange" title="View" onClick={() => navigate(`/post/${p.id}`)}><AlertTriangle size={14} /></button>
                              <button className="tbl-action-btn red" title="Remove" onClick={() => removePost(p.id)}><Trash2 size={14} /></button>
                            </div>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'users' && (
          <div style={{ padding: '20px 24px' }}>
            <div className="dash-chart-card" style={{ overflow: 'auto' }}>
              <div className="dash-card-head">
                <div>
                  <div className="dash-card-title">Registered Users</div>
                  <div className="dash-card-sub">Firebase: /users — real-time data</div>
                </div>
                <button className="btn btn-outline btn-sm"><Filter size={14} /> Filter</button>
              </div>
              {loadingUsers ? (
                <div className="empty-state"><Loader size={28} className="spin" /></div>
              ) : users.length === 0 ? (
                <div className="empty-state"><Users size={36} /><p>No users yet.</p></div>
              ) : (
                <table className="admin-table">
                  <thead>
                    <tr><th>Name</th><th>Email</th><th>Barangay</th><th>Role</th><th>Verified</th><th>Sign-In</th><th>Joined</th><th>Actions</th></tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.uid}>
                        <td style={{ fontWeight: 600 }}>{u.displayName || '—'}</td>
                        <td style={{ fontSize: 13, color: 'var(--text-2)' }}>{u.email}</td>
                        <td style={{ fontSize: 13 }}>{u.barangay || '—'}</td>
                        <td>
                          <span className="tbl-badge" style={{
                            background: u.role === 'admin' || u.role === 'superadmin' ? '#EFF6FF' : u.role === 'deactivated' ? '#FEF2F2' : '#F0FDF4',
                            color:      u.role === 'admin' || u.role === 'superadmin' ? '#1D4ED8' : u.role === 'deactivated' ? '#DC2626' : '#059669'
                          }}>
                            {(u.role === 'admin' || u.role === 'superadmin') && <Shield size={10} />} {u.role || 'resident'}
                          </span>
                        </td>
                        <td>
                          {u.verified
                            ? <span style={{ color: 'var(--green)', display: 'flex', alignItems: 'center', gap: 3 }}><CheckCircle size={14} /> Yes</span>
                            : <span style={{ color: 'var(--text-3)', display: 'flex', alignItems: 'center', gap: 3 }}><X size={14} /> No</span>}
                        </td>
                        <td style={{ fontSize: 12 }}>{u.signInMethod || 'email'}</td>
                        <td style={{ fontSize: 12, color: 'var(--text-3)' }}>{u.joinedAt ? new Date(u.joinedAt).toLocaleDateString('en-PH') : '—'}</td>
                        <td>
                          <div style={{ display: 'flex', gap: 6 }}>
                            {!u.verified && <button className="tbl-action-btn green" title="Verify" onClick={() => verifyUser(u.uid)}><Check size={14} /></button>}
                            <button className="tbl-action-btn red" title="Deactivate" onClick={() => deactivateUser(u.uid)}><Lock size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {tab === 'analytics' && (
          <div style={{ padding: '20px 24px' }}>
            <div className="dash-chart-card">
              <div className="dash-card-head">
                <div className="dash-card-title">Posts by Category</div>
                <div className="dash-card-sub">Calculated from live /posts data</div>
              </div>
              {(() => {
                const cats = {}
                posts.forEach(p => { cats[p.category] = (cats[p.category] || 0) + 1 })
                const total = posts.length || 1
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {Object.entries(cats).sort((a, b) => b[1] - a[1]).map(([cat, count]) => {
                      const c = CAT_COLORS[cat] || CAT_COLORS.other
                      const pct = Math.round((count / total) * 100)
                      return (
                        <div key={cat}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 5 }}>
                            <span style={{ fontWeight: 600 }}>{cat}</span>
                            <span style={{ color: 'var(--text-3)' }}>{count} posts · {pct}%</span>
                          </div>
                          <div style={{ height: 10, background: 'var(--border)', borderRadius: 99 }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: c.color, borderRadius: 99 }} />
                          </div>
                        </div>
                      )
                    })}
                    {posts.length === 0 && <div className="empty-state"><BarChart2 size={36} /><p>No data yet.</p></div>}
                  </div>
                )
              })()}
            </div>

            <div className="dash-chart-card" style={{ marginTop: 20 }}>
              <div className="dash-card-head">
                <div className="dash-card-title">Status Overview</div>
                <div className="dash-card-sub">Live from /posts</div>
              </div>
              {(() => {
                const open = posts.filter(p => p.status === 'open').length
                const resolved = posts.filter(p => p.status === 'resolved').length
                const inProgress = posts.filter(p => p.status === 'in_progress').length
                return (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
                    {[
                      { label: 'Open', count: open, bg: '#EFF6FF', color: '#1D4ED8' },
                      { label: 'In Progress', count: inProgress, bg: '#FFFBEB', color: '#D97706' },
                      { label: 'Resolved', count: resolved, bg: '#F0FDF4', color: '#059669' },
                    ].map(s => (
                      <div key={s.label} style={{ background: s.bg, borderRadius: 12, padding: 16, textAlign: 'center' }}>
                        <div style={{ fontSize: 28, fontWeight: 800, color: s.color }}>{s.count}</div>
                        <div style={{ fontSize: 12, color: s.color, fontWeight: 600, marginTop: 4 }}>{s.label}</div>
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        )}

        {tab === 'alerts' && (
          <div style={{ padding: '20px 24px', maxWidth: 640 }}>
            <div className="dash-chart-card">
              <div className="dash-card-head">
                <div className="dash-card-title">Send Community Alert</div>
                <div className="dash-card-sub">Writes to Firebase: /alerts — visible on Home screen carousel</div>
              </div>

              {alertSent && (
                <div style={{ background: '#F0FDF4', border: '1px solid #A7F3D0', borderRadius: 10, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <CheckCircle size={18} color="var(--green)" />
                  <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--green)' }}>Alert saved to Firebase and visible on Home screen!</span>
                </div>
              )}

              <form onSubmit={sendAlert} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Alert Title</label>
                  <div className="input-wrap no-icon">
                    <input type="text" placeholder="e.g. PAGASA Rainfall Advisory #3 — Quezon City" value={alertForm.title} onChange={e => setAlertForm(f => ({ ...f, title: e.target.value }))} required />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: alerts/{'{id}'}/title</div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Message</label>
                  <div className="input-wrap no-icon">
                    <textarea rows={4} placeholder="Alert message for community residents..." className="post-textarea" style={{ width: '100%' }} value={alertForm.message} onChange={e => setAlertForm(f => ({ ...f, message: e.target.value }))} required />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: alerts/{'{id}'}/message</div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Target Audience</label>
                    <div className="input-wrap">
                      <MapPin size={16} className="i-left" />
                      <select value={alertForm.targetBarangay} onChange={e => setAlertForm(f => ({ ...f, targetBarangay: e.target.value }))}>
                        <option value="all">All Barangays (QC-wide)</option>
                        {QC_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Category</label>
                    <div className="input-wrap">
                      <Bell size={16} className="i-left" />
                      <select value={alertForm.category} onChange={e => setAlertForm(f => ({ ...f, category: e.target.value }))}>
                        <option value="weather">Weather (PAGASA/AGASA)</option>
                        <option value="emergency">Emergency</option>
                        <option value="health">Health Dept.</option>
                        <option value="info">General Info</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label">Expiry Date & Time (optional)</label>
                  <div className="input-wrap no-icon">
                    <input type="datetime-local" value={alertForm.expiresAt} onChange={e => setAlertForm(f => ({ ...f, expiresAt: e.target.value }))} />
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>Firebase field: alerts/{'{id}'}/expiresAt (timestamp)</div>
                </div>

                <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '12px 14px', fontSize: 13, color: '#1D4ED8' }}>
                  <div style={{ fontWeight: 700, marginBottom: 4, display: 'flex', alignItems: 'center', gap: 6 }}><Bell size={14} /> Firebase Realtime Database</div>
                  Alert is saved to <code>/alerts/</code> and displayed on the Home screen carousel. Residents see it immediately in real time.
                </div>

                <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', padding: '12px 28px' }} disabled={sending}>
                  {sending ? <><Loader size={15} className="spin" /> Sending…</> : <><Send size={16} /> Send Alert</>}
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
