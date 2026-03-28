import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  MapPin, Star, Heart, ThumbsUp, Share2, Bookmark,
  CheckCircle, Image, Send, Reply, Clock, Flag,
  ChevronRight, CircleDot
} from 'lucide-react'

const COMMENTS = [
  {
    id: 1, author: 'Pedro Lim', av: 'PL', avBg: '#ECFDF5', avColor: '#065F46',
    text: "I'm a volunteer from QC Rescue Team Batasan. We're heading there now with 2 boats. ETA 20 minutes. Please keep all residents elevated.",
    likes: 12, time: '3m ago', role: null
  },
  {
    id: 2, author: 'Rosa Bautista', av: 'RB', avBg: '#EDE9FE', avColor: '#5B21B6',
    text: 'I have extra life vests. Come pick them up at the evacuation center near Batasan Hills National High School. I can accommodate 5 families.',
    likes: 7, time: '8m ago', role: null
  },
  {
    id: 3, author: 'QCDRRMO Official', av: 'QD', avBg: '#DBEAFE', avColor: '#1D4ED8',
    text: 'Barangay hotline: 8988-8000. QCDRRMO: 8924-0655. Evacuation center at Batasan Hills Elementary School is now open. Relief packs available.',
    likes: 19, time: '11m ago', role: 'admin'
  },
]

const RELATED = [
  { id: 'rp1', cat: 'flood', title: 'Flooding reported at Pasong Tamo Creek', loc: 'Pasong Tamo', time: '4h ago' },
  { id: 'rp2', cat: 'flood', title: 'Commonwealth Ave drainage overflow update', loc: 'Commonwealth', time: '1h ago' },
]

export default function PostDetail() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(24)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(COMMENTS)
  const [resolved, setResolved] = useState(false)

  const sendComment = () => {
    if (!comment.trim()) return
    setComments(c => [...c, {
      id: Date.now(), author: 'Juan dela Cruz', av: 'JC',
      avBg: '#DBEAFE', avColor: '#1D4ED8',
      text: comment, likes: 0, time: 'just now', role: null
    }])
    setComment('')
  }

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
        </button>
        <h2 className="inner-title">Post Detail</h2>
        <button className="icon-btn">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>
        </button>
      </div>

      <div className="screen-body" style={{ paddingBottom: 24 }}>
        <div className="detail-header">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#FCE7F3', color: '#9D174D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>MS</div>
          <div className="post-meta" style={{ flex: 1 }}>
            <span className="post-author">Maria Santos</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
              <span className="rep-badge"><Star size={11} /> 142 pts</span>
              <div className="post-loc"><MapPin size={11} /> Batasan Hills</div>
              <div className="post-loc"><Clock size={11} /> 5m ago</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <div className="post-tags">
            <span className="tag flood">Flood</span>
            <span className="tag urgent">Urgent</span>
          </div>
        </div>

        <p className="detail-text">
          Floodwater is rising rapidly along Batasan Road near the creek. Several families need immediate evacuation assistance. Water level is already at knee height as of 2:30 PM. The area near the bridge is impassable. Quezon City Bureau of Fire Protection (BFP) has been notified but residents are asking for more volunteers and boats. Three families are stranded with elderly members and a newborn.
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px 14px', fontSize: 13, color: 'var(--text-3)' }}>
          <MapPin size={13} /> <span>Batasan Road cor. Creek Road, Batasan Hills</span>
        </div>

        <div className="media-placeholder">
          <Image size={32} />
          <span>2 photos attached · Firebase Storage</span>
          <span style={{ fontSize: 11 }}>Field: posts/post_001/mediaUrls[ ]</span>
        </div>

        <div className="resolve-bar">
          <div className="status-info">
            <CircleDot size={14} />
            <span>Status: <strong>{resolved ? 'Resolved' : 'Open'}</strong></span>
          </div>
          <button className={`btn btn-sm ${resolved ? 'btn-outline' : 'btn-green'}`} onClick={() => setResolved(r => !r)}>
            {resolved ? <><CircleDot size={13} /> Re-open</> : <><CheckCircle size={13} /> Mark Resolved</>}
          </button>
        </div>

        <div className="reaction-bar">
          <button className={`post-action ${liked ? 'liked' : ''}`} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1) }}>
            <Heart size={14} /> {likes}
          </button>
          <button className="post-action"><ThumbsUp size={14} /> 18</button>
          <button className="post-action"><Share2 size={14} /> Share</button>
          <button className={`post-action ${saved ? 'saved' : ''}`} style={{ marginLeft: 'auto' }} onClick={() => setSaved(s => !s)}>
            <Bookmark size={14} />
          </button>
          <button className="post-action" style={{ color: 'var(--text-3)' }}>
            <Flag size={14} /> Report
          </button>
        </div>

        <div className="comments-section">
          <h4 className="comments-title">Comments <span>({comments.length})</span></h4>
          <div className="comment-input-row">
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>JC</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="text"
                placeholder="Write a comment..."
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendComment()}
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 99, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
              />
              <button className="send-btn" onClick={sendComment}><Send size={15} /></button>
            </div>
          </div>

          {comments.map(c => (
            <div key={c.id} className="comment">
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: c.avBg, color: c.avColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{c.av}</div>
              <div className="comment-body">
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span className="comment-author">{c.author}</span>
                  {c.role === 'admin' && (
                    <span style={{ background: '#DBEAFE', color: '#1D4ED8', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>Official</span>
                  )}
                </div>
                <p className="comment-text">{c.text}</p>
                <div className="comment-actions">
                  <button className="comment-action"><Heart size={12} /> {c.likes}</button>
                  <button className="comment-action"><Reply size={12} /> Reply</button>
                  <span className="comment-time">{c.time}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ padding: '0 16px 16px' }}>
          <div className="profile-section-title" style={{ marginBottom: 10 }}>Related Posts</div>
          {RELATED.map(r => (
            <div key={r.id} className="related-post-item" onClick={() => navigate(`/post/${r.id}`)}>
              <span className={`legend-dot ${r.cat}`} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)' }}>{r.title}</div>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 2, display: 'flex', gap: 6 }}>
                  <span><MapPin size={10} /> {r.loc}</span>
                  <span><Clock size={10} /> {r.time}</span>
                </div>
              </div>
              <ChevronRight size={15} color="var(--text-3)" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
