"use client"

import { useState } from "react"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"

export function AuthPages() {
  const [currentView, setCurrentView] = useState<'login' | 'register'>('login')

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent mb-2">
            Botswana Financial Regulatory Platform
          </h1>
          <p className="text-gray-600">Secure access to regulatory frameworks and licensing information</p>
        </div>

        <div className="flex justify-center">
          {currentView === 'login' ? (
            <LoginForm onSwitchToRegister={() => setCurrentView('register')} />
          ) : (
            <RegisterForm onSwitchToLogin={() => setCurrentView('login')} />
          )}
        </div>
      </div>
    </div>
  )
}
