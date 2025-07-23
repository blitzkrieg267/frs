"use client"

import React, { useState } from 'react'
import { Eye, EyeOff, Lock, Mail, User, Building, Phone, FileText, Users, Briefcase } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { RegisterData, UserRole } from '@/types/auth'
import { useAuth } from './AuthProvider'
import { ENTITY_TYPES, REGULATORY_BODIES, USER_ROLES } from '@/lib/constants'

export function RegisterForm({ onSwitchToLogin }: { onSwitchToLogin: () => void }) {
  const [formData, setFormData] = useState<RegisterData>({
    accountType: 'PROFESSIONAL',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    company: '',
    entityType: '',
    licenseNumber: '',
    phone: '',
    regulatoryBody: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const { register, isLoading, error, clearError } = useAuth()

  const handleInputChange = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (error) clearError()
  }

  const handleSubmit = async () => {
    clearError()

    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match')
      return
    }

    try {
      await register(formData)
      alert('Registration successful! Please check your email for verification.')
      onSwitchToLogin()
    } catch (err) {
      // Error is handled by the auth context
    }
  }

  return (
    <Card className="w-full max-w-2xl bg-white/90 backdrop-blur-sm border-brand-blue/20">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl text-brand-navy">Create Account</CardTitle>
        <p className="text-gray-600">Register for access to regulatory resources</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Account Type Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Account Type</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(USER_ROLES).filter(([key]) => key !== 'REGULATOR').map(([key, role]) => (
              <div
                key={key}
                className={`p-3 border rounded-lg cursor-pointer transition-all ${formData.accountType === key
                  ? 'border-brand-blue bg-brand-blue/10'
                  : 'border-gray-200 hover:border-brand-blue/50'
                  }`}
                onClick={() => handleInputChange('accountType', key as UserRole)}
              >
                <div className="flex items-center space-x-2">
                  {key === 'PUBLIC' && <Users className="h-4 w-4 text-brand-blue" />}
                  {key === 'PROFESSIONAL' && <Briefcase className="h-4 w-4 text-brand-blue" />}
                  {key === 'INSTITUTIONAL' && <Building className="h-4 w-4 text-brand-blue" />}
                  <div>
                    <p className="font-medium text-sm">{role.name}</p>
                    <p className="text-xs text-gray-600">{role.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Personal Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">First Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Last Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="email"
                placeholder="your.email@company.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="+267 XX XXX XXX"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        {/* Professional Information */}
        {formData.accountType !== 'PUBLIC' && (
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-navy">Company/Organization</label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="ABC Financial Services"
                  value={formData.company}
                  onChange={(e) => handleInputChange('company', e.target.value)}
                  className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-navy">Entity Type</label>
                <select
                  value={formData.entityType}
                  onChange={(e) => handleInputChange('entityType', e.target.value)}
                  className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  disabled={isLoading}
                >
                  <option value="">Select entity type</option>
                  {ENTITY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-navy">License Number (if applicable)</label>
                <div className="relative">
                  <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="FS-2024-001"
                    value={formData.licenseNumber}
                    onChange={(e) => handleInputChange('licenseNumber', e.target.value)}
                    className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                    disabled={isLoading}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-brand-navy">Primary Regulator</label>
              <select
                value={formData.regulatoryBody}
                onChange={(e) => handleInputChange('regulatoryBody', e.target.value)}
                className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
              >
                <option value="">Select primary regulator</option>
                {REGULATORY_BODIES.map(body => (
                  <option key={body} value={body}>{body}</option>
                ))}
              </select>
            </div>
          </div>
        )}

        {/* Password */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Create a strong password"
                value={formData.password}
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

          <div className="space-y-2">
            <label className="text-sm font-medium text-brand-navy">Confirm Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                disabled={isLoading}
              />
            </div>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          className="w-full hover:bg-brand-navy text-white"
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-brand-blue hover:underline font-medium"
            >
              Sign in here
            </button>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
