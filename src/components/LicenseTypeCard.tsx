"use client"

import React from 'react'
import { Clock, DollarSign, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LicenseType } from '@/types/license'


export function LicenseTypeCard({ license, onViewDetails }: { license: LicenseType; onViewDetails: (license: LicenseType) => void }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Basic': return 'bg-green-100 text-green-800 border-green-200'
      case 'Intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Advanced': return 'bg-red-100 text-red-800 border-red-200'
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

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 hover:shadow-lg transition-all duration-200 h-full">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start mb-2">
          <div className="flex items-center gap-2">
            {license.isPopular && (
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
            )}
            <h3 className="text-lg font-semibold text-brand-navy">{license.name}</h3>
          </div>
          <Badge className={getDifficultyColor(license.difficulty) + " border text-xs"}>
            {license.difficulty}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge className={getRegulatorColor(license.regulator) + " border text-xs"}>
            {license.regulator}
          </Badge>
          <Badge variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
            {license.category}
          </Badge>
        </div>

        <p className="text-gray-600 text-sm line-clamp-2">{license.description}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <Clock className="h-3 w-3" />
              <span>Processing Time</span>
            </div>
            <p className="font-medium text-brand-navy">{license.processingTime}</p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1 text-gray-500">
              <DollarSign className="h-3 w-3" />
              <span>Application Fee</span>
            </div>
            <p className="font-medium text-brand-navy">{license.applicationFee}</p>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xs text-gray-500">Key Requirements:</p>
          <div className="space-y-1">
            {license.requirements.slice(0, 2).map((req, index) => (
              <div key={index} className="flex items-start gap-2 text-xs text-gray-600">
                <span className="w-1 h-1 bg-brand-blue rounded-full mt-1.5 flex-shrink-0"></span>
                {req}
              </div>
            ))}
            {license.requirements.length > 2 && (
              <p className="text-xs text-brand-blue">+{license.requirements.length - 2} more requirements</p>
            )}
          </div>
        </div>

        <Button
          onClick={() => onViewDetails(license)}
          className="w-full bg-brand-blue hover:bg-brand-navy text-white"
        >
          View Details & Apply
        </Button>
      </CardContent>
    </Card>
  )
}
