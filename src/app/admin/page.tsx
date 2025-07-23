"use client"

import { useState, useEffect } from 'react'
import { useLocalAuth } from '@/components/auth/LocalAuthProvider'
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
  Filter,
  Home,
  Menu,
  X
} from 'lucide-react'
import { DocumentManager } from '@/components/admin/DocumentManager'
import { NewsManager } from '@/components/admin/NewsManager'
import { EventManager } from '@/components/admin/EventManager'
import { UserManager } from '@/components/admin/UserManager'
import { localDB } from '@/lib/localStorage'

type AdminView = 'dashboard' | 'documents' | 'news' | 'events' | 'users' | 'settings'

export default function AdminDashboard() {
  const { user, isAdmin, isLoading } = useLocalAuth()
  const [currentView, setCurrentView] = useState<AdminView>('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [stats, setStats] = useState({
    documents: 0,
    news: 0,
    events: 0,
    users: 0
  })

  // Load stats when component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setStats({
        documents: localDB.documents.getAll().length,
        news: localDB.news.getAll().length,
        events: localDB.events.getAll().length,
        users: localDB.users.getAll().length
      })
    }
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-white shadow-lg">
          <CardContent className="text-center py-12">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">Admin Access Required</h3>
            <p className="text-gray-500 mb-4">Please sign in with an admin account to access this area.</p>
            <Button
              onClick={() => window.location.href = '/auth/login'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const navigationItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, color: 'text-blue-600' },
    { id: 'documents', label: 'Documents', icon: FileText, color: 'text-green-600' },
    { id: 'news', label: 'News & Updates', icon: Newspaper, color: 'text-orange-600' },
    { id: 'events', label: 'Events', icon: Calendar, color: 'text-purple-600' },
    { id: 'users', label: 'Users', icon: Users, color: 'text-indigo-600' },
    { id: 'settings', label: 'Settings', icon: Settings, color: 'text-gray-600' },
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
        return <AdminDashboardContent stats={stats} />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-slate-800 text-white transition-all duration-300 flex flex-col`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700">
          <div className="flex items-center justify-between">
            {sidebarOpen && (
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-blue-400" />
                <div>
                  <h1 className="text-lg font-bold text-white">Admin Panel</h1>
                  <p className="text-xs text-slate-400">FSRF Management</p>
                </div>
              </div>
            )}
            <Button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              variant="ghost"
              size="sm"
              className="text-white hover:bg-slate-700 p-2"
            >
              {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id as AdminView)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                    currentView === item.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  <Icon className={`h-5 w-5 ${currentView === item.id ? 'text-white' : item.color}`} />
                  {sidebarOpen && (
                    <span className="font-medium">{item.label}</span>
                  )}
                </button>
              )
            })}
          </div>
        </nav>

        {/* User Info */}
        <div className="p-4 border-t border-slate-700">
          {sidebarOpen ? (
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">
                  {user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.email}</p>
                <p className="text-xs text-slate-400">Administrator</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mx-auto">
              <span className="text-white text-sm font-bold">
                {user.email[0].toUpperCase()}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">{currentView}</h2>
              <p className="text-sm text-gray-600">
                {currentView === 'dashboard' && 'Overview of platform activity and statistics'}
                {currentView === 'documents' && 'Manage regulatory documents and files'}
                {currentView === 'news' && 'Create and manage news updates'}
                {currentView === 'events' && 'Manage events and conferences'}
                {currentView === 'users' && 'View and manage user accounts'}
                {currentView === 'settings' && 'System configuration and preferences'}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                onClick={() => window.location.href = '/'}
                variant="outline"
                size="sm"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
              {currentView !== 'dashboard' && (
                <Button
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  size="sm"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-4">
              <p>&copy; 2024 FSRF Botswana. All rights reserved.</p>
              <span className="text-gray-400">|</span>
              <p>Financial Services Regulatory Framework</p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-green-600 border-green-200">
                System Online
              </Badge>
              <p>Last updated: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}

function AdminDashboardContent({ stats }: { stats: any }) {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
        <h3 className="text-xl font-bold mb-2">Welcome to Admin Dashboard</h3>
        <p className="text-blue-100">
          Manage your financial regulatory platform content and users from this central hub.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Documents</p>
                <p className="text-3xl font-bold text-gray-900">{stats.documents}</p>
              </div>
              <FileText className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">News Articles</p>
                <p className="text-3xl font-bold text-gray-900">{stats.news}</p>
              </div>
              <Newspaper className="h-8 w-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Events</p>
                <p className="text-3xl font-bold text-gray-900">{stats.events}</p>
              </div>
              <Calendar className="h-8 w-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-indigo-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Registered Users</p>
                <p className="text-3xl font-bold text-gray-900">{stats.users}</p>
              </div>
              <Users className="h-8 w-8 text-indigo-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <FileText className="h-5 w-5 text-green-500" />
              Recent Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {localDB.documents.getAll().slice(0, 3).map((doc, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{doc.title}</p>
                    <p className="text-sm text-gray-600 capitalize">{doc.type} • {doc.regulator}</p>
                  </div>
                  <p className="text-xs text-gray-500">{new Date(doc.updated_at).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm">
          <CardHeader className="border-b border-gray-100">
            <CardTitle className="text-gray-900 flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-orange-500" />
              Recent News
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {localDB.news.getAll().slice(0, 3).map((news, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{news.title}</p>
                    <p className="text-sm text-gray-600">{news.regulator}</p>
                  </div>
                  <Badge className={
                    news.status === 'published' ? 'bg-green-100 text-green-800' : 
                    news.status === 'draft' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-gray-100 text-gray-800'
                  }>
                    {news.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-gray-900">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700 text-white h-16 flex flex-col items-center justify-center"
              onClick={() => setCurrentView('documents')}
            >
              <Upload className="h-5 w-5 mb-1" />
              Upload Document
            </Button>
            <Button 
              className="bg-orange-600 hover:bg-orange-700 text-white h-16 flex flex-col items-center justify-center"
              onClick={() => setCurrentView('news')}
            >
              <Plus className="h-5 w-5 mb-1" />
              Create News
            </Button>
            <Button 
              className="bg-purple-600 hover:bg-purple-700 text-white h-16 flex flex-col items-center justify-center"
              onClick={() => setCurrentView('events')}
            >
              <Calendar className="h-5 w-5 mb-1" />
              Add Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AdminSettings() {
  return (
    <div className="space-y-6">
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="text-gray-900">Platform Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-gray-600">System settings and configuration options will be available here.</p>
          
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Data Storage</h4>
              <p className="text-sm text-blue-700">Currently using local storage for demo purposes. All data is stored in the browser.</p>
            </div>
            
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h4 className="font-medium text-green-900 mb-2">Search Engine</h4>
              <p className="text-sm text-green-700">Full-text search is enabled across all content types with advanced filtering.</p>
            </div>
            
            <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
              <h4 className="font-medium text-purple-900 mb-2">User Management</h4>
              <p className="text-sm text-purple-700">Role-based access control with admin and regular user permissions.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}