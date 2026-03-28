import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MapPin, Heart, MessageCircle, Share2, Bookmark, Clock } from 'lucide-react'
import { ref, runTransaction, set, remove } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo, initials, avatarColor } from '../utils/format'

export default function PostCard({ post }) {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [liked, setLiked] = useState(post.likes?.[user?.uid] === true)
  const [likeCount, setLikeCount] = useState(post.likeCount || 0)

  const av = avatarColor(post.authorId)

  const toggleLike = async (e) => {
    e.stopPropagation()
    if (!user) return
    const likeRef = ref(db, `posts/${post.id}/likes/${user.uid}`)
    const countRef = ref(db, `posts/${post.id}/likeCount`)
    if (liked) {
      await remove(likeRef)
      await runTransaction(countRef, c => Math.max(0, (c || 1) - 1))
      setLikeCount(n => Math.max(0, n - 1))
    } else {
      await set(likeRef, true)
      await runTransaction(countRef, c => (c || 0) + 1)
      setLikeCount(n => n + 1)
    }
    setLiked(l => !l)
  }

  return (
    <div className="post-card" onClick={() => navigate(`/post/${post.id}`)}>
      <div className="post-header">
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: av.bg, color: av.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>
          {initials(post.authorName)}
        </div>
        <div className="post-meta">
          <span className="post-author">{post.authorName || 'Unknown'}</span>
          <div className="post-loc-row">
            {post.barangay && <div className="post-loc"><MapPin size={11} />{post.barangay}</div>}
            <div className="post-loc"><Clock size={11} />{timeAgo(post.createdAt)}</div>
          </div>
        </div>
        {post.priority === 'urgent' && <div className="priority-dot urgent" />}
        {post.priority === 'critical' && <div className="priority-dot critical" />}
      </div>

      <div className="post-tags">
        {post.category && <span className={`tag ${post.category}`}>{post.category === 'lost' ? 'Lost & Found' : post.category}</span>}
        {post.priority === 'urgent' && <span className="tag urgent">Urgent</span>}
        {post.status === 'resolved' && <span className="tag resolved">Resolved</span>}
      </div>

      <p className="post-text" style={{ WebkitLineClamp: 3, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
        {post.content}
      </p>

      <div className="post-footer">
        <button className={`post-action ${liked ? 'liked' : ''}`} onClick={toggleLike}>
          <Heart size={14} /> {likeCount}
        </button>
        <button className="post-action" onClick={e => { e.stopPropagation(); navigate(`/post/${post.id}`) }}>
          <MessageCircle size={14} /> {post.commentCount || 0}
        </button>
        <button className="post-action" onClick={e => e.stopPropagation()}>
          <Share2 size={14} /> Share
        </button>
      </div>
    </div>
  )
}
