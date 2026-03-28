import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import WelcomePage from './pages/WelcomePage'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import ResetPassword from './pages/ResetPassword'
import Home from './pages/Home'
import PostCreate from './pages/PostCreate'
import PostDetail from './pages/PostDetail'
import MapPage from './pages/MapPage'
import ChatList from './pages/ChatList'
import ChatUI from './pages/ChatUI'
import ActivityPage from './pages/ActivityPage'
import ProfilePage from './pages/ProfilePage'
import AdminPanel from './pages/AdminPanel'

export default function App() {
  return (
    <div className="app-root">
      <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/reset" element={<ResetPassword />} />
        <Route path="/home" element={<Home />} />
        <Route path="/post/create" element={<PostCreate />} />
        <Route path="/post/:id" element={<PostDetail />} />
        <Route path="/map" element={<MapPage />} />
        <Route path="/chat" element={<ChatList />} />
        <Route path="/chat/:id" element={<ChatUI />} />
        <Route path="/activity" element={<ActivityPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
