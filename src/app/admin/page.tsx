"use client"

import { useState } from 'react'
import { useSupabaseAuth } from '@/components/auth/SupabaseAuthProvider'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  FileText, 
  Newspaper, 
  Calendar, 
  Users, 
  Settings, 
  Upload,
  BarChart3,
  Shield,
  Plus,
  Search,
  Filter
} from 'lucide-react'
import { DocumentManager } from '@/components/admin/DocumentManager'
import { NewsManager } from '@/components/admin/NewsManager'
import { EventManager } from '@/components/admin/EventManager'
import { UserManager } from '@/components/admin/UserManager'
import { AdminLogin } from '@/components/admin/AdminLogin'

type AdminView = 'dashboard' | 'documents' | 'news' | 'events' | 'users' | 'settings'

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useSupabaseAuth()
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return <AdminLogin />
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'news', label: 'News & Updates', icon: Newspaper },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const renderContent = () => {
    switch (currentView) {
      case 'documents':
        return <DocumentManager />
      case 'news':
        return <NewsManager />
      case 'events':
        return <EventManager />
      case 'users':
        return <UserManager />
      case 'settings':
        return <AdminSettings />
      default:
        return <AdminDashboardContent />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue">
      {/* Admin Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-brand-blue/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <Shield className="h-8 w-8 text-brand-blue" />
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-gray-600">Financial Regulatory Platform Management</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 border-green-200">
                Admin Access
              </Badge>
              <div className="text-right">
                <p className="text-sm font-medium text-brand-navy">{user.email}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar Navigation */}
          <div className="lg:col-span-1">
            <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
              <CardHeader>
                <CardTitle className="text-brand-navy">Navigation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {navigationItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={item.id}
                      onClick={() => setCurrentView(item.id as AdminView)}
                      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                        currentView === item.id
                          ? 'bg-brand-blue text-white'
                          : 'text-gray-600 hover:bg-brand-blue/10 hover:text-brand-blue'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </button>
                  )
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {renderContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

function AdminDashboardContent() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">Dashboard Overview</h2>
        <Button className="bg-brand-blue hover:bg-brand-navy text-white">
          <Plus className="h-4 w-4 mr-2" />
          Quick Add Content
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 text-center p-6">
          <FileText className="h-8 w-8 text-brand-blue mx-auto mb-3" />
          <div className="text-2xl font-bold text-brand-blue mb-1">156</div>
          <p className="text-sm text-gray-600">Total Documents</p>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200 text-center p-6">
          <Newspaper className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-600 mb-1">23</div>
          <p className="text-sm text-gray-600">News Articles</p>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-purple-200 text-center p-6">
          <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-purple-600 mb-1">8</div>
          <p className="text-sm text-gray-600">Upcoming Events</p>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-orange-200 text-center p-6">
          <Users className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-orange-600 mb-1">1,247</div>
          <p className="text-sm text-gray-600">Registered Users</p>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardHeader>
            <CardTitle className="text-brand-navy">Recent Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { title: 'Banking Act Amendment 2024', type: 'Act', date: '2024-03-15' },
                { title: 'AML Guidelines Update', type: 'Guideline', date: '2024-03-10' },
                { title: 'Insurance Regulations', type: 'Regulation', date: '2024-03-08' }
              ].map((doc, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-navy">{doc.title}</p>
                    <p className="text-sm text-gray-600">{doc.type}</p>
                  </div>
                  <p className="text-xs text-gray-500">{doc.date}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardHeader>
            <CardTitle className="text-brand-navy">System Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { action: 'Document uploaded', user: 'admin@bob.bw', time: '2 hours ago' },
                { action: 'News article published', user: 'editor@nbfira.bw', time: '4 hours ago' },
                { action: 'Event created', user: 'admin@fia.bw', time: '1 day ago' }
              ].map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-brand-navy">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.user}</p>
                  </div>
                  <p className="text-xs text-gray-500">{activity.time}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-brand-navy">System Settings</h2>
      
      <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
        <CardHeader>
          <CardTitle className="text-brand-navy">Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">System settings and configuration options will be available here.</p>
        </CardContent>
      </Card>
    </div>
  )
}