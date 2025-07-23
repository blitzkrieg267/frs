import { Calendar, File, FileText, Newspaper } from "lucide-react"

export interface SearchableItem {
  id: string
  type: 'document' | 'form' | 'event' | 'news'
  title: string
  description: string
  regulator: string
  category: string
  tags: string[]
  datePublished: string
  lastUpdated: string
  fileSize?: string
  fileType?: string
  priority: 'High' | 'Medium' | 'Low'
  status: 'Active' | 'Draft' | 'Archived' | 'Updated'
  popularity: number
  entityTypes: string[]
  isNew?: boolean
  isTrending?: boolean
}

export const mockSearchData: SearchableItem[] = [
  {
    id: 'doc-001',
    type: 'document',
    title: 'Banking Act (Cap 46:04)',
    description: 'Comprehensive legislation governing banking operations in Botswana',
    regulator: 'Bank of Botswana',
    category: 'Primary Legislation',
    tags: ['banking', 'legislation', 'licensing', 'supervision'],
    datePublished: '2020-01-01',
    lastUpdated: '2024-01-15',
    fileSize: '2.4 MB',
    fileType: 'PDF',
    priority: 'High',
    status: 'Active',
    popularity: 95,
    entityTypes: ['Commercial Bank', 'Investment Bank'],
    isNew: false,
    isTrending: true
  },
  {
    id: 'form-001',
    type: 'form',
    title: 'Commercial Bank License Application Form',
    description: 'Application form for obtaining a commercial banking license',
    regulator: 'Bank of Botswana',
    category: 'Licensing Forms',
    tags: ['application', 'licensing', 'commercial bank', 'form'],
    datePublished: '2023-06-01',
    lastUpdated: '2024-02-01',
    fileSize: '856 KB',
    fileType: 'PDF',
    priority: 'High',
    status: 'Active',
    popularity: 78,
    entityTypes: ['Commercial Bank'],
    isNew: false,
    isTrending: false
  },
  {
    id: 'news-001',
    type: 'news',
    title: 'New Capital Adequacy Requirements Announced',
    description: 'Bank of Botswana announces enhanced capital adequacy requirements for commercial banks',
    regulator: 'Bank of Botswana',
    category: 'Regulatory Updates',
    tags: ['capital adequacy', 'basel III', 'announcement', 'requirements'],
    datePublished: '2024-03-01',
    lastUpdated: '2024-03-01',
    priority: 'High',
    status: 'Active',
    popularity: 89,
    entityTypes: ['Commercial Bank', 'Investment Bank'],
    isNew: true,
    isTrending: true
  },
  {
    id: 'event-001',
    type: 'event',
    title: 'Annual Banking Supervision Conference 2024',
    description: 'Annual conference bringing together banking sector stakeholders',
    regulator: 'Bank of Botswana',
    category: 'Industry Events',
    tags: ['conference', 'supervision', 'banking', 'networking'],
    datePublished: '2024-01-20',
    lastUpdated: '2024-02-15',
    priority: 'Medium',
    status: 'Active',
    popularity: 65,
    entityTypes: ['All Financial Institutions'],
    isNew: false,
    isTrending: false
  },
  {
    id: 'doc-002',
    type: 'document',
    title: 'AML/CFT Guidelines for Financial Institutions',
    description: 'Comprehensive guidelines for anti-money laundering and counter-terrorist financing compliance',
    regulator: 'Financial Intelligence Agency',
    category: 'Compliance Guidelines',
    tags: ['AML', 'CFT', 'compliance', 'guidelines', 'reporting'],
    datePublished: '2023-04-01',
    lastUpdated: '2024-02-20',
    fileSize: '3.1 MB',
    fileType: 'PDF',
    priority: 'High',
    status: 'Updated',
    popularity: 92,
    entityTypes: ['All Financial Institutions'],
    isNew: false,
    isTrending: true
  },
  {
    id: 'form-002',
    type: 'form',
    title: 'Suspicious Transaction Report (STR) Form',
    description: 'Form for reporting suspicious transactions to FIA',
    regulator: 'Financial Intelligence Agency',
    category: 'Reporting Forms',
    tags: ['STR', 'reporting', 'suspicious', 'transaction'],
    datePublished: '2023-03-15',
    lastUpdated: '2024-01-10',
    fileSize: '245 KB',
    fileType: 'PDF',
    priority: 'High',
    status: 'Active',
    popularity: 71,
    entityTypes: ['All Financial Institutions'],
    isNew: false,
    isTrending: false
  }
]

// Filter options
export const ITEM_TYPES = [
  { id: 'document', label: 'Documents', icon: FileText },
  { id: 'form', label: 'Forms', icon: File },
  { id: 'event', label: 'Events', icon: Calendar },
  { id: 'news', label: 'News', icon: Newspaper }
]

export const REGULATORS = ['Bank of Botswana', 'NBFIRA', 'Financial Intelligence Agency']
export const CATEGORIES = [
  'Primary Legislation', 'Compliance Guidelines', 'Licensing Forms', 'Regulatory Updates',
  'Industry Events', 'Legislative Updates', 'Market Reports', 'Training Events'
]
export const PRIORITIES = ['High', 'Medium', 'Low']
