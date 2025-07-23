"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { 
  Calendar, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Eye,
  MapPin,
  Users,
  Save
} from 'lucide-react'
import { localDB, Event } from '@/lib/localStorage'
import { useLocalAuth } from '@/components/auth/LocalAuthProvider'
import { auditLogger, AUDIT_ACTIONS } from '@/lib/auditLogger'

export function EventManager() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const { user } = useLocalAuth()

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      const data = localDB.events.getAll()
      // Sort by event_date ascending
      const sortedData = data.sort((a, b) => new Date(a.event_date).getTime() - new Date(b.event_date).getTime())
      setEvents(sortedData)
    } catch (error) {
      console.error('Error fetching events:', error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const eventToDelete = events.find(event => event.id === id)
      const success = localDB.events.delete(id)
      if (success) {
        setEvents(events.filter(event => event.id !== id))
        
        // Log event deletion
        if (user && eventToDelete) {
          auditLogger.log({
            user_id: user.id,
            user_email: user.email,
            action: AUDIT_ACTIONS.EVENT_DELETE,
            resource_type: 'event',
            resource_id: id,
            details: `Deleted event: ${eventToDelete.title}`,
            severity: 'medium',
            status: 'success',
            metadata: {
              event_date: eventToDelete.event_date,
              regulator: eventToDelete.regulator
            }
          })
        }
      } else {
        throw new Error('Event not found')
      }
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event. Please try again.')
    }
  }

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      upcoming: 'bg-blue-100 text-blue-800 border-blue-200',
      ongoing: 'bg-green-100 text-green-800 border-green-200',
      completed: 'bg-gray-100 text-gray-800 border-gray-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || event.status === selectedStatus
    
    return matchesSearch && matchesStatus
  })

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-navy">Event Management</h2>
        </div>
        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading events...</p>
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
          className="bg-purple-600 hover:bg-purple-700 text-white"
        >
          <Plus className="h-4 w-4 mr-2" />
          Create Event
        </Button>
      </div>

      {/* Search and Filters */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Search className="h-5 w-5" />
            Search & Filter Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search events by title or description..."
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
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredEvents.length}</span> events
        </p>
        <Badge variant="outline" className="text-purple-600 border-purple-300">
          {events.length} Total Events
        </Badge>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <Card key={event.id} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
                      <Badge className={getStatusColor(event.status) + " border text-xs capitalize"}>
                        {event.status}
                      </Badge>
                      {event.registration_required && (
                        <Badge className="bg-purple-100 text-purple-800 border-purple-200 text-xs">
                          Registration Required
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{event.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>{new Date(event.event_date).toLocaleDateString()}</span>
                        {event.end_date && (
                          <span> - {new Date(event.end_date).toLocaleDateString()}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        <span>{event.location}</span>
                      </div>
                      {event.max_participants && (
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          <span>Max: {event.max_participants}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-2">
                      <span>Regulator: {event.regulator}</span>
                      <span>Category: {event.category}</span>
                      <span>Created: {new Date(event.created_at).toLocaleDateString()}</span>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {event.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-purple-300 text-purple-600 hover:bg-purple-50">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-purple-300 text-purple-600 hover:bg-purple-50"
                      onClick={() => setEditingEvent(event)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="border-red-300 text-red-600 hover:bg-red-50"
                      onClick={() => handleDelete(event.id)}
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
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Events Found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || selectedStatus !== 'all'
                  ? 'Try adjusting your search criteria'
                  : 'Start by creating your first event'
                }
              </p>
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-purple-600 hover:bg-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Event
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create/Edit Modal */}
      {(showCreateModal || editingEvent) && (
        <EventModal 
          event={editingEvent}
          onClose={() => {
            setShowCreateModal(false)
            setEditingEvent(null)
          }}
          onSuccess={() => {
            setShowCreateModal(false)
            setEditingEvent(null)
            fetchEvents()
          }}
        />
      )}
    </div>
  )
}

function EventModal({ 
  event, 
  onClose, 
  onSuccess 
}: { 
  event: Event | null
  onClose: () => void
  onSuccess: () => void 
}) {
  const [formData, setFormData] = useState({
    title: event?.title || '',
    description: event?.description || '',
    event_date: event?.event_date?.split('T')[0] || '',
    end_date: event?.end_date?.split('T')[0] || '',
    location: event?.location || '',
    regulator: event?.regulator || 'Bank of Botswana',
    category: event?.category || 'Conference',
    tags: event?.tags.join(', ') || '',
    status: event?.status || 'upcoming',
    registration_required: event?.registration_required || false,
    registration_url: event?.registration_url || '',
    max_participants: event?.max_participants?.toString() || ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { user } = useLocalAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const eventData = {
        ...formData,
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean),
        max_participants: formData.max_participants ? parseInt(formData.max_participants) : undefined,
        created_by: user?.id || 'unknown',
        status: formData.status as Event['status']
      }

      if (event) {
        // Update existing event
        const updatedEvent = localDB.events.update(event.id, eventData)
        if (!updatedEvent) throw new Error('Failed to update event')
        
        // Log event update
        if (user) {
          auditLogger.log({
            user_id: user.id,
            user_email: user.email,
            action: AUDIT_ACTIONS.EVENT_UPDATE,
            resource_type: 'event',
            resource_id: event.id,
            details: `Updated event: ${updatedEvent.title}`,
            severity: 'low',
            status: 'success',
            metadata: {
              status_change: formData.status !== event.status ? `${event.status} -> ${formData.status}` : null
            }
          })
        }
      } else {
        // Create new event
        const newEvent = localDB.events.create(eventData)
        
        // Log event creation
        if (user) {
          auditLogger.log({
            user_id: user.id,
            user_email: user.email,
            action: AUDIT_ACTIONS.EVENT_CREATE,
            resource_type: 'event',
            resource_id: newEvent.id,
            details: `Created event: ${newEvent.title}`,
            severity: 'low',
            status: 'success',
            metadata: {
              event_date: newEvent.event_date,
              regulator: newEvent.regulator,
              location: newEvent.location
            }
          })
        }
      }

      onSuccess()
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Error saving event. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl bg-white max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="text-gray-900">
            {event ? 'Edit Event' : 'Create Event'}
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
                  placeholder="Event title"
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
                  <option value="Conference">Conference</option>
                  <option value="Workshop">Workshop</option>
                  <option value="Training">Training</option>
                  <option value="Seminar">Seminar</option>
                  <option value="Meeting">Meeting</option>
                  <option value="Consultation">Consultation</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Event description"
                className="h-24"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Start Date</label>
                <Input
                  type="date"
                  value={formData.event_date}
                  onChange={(e) => setFormData({...formData, event_date: e.target.value})}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">End Date (Optional)</label>
                <Input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({...formData, end_date: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Location</label>
                <Input
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                  placeholder="Event location"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <label className="text-sm font-medium text-gray-700">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Max Participants (Optional)</label>
                <Input
                  type="number"
                  value={formData.max_participants}
                  onChange={(e) => setFormData({...formData, max_participants: e.target.value})}
                  placeholder="Maximum number of participants"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Registration URL (Optional)</label>
                <Input
                  type="url"
                  value={formData.registration_url}
                  onChange={(e) => setFormData({...formData, registration_url: e.target.value})}
                  placeholder="https://registration-link.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Tags (comma-separated)</label>
              <Input
                value={formData.tags}
                onChange={(e) => setFormData({...formData, tags: e.target.value})}
                placeholder="e.g., conference, banking, training"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="registration_required"
                checked={formData.registration_required}
                onChange={(e) => setFormData({...formData, registration_required: e.target.checked})}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="registration_required" className="text-sm text-gray-700">
                Registration Required
              </label>
            </div>

            <div className="flex justify-end gap-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                disabled={isSubmitting}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Saving...' : (event ? 'Update Event' : 'Create Event')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}