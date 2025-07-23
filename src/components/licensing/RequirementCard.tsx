"use client"

import { RegulatoryRequirement } from "@/types/requirements"
import { useState } from "react"
import { FileText, Calendar, CheckCircle, AlertTriangle, Clock, Plus, Minus } from 'lucide-react'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

export function RequirementCard({ requirement }: { requirement: RegulatoryRequirement }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
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

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-brand-navy">{requirement.title}</h3>
              <Badge className={getPriorityColor(requirement.priority) + " border text-xs"}>
                {requirement.priority}
              </Badge>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-3">
              <Badge className={getRegulatorColor(requirement.regulator) + " border text-xs"}>
                {requirement.regulator}
              </Badge>
              <Badge variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
                {requirement.category}
              </Badge>
            </div>

            <p className="text-gray-600 text-sm">{requirement.description}</p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-brand-blue hover:bg-brand-blue/10"
          >
            {isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          </Button>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div>
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <Clock className="h-3 w-3" />
                <span>Timeline</span>
              </div>
              <p className="font-medium text-brand-navy">{requirement.timeline}</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <Calendar className="h-3 w-3" />
                <span>Compliance</span>
              </div>
              <p className="font-medium text-brand-navy">{requirement.compliance.frequency}</p>
            </div>

            <div>
              <div className="flex items-center gap-1 text-gray-500 mb-1">
                <AlertTriangle className="h-3 w-3" />
                <span>Deadline</span>
              </div>
              <p className="font-medium text-brand-navy">{requirement.compliance.deadline}</p>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-medium text-brand-navy mb-2">Specific Requirements:</h4>
              <ul className="space-y-1">
                {requirement.specificRequirements.map((req, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    {req}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-brand-navy mb-2">Required Documents:</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {requirement.documents.map((doc, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <FileText className="h-3 w-3 text-brand-blue flex-shrink-0" />
                    {doc}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-brand-navy mb-2">Regulatory References:</h4>
              <div className="space-y-1">
                {requirement.references.map((ref, index) => (
                  <div key={index} className="text-sm">
                    <span className="text-gray-600">{ref.regulation}, {ref.section}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-brand-navy mb-2">Penalties for Non-Compliance:</h4>
              <p className="text-sm text-red-600 bg-red-50 p-2 rounded">
                {requirement.compliance.penalties}
              </p>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  )
}
