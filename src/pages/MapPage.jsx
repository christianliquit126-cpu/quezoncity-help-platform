import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  SlidersHorizontal, Plus, MapPin, AlertTriangle,
  Heart, Users, AlertCircle, ZoomIn, ZoomOut, Navigation
} from 'lucide-react'
import BottomNav from '../components/BottomNav'
import { MAP_MARKERS } from '../constants/barangays'

const LEGEND = [
  { type: 'emergency', label: 'Emergency', Icon: AlertTriangle, color: '#DC2626', bg: '#FEE2E2' },
  { type: 'community', label: 'Community Help', Icon: Heart, color: '#059669', bg: '#D1FAE5' },
  { type: 'cluster', label: 'Cluster Zone', Icon: Users, color: '#2563EB', bg: '#DBEAFE' },
  { type: 'active', label: 'Active Report', Icon: AlertCircle, color: '#D97706', bg: '#FEF3C7' },
]

const INCIDENTS = [
  { cat: 'emergency', title: 'Flooding — Batasan Road cor. Tandang Sora', sub: 'Batasan Hills · Reported 25 mins ago', time: '25m', postId: 'post_001' },
  { cat: 'community', title: 'Volunteer Needed — Holy Spirit food distribution', sub: 'Holy Spirit · Reported 1h ago', time: '1h', postId: 'post_005' },
  { cat: 'active', title: 'Road Closure — EDSA-Cubao rehabilitation works', sub: 'Cubao · Reported 2h ago', time: '2h', postId: 'post_004' },
  { cat: 'emergency', title: 'Blood Donor O+ — QC General Hospital', sub: 'Commonwealth · Reported 18 mins ago', time: '18m', postId: 'post_002' },
  { cat: 'cluster', title: '4 Reports — Commonwealth Ave corridor', sub: 'Multiple barangays · Mixed reports', time: '—', postId: null },
  { cat: 'active', title: 'Pasong Tamo Creek overflow — evacuation advisory', sub: 'Pasong Tamo · Reported 4h ago', time: '4h', postId: 'post_006' },
]

const LEGEND_MAP = {
  emergency: { color: '#DC2626', bg: '#FEE2E2' },
  community: { color: '#059669', bg: '#D1FAE5' },
  cluster:   { color: '#2563EB', bg: '#DBEAFE' },
  active:    { color: '#D97706', bg: '#FEF3C7' },
}

export default function MapPage() {
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all')
  const [selectedMarker, setSelectedMarker] = useState(null)

  const filtered = filter === 'all' ? INCIDENTS : INCIDENTS.filter(i => i.cat === filter)

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="inner-title">QC Incident Map</h2>
        <button className="icon-btn"><SlidersHorizontal size={20} /></button>
      </div>

      <div className="map-container screen-body">
        <div style={{ position: 'relative' }}>
          <div className="map-frame" style={{ height: 290, flexShrink: 0 }}>
            <iframe
              title="Quezon City Map"
              src="https://www.openstreetmap.org/export/embed.html?bbox=120.98%2C14.60%2C121.12%2C14.75&layer=mapnik&marker=14.676%2C121.040"
              style={{ width: '100%', height: '100%', border: 'none' }}
              loading="lazy"
            />
          </div>
          <div className="map-controls">
            <button className="map-ctrl-btn"><ZoomIn size={18} /></button>
            <button className="map-ctrl-btn"><ZoomOut size={18} /></button>
            <button className="map-ctrl-btn"><Navigation size={18} /></button>
          </div>
        </div>

        <div className="map-legend-row">
          {LEGEND.map(l => {
            const Icon = l.Icon
            return (
              <button
                key={l.type}
                className={`legend-chip ${filter === l.type ? 'active' : ''}`}
                style={filter === l.type ? { background: l.bg, borderColor: l.color, color: l.color } : {}}
                onClick={() => setFilter(filter === l.type ? 'all' : l.type)}
              >
                <Icon size={12} />
                {l.label}
              </button>
            )
          })}
        </div>

        <div className="map-incidents">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div className="map-panel-title">Nearby Incidents <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 13 }}>({filtered.length})</span></div>
            <button className="section-more" onClick={() => setFilter('all')}>View all</button>
          </div>
          {filtered.map((inc, i) => {
            const style = LEGEND_MAP[inc.cat]
            return (
              <div
                key={i}
                className="map-inc-item"
                onClick={() => inc.postId ? navigate(`/post/${inc.postId}`) : null}
                style={{ cursor: inc.postId ? 'pointer' : 'default' }}
              >
                <div className="map-inc-dot" style={{ background: style.bg }}>
                  {inc.cat === 'emergency' && <AlertTriangle size={13} color={style.color} />}
                  {inc.cat === 'community' && <Heart size={13} color={style.color} />}
                  {inc.cat === 'cluster' && <Users size={13} color={style.color} />}
                  {inc.cat === 'active' && <AlertCircle size={13} color={style.color} />}
                </div>
                <div className="mi-info">
                  <div className="mi-title">{inc.title}</div>
                  <div className="mi-sub">{inc.sub}</div>
                </div>
                <span className="post-time">{inc.time}</span>
              </div>
            )
          })}
        </div>

        <button className="fab-map" onClick={() => navigate('/post/create')}>
          <Plus size={22} />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
