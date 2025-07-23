import { SearchCriteria } from "@/types/requirements"

import { Search, Settings } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CATEGORIES, COMPLIANCE_FREQUENCIES, ENTITY_TYPES, PRIORITIES, REGULATORS } from "@/lib/constants"

export function SearchCriteriaBuilder({
  criteria,
  onCriteriaChange
}: {
  criteria: SearchCriteria
  onCriteriaChange: (criteria: SearchCriteria) => void
}) {
  const updateCriteria = (field: keyof SearchCriteria, value: SearchCriteria[keyof SearchCriteria]) => {
    onCriteriaChange({ ...criteria, [field]: value })
  }

  const toggleArrayItem = (field: 'entityTypes' | 'regulators' | 'categories' | 'priorities' | 'complianceFrequency', item: string) => {
    const current = criteria[field]
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item]
    updateCriteria(field, updated)
  }

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-brand-navy">
          <Settings className="h-5 w-5" />
          Search Criteria
        </CardTitle>
        <p className="text-sm text-gray-600">
          Define your requirements to generate a customized regulatory checklist
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Keywords Search */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-brand-navy">Keywords</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by keywords (e.g., capital, liquidity, reporting)..."
              value={criteria.keywords}
              onChange={(e) => updateCriteria('keywords', e.target.value)}
              className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
        </div>

        {/* Entity Types */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Entity Types</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {ENTITY_TYPES.map(type => (
              <label key={type} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.entityTypes.includes(type)}
                  onChange={() => toggleArrayItem('entityTypes', type)}
                  className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm text-gray-700">{type}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Regulators */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Regulators</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            {REGULATORS.map(regulator => (
              <label key={regulator} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.regulators.includes(regulator)}
                  onChange={() => toggleArrayItem('regulators', regulator)}
                  className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm text-gray-700">{regulator}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Requirement Categories</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {CATEGORIES.map(category => (
              <label key={category} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.categories.includes(category)}
                  onChange={() => toggleArrayItem('categories', category)}
                  className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Priority Levels */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Priority Levels</label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {PRIORITIES.map(priority => (
              <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.priorities.includes(priority)}
                  onChange={() => toggleArrayItem('priorities', priority)}
                  className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm text-gray-700">{priority}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Compliance Frequency */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Compliance Frequency</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {COMPLIANCE_FREQUENCIES.map(freq => (
              <label key={freq} className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={criteria.complianceFrequency.includes(freq)}
                  onChange={() => toggleArrayItem('complianceFrequency', freq)}
                  className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                />
                <span className="text-sm text-gray-700">{freq}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Date Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-brand-navy">Applicable Date Range</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs text-gray-500">From Date</label>
              <Input
                type="date"
                value={criteria.dateRange.from}
                onChange={(e) => updateCriteria('dateRange', { ...criteria.dateRange, from: e.target.value })}
                className="border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs text-gray-500">To Date</label>
              <Input
                type="date"
                value={criteria.dateRange.to}
                onChange={(e) => updateCriteria('dateRange', { ...criteria.dateRange, to: e.target.value })}
                className="border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
