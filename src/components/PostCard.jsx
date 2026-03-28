import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Heart, MessageCircle, Share2, Bookmark, Clock } from 'lucide-react'

export function Avatar({ seed, bg, textColor, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: textColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.36, flexShrink: 0,
    }}>
      {seed}
    </div>
  )
}

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)
  const [saved, setSaved] = useState(false)

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  const handleSave = (e) => {
    e.stopPropagation()
    setSaved(s => !s)
  }

  const CAT_LABELS = {
    flood: 'Flood', medical: 'Medical', traffic: 'Traffic',
    fire: 'Fire', lost: 'Lost & Found', crime: 'Crime',
    info: 'Info', other: 'Other',
  }

  return (
    <div className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="post-header">
        <Avatar seed={post.avatar} bg={post.avatarColor} textColor={post.avatarText} />
        <div className="post-meta">
          <span className="post-author">{post.author}</span>
          <div className="post-loc-row">
            <div className="post-loc"><MapPin size={11} /> {post.barangay}</div>
            <div className="post-loc" style={{ marginLeft: 8 }}><Clock size={11} /> {post.time}</div>
          </div>
        </div>
        {post.priority === 'urgent' && (
          <span className="priority-dot urgent" title="Urgent" />
        )}
        {post.priority === 'critical' && (
          <span className="priority-dot critical" title="Critical" />
        )}
      </div>

      <div className="post-tags">
        {post.tags.map(t => (
          <span key={t} className={`tag ${t}`}>
            {CAT_LABELS[t] || t.charAt(0).toUpperCase() + t.slice(1)}
          </span>
        ))}
        {post.status === 'resolved' && <span className="tag resolved">Resolved</span>}
        {post.status === 'in_progress' && <span className="tag traffic">In Progress</span>}
      </div>

      <p className="post-text">{post.text}</p>

      <div className="post-footer">
        <button className={`post-action ${liked ? 'liked' : ''}`} onClick={handleLike}>
          <Heart size={14} /> {likeCount}
        </button>
        <button className="post-action" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`) }}>
          <MessageCircle size={14} /> {post.comments}
        </button>
        <button className="post-action" onClick={e => e.stopPropagation()}>
          <Share2 size={14} /> Share
        </button>
        <button className={`post-action ${saved ? 'saved' : ''}`} onClick={handleSave} style={{ marginLeft: 'auto' }}>
          <Bookmark size={14} />
        </button>
      </div>
    </div>
  )
}
