"use client"
import React, { useState, useMemo } from 'react'
import { Download, Trash2, Eye, Edit3, Share2, Calendar, Clock, CheckCircle, AlertCircle, Filter, Search, Plus, FileText, Star, MoreVertical, ExternalLink, Archive, FolderOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { SavedChecklist, UserProfile, mockUserProfile, mockSavedChecklists } from '@/types/profile'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

function ChecklistCard({ checklist, onView, onEdit, onDelete, onShare, onToggleFavorite }: {
  checklist: SavedChecklist
  onView: (id: string) => void
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onShare: (id: string) => void
  onToggleFavorite: (id: string) => void
}) {
  const [showMenu, setShowMenu] = useState(false)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Not Started': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Archived': return 'bg-purple-100 text-purple-800 border-purple-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low': return 'bg-green-100 text-green-800 border-green-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getRegulatorColor = (regulator: string) => {
    switch (regulator) {
      case 'Bank of Botswana': return 'bg-brand-blue/10 text-brand-navy border-brand-blue/20'
      case 'NBFIRA': return 'bg-green-50 text-green-700 border-green-200'
      case 'Financial Intelligence Agency': return 'bg-purple-50 text-purple-700 border-purple-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  const progressPercentage = Math.round((checklist.completedItems / checklist.totalItems) * 100)

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 hover:shadow-lg transition-all duration-200 relative">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-lg font-semibold text-brand-navy line-clamp-1">{checklist.title}</h3>
              {checklist.isFavorite && (
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
              )}
              {checklist.isShared && (
                <Share2 className="h-4 w-4 text-blue-500" />
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={getStatusColor(checklist.status) + " border text-xs"}>
                {checklist.status}
              </Badge>
              <Badge className={getPriorityColor(checklist.priority) + " border text-xs"}>
                {checklist.priority}
              </Badge>
              <Badge className={getRegulatorColor(checklist.regulator) + " border text-xs"}>
                {checklist.regulator}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm line-clamp-2 mb-3">{checklist.description}</p>
          </div>

          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="p-1"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>

            {showMenu && (
              <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-40">
                <button
                  onClick={() => {
                    onView(checklist.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Eye className="h-3 w-3" />
                  View Details
                </button>
                <button
                  onClick={() => {
                    onEdit(checklist.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Edit3 className="h-3 w-3" />
                  Edit
                </button>
                <button
                  onClick={() => {
                    onToggleFavorite(checklist.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Star className="h-3 w-3" />
                  {checklist.isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                </button>
                <button
                  onClick={() => {
                    onShare(checklist.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2"
                >
                  <Share2 className="h-3 w-3" />
                  Share
                </button>
                <hr className="my-1" />
                <button
                  onClick={() => {
                    onDelete(checklist.id)
                    setShowMenu(false)
                  }}
                  className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 text-red-600 flex items-center gap-2"
                >
                  <Trash2 className="h-3 w-3" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-medium text-brand-navy">
              {checklist.completedItems}/{checklist.totalItems} ({progressPercentage}%)
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-brand-blue h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>Created: {new Date(checklist.createdDate).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>Modified: {new Date(checklist.lastModified).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Due Date */}
        {checklist.dueDate && (
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium text-orange-700">
              Due: {new Date(checklist.dueDate).toLocaleDateString()}
            </span>
          </div>
        )}

        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {checklist.tags.slice(0, 3).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
              {tag}
            </Badge>
          ))}
          {checklist.tags.length > 3 && (
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
              +{checklist.tags.length - 3} more
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-2">
          <Button
            onClick={() => onView(checklist.id)}
            size="sm"
            className="flex-1  hover:bg-brand-navy text-white"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            onClick={() => {
              // Mock download functionality
              alert(`Downloading checklist: ${checklist.title}`)
            }}
            size="sm"
            variant="outline"
            className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            <Download className="h-3 w-3" />
          </Button>
          <Button
            onClick={() => onEdit(checklist.id)}
            size="sm"
            variant="outline"
            className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            <Edit3 className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

function UserProfileHeader({ user }: { user: UserProfile }) {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 mb-8">
      <CardContent className="p-6">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-brand-blue rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
            ) : (
              user.name.split(' ').map(n => n[0]).join('')
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-brand-navy mb-2">{user.name}</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="space-y-1">
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Company:</strong> {user.company}</p>
                <p><strong>Role:</strong> {user.role}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Entity Type:</strong> {user.entityType}</p>
                {user.licenseNumber && <p><strong>License:</strong> {user.licenseNumber}</p>}
                <p><strong>Member Since:</strong> {new Date(user.memberSince).toLocaleDateString()}</p>
              </div>
            </div>
          </div>

          <div className="text-right">
            <Button variant="outline" className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// ============================
// Main User Profile Component
// ============================

export default function UserProfileChecklists() {
  const [checklists, setChecklists] = useState(mockSavedChecklists)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('All')
  const [filterPriority, setFilterPriority] = useState('All')
  const [sortBy, setSortBy] = useState('lastModified')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Filter and search logic
  const filteredChecklists = useMemo(() => {
    const filtered = checklists.filter(checklist => {
      const matchesSearch =
        checklist.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        checklist.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = filterStatus === 'All' || checklist.status === filterStatus
      const matchesPriority = filterPriority === 'All' || checklist.priority === filterPriority

      return matchesSearch && matchesStatus && matchesPriority
    })

    // Sort results
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
        case 'createdDate':
          comparison = new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime()
          break
        case 'lastModified':
          comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime()
          break
        case 'dueDate':
          const aDue = a.dueDate ? new Date(a.dueDate).getTime() : 0
          const bDue = b.dueDate ? new Date(b.dueDate).getTime() : 0
          comparison = aDue - bDue
          break
        case 'progress':
          const aProgress = a.completedItems / a.totalItems
          const bProgress = b.completedItems / b.totalItems
          comparison = aProgress - bProgress
          break
      }

      return sortOrder === 'asc' ? comparison : -comparison
    })

    return filtered
  }, [checklists, searchTerm, filterStatus, filterPriority, sortBy, sortOrder])

  // Handler functions
  const handleView = (id: string) => {
    alert(`Viewing checklist: ${id}`)
  }

  const handleEdit = (id: string) => {
    alert(`Editing checklist: ${id}`)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this checklist?')) {
      setChecklists(prev => prev.filter(c => c.id !== id))
    }
  }

  const handleShare = (id: string) => {
    alert(`Sharing checklist: ${id}`)
  }

  const handleToggleFavorite = (id: string) => {
    setChecklists(prev => prev.map(c =>
      c.id === id ? { ...c, isFavorite: !c.isFavorite } : c
    ))
  }

  // Statistics
  const stats = useMemo(() => {
    const total = checklists.length
    const completed = checklists.filter(c => c.status === 'Completed').length
    const inProgress = checklists.filter(c => c.status === 'In Progress').length
    const overdue = checklists.filter(c =>
      c.dueDate && new Date(c.dueDate) < new Date() && c.status !== 'Completed'
    ).length

    return { total, completed, inProgress, overdue }
  }, [checklists])

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue">
        <div className="container mx-auto px-4 py-8">
          {/* User Profile Header */}
          <UserProfileHeader user={mockUserProfile} />

          {/* Page Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">
                My Checklists
              </h2>
              <p className="text-gray-600 mt-2">
                Manage your saved regulatory compliance checklists and track progress
              </p>
            </div>

            <Button className="bg-brand-blue hover:bg-brand-navy text-white">
              <Plus className="h-4 w-4 mr-2" />
              Create New Checklist
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20 text-center p-6">
              <FolderOpen className="h-8 w-8 text-brand-blue mx-auto mb-3" />
              <div className="text-2xl font-bold text-brand-blue mb-1">{stats.total}</div>
              <p className="text-sm text-gray-600">Total Checklists</p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-green-200 text-center p-6">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-green-600 mb-1">{stats.completed}</div>
              <p className="text-sm text-gray-600">Completed</p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-blue-200 text-center p-6">
              <Clock className="h-8 w-8 text-blue-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-blue-600 mb-1">{stats.inProgress}</div>
              <p className="text-sm text-gray-600">In Progress</p>
            </Card>

            <Card className="bg-white/80 backdrop-blur-sm border-red-200 text-center p-6">
              <AlertCircle className="h-8 w-8 text-red-600 mx-auto mb-3" />
              <div className="text-2xl font-bold text-red-600 mb-1">{stats.overdue}</div>
              <p className="text-sm text-gray-600">Overdue</p>
            </Card>
          </div>

          {/* Search and Filters */}
          <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-brand-navy">
                <Filter className="h-5 w-5" />
                Search & Filter Checklists
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search checklists by title, description, or tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
                />
              </div>

              {/* Filters and Sort */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-navy">Status</label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="All">All Statuses</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Not Started">Not Started</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-navy">Priority</label>
                  <select
                    value={filterPriority}
                    onChange={(e) => setFilterPriority(e.target.value)}
                    className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="All">All Priorities</option>
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-navy">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="lastModified">Last Modified</option>
                    <option value="createdDate">Created Date</option>
                    <option value="title">Title</option>
                    <option value="dueDate">Due Date</option>
                    <option value="progress">Progress</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-brand-navy">Order</label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
                    className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                  >
                    <option value="desc">Newest First</option>
                    <option value="asc">Oldest First</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Summary */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing <span className="font-semibold text-brand-navy">{filteredChecklists.length}</span> of <span className="font-semibold text-brand-navy">{checklists.length}</span> checklists
              {searchTerm && (
                <span> matching <span className="font-semibold text-brand-blue">{searchTerm}</span></span>
              )}
            </p>
          </div>

          {/* Checklists Grid */}
          {filteredChecklists.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredChecklists.map(checklist => (
                <ChecklistCard
                  key={checklist.id}
                  checklist={checklist}
                  onView={handleView}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onShare={handleShare}
                  onToggleFavorite={handleToggleFavorite}
                />
              ))}
            </div>
          ) : (
            <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
              <CardContent className="text-center py-12">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Checklists Found</h3>
                <p className="text-gray-500 mb-4">
                  {searchTerm || filterStatus !== 'All' || filterPriority !== 'All'
                    ? 'Try adjusting your search criteria or filters'
                    : 'You haven\'t created any checklists yet'
                  }
                </p>
                <Button
                  onClick={() => {
                    if (searchTerm || filterStatus !== 'All' || filterPriority !== 'All') {
                      setSearchTerm('')
                      setFilterStatus('All')
                      setFilterPriority('All')
                    } else {
                      alert('Redirecting to create new checklist...')
                    }
                  }}
                  className="bg-brand-blue hover:bg-brand-navy text-white"
                >
                  {searchTerm || filterStatus !== 'All' || filterPriority !== 'All'
                    ? 'Clear Filters'
                    : 'Create Your First Checklist'
                  }
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Quick Actions Footer */}
          <Card className="mt-12 bg-gradient-to-r from-brand-blue to-brand-navy text-white border-0">
            <CardContent className="p-8">
              <div className="text-center">
                <h3 className="text-xl font-bold mb-4">Need Help Managing Your Checklists?</h3>
                <p className="text-brand-cream/90 mb-6 max-w-2xl mx-auto">
                  Our AI assistant can help you organize compliance tasks, set priorities,
                  and ensure you never miss important regulatory deadlines.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    className=" text-brand-blue hover:bg-brand-cream"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create New Checklist
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-primary hover:bg-white hover:text-brand-blue"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Browse Templates
                  </Button>
                  <Button
                    variant="outline"
                    className="border-white text-primary hover:bg-white hover:text-brand-blue"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Export All Data
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}

