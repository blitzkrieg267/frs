"use client"

import { CATEGORIES, DIFFICULTIES, LicenseType, mockApplications, mockLicenseTypes, REGULATORS } from "@/types/license"
import React, { useMemo, useState } from "react"
import { Search, Building, Clock, Users, Shield, Star } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ApplicationTracker } from "@/components/ApplicationTracker"
import { LicenseDetailsModal } from "@/components/LicenseDetailsModal"
import { LicenseTypeCard } from "@/components/LicenseTypeCard"

export default function LicensingPortal() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedRegulator, setSelectedRegulator] = useState('All')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedDifficulty, setSelectedDifficulty] = useState('All')
  const [selectedLicense, setSelectedLicense] = useState<LicenseType | null>(null)
  const [currentView, setCurrentView] = useState<'browse' | 'applications'>('browse')

  const filteredLicenses = useMemo(() => {
    return mockLicenseTypes.filter(license => {
      const matchesSearch =
        license.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        license.category.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesRegulator = selectedRegulator === 'All' || license.regulator === selectedRegulator
      const matchesCategory = selectedCategory === 'All' || license.category === selectedCategory
      const matchesDifficulty = selectedDifficulty === 'All' || license.difficulty === selectedDifficulty

      return matchesSearch && matchesRegulator && matchesCategory && matchesDifficulty
    })
  }, [searchTerm, selectedRegulator, selectedCategory, selectedDifficulty])

  const handleStartApplication = (license: LicenseType) => {
    alert(`Starting application for ${license.name}. This would redirect to the application form.`)
    setSelectedLicense(null)
  }

  return (
    <div className="min-h-full bg-gradient-to-br from-brand-cream to-brand-light-blue">
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b border-brand-blue/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-brand-blue to-brand-navy bg-clip-text text-transparent">
                Financial Services Licensing Portal
              </h1>
              <p className="text-gray-600 mt-2">
                Comprehensive licensing information and application management for Botswanas financial sector
              </p>
            </div>

            {/* View Toggle */}
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setCurrentView('browse')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'browse'
                  ? ' text-white'
                  : 'text-gray-600 hover:text-brand-blue'
                  }`}
              >
                Browse Licenses
              </button>
              <button
                onClick={() => setCurrentView('applications')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'applications'
                  ? ' text-white'
                  : 'text-gray-600 hover:text-brand-blue'
                  }`}
              >
                My Applications
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {currentView === 'browse' ? (
          <>
            {/* Search and Filters */}
            <Card className="mb-8 bg-white/80 backdrop-blur-sm border-brand-blue/20">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-brand-navy">
                  <Search className="h-5 w-5" />
                  Find the Right License
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search Input */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search licenses by name, category, or description..."
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
                      {REGULATORS.map(reg => (
                        <option key={reg} value={reg}>{reg}</option>
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
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-brand-navy">Difficulty</label>
                    <select
                      value={selectedDifficulty}
                      onChange={(e) => setSelectedDifficulty(e.target.value)}
                      className="w-full p-2 border border-brand-blue/20 rounded-md focus:ring-brand-blue focus:border-brand-blue"
                    >
                      {DIFFICULTIES.map(diff => (
                        <option key={diff} value={diff}>{diff}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing <span className="font-semibold text-brand-navy">{filteredLicenses.length}</span> license types
                {searchTerm && (
                  <span> matching <span className="font-semibold text-brand-blue">{searchTerm}</span></span>
                )}
              </p>

              {/* Popular Licenses Filter */}
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-600">
                  {filteredLicenses.filter(l => l.isPopular).length} popular licenses
                </span>
              </div>
            </div>

            {/* License Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {filteredLicenses.map(license => (
                <LicenseTypeCard
                  key={license.id}
                  license={license}
                  onViewDetails={setSelectedLicense}
                />
              ))}
            </div>

            {filteredLicenses.length === 0 && (
              <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
                <CardContent className="text-center py-12">
                  <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-600 mb-2">No licenses found</h3>
                  <p className="text-gray-500">Try adjusting your search terms or filters</p>
                </CardContent>
              </Card>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20 text-center p-6">
                <Building className="h-8 w-8 text-brand-blue mx-auto mb-3" />
                <div className="text-2xl font-bold text-brand-blue mb-1">
                  {mockLicenseTypes.filter(l => l.regulator === 'Bank of Botswana').length}
                </div>
                <p className="text-sm text-gray-600">BoB Licenses</p>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20 text-center p-6">
                <Shield className="h-8 w-8 text-green-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-green-600 mb-1">
                  {mockLicenseTypes.filter(l => l.regulator === 'NBFIRA').length}
                </div>
                <p className="text-sm text-gray-600">NBFIRA Licenses</p>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20 text-center p-6">
                <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-yellow-600 mb-1">4-8</div>
                <p className="text-sm text-gray-600">Avg. Months Processing</p>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20 text-center p-6">
                <Users className="h-8 w-8 text-purple-600 mx-auto mb-3" />
                <div className="text-2xl font-bold text-purple-600 mb-1">
                  {mockApplications.length}
                </div>
                <p className="text-sm text-gray-600">Active Applications</p>
              </Card>
            </div>
          </>
        ) : (
          <ApplicationTracker />
        )}

        {/* License Details Modal */}
        {selectedLicense && (
          <LicenseDetailsModal
            license={selectedLicense}
            onClose={() => setSelectedLicense(null)}
            onStartApplication={handleStartApplication}
          />
        )}
      </div>
    </div>
  )
}
