import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, KeyRound, CheckCircle, MapPin } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { resetPassword } = useAuth()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handle = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err) {
      setError(err.code === 'auth/user-not-found' ? 'No account found with this email.' : 'Failed to send reset email. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-top-bar">
        <button className="back-btn" onClick={() => navigate('/signin')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="logo-row">
          <div className="logo-dot"><MapPin size={16} /></div>
          <span className="logo-name">QCHelp</span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div className="auth-body">
        <div style={{ width: 56, height: 56, borderRadius: 16, background: '#EFF6FF', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
          <KeyRound size={26} color="#2563EB" />
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', paddingTop: 8 }}>
            <div style={{ width: 64, height: 64, background: '#F0FDF4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <CheckCircle size={32} color="#059669" />
            </div>
            <h2 className="auth-title">Check your email</h2>
            <p className="auth-sub" style={{ marginBottom: 28 }}>We sent a password reset link to <strong>{email}</strong>. Check your inbox and follow the link to reset your password.</p>
            <button className="btn btn-primary btn-full" onClick={() => navigate('/signin')}>Back to Sign In</button>
            <p style={{ fontSize: 13, color: 'var(--text-3)', marginTop: 16 }}>
              Didn't receive it?{' '}
              <button className="link-btn" onClick={() => setSent(false)}>Try again</button>
            </p>
          </div>
        ) : (
          <>
            <h2 className="auth-title">Forgot password?</h2>
            <p className="auth-sub">Enter your email and we'll send you a link to reset your password.</p>

            {error && <div className="error-banner">{error}</div>}

            <form onSubmit={handle}>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <div className="input-wrap">
                  <Mail size={16} className="i-left" />
                  <input type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoFocus />
                </div>
              </div>
              <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                {loading ? 'Sending…' : 'Send Reset Link'}
              </button>
            </form>

            <p className="auth-footer" style={{ marginTop: 20 }}>
              <button className="link-btn" onClick={() => navigate('/signin')}>Back to Sign In</button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}
