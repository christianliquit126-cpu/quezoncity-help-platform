import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider, useAuth } from './contexts/AuthContext'
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
import MainDashboard from './pages/MainDashboard'

function PrivateRoute({ children }) {
  const { user } = useAuth()
  if (user === undefined) return null
  if (!user) return <Navigate to="/signin" replace />
  return children
}

function PublicRoute({ children }) {
  const { user } = useAuth()
  if (user === undefined) return null
  if (user) return <Navigate to="/home" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicRoute><WelcomePage /></PublicRoute>} />
      <Route path="/signin" element={<PublicRoute><SignIn /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignUp /></PublicRoute>} />
      <Route path="/reset" element={<PublicRoute><ResetPassword /></PublicRoute>} />
      <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
      <Route path="/post/create" element={<PrivateRoute><PostCreate /></PrivateRoute>} />
      <Route path="/post/:id" element={<PrivateRoute><PostDetail /></PrivateRoute>} />
      <Route path="/map" element={<PrivateRoute><MapPage /></PrivateRoute>} />
      <Route path="/chat" element={<PrivateRoute><ChatList /></PrivateRoute>} />
      <Route path="/chat/:id" element={<PrivateRoute><ChatUI /></PrivateRoute>} />
      <Route path="/activity" element={<PrivateRoute><ActivityPage /></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />
      <Route path="/admin" element={<PrivateRoute><AdminPanel /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><MainDashboard /></PrivateRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <div className="app-root">
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </div>
  )
}
