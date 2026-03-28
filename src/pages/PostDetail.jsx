import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Star, Heart, ThumbsUp, Share2, Bookmark, CircleDot, Image, Send, Reply } from 'lucide-react'

const COMMENTS = [
  { id: 1, author: 'Pedro Lim', av: 'PL', avBg: '#ECFDF5', avColor: '#065F46', text: "I'm a volunteer from QC Rescue. We're heading there now with 2 boats. ETA 20 minutes.", likes: 12, time: '3m ago' },
  { id: 2, author: 'Rosa Bautista', av: 'RB', avBg: '#EDE9FE', avColor: '#5B21B6', text: 'I have extra life vests. Come pick them up at the evacuation center near Batasan Hills National High School.', likes: 7, time: '8m ago' },
  { id: 3, author: 'Noel Garcia', av: 'NG', avBg: '#FFF7ED', avColor: '#9A3412', text: 'Barangay hotline is 8988-8000. Contact QCDRRMO at 8924-0655 for official evacuation coordination.', likes: 19, time: '11m ago' },
]

export default function PostDetail() {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likes, setLikes] = useState(24)
  const [comment, setComment] = useState('')
  const [comments, setComments] = useState(COMMENTS)
  const [resolved, setResolved] = useState(false)

  const sendComment = () => {
    if (!comment.trim()) return
    setComments(c => [...c, { id: Date.now(), author: 'Juan dela Cruz', av: 'JC', avBg: '#DBEAFE', avColor: '#1D4ED8', text: comment, likes: 0, time: 'just now' }])
    setComment('')
  }

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Post Detail</h2>
        <button className="icon-btn"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg></button>
      </div>

      <div className="screen-body" style={{ paddingBottom: 24 }}>
        <div className="detail-header">
          <div style={{ width: 46, height: 46, borderRadius: '50%', background: '#FCE7F3', color: '#9D174D', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>MS</div>
          <div className="post-meta" style={{ flex: 1 }}>
            <span className="post-author">Maria Santos</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
              <span className="rep-badge"><Star size={11} /> 142 rep</span>
              <div className="post-loc"><MapPin size={11} /> Batasan Hills</div>
            </div>
          </div>
          <span className="post-time">5m ago</span>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <div className="post-tags">
            <span className="tag flood">Flood</span>
            <span className="tag urgent">Urgent</span>
          </div>
        </div>

        <p className="detail-text">
          Floodwater is rising rapidly along Batasan Road near the creek. Several families need immediate evacuation assistance. Water level is already at knee height as of 2:30PM. The area near the bridge is impassable. BFP has been notified but residents are asking for more volunteers and boats.
        </p>

        <div className="media-placeholder">
          <Image size={32} />
          <span>2 photos attached</span>
        </div>

        <div className="resolve-bar">
          <div className="status-info">
            <CircleDot size={14} />
            <span>Status: <strong>{resolved ? 'Resolved' : 'Open'}</strong></span>
          </div>
          <button className={`btn btn-sm ${resolved ? 'btn-outline' : 'btn-green'}`} onClick={() => setResolved(r => !r)}>
            {resolved ? 'Re-open' : 'Mark Resolved'}
          </button>
        </div>

        <div className="reaction-bar">
          <button className={`post-action ${liked ? 'liked' : ''}`} onClick={() => { setLiked(l => !l); setLikes(n => liked ? n - 1 : n + 1) }}>
            <Heart size={14} /> {likes}
          </button>
          <button className="post-action"><ThumbsUp size={14} /> 18</button>
          <button className="post-action"><Share2 size={14} /> Share</button>
          <button className="post-action"><Bookmark size={14} /> Save</button>
        </div>

        <div className="comments-section">
          <h4 className="comments-title">Comments <span>({comments.length})</span></h4>
          <div className="comment-input-row">
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#DBEAFE', color: '#1D4ED8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>JC</div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <input type="text" placeholder="Write a comment..." value={comment} onChange={e => setComment(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendComment()} style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 99, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }} />
              <button className="send-btn" onClick={sendComment}><Send size={15} /></button>
            </div>
          </div>
          {comments.map(c => (
            <div key={c.id} className="comment">
              <div style={{ width: 30, height: 30, borderRadius: '50%', background: c.avBg, color: c.avColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>{c.av}</div>
              <div className="comment-body">
                <span className="comment-author">{c.author}</span>
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
      </div>
    </div>
  )
}
