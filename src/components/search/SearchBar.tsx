import React, { useState, useEffect } from 'react'
import { Search, Filter, Download, FileText, Calendar, Newspaper, File, Eye, Clock, ChevronRight, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { CATEGORIES, ITEM_TYPES, mockSearchData, REGULATORS, SearchableItem } from '@/types/search'
import { PRIORITIES } from '@/lib/constants'

interface SearchProps {
  searchTerm: string
  onSearchChange: (search: string) => void
  onSearch: () => void
}
export function SearchBar({ searchTerm, onSearchChange, onSearch }: SearchProps) {
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const popularSearches = [
    'capital adequacy',
    'AML guidelines',
    'license application',
    'suspicious transaction',
    'insurance regulations',
    'payment systems'
  ]

  useEffect(() => {
    if (searchTerm.length > 2) {
      const matchingSuggestions = mockSearchData
        .filter(item =>
          item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .slice(0, 5)
        .map(item => item.title)

      setSuggestions([...new Set(matchingSuggestions)])
      setShowSuggestions(true)
    } else {
      setShowSuggestions(false)
    }
  }, [searchTerm])

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <Input
          placeholder="Search documents, forms, events, news..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="pl-12 pr-24 h-12 text-lg border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
        />
        <Button
          onClick={onSearch}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-brand-blue hover:bg-brand-navy px-6"
        >
          Search
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-10 mt-1">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => {
                onSearchChange(suggestion)
                setShowSuggestions(false)
                onSearch()
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-gray-400" />
                <span className="text-gray-700">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {!searchTerm && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Popular searches:</p>
          <div className="flex flex-wrap gap-2">
            {popularSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => {
                  onSearchChange(search)
                  onSearch()
                }}
                className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm hover:bg-brand-blue hover:text-white transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

interface FilterProps {
  filters: {
    types: string[],
    regulators: string[],
    categories: string[],
    priorities: string[],
    dateRange: { from: string, to: string }
  }
  onFiltersChange: (updatedFilters: FilterProps['filters']) => void
}

export function AdvancedFilters({ filters, onFiltersChange }: FilterProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const updateFilter = (key: string, value: string[]) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const toggleArrayFilter = (key: keyof FilterProps['filters'], value: string) => {
    const current = filters[key]
    if (Array.isArray(current)) {

      const updated = current.includes(value)
        ? current.filter(item => item !== value)
        : [...current, value]
      updateFilter(key, updated)
    }
  }

  const clearAllFilters = () => {
    onFiltersChange({
      types: [],
      regulators: [],
      categories: [],
      priorities: [],
      dateRange: { from: '', to: '' }
    })
  }

  const activeFiltersCount =
    (filters.types || []).length +
    (filters.regulators || []).length +
    (filters.categories || []).length +
    (filters.priorities || []).length

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-brand-navy">
            <Filter className="h-5 w-5" />
            Advanced Filters
            {activeFiltersCount > 0 && (
              <Badge className="bg-brand-blue text-white">
                {activeFiltersCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center gap-2">
            {activeFiltersCount > 0 && (
              <Button
                onClick={clearAllFilters}
                variant="outline"
                size="sm"
                className="text-xs"
              >
                Clear All
              </Button>
            )}
            <Button
              onClick={() => setIsExpanded(!isExpanded)}
              variant="ghost"
              size="sm"
            >
              {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-6">
          {/* Content Types */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-brand-navy">Content Types</label>
            <div className="grid grid-cols-2 gap-2">
              {ITEM_TYPES.map(type => {
                const Icon = type.icon
                return (
                  <label key={type.id} className="flex items-center space-x-2 cursor-pointer p-2 rounded hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={(filters.types || []).includes(type.id)}
                      onChange={() => toggleArrayFilter('types', type.id)}
                      className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                    />
                    <Icon className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700">{type.label}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Regulators */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-brand-navy">Regulators</label>
            <div className="space-y-2">
              {REGULATORS.map(regulator => (
                <label key={regulator} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.regulators || []).includes(regulator)}
                    onChange={() => toggleArrayFilter('regulators', regulator)}
                    className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm text-gray-700">{regulator}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-brand-navy">Categories</label>
            <div className="grid grid-cols-1 gap-2">
              {CATEGORIES.map(category => (
                <label key={category} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.categories || []).includes(category)}
                    onChange={() => toggleArrayFilter('categories', category)}
                    className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm text-gray-700">{category}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Priorities */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-brand-navy">Priority</label>
            <div className="space-y-2">
              {PRIORITIES.map(priority => (
                <label key={priority} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(filters.priorities || []).includes(priority)}
                    onChange={() => toggleArrayFilter('priorities', priority)}
                    className="rounded border-brand-blue/30 text-brand-blue focus:ring-brand-blue"
                  />
                  <span className="text-sm text-gray-700">{priority}</span>
                </label>
              ))}
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}

interface SearchResultProps {
  item: SearchableItem
  viewMode: string
}
export function SearchResultCard({ item }: SearchResultProps) {
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'document': return FileText
      case 'form': return File
      case 'event': return Calendar
      case 'news': return Newspaper
      default: return FileText
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'document': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'form': return 'bg-green-100 text-green-800 border-green-200'
      case 'event': return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'news': return 'bg-orange-100 text-orange-800 border-orange-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-200'
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

  const TypeIcon = getTypeIcon(item.type)

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 hover:shadow-lg transition-all duration-200 h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            <TypeIcon className="h-4 w-4 text-brand-blue" />
            <Badge className={getTypeColor(item.type) + " border text-xs capitalize"}>
              {item.type}
            </Badge>
            {item.isNew && <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">NEW</Badge>}
            {item.isTrending && <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">TRENDING</Badge>}
          </div>
          <Badge className={getPriorityColor(item.priority) + " border text-xs"}>
            {item.priority}
          </Badge>
        </div>

        <h3 className="text-lg font-semibold text-brand-navy mb-2 line-clamp-2 hover:text-brand-blue cursor-pointer">
          {item.title}
        </h3>

        <Badge className={getRegulatorColor(item.regulator) + " border text-xs w-fit"}>
          {item.regulator}
        </Badge>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-gray-600 text-sm line-clamp-3">{item.description}</p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{new Date(item.lastUpdated).toLocaleDateString()}</span>
          </div>
          {item.fileSize && (
            <div className="flex items-center gap-1">
              <Download className="h-3 w-3" />
              <span>{item.fileSize}</span>
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-1">
          {item.tags.slice(0, 2).map(tag => (
            <Badge key={tag} variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
              {tag}
            </Badge>
          ))}
          {item.tags.length > 2 && (
            <Badge variant="outline" className="text-xs border-gray-300 text-gray-500">
              +{item.tags.length - 2}
            </Badge>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            className="flex-1 bg-brand-blue hover:bg-brand-navy text-white"
          >
            <Eye className="h-3 w-3 mr-1" />
            View
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white"
          >
            <Download className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
