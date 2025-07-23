import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client with service role key (for server-side operations)
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

// Database types
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

// Helper functions for database operations
export const dbOperations = {
  // Documents
  async getDocuments() {
    const { data, error } = await supabase
      .from('documents')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createDocument(document: Omit<Document, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('documents')
      .insert([document])
      .select()
    return { data, error }
  },

  async updateDocument(id: string, updates: Partial<Document>) {
    const { data, error } = await supabase
      .from('documents')
      .update(updates)
      .eq('id', id)
      .select()
    return { data, error }
  },

  async deleteDocument(id: string) {
    const { data, error } = await supabase
      .from('documents')
      .delete()
      .eq('id', id)
    return { data, error }
  },

  // News
  async getNews() {
    const { data, error } = await supabase
      .from('news_updates')
      .select('*')
      .order('created_at', { ascending: false })
    return { data, error }
  },

  async createNews(news: Omit<NewsUpdate, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('news_updates')
      .insert([news])
      .select()
    return { data, error }
  },

  // Events
  async getEvents() {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
    return { data, error }
  },

  async createEvent(event: Omit<Event, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('events')
      .insert([event])
      .select()
    return { data, error }
  },

  // FAQs
  async getFAQs() {
    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .order('priority', { ascending: false })
    return { data, error }
  },

  // Search across all content
  async searchContent(query: string, filters?: {
    type?: string[]
    regulator?: string[]
    category?: string[]
  }) {
    // This would implement full-text search across documents, news, events
    // For now, we'll do basic filtering
    const results = []
    
    // Search documents
    const { data: docs } = await supabase
      .from('documents')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    
    if (docs) {
      results.push(...docs.map(doc => ({ ...doc, content_type: 'document' })))
    }

    // Search news
    const { data: newsItems } = await supabase
      .from('news_updates')
      .select('*')
      .or(`title.ilike.%${query}%,content.ilike.%${query}%`)
    
    if (newsItems) {
      results.push(...newsItems.map(news => ({ ...news, content_type: 'news' })))
    }

    // Search events
    const { data: events } = await supabase
      .from('events')
      .select('*')
      .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    
    if (events) {
      results.push(...events.map(event => ({ ...event, content_type: 'event' })))
    }

    return results
  }
}