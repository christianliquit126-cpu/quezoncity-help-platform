import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, KeyRound, CheckCircle } from 'lucide-react'

export default function ResetPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSent(true)
  }

  return (
    <div className="auth-shell">
      <div className="auth-top-bar">
        <button className="back-btn" onClick={() => navigate('/signin')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <div style={{ width: 36 }} />
      </div>
      <div className="auth-body" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 24 }}>
          <KeyRound size={32} color="var(--primary)" />
        </div>
        <h2 className="auth-title">Forgot Password?</h2>
        <p className="auth-sub" style={{ maxWidth: 280 }}>Enter your email and we will send you instructions to reset your password.</p>

        {!sent ? (
          <form onSubmit={handleSubmit} style={{ width: '100%', marginTop: 8 }}>
            <div className="form-group" style={{ textAlign: 'left' }}>
              <label className="form-label">Email Address</label>
              <div className="input-wrap">
                <Mail size={16} className="i-left" />
                <input type="email" name="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)} required autoComplete="email" />
              </div>
            </div>
            <button type="submit" className="btn btn-primary btn-full">Send Reset Link</button>
          </form>
        ) : (
          <div style={{ width: '100%', background: 'var(--green-light)', borderRadius: 'var(--radius-sm)', padding: '16px', display: 'flex', alignItems: 'center', gap: 10, marginTop: 16 }}>
            <CheckCircle size={20} color="var(--green)" />
            <span style={{ fontSize: 14, color: 'var(--green)', fontWeight: 600 }}>Reset link sent! Check your inbox.</span>
          </div>
        )}

        <p className="auth-footer" style={{ marginTop: 24 }}>
          <button className="link-btn" onClick={() => navigate('/signin')}>Back to Sign In</button>
        </p>
      </div>
    </div>
  )
}
