"use client"

import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useAuth } from './AuthProvider'

export function LoginForm({ onSwitchToRegister }: { onSwitchToRegister: () => void }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const { login, isLoading, error, clearError } = useAuth()

  const handleSubmit = async () => {
    clearError()

    try {
      await login(email, password)
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  const handleInputChange = (field: string, value: string) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)
    if (error) clearError()
  }

  return (
    <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-brand-blue/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-brand-navy">Sign In</CardTitle>
        <p className="text-gray-600">Access the Financial Regulatory Platform</p>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="email"
              placeholder="your.email@company.com"
              value={email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="pl-10 pr-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full hover:bg-brand-navy text-white"
          disabled={isLoading || !email || !password}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>

        <div className="text-center space-y-2">
          <button
            type="button"
            className="text-sm text-brand-blue hover:underline"
          >
            Forgot your password?
          </button>
          <p className="text-sm text-gray-600">
            Dont have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="text-brand-blue hover:underline font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
