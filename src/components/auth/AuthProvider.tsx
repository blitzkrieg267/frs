"use client"

import { USER_ROLES } from "@/lib/constants"
import { AuthContextType, RegisterData, User } from "@/types/auth"
import { createContext, useState, useEffect, useContext } from "react"

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('finreg_user')
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (err) {
        localStorage.removeItem('finreg_user')
      }
    }
  }, [])

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    setError(null)
    console.log(password)

    try {
      // Mock API call - replace with actual API
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Mock user data based on email
      const mockUser: User = {
        id: '1',
        email,
        firstName: 'John',
        lastName: 'Doe',
        name: 'John Doe',
        role: email.includes('admin') ? 'REGULATOR' : 'PROFESSIONAL',
        company: 'ABC Financial Services',
        entityType: 'Commercial Bank',
        licenseNumber: 'FS-2024-001',
        phone: '+267 XX XXX XXX',
        regulatoryBody: 'Bank of Botswana',
        isVerified: true,
        permissions: USER_ROLES[email.includes('admin') ? 'REGULATOR' : 'PROFESSIONAL'].permissions
      }

      setUser(mockUser)
      setIsAuthenticated(true)
      localStorage.setItem('finreg_user', JSON.stringify(mockUser))
    } catch (err) {
      setError('Invalid credentials')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (data: RegisterData) => {
    setIsLoading(true)
    setError(null)

    try {
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      // Mock success response
      console.log('Registration successful for:', data.email)
    } catch (err) {
      setError('Registration failed')
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setIsAuthenticated(false)
    setError(null)
    localStorage.removeItem('finreg_user')
  }

  const clearError = () => {
    setError(null)
  }

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      error,
      login,
      register,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
