import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getDatabase } from 'firebase/database'
import { getStorage } from 'firebase/storage'
import { getMessaging } from 'firebase/messaging'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || '',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || '',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || '',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || '',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || '',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || '',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getDatabase(app)
export const storage = getStorage(app)

export let messaging = null
if (typeof window !== 'undefined' && 'Notification' in window) {
  try { messaging = getMessaging(app) } catch (_) {}
}

export default app

/*
  FIREBASE REALTIME DATABASE STRUCTURE
  ─────────────────────────────────────
  /users/{uid}
    displayName: string
    email: string
    contactNumber: string (optional, format: +639XXXXXXXXX)
    barangay: string  (from QC_BARANGAYS list)
    role: "resident" | "admin" | "superadmin"
    verified: boolean
    joinedAt: timestamp (number)
    reputation: number
    postCount: number
    helpedCount: number
    savedPosts: { [postId]: boolean }
    signInMethod: "email" | "google" | "facebook"
    photoURL: string (optional, Firebase Storage URL)
    fcmToken: string (for Cloud Messaging push)

  /posts/{postId}
    authorId: string (uid ref)
    authorName: string
    authorBarangay: string
    content: string
    category: "flood"|"medical"|"traffic"|"fire"|"lost"|"crime"|"info"|"other"
    priority: "normal"|"urgent"|"critical"
    barangay: string
    location: string (optional, specific street/landmark)
    status: "open"|"resolved"|"in_progress"
    mediaUrls: string[] (Firebase Storage URLs)
    likeCount: number
    commentCount: number
    createdAt: timestamp
    updatedAt: timestamp
    resolvedAt: timestamp (optional)

  /posts/{postId}/likes/{uid}: boolean

  /posts/{postId}/comments/{commentId}
    authorId: string
    authorName: string
    text: string
    likeCount: number
    createdAt: timestamp
    parentId: string (optional, for nested replies)

  /chats/{chatId}
    participants: { [uid]: boolean }
    lastMessage: string
    lastMessageAt: timestamp
    type: "direct" | "group"
    name: string (optional, for group chats)
    isAdminChat: boolean

  /chats/{chatId}/messages/{messageId}
    senderId: string
    text: string
    mediaUrl: string (optional)
    sentAt: timestamp
    readBy: { [uid]: boolean }

  /activity/{uid}/{activityId}
    type: "like"|"comment"|"follow"|"resolve"|"mention"|"system"
    actorId: string
    actorName: string
    postId: string (optional)
    text: string
    createdAt: timestamp
    read: boolean

  /alerts/{alertId}
    title: string
    message: string
    targetBarangay: string | "all"
    createdBy: string (uid)
    createdAt: timestamp
    expiresAt: timestamp
    category: "weather"|"emergency"|"info"|"health"
    sentViaPush: boolean

  /resources/{resourceId}
    name: string
    type: "evacuation"|"medical"|"food"|"shelter"
    barangay: string
    address: string
    contactNumber: string
    available: boolean
    updatedAt: timestamp
*/
