export interface SavedChecklist {
  id: string
  title: string
  description: string
  category: string
  regulator: string
  entityType: string[]
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  status: 'In Progress' | 'Completed' | 'Not Started' | 'Archived'
  createdDate: string
  lastModified: string
  dueDate?: string
  totalItems: number
  completedItems: number
  tags: string[]
  isShared: boolean
  isFavorite: boolean
  sharedWith?: string[]
  notes?: string
}

export interface UserProfile {
  id: string
  name: string
  email: string
  company: string
  role: string
  entityType: string
  licenseNumber?: string
  memberSince: string
  avatar?: string
}

// Mock data for user profile
export const mockUserProfile: UserProfile = {
  id: 'user-001',
  name: 'John Doe',
  email: 'john.doe@abcfinancial.bw',
  company: 'ABC Financial Services',
  role: 'Compliance Manager',
  entityType: 'Commercial Bank',
  licenseNumber: 'FS-2024-001',
  memberSince: '2023-06-15',
  avatar: undefined
}

// Mock data for saved checklists
export const mockSavedChecklists: SavedChecklist[] = [
  {
    id: 'checklist-001',
    title: 'Commercial Bank License Application Requirements',
    description: 'Complete checklist for obtaining a commercial banking license from Bank of Botswana',
    category: 'Licensing',
    regulator: 'Bank of Botswana',
    entityType: ['Commercial Bank'],
    priority: 'Critical',
    status: 'In Progress',
    createdDate: '2024-02-15',
    lastModified: '2024-03-10',
    dueDate: '2024-04-30',
    totalItems: 28,
    completedItems: 18,
    tags: ['banking', 'license', 'capital requirements', 'documentation'],
    isShared: false,
    isFavorite: true,
    notes: 'Need to finalize capital adequacy documentation by end of March'
  },
  {
    id: 'checklist-002',
    title: 'AML/CFT Compliance Framework Setup',
    description: 'Comprehensive checklist for establishing anti-money laundering and counter-terrorist financing compliance',
    category: 'Compliance',
    regulator: 'Financial Intelligence Agency',
    entityType: ['All Financial Institutions'],
    priority: 'Critical',
    status: 'Completed',
    createdDate: '2024-01-20',
    lastModified: '2024-02-28',
    totalItems: 45,
    completedItems: 45,
    tags: ['AML', 'CFT', 'compliance', 'policies', 'training'],
    isShared: true,
    isFavorite: false,
    sharedWith: ['compliance-team@abcfinancial.bw'],
    notes: 'Successfully implemented and approved by FIA'
  },
  {
    id: 'checklist-003',
    title: 'Quarterly Capital Adequacy Reporting',
    description: 'Regulatory reporting requirements for quarterly capital adequacy submissions',
    category: 'Reporting',
    regulator: 'Bank of Botswana',
    entityType: ['Commercial Bank', 'Investment Bank'],
    priority: 'High',
    status: 'Not Started',
    createdDate: '2024-03-01',
    lastModified: '2024-03-05',
    dueDate: '2024-04-15',
    totalItems: 15,
    completedItems: 0,
    tags: ['reporting', 'capital', 'quarterly', 'basel III'],
    isShared: false,
    isFavorite: false,
    notes: 'Q1 2024 reporting deadline approaching'
  },
  {
    id: 'checklist-004',
    title: 'Corporate Governance Framework Implementation',
    description: 'Establishing board structures and governance policies per NBFIRA guidelines',
    category: 'Governance',
    regulator: 'NBFIRA',
    entityType: ['Insurance Company', 'Asset Management'],
    priority: 'Medium',
    status: 'In Progress',
    createdDate: '2024-01-10',
    lastModified: '2024-03-08',
    totalItems: 22,
    completedItems: 12,
    tags: ['governance', 'board', 'policies', 'compliance'],
    isShared: true,
    isFavorite: true,
    sharedWith: ['board@abcfinancial.bw', 'governance@abcfinancial.bw']
  },
  {
    id: 'checklist-005',
    title: 'Payment System Security Compliance',
    description: 'Security requirements for electronic payment system implementation',
    category: 'Technology',
    regulator: 'Bank of Botswana',
    entityType: ['Payment Service Provider'],
    priority: 'High',
    status: 'Archived',
    createdDate: '2023-11-15',
    lastModified: '2024-01-20',
    totalItems: 32,
    completedItems: 32,
    tags: ['payments', 'security', 'PCI DSS', 'technology'],
    isShared: false,
    isFavorite: false,
    notes: 'Archived after successful implementation and certification'
  }
]
