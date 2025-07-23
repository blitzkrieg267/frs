"use client"

import { useState } from "react"
import { useLocalAuth } from "./auth/LocalAuthProvider"
import { LogOut, Menu, Shield, X } from "lucide-react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function AppHeader() {
  const { user, signOut, isAdmin } = useLocalAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const router = useRouter()

  const handleNavigation = (view: string) => {
    router.push(view)
  }

  const handleSignOut = async () => {
    await signOut()
    router.push('/')
  }
  return (
    <header className="bg-white/90 backdrop-blur-sm border-b border-brand-blue/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavigation('/')}>
            <Image
              src="/images.png"
              alt="Logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <div>
              <h1 className="text-lg font-bold text-brand-navy">FSRF Botswana</h1>
              <p className="text-xs text-gray-500 hidden sm:block">Financial Regulatory Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <button
              onClick={() => handleNavigation('/')}
              className="text-gray-600 hover:text-brand-blue transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => handleNavigation('/search')}
              className="text-gray-600 hover:text-brand-blue transition-colors"
            >
              Search
            </button>
            <button
              onClick={() => handleNavigation('/licensing')}
              className="text-gray-600 hover:text-brand-blue transition-colors"
            >
              Licensing
            </button>
            <button
              onClick={() => handleNavigation('/requirements')}
              className="text-gray-600 hover:text-brand-blue transition-colors"
            >
              Requirements
            </button>
            {user && (
              <>
                <button
                  onClick={() => handleNavigation('/profile')}
                  className="text-gray-600 hover:text-brand-blue transition-colors"
                >
                  Profile
                </button>
                {isAdmin && (
                  <button
                    onClick={() => handleNavigation('/admin')}
                <button
                  onClick={() => {
                    handleNavigation('/requirements')
                    setIsMenuOpen(false)
                  }}
                  className="px-4 py-2 text-left text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded"
                >
                  Requirements
                </button>
                <button
                  >
                    <Shield className="h-4 w-4" />
                    Admin
                  </button>
                )}
              </>
            )}
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                {/* User Info */}
                <div className="hidden sm:block text-right">
                  <p className="text-sm font-medium text-brand-navy">{user?.email}</p>
                  <p className="text-xs text-gray-500">{isAdmin ? 'Administrator' : 'User'}</p>
                </div>

                {/* User Avatar */}
                <div className="w-8 h-8 bg-brand-blue rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {user?.email?.[0]?.toUpperCase()}
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button
                  onClick={() => handleNavigation('/auth/login')}
                  variant="outline"
                  size="sm"
                  className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  Sign In
                </Button>
                <Button
                  onClick={() => handleNavigation('/auth/register')}
                  size="sm"
                  className="hover:bg-brand-navy text-white"
                >
                  Register
                </Button>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600 hover:text-brand-blue"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <nav className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  handleNavigation('/')
                  setIsMenuOpen(false)
                }}
                className="px-4 py-2 text-left text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded"
              >
                Home
              </button>
              <button
                onClick={() => {
                  handleNavigation('/search')
                  setIsMenuOpen(false)
                }}
                className="px-4 py-2 text-left text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded"
              >
                Search
              </button>
              {session && (
                <>
                  <button
                    onClick={() => {
                      handleNavigation('/licensing')
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-2 text-left text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded"
                  >
                    Licensing
                  </button>
                  <button
                    onClick={() => {
                      handleNavigation('/profile')
                      setIsMenuOpen(false)
                    }}
                    className="px-4 py-2 text-left text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded"
                  >
                    Profile
                  </button>
                {isAdmin && (
                    <button
                      onClick={() => {
                        handleNavigation('/admin')
                        setIsMenuOpen(false)
                      }}
                      className="px-4 py-2 text-left text-gray-600 hover:text-brand-blue hover:bg-gray-50 rounded flex items-center gap-2"
                    >
                      <Shield className="h-4 w-4" />
                      Admin
                    </button>
                  )}
              </>
            )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
