import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, User, Mail, Phone, Lock, Eye, EyeOff, ChevronDown } from 'lucide-react'
import { QC_BARANGAYS } from '../constants/barangays'

function getStrength(p) {
  if (!p) return { pct: 0, label: '', color: '' }
  let score = 0
  if (p.length >= 8) score++
  if (/[A-Z]/.test(p)) score++
  if (/[0-9]/.test(p)) score++
  if (/[^A-Za-z0-9]/.test(p)) score++
  const map = [
    { pct: 0, label: '', color: '' },
    { pct: 25, label: 'Weak', color: '#EF4444' },
    { pct: 50, label: 'Fair', color: '#F59E0B' },
    { pct: 75, label: 'Good', color: '#3B82F6' },
    { pct: 100, label: 'Strong', color: '#10B981' },
  ]
  return map[score]
}

export default function SignUp() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ fullName: '', email: '', contactNumber: '', barangay: '', password: '', confirmPassword: '', agreeToTerms: false })
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const strength = getStrength(form.password)

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

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
        <h2 className="auth-title">Join QCHelp</h2>
        <p className="auth-sub">Create your community account</p>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-wrap">
              <User size={16} className="i-left" />
              <input type="text" name="fullName" placeholder="Juan dela Cruz" value={form.fullName} onChange={e => set('fullName', e.target.value)} autoComplete="name" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-wrap">
              <Mail size={16} className="i-left" />
              <input type="email" name="email" placeholder="you@example.com" value={form.email} onChange={e => set('email', e.target.value)} autoComplete="email" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Contact Number</label>
            <div className="input-wrap">
              <Phone size={16} className="i-left" />
              <input type="tel" name="contactNumber" placeholder="+63 9XX XXX XXXX" value={form.contactNumber} onChange={e => set('contactNumber', e.target.value)} autoComplete="tel" />
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Barangay</label>
            <div className="input-wrap">
              <MapPin size={16} className="i-left" />
              <select name="barangay" value={form.barangay} onChange={e => set('barangay', e.target.value)}>
                <option value="">Select your barangay</option>
                {QC_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
              <span className="i-right" style={{ pointerEvents: 'none' }}><ChevronDown size={16} /></span>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="input-wrap">
              <Lock size={16} className="i-left" />
              <input type={showPwd ? 'text' : 'password'} name="password" placeholder="Create a password" value={form.password} onChange={e => set('password', e.target.value)} autoComplete="new-password" />
              <button type="button" className="i-right" onClick={() => setShowPwd(v => !v)}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <>
                <div className="strength-bar"><div className="strength-fill" style={{ width: `${strength.pct}%`, background: strength.color }} /></div>
                <span className="strength-label" style={{ color: strength.color }}>{strength.label}</span>
              </>
            )}
          </div>
          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="input-wrap">
              <Lock size={16} className="i-left" />
              <input type={showConfirm ? 'text' : 'password'} name="confirmPassword" placeholder="Repeat your password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} autoComplete="new-password" />
              <button type="button" className="i-right" onClick={() => setShowConfirm(v => !v)}>
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
          <label className="check-row" style={{ marginBottom: 20 }}>
            <input type="checkbox" name="agreeToTerms" checked={form.agreeToTerms} onChange={e => set('agreeToTerms', e.target.checked)} />
            I agree to the <button type="button" className="link-btn" style={{ marginLeft: 4 }}>Terms of Service</button>&nbsp;and&nbsp;<button type="button" className="link-btn">Privacy Policy</button>
          </label>
          <button type="submit" className="btn btn-primary btn-full">Create Account</button>
        </form>
        <p className="auth-footer">Already have an account? <button className="link-btn" onClick={() => navigate('/signin')}>Sign In</button></p>
      </div>
    </div>
  )
}
