"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Newspaper, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  Save
} from 'lucide-react'
import { localDB, NewsUpdate } from '@/lib/localStorage'
import { useLocalAuth } from '@/components/auth/LocalAuthProvider'
import { auditLogger, AUDIT_ACTIONS } from '@/lib/auditLogger'

export function NewsManager() {
  const [news, setNews] = useState<NewsUpdate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingNews, setEditingNews] = useState<NewsUpdate | null>(null)
  const { user } = useLocalAuth()

  useEffect(() => {
    fetchNews()
  }, [])

  const fetchNews = async () => {
    try {
      const data = localDB.news.getAll()
      // Sort by created_at descending
      const sortedData = data.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      setNews(sortedData)
    } catch (error) {
      console.error('Error fetching news:', error)
      setNews([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this news article?')) return

    try {
      const newsToDelete = news.find(item => item.id === id)
      const success = localDB.news.delete(id)
      if (success) {
        setNews(news.filter(item => item.id !== id))
        
        // Log news deletion
        if (user && newsToDelete) {
          auditLogger.log({
            user_id: user.id,
            user_email: user.email,
            action: AUDIT_ACTIONS.NEWS_DELETE,
            resource_type: 'news',
            resource_id: id,
            details: `Deleted news article: ${newsToDelete.title}`,
            severity: 'medium',
            status: 'success',
            metadata: {
              regulator: newsToDelete.regulator,
              category: newsToDelete.category
            }
          })
        }
      } else {
        throw new Error('News article not found')
      }
    } catch (error) {
      console.error('Error deleting news:', error)
      alert('Error deleting news article. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      published: 'bg-green-100 text-green-800 border-green-200',
      draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      archived: 'bg-gray-100 text-gray-800 border-gray-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      high: 'bg-red-100 text-red-800 border-red-200',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      low: 'bg-green-100 text-green-800 border-green-200'
    }
    return colors[priority] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const filteredNews = news.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-navy">News Management</h2>
        </div>
        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading news articles...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <Button 
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-600 hover:bg-orange-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create News Article
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Search className="h-5 w-5" />
            Search & Filter News
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search news by title or content..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">Status</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredNews.length}</span> news articles
        </p>
        <Badge variant="outline" className="text-orange-600 border-orange-300">
          {news.length} Total Articles
        </Badge>
      </div>

      {/* News List */}
      <div className="space-y-4">
        {filteredNews.length > 0 ? (
          filteredNews.map((item) => (
            <Card key={item.id} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <Badge className={getStatusColor(item.status) + " border text-xs capitalize"}>
                        {item.status}
                      </Badge>
                      <Badge className={getPriorityColor(item.priority) + " border text-xs capitalize"}>
                        {item.priority}
                      </Badge>
                    </div>

                    <p className="text-gray-600 mb-3 line-clamp-2">{item.summary}</p>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <span>Regulator: {item.regulator}</span>
                      <span>Category: {item.category}</span>
                      <span>Created: {new Date(item.created_at).toLocaleDateString()}</span>
                      {item.published_at && (
                        <span>Published: {new Date(item.published_at).toLocaleDateString()}</span>
                      )}
                    </div>

                    <div className="flex flex-wrap gap-1 mt-2">
                      {item.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-50">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-orange-300 text-orange-600 hover:bg-orange-50"
                      onClick={() => setEditingNews(item)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white shadow-sm border border-gray-200">
            <CardContent className="text-center py-12">
              <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No News Articles Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Start by creating your first news article'
                }
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-orange-600 hover:bg-orange-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create News Article
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingNews) && (
        <NewsModal 
          news={editingNews}
          onClose={() => {
            setShowCreateModal(false)
            setEditingNews(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingNews(null)
            fetchNews()
          }}
        />
      )}
    </div>
  )
}

function NewsModal({ 
  news, 
  onClose, 
  onSuccess 
}: { 
  news: NewsUpdate | null
  onClose: () => void
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    title: news?.title || '',
    content: news?.content || '',
    summary: news?.summary || '',
    regulator: news?.regulator || 'Bank of Botswana',
    category: news?.category || 'Regulatory Updates',
    tags: news?.tags.join(', ') || '',
    priority: news?.priority || 'medium',
    status: news?.status || 'draft'
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useLocalAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const newsData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        created_by: user?.id || 'unknown',
        published_at: formData.status === 'published' ? new Date().toISOString() : undefined,
        status: formData.status as NewsUpdate['status'],
        priority: formData.priority as NewsUpdate['priority']
      }

      if (news) {
        // Update existing news
        const updatedNews = localDB.news.update(news.id, newsData)
        if (!updatedNews) throw new Error('Failed to update news')
        
        // Log news update
        if (user) {
          auditLogger.log({
            user_id: user.id,
            user_email: user.email,
            action: AUDIT_ACTIONS.NEWS_UPDATE,
            resource_type: 'news',
            resource_id: news.id,
            details: `Updated news article: ${updatedNews.title}`,
            severity: 'low',
            status: 'success',
            metadata: {
              status_change: formData.status !== news.status ? `${news.status} -> ${formData.status}` : null
            }
          })
        }
      } else {
        // Create new news
        const newNews = localDB.news.create(newsData)
        
        // Log news creation
        if (user) {
          auditLogger.log({
            user_id: user.id,
            user_email: user.email,
            action: AUDIT_ACTIONS.NEWS_CREATE,
            resource_type: 'news',
            resource_id: newNews.id,
            details: `Created news article: ${newNews.title}`,
            severity: 'low',
            status: 'success',
            metadata: {
              regulator: newNews.regulator,
              category: newNews.category,
              status: newNews.status
            }
          })
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving news:', error)
      alert('Error saving news article. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {news ? 'Edit News Article' : 'Create News Article'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Title</label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="News article title"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Regulatory Updates">Regulatory Updates</option>
                  <option value="Policy Changes">Policy Changes</option>
                  <option value="Industry News">Industry News</option>
                  <option value="Announcements">Announcements</option>
                  <option value="Market Updates">Market Updates</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Summary</label>
              <Textarea
                value={formData.summary}
                onChange={(e) => setFormData({...formData, summary: e.target.value})}
                placeholder="Brief summary of the news article"
                className="h-20"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Content</label>
              <Textarea
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
                placeholder="Full content of the news article"
                className="h-40"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Regulator</label>
                <select
                  value={formData.regulator}
                  onChange={(e) => setFormData({...formData, regulator: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="Bank of Botswana">Bank of Botswana</option>
                  <option value="NBFIRA">NBFIRA</option>
                  <option value="Financial Intelligence Agency">Financial Intelligence Agency</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={formData.priority}
                  onChange={(e) => setFormData({...formData, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., banking, regulation, announcement"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : (news ? 'Update Article' : 'Create Article')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}