import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bell, FileText, Users, AlertCircle, CheckCircle, Send, UserX, Flag, BarChart2 } from 'lucide-react'

const REPORTS = [
  { cat: 'flood', title: 'Flood — Batasan Hills', sub: 'Maria Santos · 5 min ago' },
  { cat: 'medical', title: 'Medical — Blood Donor Needed', sub: 'Jose Reyes · 18 min ago' },
  { cat: 'traffic', title: 'Traffic — EDSA-Cubao Closure', sub: 'Carlos Mendoza · 2 hrs ago' },
  { cat: 'fire', title: 'Fire Alert — Krus na Ligas', sub: 'Pedro Santos · 3 hrs ago' },
]

const COVERAGE = [
  { name: 'Batasan Hills', pct: 82 },
  { name: 'Commonwealth', pct: 74 },
  { name: 'Fairview', pct: 65 },
  { name: 'Novaliches', pct: 58 },
  { name: 'Cubao', pct: 91 },
  { name: 'Holy Spirit', pct: 47 },
]

export default function AdminPanel() {
  const navigate = useNavigate()
  const [reports, setReports] = useState(REPORTS)

  const removeReport = (i) => setReports(r => r.filter((_, idx) => idx !== i))

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/profile')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Admin Dashboard</h2>
        <button className="icon-btn" onClick={() => navigate('/activity')}><Bell size={20} /></button>
      </div>

      <div className="screen-body" style={{ paddingBottom: 24 }}>
        <div className="admin-stats-grid">
          <div className="admin-stat-card blue">
            <div className="admin-stat-icon"><FileText size={20} /></div>
            <div className="admin-stat-num">1,248</div>
            <div className="admin-stat-lbl">Total Posts</div>
          </div>
          <div className="admin-stat-card green">
            <div className="admin-stat-icon"><Users size={20} /></div>
            <div className="admin-stat-num">3,587</div>
            <div className="admin-stat-lbl">Active Users</div>
          </div>
          <div className="admin-stat-card orange">
            <div className="admin-stat-icon"><AlertCircle size={20} /></div>
            <div className="admin-stat-num">24</div>
            <div className="admin-stat-lbl">Open Incidents</div>
          </div>
          <div className="admin-stat-card purple">
            <div className="admin-stat-icon"><CheckCircle size={20} /></div>
            <div className="admin-stat-num">892</div>
            <div className="admin-stat-lbl">Resolved</div>
          </div>
        </div>

        <div style={{ padding: '4px 16px 0' }}>
          <div className="section-label">Pending Reports</div>
        </div>
        <div className="admin-report-list">
          {reports.map((r, i) => (
            <div key={i} className="admin-report-item">
              <span className={`report-dot ${r.cat}`} />
              <div style={{ flex: 1 }}>
                <div className="report-title">{r.title}</div>
                <div className="report-sub">{r.sub}</div>
              </div>
              <div className="report-actions">
                <button className="btn btn-green btn-xs" onClick={() => removeReport(i)}>Approve</button>
                <button className="btn btn-danger btn-xs" onClick={() => removeReport(i)}>Remove</button>
              </div>
            </div>
          ))}
          {reports.length === 0 && (
            <div style={{ textAlign: 'center', padding: 20, color: 'var(--text-3)', fontSize: 13 }}>
              All reports have been reviewed.
            </div>
          )}
        </div>

        <div style={{ padding: '4px 16px 0' }}>
          <div className="section-label">Barangay Coverage</div>
        </div>
        <div className="coverage-list">
          {COVERAGE.map(c => (
            <div key={c.name} className="cov-item">
              <div className="cov-head">
                <span className="cov-name">{c.name}</span>
                <span className="cov-pct">{c.pct}%</span>
              </div>
              <div className="cov-bar"><div className="cov-fill" style={{ width: `${c.pct}%` }} /></div>
            </div>
          ))}
        </div>

        <div style={{ padding: '4px 16px 0' }}>
          <div className="section-label">Quick Actions</div>
        </div>
        <div className="admin-quick-grid">
          <button className="admin-q-btn"><Send size={16} /> Broadcast Alert</button>
          <button className="admin-q-btn"><UserX size={16} /> Manage Users</button>
          <button className="admin-q-btn"><Flag size={16} /> Flagged Content</button>
          <button className="admin-q-btn"><BarChart2 size={16} /> Analytics</button>
        </div>
      </div>
    </div>
  )
}
