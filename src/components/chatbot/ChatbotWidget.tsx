"use client"

import React, { useState, useEffect } from 'react'
import { MessageCircle, X, Bot, ChevronUp, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


interface ChatbotWidgetProps {
  // Your Copilot Studio iframe URL
  iframeSrc: string
  // Customization options
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
  theme?: 'light' | 'dark' | 'brand'
  size?: 'small' | 'medium' | 'large'
  title?: string
  subtitle?: string
  showQuickHelp?: boolean
}

export function FloatingChatbotWidget({
  iframeSrc = "https://copilotstudio.microsoft.com/environments/your-environment-id/bots/your-bot-id/webchat",
  position = 'bottom-right',
  theme = 'brand',
  size = 'medium',
  title = "Regulatory Assistant",
  subtitle = "Ask me about regulations, licensing, or compliance",
  showQuickHelp = true
}: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showQuickHelpTooltip, setShowQuickHelpTooltip] = useState(showQuickHelp && !isOpen)
  const [hasNewMessage, setHasNewMessage] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Auto-hide quick help after some time
  useEffect(() => {
    if (showQuickHelpTooltip && !isOpen) {
      const timer = setTimeout(() => {
        setShowQuickHelpTooltip(false)
      }, 8000) // Hide after 8 seconds

      return () => clearTimeout(timer)
    }
  }, [showQuickHelpTooltip, isOpen])

  // Simulate loading state for iframe
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsLoading(false)
      }, 2000)

      return () => clearTimeout(timer)
    } else {
      setIsLoading(true)
    }
  }, [isOpen])

  // Get position classes
  const getPositionClasses = () => {
    switch (position) {
      case 'bottom-right':
        return 'bottom-6 right-6'
      case 'bottom-left':
        return 'bottom-6 left-6'
      case 'top-right':
        return 'top-6 right-6'
      case 'top-left':
        return 'top-6 left-6'
      default:
        return 'bottom-6 right-6'
    }
  }

  // Get size classes
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-80 h-96'
      case 'medium':
        return 'w-96 h-[500px]'
      case 'large':
        return 'w-[480px] h-[600px]'
      default:
        return 'w-96 h-[500px]'
    }
  }

  // Get theme classes
  const getThemeClasses = () => {
    switch (theme) {
      case 'dark':
        return 'bg-gray-900 border-gray-700 text-white'
      case 'light':
        return 'bg-white border-gray-200 text-gray-900'
      case 'brand':
        return 'bg-white border-brand-blue/20 text-brand-navy'
      default:
        return 'bg-white border-brand-blue/20 text-brand-navy'
    }
  }

  const toggleChatbot = () => {
    console.log("clicked")
    setIsOpen(!isOpen)
    setShowQuickHelpTooltip(false)
    if (hasNewMessage) {
      setHasNewMessage(false)
    }
  }

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const closeChatbot = () => {
    setIsOpen(false)
    setIsMinimized(false)
  }

  // Quick help suggestions
  const quickHelpItems = [
    "How do I apply for a banking license?",
    "What are the capital requirements?",
    "Where can I find AML guidelines?",
    "How to report suspicious transactions?"
  ]

  return (
    <>
      {/* Quick Help Tooltip */}
      {showQuickHelpTooltip && !isOpen && (
        <div className={`fixed z-40 ${getPositionClasses().replace('bottom-6', 'bottom-24').replace('right-6', 'right-20')}`}>
          <Card className="bg-white/95 backdrop-blur-sm border-brand-blue/20 shadow-lg max-w-xs">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-sm text-brand-navy">Need help?</CardTitle>
                  <p className="text-xs text-gray-600 mt-1">Ask our AI assistant about regulations</p>
                </div>
                <Button
                  onClick={() => setShowQuickHelpTooltip(false)}
                  variant="ghost"
                  size="sm"
                  className="p-1 h-6 w-6"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                {quickHelpItems.slice(0, 2).map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsOpen(true)
                      setShowQuickHelpTooltip(false)
                      // You could potentially pre-populate the chat with this question
                    }}
                    className="text-xs text-left text-gray-600 hover:text-brand-blue transition-colors block w-full"
                  >
                    • {item}
                  </button>
                ))}
              </div>
              <Button
                onClick={toggleChatbot}
                className="w-full mt-3 hover:bg-brand-navy text-white text-xs py-1"
                size="sm"
              >
                Start Chat
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Floating Chat Button */}
      {!isOpen && (
        <div className={`fixed ${getPositionClasses()} z-50`}>
          <div className="relative">
            <Button
              onClick={toggleChatbot}
              className="w-16 h-16 rounded-full  hover:bg-brand-navy text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <MessageCircle className="h-6 w-6" />
            </Button>

            {/* Notification Badge */}
            {hasNewMessage && (
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                <span className="text-xs text-white font-bold">1</span>
              </div>
            )}

          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className={`fixed ${getPositionClasses()} z-50`}>
          <Card className={`${getSizeClasses()} ${getThemeClasses()} shadow-2xl transition-all duration-300 ${isMinimized ? 'h-16' : ''}`}>

            {/* Chat Content */}
            {!isMinimized && (
              <CardContent className="p-0 h-full flex flex-col">
                <div className="flex justify-end items-start ">

                  <div className="flex items-center gap-1">
                    <Button
                      onClick={toggleMinimize}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6"
                    >
                      {isMinimized ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </Button>
                    <Button
                      onClick={closeChatbot}
                      variant="ghost"
                      size="sm"
                      className="p-1 h-6 w-6"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="flex-1 relative">
                  {isLoading ? (
                    // Loading State
                    <div className="flex flex-col items-center justify-center h-full bg-gray-50">
                      <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center mb-4 animate-pulse">
                        <Bot className="h-6 w-6 text-white" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-brand-navy mb-2">Initializing AI Assistant</p>
                        <p className="text-xs text-gray-500 mb-4">Connecting to regulatory knowledge base...</p>
                        <div className="flex items-center justify-center gap-1">
                          <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-brand-blue rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Copilot Studio Iframe
                    <iframe
                      src={iframeSrc}
                      className="w-full h-full border-0 rounded-b-lg"
                      title="Regulatory AI Assistant"
                      allow="microphone; camera; geolocation"
                      style={{
                        minHeight: '100%',
                        backgroundColor: '#ffffff'
                      }}
                      onLoad={() => setIsLoading(false)}
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-top-navigation"
                    />
                  )}
                </div>

                {/* Quick Actions Footer (shown before iframe loads) */}
                {isLoading && (
                  <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <p className="text-xs text-gray-600 mb-3">Popular questions:</p>
                    <div className="grid grid-cols-1 gap-2">
                      {quickHelpItems.slice(0, 3).map((item, index) => (
                        <button
                          key={index}
                          className="text-left text-xs p-2 bg-white border border-gray-200 rounded hover:bg-brand-blue/5 hover:border-brand-blue/20 transition-colors"
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            )}
          </Card>
        </div>
      )}

      {/* Backdrop for mobile */}
      {isOpen && !isMinimized && (
        <div
          className="fixed inset-0 bg-black/20 z-40 md:hidden"
          onClick={closeChatbot}
        />
      )}
    </>
  )
}
