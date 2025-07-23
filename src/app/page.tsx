'use client'
import React, { useState, useMemo } from 'react'
import { Search, Download, ExternalLink, FileText, Calendar, Building, Tag, ChevronDown, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { localDB } from '@/lib/localStorage'

const regulators = ["All", "Bank of Botswana", "NBFIRA", "FIA"]
const documentTypes = ["All", "Act", "Regulation", "Policy", "Rule", "Directive", "Guideline"]
const categories = ["All", "Banking", "Insurance", "Microfinance", "Payments", "Asset Management", "Compliance"]


export default function Home() {
  const [documents, setDocuments] = useState<any[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegulator, setSelectedRegulator] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [expandedCard, setExpandedCard] = useState<number | null>(null)

  // Load documents on component mount
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localDB.init()
      const docs = localDB.documents.getAll()
      // Transform to match the expected format
      const transformedDocs = docs.map(doc => ({
        id: doc.id,
        title: doc.title,
        type: doc.type.charAt(0).toUpperCase() + doc.type.slice(1),
        regulator: doc.regulator,
        category: doc.category,
        lastUpdated: doc.updated_at.split('T')[0],
        description: doc.description,
        documentUrl: doc.file_url || "#",
        tags: doc.tags,
        status: "Current"
      }))
      setDocuments(transformedDocs)
    }
  }, [])

  const filteredDocuments = useMemo(() => {
    return documents.filter(doc => {
      const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesRegulator = selectedRegulator === "All" || doc.regulator === selectedRegulator
      const matchesType = selectedType === "All" || doc.type === selectedType
      const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory

      return matchesSearch && matchesRegulator && matchesType && matchesCategory
    })
  }, [documents, searchTerm, selectedRegulator, selectedType, selectedCategory])

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      "Act": "bg-red-100 text-red-800 border-red-200",
      "Regulation": "bg-blue-100 text-blue-800 border-blue-200",
      "Policy": "bg-green-100 text-green-800 border-green-200",
      "Rule": "bg-purple-100 text-purple-800 border-purple-200",
      "Directive": "bg-orange-100 text-orange-800 border-orange-200",
      "Guideline": "bg-cyan-100 text-cyan-800 border-cyan-200"
    }
    return colors[type] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getRegulatorColor = (regulator: string) => {
    const colors: Record<string, string> = {
      "Bank of Botswana": "bg-brand-blue/10 text-brand-navy border-brand-blue/20",
      "NBFIRA": "bg-green-50 text-green-700 border-green-200",
      "FIA": "bg-purple-50 text-purple-700 border-purple-200",
    };
    return colors[regulator] || "bg-gray-50 text-gray-700 border-gray-200";
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-brand-cream to-brand-light-blue">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-brand-blue/20">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">
              Botswana Financial Regulatory Framework
            </h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Unified access to acts, regulations, policies, rules, directives and guidelines across
              Bank of Botswana, NBFIRA, and FIA
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Search and Filters */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-brand-blue/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-brand-navy">
              <Search className="h-5 w-5" />
              Search Regulatory Documents
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by title, description, or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-navy">Regulator</label>
                <select
                  value={selectedRegulator}
                  onChange={(e) => setSelectedRegulator(e.target.value)}
                  className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                >
                  {regulators.map(reg => (
                    <option key={reg} value={reg}>{reg}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-navy">Document Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                >
                  {documentTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-brand-navy">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results Summary */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-brand-navy">{filteredDocuments.length}</span> documents
            {searchTerm && (
              <span> matching <span className="font-semibold text-brand-blue">{searchTerm}</span></span>
            )}
          </p>
        </div>

        {/* Document Cards */}
        <div className="space-y-4">
          {filteredDocuments.map(doc => (
            <Card key={doc.id} className="bg-white/90 backdrop-blur-sm border-brand-blue/20 hover:shadow-lg transition-all duration-200">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold text-brand-navy">{doc.title}</h3>
                      <Badge className={getTypeColor(doc.type) + " border font-medium"}>
                        {doc.type}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Building className="h-4 w-4" />
                        <Badge className={getRegulatorColor(doc.regulator) + " border text-xs"}>
                          {doc.regulator}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Last updated: {new Date(doc.lastUpdated).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Tag className="h-4 w-4" />
                        <span className="text-brand-blue font-medium">{doc.category}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setExpandedCard(expandedCard === doc.id ? null : doc.id)}
                    className="text-brand-blue hover:bg-brand-blue/10"
                  >
                    {expandedCard === doc.id ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </CardHeader>

              {expandedCard === doc.id && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <p className="text-gray-700">{doc.description}</p>

                    <div className="space-y-2">
                      <p className="text-sm font-medium text-brand-navy">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {doc.tags.map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <Button
                        className=" hover:bg-brand-navy text-white"
                        onClick={() => window.open(doc.documentUrl, '_blank')}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Document
                      </Button>
                      <Button
                        variant="outline"
                        className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download PDF
                      </Button>
                      <Button
                        variant="outline"
                        className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Source
                      </Button>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {filteredDocuments.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="text-center py-12">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No documents found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-brand-blue mb-2">
                {documents.filter(d => d.regulator === "Bank of Botswana").length}
              </div>
              <p className="text-gray-600">Bank of Botswana Documents</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-brand-blue mb-2">
                {documents.filter(d => d.regulator === "NBFIRA").length}
              </div>
              <p className="text-gray-600">NBFIRA Documents</p>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="text-center py-6">
              <div className="text-3xl font-bold text-brand-blue mb-2">
                {documents.filter(d => d.regulator === "Financial Intelligence Agency").length}
              </div>
              <p className="text-gray-600">FIA Documents</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
