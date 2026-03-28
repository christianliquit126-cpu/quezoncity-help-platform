import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ShieldCheck, Users, Map, AlertTriangle, Building2 } from 'lucide-react'

export default function WelcomePage() {
  const navigate = useNavigate()
  return (
    <div className="welcome-shell">
      <div className="welcome-blobs">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
      </div>

      <div className="welcome-content">
        <div className="welcome-logo">
          <div className="welcome-logo-dot"><MapPin size={20} /></div>
          <span className="welcome-logo-name">QCHelp</span>
        </div>

        <div className="welcome-landmark-row">
          <div className="welcome-landmark">
            <Building2 size={16} />
            <span>Quezon Memorial Circle</span>
          </div>
          <div className="welcome-landmark">
            <Building2 size={16} />
            <span>Batasang Pambansa</span>
          </div>
          <div className="welcome-landmark">
            <Building2 size={16} />
            <span>UP Diliman</span>
          </div>
        </div>

        <div className="welcome-hero">
          <h1 className="welcome-title">
            Welcome to QCHelp –<br />
            Quezon City's <span>Community</span><br />
            Support Hub
          </h1>
          <p className="welcome-sub">
            Connect with neighbors, get help, and stay updated on what's happening in your barangay across all of Quezon City.
          </p>
        </div>

        <div className="welcome-chips">
          <div className="w-chip"><ShieldCheck size={14} /><span>Emergency Alerts</span></div>
          <div className="w-chip"><Users size={14} /><span>Community Feed</span></div>
          <div className="w-chip"><Map size={14} /><span>Live Incident Map</span></div>
          <div className="w-chip"><AlertTriangle size={14} /><span>Urgent Requests</span></div>
        </div>

        <div className="welcome-actions">
          <button className="btn btn-primary btn-full" style={{ fontSize: 16 }} onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn btn-outline btn-full" onClick={() => navigate('/signup')}>Create Account</button>
          <button className="btn btn-ghost btn-full" style={{ fontSize: 13 }} onClick={() => navigate('/home')}>
            Continue as Guest <span style={{ fontSize: 11, color: 'var(--text-3)' }}>(Limited Access)</span>
          </button>
        </div>

        <div className="welcome-footer">
          <span style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center' }}>
            Serving all <strong>142 barangays</strong> of Quezon City
          </span>
        </div>
      </div>
    </div>
  )
}
