import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Heart, ThumbsUp, Share2, Bookmark, CheckCircle, Image, Send, Reply, Clock, Flag, CircleDot, Loader, MapPin, Star } from 'lucide-react'
import { ref, onValue, push, runTransaction, set, remove, update } from 'firebase/database'
import { db } from '../firebase'
import { useAuth } from '../contexts/AuthContext'
import { timeAgo, initials, avatarColor } from '../utils/format'

export default function PostDetail() {
  const navigate = useNavigate()
  const { id } = useParams()
  const { user, profile } = useAuth()
  const [post, setPost] = useState(null)
  const [comments, setComments] = useState([])
  const [liked, setLiked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  useEffect(() => {
    const unsub = onValue(ref(db, `posts/${id}`), snap => {
      if (snap.exists()) {
        setPost({ id: snap.key, ...snap.val() })
        setLiked(snap.val().likes?.[user?.uid] === true)
        setSaved(snap.val().savedBy?.[user?.uid] === true)
      }
      setLoading(false)
    })
    return unsub
  }, [id, user?.uid])

  useEffect(() => {
    const unsub = onValue(ref(db, `posts/${id}/comments`), snap => {
      if (snap.exists()) {
        const list = []
        snap.forEach(child => list.push({ id: child.key, ...child.val() }))
        list.sort((a, b) => a.createdAt - b.createdAt)
        setComments(list)
      } else {
        setComments([])
      }
    })
    return unsub
  }, [id])

  const toggleLike = async () => {
    if (!user) return
    const likeRef = ref(db, `posts/${id}/likes/${user.uid}`)
    const countRef = ref(db, `posts/${id}/likeCount`)
    if (liked) {
      await remove(likeRef)
      await runTransaction(countRef, c => Math.max(0, (c || 1) - 1))
    } else {
      await set(likeRef, true)
      await runTransaction(countRef, c => (c || 0) + 1)
    }
    setLiked(l => !l)
  }

  const toggleSave = async () => {
    if (!user) return
    const saveRef = ref(db, `posts/${id}/savedBy/${user.uid}`)
    if (saved) {
      await remove(saveRef)
    } else {
      await set(saveRef, true)
    }
    setSaved(s => !s)
  }

  const sendComment = async () => {
    if (!comment.trim() || !user || sending) return
    setSending(true)
    const commentData = {
      authorId: user.uid,
      authorName: profile?.displayName || user.displayName || 'Anonymous',
      text: comment.trim(),
      likeCount: 0,
      createdAt: Date.now(),
      role: profile?.role || 'resident',
    }
    await push(ref(db, `posts/${id}/comments`), commentData)
    await runTransaction(ref(db, `posts/${id}/commentCount`), c => (c || 0) + 1)
    setComment('')
    setSending(false)
  }

  const toggleResolve = async () => {
    if (!post) return
    const newStatus = post.status === 'resolved' ? 'open' : 'resolved'
    await update(ref(db, `posts/${id}`), { status: newStatus, updatedAt: Date.now() })
  }

  if (loading) {
    return (
      <div className="shell">
        <div className="inner-nav">
          <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <h2 className="inner-title">Post Detail</h2>
          <div style={{ width: 36 }} />
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}><Loader size={32} className="spin" /><p>Loading post…</p></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="shell">
        <div className="inner-nav">
          <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
          <h2 className="inner-title">Post Detail</h2>
          <div style={{ width: 36 }} />
        </div>
        <div className="empty-state" style={{ paddingTop: 80 }}><Flag size={36} /><p>Post not found.</p></div>
      </div>
    )
  }

  const av = avatarColor(post.authorId)
  const userAv = avatarColor(user?.uid)
  const isOwnerOrAdmin = user?.uid === post.authorId || profile?.role === 'admin'

  return (
    <div className="shell">
      <div className="inner-nav">
        <button className="back-btn" onClick={() => navigate('/home')}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg></button>
        <h2 className="inner-title">Post Detail</h2>
        <div style={{ width: 36 }} />
      </div>

      <div className="screen-body" style={{ paddingBottom: 24 }}>
        <div className="detail-header">
          <div style={{ width: 48, height: 48, borderRadius: '50%', background: av.bg, color: av.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
            {initials(post.authorName)}
          </div>
          <div className="post-meta" style={{ flex: 1 }}>
            <span className="post-author">{post.authorName}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2, flexWrap: 'wrap' }}>
              {post.barangay && <div className="post-loc"><MapPin size={11} />{post.barangay}</div>}
              <div className="post-loc"><Clock size={11} />{timeAgo(post.createdAt)}</div>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 16px 12px' }}>
          <div className="post-tags">
            {post.category && <span className={`tag ${post.category}`}>{post.category === 'lost' ? 'Lost & Found' : post.category}</span>}
            {post.priority === 'urgent' && <span className="tag urgent">Urgent</span>}
            {post.priority === 'critical' && <span className="tag" style={{ background: '#FEE2E2', color: '#991B1B' }}>Critical</span>}
            {post.status === 'resolved' && <span className="tag resolved">Resolved</span>}
          </div>
        </div>

        <p className="detail-text">{post.content}</p>

        {post.location && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0 16px 14px', fontSize: 13, color: 'var(--text-3)' }}>
            <MapPin size={13} /><span>{post.location}</span>
          </div>
        )}

        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <div style={{ padding: '0 16px 14px', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {post.mediaUrls.map((url, i) => (
              <img key={i} src={url} alt={`Media ${i + 1}`} style={{ width: 'calc(50% - 4px)', borderRadius: 10, objectFit: 'cover', maxHeight: 180 }} />
            ))}
          </div>
        )}

        {isOwnerOrAdmin && (
          <div className="resolve-bar">
            <div className="status-info">
              <CircleDot size={14} />
              <span>Status: <strong>{post.status === 'resolved' ? 'Resolved' : post.status === 'in_progress' ? 'In Progress' : 'Open'}</strong></span>
            </div>
            <button className={`btn btn-sm ${post.status === 'resolved' ? 'btn-outline' : 'btn-green'}`} onClick={toggleResolve}>
              {post.status === 'resolved' ? <><CircleDot size={13} /> Re-open</> : <><CheckCircle size={13} /> Mark Resolved</>}
            </button>
          </div>
        )}

        <div className="reaction-bar">
          <button className={`post-action ${liked ? 'liked' : ''}`} onClick={toggleLike}>
            <Heart size={14} /> {post.likeCount || 0}
          </button>
          <button className="post-action" onClick={e => e.stopPropagation()}>
            <Share2 size={14} /> Share
          </button>
          <button className={`post-action ${saved ? 'saved' : ''}`} style={{ marginLeft: 'auto' }} onClick={toggleSave}>
            <Bookmark size={14} />
          </button>
          <button className="post-action" style={{ color: 'var(--text-3)' }}>
            <Flag size={14} /> Report
          </button>
        </div>

        <div className="comments-section">
          <h4 className="comments-title">Comments <span>({comments.length})</span></h4>

          <div className="comment-input-row">
            <div style={{ width: 30, height: 30, borderRadius: '50%', background: userAv.bg, color: userAv.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
              {initials(profile?.displayName || user?.displayName || '?')}
            </div>
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="text"
                placeholder="Write a comment…"
                value={comment}
                onChange={e => setComment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendComment()}
                style={{ flex: 1, padding: '10px 14px', border: '1.5px solid var(--border)', borderRadius: 99, fontSize: 13, fontFamily: 'inherit', background: 'var(--bg)', outline: 'none' }}
              />
              <button className="send-btn" onClick={sendComment} disabled={sending}>
                {sending ? <Loader size={13} className="spin" /> : <Send size={15} />}
              </button>
            </div>
          </div>

          {comments.length === 0 && (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-3)', fontSize: 13 }}>No comments yet. Be the first to respond.</div>
          )}

          {comments.map(c => {
            const cav = avatarColor(c.authorId)
            return (
              <div key={c.id} className="comment">
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: cav.bg, color: cav.text, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 11, flexShrink: 0 }}>
                  {initials(c.authorName)}
                </div>
                <div className="comment-body">
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span className="comment-author">{c.authorName}</span>
                    {(c.role === 'admin' || c.role === 'superadmin') && (
                      <span style={{ background: '#DBEAFE', color: '#1D4ED8', fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 99 }}>Official</span>
                    )}
                  </div>
                  <p className="comment-text">{c.text}</p>
                  <div className="comment-actions">
                    <span className="comment-time">{timeAgo(c.createdAt)}</span>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
