import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, Mail, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { QC_BARANGAYS } from '../constants/barangays'

function pwStrength(pw) {
  let s = 0
  if (pw.length >= 8) s++
  if (/[A-Z]/.test(pw)) s++
  if (/[0-9]/.test(pw)) s++
  if (/[^A-Za-z0-9]/.test(pw)) s++
  return s
}

const STRENGTH_LABELS = ['', 'Weak', 'Fair', 'Good', 'Strong']
const STRENGTH_COLORS = ['', '#DC2626', '#D97706', '#2563EB', '#059669']

export default function SignUp() {
  const navigate = useNavigate()
  const { signUp, signInWithGoogle, signInWithFacebook } = useAuth()
  const [form, setForm] = useState({ name: '', email: '', barangay: '', password: '', confirm: '' })
  const [showPwd, setShowPwd] = useState(false)
  const [agree, setAgree] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const strength = pwStrength(form.password)

  const handle = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirm) { setError('Passwords do not match.'); return }
    if (!agree) { setError('Please agree to the terms.'); return }
    setError('')
    setLoading(true)
    try {
      await signUp(form.email, form.password, form.name, form.barangay)
      navigate('/home')
    } catch (err) {
      setError(err.code === 'auth/email-already-in-use' ? 'This email is already registered.' : 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogle = async () => {
    try {
      await signInWithGoogle()
      navigate('/home')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError('Google sign-up failed.')
    }
  }

  const handleFacebook = async () => {
    try {
      await signInWithFacebook()
      navigate('/home')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError('Facebook sign-up failed.')
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-top-bar">
        <button className="back-btn" onClick={() => navigate('/')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <div className="logo-row">
          <div className="logo-dot"><MapPin size={16} /></div>
          <span className="logo-name">QCHelp</span>
        </div>
        <div style={{ width: 36 }} />
      </div>

      <div className="auth-body">
        <h2 className="auth-title">Create account</h2>
        <p className="auth-sub">Join the QCHelp community today</p>

        {error && <div className="error-banner">{error}</div>}

        <form onSubmit={handle}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrap">
              <User size={16} className="i-left" />
              <input type="text" placeholder="Juan dela Cruz" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="i-left" />
              <input type="email" placeholder="you@example.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required autoComplete="email" />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Barangay</label>
            <div className="input-wrap">
              <MapPin size={16} className="i-left" />
              <select value={form.barangay} onChange={e => setForm({ ...form, barangay: e.target.value })} required>
                <option value="">Select your barangay</option>
                {QC_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <ChevronDown size={16} style={{ position: 'absolute', right: 14, color: 'var(--text-3)', pointerEvents: 'none' }} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="i-left" />
              <input type={showPwd ? 'text' : 'password'} placeholder="Min. 8 characters" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required autoComplete="new-password" />
              <button type="button" className="i-right" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <>
                <div className="strength-bar">
                  <div className="strength-fill" style={{ width: `${(strength / 4) * 100}%`, background: STRENGTH_COLORS[strength] }} />
                </div>
                <span className="strength-label" style={{ color: STRENGTH_COLORS[strength] }}>{STRENGTH_LABELS[strength]}</span>
              </>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="i-left" />
              <input type={showPwd ? 'text' : 'password'} placeholder="Re-enter your password" value={form.confirm} onChange={e => setForm({ ...form, confirm: e.target.value })} required autoComplete="new-password" />
            </div>
          </div>

          <div className="form-group">
            <label className="check-row">
              <input type="checkbox" checked={agree} onChange={e => setAgree(e.target.checked)} />
              I agree to the <button type="button" className="link-btn" style={{ fontSize: 13 }}>Terms of Service</button> and <button type="button" className="link-btn" style={{ fontSize: 13 }}>Privacy Policy</button>
            </label>
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading || !agree}>
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <div className="divider-or"><span>or sign up with</span></div>
        <div className="social-row">
          <button className="btn-social" type="button" onClick={handleGoogle}>
            <svg width="18" height="18" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
            Google
          </button>
          <button className="btn-social" type="button" onClick={handleFacebook}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Facebook
          </button>
        </div>

        <p className="auth-footer">Already have an account? <button className="link-btn" onClick={() => navigate('/signin')}>Sign In</button></p>
      </div>
    </div>
  )
}
