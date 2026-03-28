import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function SignIn() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '', rememberMe: false })
  const [showPwd, setShowPwd] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div className="auth-shell">
      <div className="auth-top-bar">
        <button className="back-btn" onClick={() => navigate('/')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <div className="logo-row">
          <div className="logo-dot"><MapPin size={16} /></div>
          <span className="logo-name">QCHelp</span>
        </div>
        <div style={{ width: 36 }} />
      </div>
      <div className="auth-body">
        <h2 className="auth-title">Welcome back</h2>
        <p className="auth-sub">Sign in to your QCHelp account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="i-left" />
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} autoComplete="email" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="i-left" />
              <input type={showPwd ? 'text' : 'password'} name="password" placeholder="Enter your password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
              <button type="button" className="i-right" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <div className="form-inline">
            <label className="check-row">
              <input type="checkbox" checked={form.rememberMe} onChange={e => setForm({ ...form, rememberMe: e.target.checked })} />
              Remember me
            </label>
            <button type="button" className="link-btn" onClick={() => navigate('/reset')}>Forgot password?</button>
          </div>
          <button type="submit" className="btn btn-primary btn-full">Sign In</button>
        </form>
        <div className="divider-or"><span>or continue with</span></div>
        <div className="social-row">
          <button className="btn-social">
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button className="btn-social">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>
        <p className="auth-footer">Don't have an account? <button className="link-btn" onClick={() => navigate('/signup')}>Sign Up</button></p>
      </div>
    </div>
  )
}
