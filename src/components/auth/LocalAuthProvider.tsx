"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { localDB, User } from '@/lib/localStorage'
import { auditLogger, AUDIT_ACTIONS } from '@/lib/auditLogger'

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
      
      // Log successful login
      auditLogger.log({
        user_id: loggedInUser.id,
        user_email: loggedInUser.email,
        action: AUDIT_ACTIONS.LOGIN,
        resource_type: 'auth',
        details: `User successfully logged in`,
        severity: 'low',
        status: 'success'
      })
    } else {
      // Log failed login attempt
      auditLogger.log({
        user_id: 'unknown',
        user_email: email,
        action: AUDIT_ACTIONS.LOGIN_FAILED,
        resource_type: 'auth',
        details: `Failed login attempt: ${error}`,
        severity: 'medium',
        status: 'failure'
      })
    }
    
    setIsLoading(false)
    return { error }
  }

  const signUp = async (email: string, password: string, metadata?: any) => {
    setIsLoading(true)
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const { user: newUser, error } = localDB.auth.register(email, password, metadata)
    
    if (newUser) {
      // Log successful registration
      auditLogger.log({
        user_id: newUser.id,
        user_email: newUser.email,
        action: AUDIT_ACTIONS.REGISTER,
        resource_type: 'auth',
        details: `New user registered: ${newUser.full_name || 'No name provided'}`,
        severity: 'medium',
        status: 'success',
        metadata: {
          company: metadata?.company,
          role: metadata?.role
        }
      })
    } else {
      // Log failed registration
      auditLogger.log({
        user_id: 'unknown',
        user_email: email,
        action: AUDIT_ACTIONS.REGISTER,
        resource_type: 'auth',
        details: `Failed registration attempt: ${error}`,
        severity: 'medium',
        status: 'failure'
      })
    }
    
    setIsLoading(false)
    return { error }
  }

  const signOut = async () => {
    if (user) {
      // Log logout
      auditLogger.log({
        user_id: user.id,
        user_email: user.email,
        action: AUDIT_ACTIONS.LOGOUT,
        resource_type: 'auth',
        details: `User logged out`,
        severity: 'low',
        status: 'success'
      })
    }
    
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