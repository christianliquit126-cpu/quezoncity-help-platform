import React from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, ShieldCheck, Users, Map } from 'lucide-react'

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
        <div className="welcome-hero">
          <h1 className="welcome-title">
            Quezon City's <span>Community</span> Support Hub
          </h1>
          <p className="welcome-sub">
            Connect with neighbors, report incidents, request help, and stay informed in real time across all barangays of Quezon City.
          </p>
        </div>
        <div className="welcome-chips">
          <div className="w-chip"><ShieldCheck size={14} /><span>Emergency Alerts</span></div>
          <div className="w-chip"><Users size={14} /><span>Community Feed</span></div>
          <div className="w-chip"><Map size={14} /><span>Live Incident Map</span></div>
        </div>
        <div className="welcome-actions">
          <button className="btn btn-primary btn-full" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn btn-outline btn-full" onClick={() => navigate('/signup')}>Create Account</button>
          <button className="btn btn-ghost btn-full" onClick={() => navigate('/home')}>Continue as Guest</button>
        </div>
      </div>
    </div>
  )
}
