import React, { createContext, useContext, useEffect, useState } from 'react'
import {
  onAuthStateChanged, signOut as firebaseSignOut,
  signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signInWithPopup, GoogleAuthProvider, FacebookAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth'
import { ref, set, get } from 'firebase/database'
import { auth, db } from '../firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined)
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      setUser(u)
      if (u) {
        const snap = await get(ref(db, `users/${u.uid}`))
        if (snap.exists()) {
          setProfile(snap.val())
        }
      } else {
        setProfile(null)
      }
    })
    return unsub
  }, [])

  const signIn = (email, password) =>
    signInWithEmailAndPassword(auth, email, password)

  const signUp = async (email, password, displayName, barangay) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password)
    await set(ref(db, `users/${cred.user.uid}`), {
      displayName,
      email,
      barangay,
      role: 'resident',
      verified: false,
      joinedAt: Date.now(),
      reputation: 0,
      postCount: 0,
      helpedCount: 0,
      signInMethod: 'email',
    })
    return cred
  }

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const snap = await get(ref(db, `users/${cred.user.uid}`))
    if (!snap.exists()) {
      await set(ref(db, `users/${cred.user.uid}`), {
        displayName: cred.user.displayName || '',
        email: cred.user.email || '',
        barangay: '',
        role: 'resident',
        verified: false,
        joinedAt: Date.now(),
        reputation: 0,
        postCount: 0,
        helpedCount: 0,
        signInMethod: 'google',
      })
    }
    return cred
  }

  const signInWithFacebook = async () => {
    const provider = new FacebookAuthProvider()
    const cred = await signInWithPopup(auth, provider)
    const snap = await get(ref(db, `users/${cred.user.uid}`))
    if (!snap.exists()) {
      await set(ref(db, `users/${cred.user.uid}`), {
        displayName: cred.user.displayName || '',
        email: cred.user.email || '',
        barangay: '',
        role: 'resident',
        verified: false,
        joinedAt: Date.now(),
        reputation: 0,
        postCount: 0,
        helpedCount: 0,
        signInMethod: 'facebook',
      })
    }
    return cred
  }

  const resetPassword = (email) => sendPasswordResetEmail(auth, email)

  const signOut = () => firebaseSignOut(auth)

  const refreshProfile = async () => {
    if (!user) return
    const snap = await get(ref(db, `users/${user.uid}`))
    if (snap.exists()) setProfile(snap.val())
  }

  return (
    <AuthContext.Provider value={{ user, profile, signIn, signUp, signInWithGoogle, signInWithFacebook, resetPassword, signOut, refreshProfile }}>
      {user === undefined ? (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F1F5F9' }}>
          <div className="spinner" />
        </div>
      ) : children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
