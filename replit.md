# QCHelp – Quezon City Community Support Hub

A fully functional React + Vite front-end community platform for Quezon City residents. Users can report incidents, request help, view real-time alerts, and connect with neighbors across all QC barangays.

## Tech Stack

- **Framework**: React 18 + Vite 5
- **Routing**: React Router v6 (Hash Router)
- **Icons**: Lucide React
- **Fonts**: Inter (Google Fonts)
- **Styling**: Plain CSS with CSS custom properties
- **Server (dev)**: Vite dev server on port 5000

## Project Structure

```
src/
  main.jsx            - App entry point
  App.jsx             - Route definitions
  index.css           - Global styles and design system
  constants/
    barangays.js      - QC barangays list, categories, sample data
  components/
    BottomNav.jsx     - Bottom navigation bar
    PostCard.jsx      - Feed post card
    SideMenu.jsx      - Slide-out side drawer
  pages/
    WelcomePage.jsx   - Landing/welcome screen
    SignIn.jsx        - Sign in form
    SignUp.jsx        - Sign up form with barangay dropdown
    ResetPassword.jsx - Password reset
    Home.jsx          - Main feed with alerts and posts
    PostCreate.jsx    - Create new post
    PostDetail.jsx    - Post detail with comments
    MapPage.jsx       - Incident map (OpenStreetMap embed)
    ChatList.jsx      - Conversations list
    ChatUI.jsx        - Individual chat screen
    ActivityPage.jsx  - Activity/notifications feed
    ProfilePage.jsx   - User profile
    AdminPanel.jsx    - Admin dashboard
```

## Running

```
npm run dev
```

Runs Vite on `0.0.0.0:5000`.

## Building for Production

```
npm run build
```

Output goes to `dist/`. Deploy as static site.

## Firebase-Ready Fields

All forms include Firebase-compatible field names:
- `email`, `password`, `fullName`, `barangay`, `contactNumber`, `agreeToTerms`
- Posts: `postContent`, `category`, `priority`, `barangay`, `location`, `timestamp`
- Messages: `message`, `timestamp`, `senderId`
