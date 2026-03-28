# QCHelp — Quezon City Community Platform

## Overview
A Vite + React community support platform for Quezon City residents. Covers emergency alerts, incident reporting, community feed, live map, messaging, and admin tools. Fully Firebase-ready with labeled data fields throughout the UI.

## Architecture

### Tech Stack
- **Framework**: Vite + React 18
- **Router**: react-router-dom v6
- **Icons**: lucide-react (line-style only — NO emojis)
- **Styling**: Custom CSS (src/index.css) — Inter font, pastel design system
- **Firebase**: Config ready in src/firebase.js (needs `npm install firebase` to activate)
- **Map**: OpenStreetMap via iframe embed

### Design System
- `--primary`: #2563EB (blue)
- `--radius`: 16px
- `--bg`: #F1F5F9 (light slate)
- `--surface`: #FFFFFF
- Mobile shell: max-width 430px, centered
- Desktop dashboard: full-width flex layout, 240px sticky sidebar

## Screens (14 total)

### Auth (4)
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | WelcomePage | Logo, landmarks, feature chips, sign-in/up/guest CTA |
| `/signin` | SignIn | Email/password + Google + Facebook sign-in |
| `/signup` | SignUp | Email/password + social + password strength meter |
| `/reset` | ResetPassword | Email-based reset with Firebase |

### Mobile (8)
| Route | Component | Description |
|-------|-----------|-------------|
| `/home` | Home | Alert carousel, quick actions, QC announcements, community feed |
| `/post/create` | PostCreate | Category selector, media upload, barangay picker, priority |
| `/post/:id` | PostDetail | Full post, reactions, official badge, comments, related posts |
| `/map` | MapPage | OpenStreetMap iframe, legend filters, incident list |
| `/chat` | ChatList | Conversation list with admin badge and unread counts |
| `/chat/:id` | ChatUI | Chat bubbles, timestamps, official messages |
| `/activity` | ActivityPage | Tabbed (All/Mentions/Reactions/System), unread indicators |
| `/profile` | ProfilePage | Avatar, stat cards, verified/admin badges, settings menu |

### Desktop (2)
| Route | Component | Description |
|-------|-----------|-------------|
| `/dashboard` | MainDashboard | Sidebar nav, 4 KPI widgets, bar chart, category breakdown, barangay table |
| `/admin` | AdminPanel | Posts table, users table, analytics charts, FCM alert form |

## Key Files
- `src/App.jsx` — All 14 routes
- `src/index.css` — Complete design system (mobile + desktop)
- `src/firebase.js` — Firebase config + full DB schema documentation
- `src/constants/barangays.js` — QC_BARANGAYS (142), SAMPLE_POSTS, ANNOUNCEMENTS, MAP_MARKERS, ADMIN_POSTS_TABLE, ADMIN_USERS_TABLE, BARANGAY_STATS
- `src/components/BottomNav.jsx` — Mobile bottom navigation with FAB
- `src/components/SideMenu.jsx` — Slide-out menu (13 items)
- `src/components/PostCard.jsx` — Reusable post card

## Firebase Data Structure (from firebase.js)
```
/users/{uid}          — name, barangay, role, verified, signInMethod
/posts/{postId}       — authorId, barangay, category, content, status, priority, mediaUrls[]
/comments/{postId}    — authorId, text, likes, role
/chats/{chatId}       — participants[], lastMessage
/alerts/{alertId}     — title, message, targetBarangay, category, expiresAt
/announcements/{id}   — source, title, body, type
```

## Realistic QC Content
- 142 actual barangay names
- PAGASA/AGASA weather advisories
- QCDRRMO emergency contacts (8924-0655)
- QC LGU programs (Iskolar ng QC)
- Real landmarks: Quezon Memorial Circle, Batasang Pambansa, UP Diliman
- QC General Hospital, Seminary Road
- Barangay courts, evacuation centers

## Dev Notes
- Firebase packages not yet installed — run `npm install firebase` when ready to activate
- No emojis anywhere — all icons are lucide-react line-style
- All Firebase field names are labeled in the UI for developer reference
- Social login buttons use inline SVG logos (Google, Facebook)
