"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { localDB, User } from '@/lib/localStorage'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ error: string | null }>
  signOut: () => Promise<{ error: string | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function LocalAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize local database
    localDB.init()
    
    // Check for existing session
    const currentUser = localDB.auth.getCurrentUser()
    setUser(currentUser)
    setIsLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const { user: loggedInUser, error } = localDB.auth.login(email, password)
    
    if (loggedInUser) {
      setUser(loggedInUser)
    }
    
    setIsLoading(false)
    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const { user: newUser, error } = localDB.auth.register(email, password, metadata)
    
    setIsLoading(false)
    return { error }
  }

  const signOut = async () => {
    localDB.auth.logout()
    setUser(null)
    return { error: null }
  }

  const isAdmin = user?.is_admin || false

  const value = {
    user,
    isLoading,
    isAdmin,
    signIn,
    signUp,
    signOut
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useLocalAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useLocalAuth must be used within a LocalAuthProvider')
  }
  return context
}