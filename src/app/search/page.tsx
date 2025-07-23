"use client"

import React, { useState, useMemo } from 'react'
import { Search, BookOpen, Grid, List } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ITEM_TYPES, mockSearchData } from '@/types/search'
import { AdvancedFilters, SearchBar, SearchResultCard } from '@/components/search/SearchBar'
import { localDB } from '@/lib/localStorage'
import { auditLogger, AUDIT_ACTIONS } from '@/lib/auditLogger'
import { useLocalAuth } from '@/components/auth/LocalAuthProvider'

interface Filters {
  types: string[];
  regulators: string[];
  categories: string[];
  priorities: string[];
  dateRange: { from: string; to: string };
}

export default function AdvancedSearchEngine() {
  const { user } = useLocalAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<Filters>({
    types: [],
    regulators: [],
    categories: [],
    priorities: [],
    dateRange: { from: '', to: '' }
  })

  const [searchOptions, setSearchOptions] = useState({
    sortBy: 'relevance',
    sortOrder: 'desc',
    viewMode: 'grid',
    resultsPerPage: 12
  })

  const [currentPage, setCurrentPage] = useState(1)
  const [hasSearched, setHasSearched] = useState(false)

  // Initialize local database
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localDB.init()
    }
  }, [])

  // Search and filter logic
  const filteredResults = useMemo(() => {
    // Get data from local storage and transform to search format
    let results: any[] = []
    
    if (typeof window !== 'undefined') {
      const documents = localDB.documents.getAll().map(doc => ({
        id: doc.id,
        type: 'document',
        title: doc.title,
        description: doc.description,
        regulator: doc.regulator,
        category: doc.category,
        tags: doc.tags,
        datePublished: doc.created_at.split('T')[0],
        lastUpdated: doc.updated_at.split('T')[0],
        fileSize: doc.file_size,
        fileType: 'PDF',
        priority: doc.priority.charAt(0).toUpperCase() + doc.priority.slice(1),
        status: doc.status.charAt(0).toUpperCase() + doc.status.slice(1),
        popularity: 85,
        entityTypes: doc.entity_types,
        isNew: false,
        isTrending: false
      }))

      const news = localDB.news.getAll().map(item => ({
        id: item.id,
        type: 'news',
        title: item.title,
        description: item.summary,
        regulator: item.regulator,
        category: item.category,
        tags: item.tags,
        datePublished: item.created_at.split('T')[0],
        lastUpdated: item.updated_at.split('T')[0],
        priority: item.priority.charAt(0).toUpperCase() + item.priority.slice(1),
        status: item.status.charAt(0).toUpperCase() + item.status.slice(1),
        popularity: 75,
        entityTypes: ['All Financial Institutions'],
        isNew: item.status === 'published',
        isTrending: true
      }))

      const events = localDB.events.getAll().map(event => ({
        id: event.id,
        type: 'event',
        title: event.title,
        description: event.description,
        regulator: event.regulator,
        category: event.category,
        tags: event.tags,
        datePublished: event.created_at.split('T')[0],
        lastUpdated: event.updated_at.split('T')[0],
        priority: 'Medium',
        status: event.status.charAt(0).toUpperCase() + event.status.slice(1),
        popularity: 65,
        entityTypes: ['All Financial Institutions'],
        isNew: false,
        isTrending: false
      }))

      results = [...documents, ...news, ...events]
    }

    // Text search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      results = results.filter(item =>
        item.title.toLowerCase().includes(searchLower) ||
        item.description.toLowerCase().includes(searchLower) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchLower)) ||
        item.category.toLowerCase().includes(searchLower)
      )
    }

    // Apply filters
    if (filters.types && filters.types.length > 0) {
      results = results.filter(item => filters.types.includes(item.type))
    }

    if (filters.regulators && filters.regulators.length > 0) {
      results = results.filter(item => filters.regulators.includes(item.regulator))
    }

    if (filters.categories && filters.categories.length > 0) {
      results = results.filter(item => filters.categories.includes(item.category))
    }

    if (filters.priorities && filters.priorities.length > 0) {
      results = results.filter(item => filters.priorities.includes(item.priority))
    }

    // Sort results
    results.sort((a, b) => {
      let comparison = 0

      switch (searchOptions.sortBy) {
        case 'relevance':
          comparison = b.popularity - a.popularity
          break
        case 'date':
          comparison = new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
          break
        case 'popularity':
          comparison = b.popularity - a.popularity
          break
        case 'title':
          comparison = a.title.localeCompare(b.title)
          break
      }

      return searchOptions.sortOrder === 'asc' ? comparison : -comparison
    })

    return results
  }, [searchTerm, filters, searchOptions.sortBy, searchOptions.sortOrder])

  // Pagination
  const totalPages = Math.ceil(filteredResults.length / searchOptions.resultsPerPage)
  const paginatedResults = filteredResults.slice(
    (currentPage - 1) * searchOptions.resultsPerPage,
    currentPage * searchOptions.resultsPerPage
  )

  const handleSearch = () => {
    setHasSearched(true)
    setCurrentPage(1)
    
    // Log search activity
    if (user) {
      auditLogger.log({
        user_id: user.id,
        user_email: user.email,
        action: AUDIT_ACTIONS.SEARCH_PERFORMED,
        resource_type: 'system',
        details: `Advanced search performed with term: "${searchTerm}"`,
        severity: 'low',
        status: 'success',
        metadata: {
          search_term: searchTerm,
          filters_applied: {
            types: filters.types,
            regulators: filters.regulators,
            categories: filters.categories,
            priorities: filters.priorities
          },
          results_count: filteredResults.length
        }
      })
    }
  }

  const updateSearchOptions = (key: string, value: string) => {
    setSearchOptions(prev => ({ ...prev, [key]: value }))
    setCurrentPage(1)
  }

  // Get type counts for filter display
  const typeCounts = useMemo(() => {
    const counts: Record<string, number> = { document: 0, form: 0, event: 0, news: 0 }
    filteredResults.forEach(item => {
      counts[item.type]++
    })
    return counts
  }, [filteredResults])

  return (
    <div className="min-h-full bg-gradient-to-br from-brand-cream to-brand-light-blue">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-brand-blue/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">
              Advanced Regulatory Search Engine
            </h1>
            <p className="text-gray-600 mt-2">
              Comprehensive search across documents, forms, events, and news from all regulatory bodies
            </p>
          </div>

          <SearchBar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AdvancedFilters filters={filters} onFiltersChange={setFilters} />

            {/* Quick Stats */}
            <Card className="mt-6 bg-white/90 backdrop-blur-sm border-brand-blue/20">
              <CardHeader>
                <CardTitle className="text-lg text-brand-navy">Search Results</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-brand-blue">
                      {filteredResults.length}
                    </div>
                    <p className="text-sm text-gray-600">Total Results</p>
                  </div>

                  <div className="space-y-2">
                    {ITEM_TYPES.map(type => {
                      const Icon = type.icon
                      const count = typeCounts[type.id]
                      return (
                        <div key={type.id} className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4 text-gray-500" />
                            <span className="text-gray-700">{type.label}</span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {count}
                          </Badge>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {hasSearched && (
              <>
                {/* Results Header */}
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-4">
                    <h2 className="text-xl font-semibold text-brand-navy">
                      Search Results
                      {searchTerm && (
                        <span className="text-base font-normal text-gray-600 ml-2">
                          for {searchTerm}
                        </span>
                      )}
                    </h2>
                    <Badge variant="outline" className="text-brand-blue border-brand-blue/30">
                      {filteredResults.length} results
                    </Badge>
                  </div>

                  {/* View Options */}
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="text-sm text-gray-600">Sort by:</label>
                      <select
                        value={searchOptions.sortBy}
                        onChange={(e) => updateSearchOptions('sortBy', e.target.value)}
                        className="text-sm border border-gray-300 rounded px-2 py-1"
                      >
                        <option value="relevance">Relevance</option>
                        <option value="date">Date</option>
                        <option value="popularity">Popularity</option>
                        <option value="title">Title</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant={searchOptions.viewMode === 'grid' ? 'default' : 'outline'}
                        onClick={() => updateSearchOptions('viewMode', 'grid')}
                        className="p-2"
                      >
                        <Grid className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant={searchOptions.viewMode === 'list' ? 'default' : 'outline'}
                        onClick={() => updateSearchOptions('viewMode', 'list')}
                        className="p-2"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Results Grid */}
                {filteredResults.length > 0 ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {paginatedResults.map(item => (
                        <SearchResultCard
                          key={item.id}
                          item={item}
                          viewMode={searchOptions.viewMode}
                        />
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex justify-center items-center gap-4 mt-8">
                        <Button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          variant="outline"
                        >
                          Previous
                        </Button>

                        <div className="flex items-center gap-2">
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const page = i + 1
                            return (
                              <Button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                variant={currentPage === page ? 'default' : 'outline'}
                                size="sm"
                              >
                                {page}
                              </Button>
                            )
                          })}
                        </div>

                        <Button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          variant="outline"
                        >
                          Next
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
                    <CardContent className="text-center py-12">
                      <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 mb-2">No Results Found</h3>
                      <p className="text-gray-500 mb-4">
                        Try adjusting your search terms or filters to find what youre looking for
                      </p>
                      <Button
                        onClick={() => {
                          setSearchTerm('')
                          setFilters({
                            types: [],
                            regulators: [],
                            categories: [],
                            priorities: [],
                            dateRange: { from: '', to: '' }
                          })
                        }}
                        variant="outline"
                        className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                      >
                        Clear All Filters
                      </Button>
                    </CardContent>
                  </Card>
                )}
              </>
            )}

            {/* Welcome State */}
            {!hasSearched && (
              <div className="text-center py-16">
                <BookOpen className="h-16 w-16 text-brand-blue mx-auto mb-6" />
                <h2 className="text-2xl font-bold text-brand-navy mb-4">
                  Discover Regulatory Content
                </h2>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  Use our advanced search engine to find documents, forms, events, and news across
                  Bank of Botswana, NBFIRA, and Financial Intelligence Agency
                </p>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                  {ITEM_TYPES.map(type => {
                    const Icon = type.icon
                    const totalCount = results.filter(item => item.type === type.id).length
                    return (
                      <Card
                        key={type.id}
                        className="bg-white/80 backdrop-blur-sm border-brand-blue/20 text-center p-6 hover:shadow-lg transition-shadow cursor-pointer"
                        onClick={() => {
                          setFilters(prev => ({ ...prev, types: [type.id] }))
                          handleSearch()
                        }}
                      >
                        <Icon className="h-8 w-8 text-brand-blue mx-auto mb-3" />
                        <h3 className="font-semibold text-brand-navy mb-1">{type.label}</h3>
                        <p className="text-2xl font-bold text-brand-blue mb-1">{totalCount}</p>
                        <p className="text-xs text-gray-500">Available</p>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
