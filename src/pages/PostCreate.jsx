import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloudRain, HeartPulse, Car, Flame, Search, ShieldAlert, Info, MoreHorizontal, ImagePlus, MapPin, Navigation, Loader } from 'lucide-react'
import { ref, push, update, serverTimestamp } from 'firebase/database'
import { ref as storageRef, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { QC_BARANGAYS } from '../constants/barangays'

const CATEGORIES = [
  { id: 'flood',   label: 'Flood',        Icon: CloudRain,   cls: 'flood' },
  { id: 'medical', label: 'Medical',      Icon: HeartPulse,  cls: 'medical' },
  { id: 'traffic', label: 'Traffic',      Icon: Car,         cls: 'traffic' },
  { id: 'fire',    label: 'Fire',         Icon: Flame,       cls: 'fire' },
  { id: 'lost',    label: 'Lost & Found', Icon: Search,      cls: 'lost' },
  { id: 'crime',   label: 'Crime',        Icon: ShieldAlert, cls: 'crime' },
  { id: 'info',    label: 'Info',         Icon: Info,        cls: 'info' },
  { id: 'other',   label: 'Other',        Icon: MoreHorizontal, cls: 'other' },
]

export default function PostCreate() {
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const [category, setCategory] = useState('')
  const [priority, setPriority] = useState('normal')
  const [barangay, setBarangay] = useState(profile?.barangay || '')
  const [location, setLocation] = useState('')
  const [content, setContent] = useState('')
  const [files, setFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!category) { setError('Please select a category.'); return }
    if (!content.trim()) { setError('Please write a description.'); return }
    if (!barangay) { setError('Please select your barangay.'); return }
    setError('')
    setLoading(true)
    try {
      const mediaUrls = []
      for (const file of files) {
        const sRef = storageRef(storage, `posts/${user.uid}/${Date.now()}_${file.name}`)
        const snap = await uploadBytes(sRef, file)
        const url = await getDownloadURL(snap.ref)
        mediaUrls.push(url)
      }

      const postData = {
        authorId: user.uid,
        authorName: profile?.displayName || user.displayName || 'Anonymous',
        authorBarangay: barangay,
        content: content.trim(),
        category,
        priority,
        barangay,
        location: location.trim(),
        status: 'open',
        mediaUrls,
        likeCount: 0,
        commentCount: 0,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }

      const newRef = await push(ref(db, 'posts'), postData)
      await update(ref(db, `users/${user.uid}`), { postCount: (profile?.postCount || 0) + 1 })
      navigate(`/post/${newRef.key}`)
    } catch (err) {
      console.error(err)
      setError('Failed to create post. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="inner-title">New Post</h2>
        <button type="button" className="btn btn-primary btn-sm" onClick={handleSubmit} disabled={loading}>
          {loading ? <Loader size={14} className="spin" /> : 'Post'}
        </button>
      </div>

      <div className="screen-body">
        <form onSubmit={handleSubmit} style={{ padding: '16px 16px 80px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {error && <div className="error-banner">{error}</div>}

          <div>
            <div className="section-label">Category <span style={{ color: 'var(--red)' }}>*</span></div>
            <div className="cat-grid">
              {CATEGORIES.map(c => {
                const Icon = c.Icon
                return (
                  <button key={c.id} type="button" className={`cat-btn ${c.cls} ${category === c.id ? 'active' : ''}`} onClick={() => setCategory(c.id)}>
                    <Icon size={14} />{c.label}
                  </button>
                )
              })}
            </div>
          </div>

          <div>
            <div className="section-label">Priority</div>
            <div className="priority-row">
              {['normal', 'urgent', 'critical'].map(p => (
                <button key={p} type="button" className={`priority-btn ${priority === p ? 'active' : ''}`} onClick={() => setPriority(p)}>
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div className="section-label">Description <span style={{ color: 'var(--red)' }}>*</span></div>
            <textarea
              className="post-textarea"
              rows={5}
              placeholder="Describe the situation clearly — what happened, where exactly, who is affected, and what help is needed..."
              value={content}
              onChange={e => setContent(e.target.value)}
              required
            />
            <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4, textAlign: 'right' }}>{content.length} characters</div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="section-label">Barangay <span style={{ color: 'var(--red)' }}>*</span></div>
            <div className="input-wrap">
              <MapPin size={16} className="i-left" />
              <select value={barangay} onChange={e => setBarangay(e.target.value)} required>
                <option value="">Select barangay</option>
                {QC_BARANGAYS.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: 0 }}>
            <div className="section-label">Specific Location (optional)</div>
            <div className="input-wrap">
              <Navigation size={16} className="i-left" />
              <input type="text" placeholder="e.g. near Batasan Road cor. Creek Road" value={location} onChange={e => setLocation(e.target.value)} />
            </div>
          </div>

          <div>
            <div className="section-label">Photos (optional)</div>
            <label className="upload-area">
              <ImagePlus size={28} />
              <span>{files.length > 0 ? `${files.length} photo(s) selected` : 'Tap to upload photos'}</span>
              <span style={{ fontSize: 11 }}>Stored in Firebase Storage · posts/{user?.uid}/</span>
              <input type="file" accept="image/*" multiple style={{ display: 'none' }} onChange={e => setFiles(Array.from(e.target.files))} />
            </label>
          </div>

          <div style={{ background: '#EFF6FF', borderRadius: 10, padding: '10px 14px', fontSize: 12, color: '#1D4ED8' }}>
            Firebase path: <code>posts/{'{auto-id}'}</code> · Fields: authorId, content, category, barangay, priority, status, mediaUrls, createdAt
          </div>
        </form>
      </div>
    </div>
  )
}
