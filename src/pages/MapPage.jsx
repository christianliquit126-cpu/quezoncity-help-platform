import React from 'react'
import { useNavigate } from 'react-router-dom'
import { SlidersHorizontal, Plus } from 'lucide-react'
import BottomNav from '../components/BottomNav'

const INCIDENTS = [
  { cat: 'flood', title: 'Flood Alert', sub: 'Batasan Road — 0.3 km', time: '5m' },
  { cat: 'medical', title: 'Blood Donor Needed', sub: 'QC General Hospital — 1.1 km', time: '18m' },
  { cat: 'traffic', title: 'Road Closure', sub: 'EDSA-Cubao Underpass — 2.8 km', time: '2h' },
  { cat: 'crime', title: 'Snatching Incident', sub: 'Commonwealth Ave — 3.2 km', time: '4h' },
]

export default function MapPage() {
  const navigate = useNavigate()
  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">QC Incident Map</h2>
        <button className="icon-btn"><SlidersHorizontal size={20} /></button>
      </div>

      <div className="map-container screen-body">
        <div className="map-frame" style={{ height: 320, flexShrink: 0, flexGrow: 0 }}>
          <iframe
            title="Quezon City Map"
            src="https://www.openstreetmap.org/export/embed.html?bbox=121.02%2C14.62%2C121.08%2C14.72&layer=mapnik"
            style={{ width: '100%', height: '100%', border: 'none' }}
            loading="lazy"
          />
        </div>

        <div className="map-legend">
          <div className="legend-item"><span className="legend-dot flood" /> Flood</div>
          <div className="legend-item"><span className="legend-dot medical" /> Medical</div>
          <div className="legend-item"><span className="legend-dot fire" /> Fire</div>
          <div className="legend-item"><span className="legend-dot traffic" /> Traffic</div>
          <div className="legend-item"><span className="legend-dot crime" /> Crime</div>
        </div>

        <div className="map-incidents">
          <div className="map-panel-title">Nearby Incidents</div>
          {INCIDENTS.map((inc, i) => (
            <div key={i} className="map-inc-item" onClick={() => navigate('/post/1')}>
              <span className={`legend-dot ${inc.cat}`} />
              <div className="mi-info">
                <div className="mi-title">{inc.title}</div>
                <div className="mi-sub">{inc.sub}</div>
              </div>
              <span className="post-time">{inc.time}</span>
            </div>
          ))}
        </div>

        <button className="fab-map" onClick={() => navigate('/post/create')}>
          <Plus size={22} />
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
