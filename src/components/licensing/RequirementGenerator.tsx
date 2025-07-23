"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GeneratedReport, SearchCriteria } from '@/types/requirements'
import { RequirementCard } from './RequirementCard'
import { useMemo, useState } from 'react'
import { mockRequirements } from '@/lib/constants'
import { SearchCriteriaBuilder } from './SearchBuilder'
import { BookOpen, Clock, FileText, Search, Target } from 'lucide-react'
import { Badge } from '../ui/badge'
import { GeneratedReportPage } from './GeneratedReport'

export default function RegulatoryRequirementsGenerator() {
  const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
    entityTypes: [],
    regulators: [],
    categories: [],
    priorities: [],
    keywords: '',
    complianceFrequency: [],
    dateRange: {
      from: '',
      to: ''
    }
  })

  const [generatedReport, setGeneratedReport] = useState<GeneratedReport | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  // Filter requirements based on criteria
  const filteredRequirements = useMemo(() => {
    return mockRequirements.filter(req => {
      // Entity type filter
      if (searchCriteria.entityTypes.length > 0) {
        const hasMatchingEntity = searchCriteria.entityTypes.some(entityType =>
          req.entityType.includes(entityType) || req.entityType.includes('All Financial Institutions')
        )
        if (!hasMatchingEntity) return false
      }

      // Regulator filter
      if (searchCriteria.regulators.length > 0 && !searchCriteria.regulators.includes(req.regulator)) {
        return false
      }

      // Category filter
      if (searchCriteria.categories.length > 0 && !searchCriteria.categories.includes(req.category)) {
        return false
      }

      // Priority filter
      if (searchCriteria.priorities.length > 0 && !searchCriteria.priorities.includes(req.priority)) {
        return false
      }

      // Compliance frequency filter
      if (searchCriteria.complianceFrequency.length > 0 && !searchCriteria.complianceFrequency.includes(req.compliance.frequency)) {
        return false
      }

      // Keywords filter
      if (searchCriteria.keywords) {
        const keywords = searchCriteria.keywords.toLowerCase()
        const searchableText = `${req.title} ${req.description} ${req.category} ${req.tags.join(' ')}`.toLowerCase()
        if (!searchableText.includes(keywords)) return false
      }

      // Date range filter
      if (searchCriteria.dateRange.from) {
        if (new Date(req.applicableSince) < new Date(searchCriteria.dateRange.from)) return false
      }
      if (searchCriteria.dateRange.to) {
        if (new Date(req.applicableSince) > new Date(searchCriteria.dateRange.to)) return false
      }

      return true
    })
  }, [searchCriteria])

  const handleGenerateReport = async () => {
    setIsGenerating(true)

    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 1500))

    const report: GeneratedReport = {
      criteria: searchCriteria,
      requirements: filteredRequirements,
      generatedAt: new Date().toISOString(),
      totalRequirements: filteredRequirements.length,
      criticalRequirements: filteredRequirements.filter(r => r.priority === 'Critical').length
    }

    setGeneratedReport(report)
    setIsGenerating(false)
  }

  const handleDownload = (format: string) => {
    // In a real app, this would generate and download the actual file
    alert(`Downloading requirements report in ${format.toUpperCase()} format...`)
  }

  const clearCriteria = () => {
    setSearchCriteria({
      entityTypes: [],
      regulators: [],
      categories: [],
      priorities: [],
      keywords: '',
      complianceFrequency: [],
      dateRange: {
        from: '',
        to: ''
      }
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-brand-blue/20 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">
              Regulatory Requirements Generator
            </h1>
            <p className="text-gray-600 mt-2 max-w-3xl mx-auto">
              Generate customized, downloadable lists of regulatory requirements based on your specific business needs and compliance obligations
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Search Criteria Panel */}
          <div className="lg:col-span-1">
            <SearchCriteriaBuilder
              criteria={searchCriteria}
              onCriteriaChange={setSearchCriteria}
            />

            {/* Action Buttons */}
            <Card className="mt-6 bg-white/90 backdrop-blur-sm border-brand-blue/20">
              <CardContent className="p-6 space-y-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-brand-blue mb-1">
                    {filteredRequirements.length}
                  </div>
                  <p className="text-sm text-gray-600">Requirements Found</p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-center">
                    <div className="font-semibold text-red-600">
                      {filteredRequirements.filter(r => r.priority === 'Critical').length}
                    </div>
                    <p className="text-gray-500">Critical</p>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-orange-600">
                      {filteredRequirements.filter(r => r.priority === 'High').length}
                    </div>
                    <p className="text-gray-500">High</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleGenerateReport}
                    disabled={filteredRequirements.length === 0 || isGenerating}
                    className="w-full hover:bg-brand-navy text-white"
                  >
                    {isGenerating ? (
                      <>
                        <Clock className="h-4 w-4 mr-2 animate-spin" />
                        Generating Report...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Report
                      </>
                    )}
                  </Button>

                  <Button
                    onClick={clearCriteria}
                    variant="outline"
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50"
                  >
                    Clear All Criteria
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {/* Results Header */}
              <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-brand-navy">
                    <div className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Matching Requirements
                    </div>
                    {filteredRequirements.length > 0 && (
                      <Badge variant="outline" className="text-brand-blue border-brand-blue/30">
                        {filteredRequirements.length} Found
                      </Badge>
                    )}
                  </CardTitle>
                </CardHeader>

                {filteredRequirements.length > 0 && (
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-600">
                          {filteredRequirements.filter(r => r.priority === 'Critical').length}
                        </div>
                        <p className="text-gray-600">Critical</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-orange-600">
                          {filteredRequirements.filter(r => r.priority === 'High').length}
                        </div>
                        <p className="text-gray-600">High Priority</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-yellow-600">
                          {filteredRequirements.filter(r => r.priority === 'Medium').length}
                        </div>
                        <p className="text-gray-600">Medium</p>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-600">
                          {filteredRequirements.filter(r => r.priority === 'Low').length}
                        </div>
                        <p className="text-gray-600">Low Priority</p>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>

              {/* Requirements List */}
              {filteredRequirements.length > 0 ? (
                <div className="space-y-4">
                  {filteredRequirements.map(requirement => (
                    <RequirementCard key={requirement.id} requirement={requirement} />
                  ))}
                </div>
              ) : (
                <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
                  <CardContent className="text-center py-12">
                    <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">No Requirements Found</h3>
                    <p className="text-gray-500 mb-4">
                      Try adjusting your search criteria to find relevant regulatory requirements
                    </p>
                    <Button
                      onClick={clearCriteria}
                      variant="outline"
                      className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                    >
                      Reset Search Criteria
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>

        {/* Generated Report Modal */}
        {generatedReport && (
          <GeneratedReportPage
            report={generatedReport}
            onDownload={handleDownload}
            onClose={() => setGeneratedReport(null)}
          />
        )}

        {/* Quick Help Section */}
        <Card className="mt-12 bg-gradient-to-r from-brand-blue to-brand-navy text-white border-0">
          <CardContent className="p-8">
            <div className="text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-90" />
              <h3 className="text-xl font-bold mb-4">How to Use the Requirements Generator</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold">1</span>
                  </div>
                  <h4 className="font-semibold mb-1">Select Criteria</h4>
                  <p className="opacity-90">Choose your entity type, regulators, and specific requirements categories</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold">2</span>
                  </div>
                  <h4 className="font-semibold mb-1">Generate Report</h4>
                  <p className="opacity-90">Review matching requirements and generate your customized compliance report</p>
                </div>
                <div className="text-center">
                  <div className="bg-white/20 rounded-full w-8 h-8 flex items-center justify-center mx-auto mb-2">
                    <span className="font-bold">3</span>
                  </div>
                  <h4 className="font-semibold mb-1">Download & Implement</h4>
                  <p className="opacity-90">Download in PDF, Excel, or checklist format for your compliance team</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
