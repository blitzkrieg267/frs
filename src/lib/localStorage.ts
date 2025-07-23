// Local Storage Database Simulation
import { auditLogger, AUDIT_ACTIONS } from './auditLogger'

export interface Document {
  id: string
  title: string
  description: string
  type: 'act' | 'regulation' | 'policy' | 'rule' | 'directive' | 'guideline' | 'form'
  regulator: string
  category: string
  file_url?: string
  file_size?: string
  tags: string[]
  status: 'active' | 'draft' | 'archived'
  priority: 'high' | 'medium' | 'low'
  entity_types: string[]
  created_at: string
  updated_at: string
  created_by: string
}

export interface NewsUpdate {
  id: string
  title: string
  content: string
  summary: string
  regulator: string
  category: string
  tags: string[]
  status: 'published' | 'draft' | 'archived'
  priority: 'high' | 'medium' | 'low'
  published_at?: string
  created_at: string
  updated_at: string
  created_by: string
}

export interface Event {
  id: string
  title: string
  description: string
  event_date: string
  end_date?: string
  location: string
  regulator: string
  category: string
  tags: string[]
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  registration_required: boolean
  registration_url?: string
  max_participants?: number
  created_at: string
  updated_at: string
  created_by: string
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  regulator: string
  tags: string[]
  status: 'active' | 'draft' | 'archived'
  priority: number
  created_at: string
  updated_at: string
  created_by: string
}

export interface User {
  id: string
  email: string
  password: string
  full_name?: string
  company?: string
  role?: string
  is_admin: boolean
  created_at: string
  last_login?: string
  metadata?: any
}

// Local Storage Keys
const STORAGE_KEYS = {
  DOCUMENTS: 'fsrf_documents',
  NEWS: 'fsrf_news',
  EVENTS: 'fsrf_events',
  FAQS: 'fsrf_faqs',
  USERS: 'fsrf_users',
  CURRENT_USER: 'fsrf_current_user'
}

// Utility functions
const generateId = () => Math.random().toString(36).substr(2, 9)
const getCurrentTimestamp = () => new Date().toISOString()

// Initialize with sample data if empty
const initializeSampleData = () => {
  if (!localStorage.getItem(STORAGE_KEYS.DOCUMENTS)) {
    const sampleDocuments: Document[] = [
      {
        id: 'doc-001',
        title: 'Banking Act (Cap 46:04)',
        description: 'Comprehensive legislation governing banking operations in Botswana',
        type: 'act',
        regulator: 'Bank of Botswana',
        category: 'Primary Legislation',
        tags: ['banking', 'legislation', 'licensing'],
        status: 'active',
        priority: 'high',
        entity_types: ['Commercial Bank', 'Investment Bank'],
        created_at: '2024-01-15T10:00:00Z',
        updated_at: '2024-01-15T10:00:00Z',
        created_by: 'admin'
      },
      {
        id: 'doc-002',
        title: 'AML/CFT Guidelines',
        description: 'Guidelines for anti-money laundering and counter-terrorist financing compliance',
        type: 'guideline',
        regulator: 'Financial Intelligence Agency',
        category: 'Compliance Guidelines',
        tags: ['AML', 'CFT', 'compliance'],
        status: 'active',
        priority: 'high',
        entity_types: ['All Financial Institutions'],
        created_at: '2024-02-01T10:00:00Z',
        updated_at: '2024-02-01T10:00:00Z',
        created_by: 'admin'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(sampleDocuments))
  }

  if (!localStorage.getItem(STORAGE_KEYS.NEWS)) {
    const sampleNews: NewsUpdate[] = [
      {
        id: 'news-001',
        title: 'New Capital Adequacy Requirements Announced',
        content: 'Bank of Botswana has announced enhanced capital adequacy requirements for commercial banks, effective from Q2 2024.',
        summary: 'BoB announces enhanced capital adequacy requirements for commercial banks',
        regulator: 'Bank of Botswana',
        category: 'Regulatory Updates',
        tags: ['capital adequacy', 'basel III', 'banking'],
        status: 'published',
        priority: 'high',
        published_at: '2024-03-01T10:00:00Z',
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-01T10:00:00Z',
        created_by: 'admin'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(sampleNews))
  }

  if (!localStorage.getItem(STORAGE_KEYS.EVENTS)) {
    const sampleEvents: Event[] = [
      {
        id: 'event-001',
        title: 'Annual Banking Supervision Conference 2024',
        description: 'Annual conference bringing together banking sector stakeholders',
        event_date: '2024-06-15T09:00:00Z',
        location: 'Gaborone International Convention Centre',
        regulator: 'Bank of Botswana',
        category: 'Conference',
        tags: ['banking', 'supervision', 'conference'],
        status: 'upcoming',
        registration_required: true,
        created_at: '2024-03-01T10:00:00Z',
        updated_at: '2024-03-01T10:00:00Z',
        created_by: 'admin'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(sampleEvents))
  }

  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    const sampleUsers: User[] = [
      {
        id: 'user-001',
        email: 'admin@bob.bw',
        password: 'admin123',
        full_name: 'Admin User',
        company: 'Bank of Botswana',
        role: 'Administrator',
        is_admin: true,
        created_at: '2024-01-01T10:00:00Z',
        last_login: '2024-03-15T14:30:00Z'
      },
      {
        id: 'user-002',
        email: 'user@nbfira.bw',
        password: 'user123',
        full_name: 'NBFIRA User',
        company: 'NBFIRA',
        role: 'Regulator',
        is_admin: false,
        created_at: '2024-02-01T10:00:00Z',
        last_login: '2024-03-14T16:20:00Z'
      }
    ]
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(sampleUsers))
  }
}

// Database operations
export const localDB = {
  // Initialize
  init: () => {
    if (typeof window !== 'undefined') {
      initializeSampleData()
    }
  },

  // Documents
  documents: {
    getAll: (): Document[] => {
      const data = localStorage.getItem(STORAGE_KEYS.DOCUMENTS)
      return data ? JSON.parse(data) : []
    },

    create: (document: Omit<Document, 'id' | 'created_at' | 'updated_at'>): Document => {
      const documents = localDB.documents.getAll()
      const newDocument: Document = {
        ...document,
        id: generateId(),
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp()
      }
      documents.push(newDocument)
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents))
      return newDocument
    },

    update: (id: string, updates: Partial<Document>): Document | null => {
      const documents = localDB.documents.getAll()
      const index = documents.findIndex(doc => doc.id === id)
      if (index === -1) return null

      const originalDocument = { ...documents[index] }
      documents[index] = {
        ...documents[index],
        ...updates,
        updated_at: getCurrentTimestamp()
      }
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents))
      return documents[index]
    },

    delete: (id: string): boolean => {
      const documents = localDB.documents.getAll()
      const filtered = documents.filter(doc => doc.id !== id)
      if (filtered.length === documents.length) return false
      
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(filtered))
      return true
    },

    search: (query: string, filters?: any): Document[] => {
      const documents = localDB.documents.getAll()
      return documents.filter(doc => {
        const matchesQuery = !query || 
          doc.title.toLowerCase().includes(query.toLowerCase()) ||
          doc.description.toLowerCase().includes(query.toLowerCase()) ||
          doc.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

        const matchesType = !filters?.type || doc.type === filters.type
        const matchesRegulator = !filters?.regulator || doc.regulator === filters.regulator
        const matchesStatus = !filters?.status || doc.status === filters.status

        return matchesQuery && matchesType && matchesRegulator && matchesStatus
      })
    }
  },

  // News
  news: {
    getAll: (): NewsUpdate[] => {
      const data = localStorage.getItem(STORAGE_KEYS.NEWS)
      return data ? JSON.parse(data) : []
    },

    create: (news: Omit<NewsUpdate, 'id' | 'created_at' | 'updated_at'>): NewsUpdate => {
      const newsItems = localDB.news.getAll()
      const newNews: NewsUpdate = {
        ...news,
        id: generateId(),
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp()
      }
      newsItems.push(newNews)
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsItems))
      return newNews
    },

    update: (id: string, updates: Partial<NewsUpdate>): NewsUpdate | null => {
      const newsItems = localDB.news.getAll()
      const index = newsItems.findIndex(item => item.id === id)
      if (index === -1) return null

      newsItems[index] = {
        ...newsItems[index],
        ...updates,
        updated_at: getCurrentTimestamp()
      }
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(newsItems))
      return newsItems[index]
    },

    delete: (id: string): boolean => {
      const newsItems = localDB.news.getAll()
      const filtered = newsItems.filter(item => item.id !== id)
      if (filtered.length === newsItems.length) return false
      
      localStorage.setItem(STORAGE_KEYS.NEWS, JSON.stringify(filtered))
      return true
    }
  },

  // Events
  events: {
    getAll: (): Event[] => {
      const data = localStorage.getItem(STORAGE_KEYS.EVENTS)
      return data ? JSON.parse(data) : []
    },

    create: (event: Omit<Event, 'id' | 'created_at' | 'updated_at'>): Event => {
      const events = localDB.events.getAll()
      const newEvent: Event = {
        ...event,
        id: generateId(),
        created_at: getCurrentTimestamp(),
        updated_at: getCurrentTimestamp()
      }
      events.push(newEvent)
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events))
      return newEvent
    },

    update: (id: string, updates: Partial<Event>): Event | null => {
      const events = localDB.events.getAll()
      const index = events.findIndex(event => event.id === id)
      if (index === -1) return null

      events[index] = {
        ...events[index],
        ...updates,
        updated_at: getCurrentTimestamp()
      }
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(events))
      return events[index]
    },

    delete: (id: string): boolean => {
      const events = localDB.events.getAll()
      const filtered = events.filter(event => event.id !== id)
      if (filtered.length === events.length) return false
      
      localStorage.setItem(STORAGE_KEYS.EVENTS, JSON.stringify(filtered))
      return true
    }
  },

  // Users
  users: {
    getAll: (): User[] => {
      const data = localStorage.getItem(STORAGE_KEYS.USERS)
      return data ? JSON.parse(data) : []
    },

    findByEmail: (email: string): User | null => {
      const users = localDB.users.getAll()
      return users.find(user => user.email === email) || null
    },

    create: (user: Omit<User, 'id' | 'created_at'>): User => {
      const users = localDB.users.getAll()
      const newUser: User = {
        ...user,
        id: generateId(),
        created_at: getCurrentTimestamp(),
        is_admin: user.email.includes('admin')
      }
      users.push(newUser)
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      return newUser
    },

    updateLastLogin: (id: string): void => {
      const users = localDB.users.getAll()
      const index = users.findIndex(user => user.id === id)
      if (index !== -1) {
        users[index].last_login = getCurrentTimestamp()
        localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users))
      }
    }
  },

  // Authentication
  auth: {
    getCurrentUser: (): User | null => {
      const data = localStorage.getItem(STORAGE_KEYS.CURRENT_USER)
      return data ? JSON.parse(data) : null
    },

    login: (email: string, password: string): { user: User | null; error: string | null } => {
      const user = localDB.users.findByEmail(email)
      
      if (!user) {
        return { user: null, error: 'User not found' }
      }

      if (user.password !== password) {
        return { user: null, error: 'Invalid password' }
      }

      // Update last login
      localDB.users.updateLastLogin(user.id)
      
      // Set current user
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user))
      
      return { user, error: null }
    },

    register: (email: string, password: string, metadata?: any): { user: User | null; error: string | null } => {
      // Check if user already exists
      if (localDB.users.findByEmail(email)) {
        return { user: null, error: 'User already exists' }
      }

      const newUser = localDB.users.create({
        email,
        password,
        full_name: metadata?.full_name,
        company: metadata?.company,
        role: metadata?.role
      })

      return { user: newUser, error: null }
    },

    logout: (): void => {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER)
    }
  },

  // Search across all content
  search: (query: string, filters?: any) => {
    const results: any[] = []

    // Search documents
    const documents = localDB.documents.search(query, filters)
    results.push(...documents.map(doc => ({ ...doc, content_type: 'document' })))

    // Search news
    const news = localDB.news.getAll().filter(item =>
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.content.toLowerCase().includes(query.toLowerCase())
    )
    results.push(...news.map(item => ({ ...item, content_type: 'news' })))

    // Search events
    const events = localDB.events.getAll().filter(event =>
      event.title.toLowerCase().includes(query.toLowerCase()) ||
      event.description.toLowerCase().includes(query.toLowerCase())
    )
    results.push(...events.map(event => ({ ...event, content_type: 'event' })))

    return results
  }
}