import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Heart, MessageCircle, Share2 } from 'lucide-react'

function Avatar({ seed, bg, textColor, size = 38 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: '50%',
      background: bg, color: textColor,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 700, fontSize: size * 0.38, flexShrink: 0,
    }}>
      {seed}
    </div>
  )
}

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(post.likes)

  const handleLike = (e) => {
    e.stopPropagation()
    setLiked(l => !l)
    setLikeCount(c => liked ? c - 1 : c + 1)
  }

  return (
    <div className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="post-header">
        <Avatar seed={post.avatar} bg={post.avatarColor} textColor={post.avatarText} />
        <div className="post-meta">
          <span className="post-author">{post.author}</span>
          <div className="post-loc"><MapPin size={11} /> {post.barangay}</div>
        </div>
        <span className="post-time">{post.time}</span>
      </div>

      <div className="post-tags">
        {post.tags.map(t => <span key={t} className={`tag ${t}`}>{t === 'lost' ? 'Lost & Found' : t.charAt(0).toUpperCase() + t.slice(1)}</span>)}
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
        <span className={`status-badge ${post.status}`}>
          {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
        </span>
      </div>
    </div>
  )
}
