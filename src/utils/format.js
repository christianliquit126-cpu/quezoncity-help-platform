export function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - ts
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'Yesterday'
  if (d < 7) return `${d}d ago`
  return new Date(ts).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })
}

export function initials(name) {
  if (!name) return '??'
  const parts = name.trim().split(' ')
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function avatarColor(uid) {
  const COLORS = [
    { bg: '#DBEAFE', text: '#1D4ED8' },
    { bg: '#FCE7F3', text: '#9D174D' },
    { bg: '#EDE9FE', text: '#5B21B6' },
    { bg: '#ECFDF5', text: '#065F46' },
    { bg: '#FEF3C7', text: '#92400E' },
    { bg: '#FEE2E2', text: '#991B1B' },
    { bg: '#F0FDF4', text: '#059669' },
  ]
  let hash = 0
  for (let i = 0; i < (uid || '').length; i++) hash = uid.charCodeAt(i) + ((hash << 5) - hash)
  return COLORS[Math.abs(hash) % COLORS.length]
}
