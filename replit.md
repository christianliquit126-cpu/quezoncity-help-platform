# QCHelp — Quezon City Community Platform

## Overview
A Vite + React community support platform for Quezon City residents. Covers emergency alerts, incident reporting, community feed, live map, messaging, activity feed, user profiles, and admin/dashboard tools. Fully wired to Firebase Realtime Database and Firebase Auth — all mock/fake data removed.

## Tech Stack
- **Frontend**: React 18 + Vite + React Router v6
- **Backend/DB**: Firebase Realtime Database (Asia Southeast 1)
- **Auth**: Firebase Authentication (email/password, Google, Facebook)
- **Storage**: Firebase Storage (for post media uploads)
- **Icons**: lucide-react (line-style only — NO emojis anywhere)
- **Fonts**: Inter (Google Fonts)

## Firebase Project
- Project ID: `qc-help-support`
- Database URL: `qc-help-support-default-rtdb.asia-southeast1.firebasedatabase.app`
- Region: Asia Southeast 1
- Credentials stored as Replit shared environment variables (VITE_FIREBASE_*)

## Key Files
```
src/
  firebase.js             — Firebase app init (auth, db, storage, messaging)
  contexts/
    AuthContext.jsx       — Firebase Auth state, signIn/signUp/social/reset/signOut
  utils/
    format.js             — timeAgo(), initials(), avatarColor()
  constants/
    barangays.js          — QC_BARANGAYS list + CATEGORIES (static data only, no mock posts)
  pages/
    WelcomePage.jsx       — Landing page (public)
    SignIn.jsx            — Firebase email + Google + Facebook sign-in
    SignUp.jsx            — Firebase sign-up → writes /users/{uid}
    ResetPassword.jsx     — Firebase sendPasswordResetEmail
    Home.jsx              — Real-time posts (onValue /posts) + alerts carousel (/alerts)
    PostCreate.jsx        — push to /posts, upload to Storage
    PostDetail.jsx        — onValue /posts/{id}, comments, like/save via runTransaction
    ChatList.jsx          — onValue /chats filtered by participant uid
    ChatUI.jsx            — onValue /chats/{id}/messages, push messages
    ActivityPage.jsx      — onValue /activity/{uid}, mark read
    ProfilePage.jsx       — Reads /users/{uid} profile, sign-out
    AdminPanel.jsx        — Manages /posts, /users, /alerts; 4 tabs
    MainDashboard.jsx     — Desktop dashboard with live stats from Firebase
    MapPage.jsx           — OpenStreetMap iframe (static incidents for now)
  components/
    PostCard.jsx          — Like toggle via runTransaction, click → PostDetail
    BottomNav.jsx         — 5-item nav with FAB for PostCreate
    SideMenu.jsx          — Slide-in drawer with full navigation + sign-out
```

## Firebase DB Structure
```
/users/{uid}            — displayName, email, barangay, role, verified, joinedAt, reputation, postCount, helpedCount
/posts/{postId}         — authorId, content, category, barangay, priority, status, mediaUrls, likeCount, commentCount, createdAt
/posts/{postId}/likes/{uid}      — boolean
/posts/{postId}/comments/{id}    — authorId, authorName, text, createdAt, role
/chats/{chatId}         — participants, lastMessage, lastMessageAt, isAdminChat
/chats/{chatId}/messages/{id}    — senderId, senderName, text, sentAt, readBy
/activity/{uid}/{id}    — type, text, postId, createdAt, read
/alerts/{alertId}       — title, message, targetBarangay, category, expiresAt, createdAt
```

## Design System
- Background: cream `#F1F5F9` + pastel gradient body
- Surface: `#FFFFFF`
- Primary: `#2563EB` (blue)
- Border radius: `--radius: 16px`
- Mobile shell max-width: 430px
- Desktop sidebar: 240px sticky (collapsible)
- NO emojis — lucide-react line icons only
- `.spin` keyframe class for loading spinners (`<Loader className="spin" />`)
- `.error-banner` for auth error messages
- `.spinner` for full-page loading (used in AuthContext)

## Auth Flow
1. Unauthenticated users land on WelcomePage (`/`)
2. SignIn/SignUp/ResetPassword at `/signin`, `/signup`, `/reset` — all PublicRoutes (redirect to /home if already signed in)
3. All other routes (`/home`, `/post/*`, `/chat/*`, `/activity`, `/profile`, `/admin`, `/dashboard`) are PrivateRoutes — redirect to `/signin` if unauthenticated
4. AuthContext shows a full-page spinner while Firebase resolves auth state

## Roles
- `resident` — default for new sign-ups
- `admin` / `superadmin` — sees Admin Panel and Dashboard links in Profile + SideMenu
- `deactivated` — blocked users (set by admin)

## Environment Variables (Replit Shared Secrets)
All prefixed with `VITE_FIREBASE_`:
- `API_KEY`, `AUTH_DOMAIN`, `DATABASE_URL`, `PROJECT_ID`, `STORAGE_BUCKET`, `MESSAGING_SENDER_ID`, `APP_ID`, `MEASUREMENT_ID`
