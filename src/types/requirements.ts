
export interface RegulatoryRequirement {
  id: string
  title: string
  category: string
  regulator: string
  entityType: string[]
  priority: 'Critical' | 'High' | 'Medium' | 'Low'
  description: string
  specificRequirements: string[]
  documents: string[]
  timeline: string
  applicableSince: string
  lastUpdated: string
  compliance: {
    frequency: string
    deadline: string
    penalties: string
  }
  references: {
    regulation: string
    section: string
    url: string
  }[]
  tags: string[]
}

export interface SearchCriteria {
  entityTypes: string[]
  regulators: string[]
  categories: string[]
  priorities: string[]
  keywords: string
  complianceFrequency: string[]
  dateRange: {
    from: string
    to: string
  }
}

export interface GeneratedReport {
  criteria: SearchCriteria
  requirements: RegulatoryRequirement[]
  generatedAt: string
  totalRequirements: number
  criticalRequirements: number
}
