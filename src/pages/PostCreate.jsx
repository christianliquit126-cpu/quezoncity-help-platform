import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CloudRain, HeartPulse, Car, Flame, Search, ShieldAlert, Info, MoreHorizontal, ImagePlus, MapPin, Navigation } from 'lucide-react'
import { QC_BARANGAYS } from '../constants/barangays'

const CATS = [
  { id: 'flood',   label: 'Flood',        Icon: CloudRain     },
  { id: 'medical', label: 'Medical',      Icon: HeartPulse    },
  { id: 'traffic', label: 'Traffic',      Icon: Car           },
  { id: 'fire',    label: 'Fire',         Icon: Flame         },
  { id: 'lost',    label: 'Lost & Found', Icon: Search        },
  { id: 'crime',   label: 'Crime',        Icon: ShieldAlert   },
  { id: 'info',    label: 'Info',         Icon: Info          },
  { id: 'other',   label: 'Other',        Icon: MoreHorizontal},
]

export default function PostCreate() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ postContent: '', category: 'flood', priority: 'urgent', barangay: 'Batasan Hills', location: '' })
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handlePublish = (e) => {
    e.preventDefault()
    navigate('/home')
  }

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">New Post</h2>
        <button className="btn btn-primary btn-sm" onClick={handlePublish}>Publish</button>
      </div>

      <div className="screen-body" style={{ padding: '0 16px 80px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '16px 0 14px' }}>
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>JC</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text)' }}>Juan dela Cruz</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 12, color: 'var(--text-3)' }}><MapPin size={11} /> Batasan Hills</div>
          </div>
        </div>

        <textarea
          className="post-textarea"
          rows={5}
          placeholder="What's happening in your barangay? Share an incident, ask for help, or post an update..."
          name="postContent"
          value={form.postContent}
          onChange={e => set('postContent', e.target.value)}
        />

        <div className="section-label">Category</div>
        <div className="cat-grid">
          {CATS.map(({ id, label, Icon }) => (
            <button
              key={id}
              className={`cat-btn ${id} ${form.category === id ? 'active' : ''}`}
              onClick={() => set('category', id)}
            >
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        <div className="section-label">Priority Level</div>
        <div className="priority-row">
          {['normal', 'urgent', 'critical'].map(p => (
            <button key={p} className={`priority-btn ${form.priority === p ? 'active' : ''}`} onClick={() => set('priority', p)}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>

        <div className="section-label">Barangay</div>
        <div className="input-wrap">
          <MapPin size={16} className="i-left" />
          <select name="barangay" value={form.barangay} onChange={e => set('barangay', e.target.value)}>
            {QC_BARANGAYS.map(b => <option key={b}>{b}</option>)}
          </select>
        </div>

        <div className="section-label">Add Media</div>
        <label className="upload-area">
          <ImagePlus size={28} />
          <span>Tap to add photos or videos</span>
          <input type="file" accept="image/*,video/*" multiple style={{ display: 'none' }} />
        </label>

        <div className="section-label">Location (Optional)</div>
        <div className="input-wrap">
          <Navigation size={16} className="i-left" />
          <input type="text" placeholder="Enter specific street or landmark" name="location" value={form.location} onChange={e => set('location', e.target.value)} />
        </div>
      </div>
    </div>
  )
}
