"use client"

import { mockApplications } from "@/types/license"
import { Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react"
import React from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function ApplicationTracker() {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Draft': return 'bg-gray-100 text-gray-800 border-gray-200'
      case 'Submitted': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Under Review': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Additional Info Required': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Approved': return 'bg-green-100 text-green-800 border-green-200'
      case 'Rejected': return 'bg-red-100 text-red-800 border-red-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Approved': return <CheckCircle className="h-4 w-4" />
      case 'Rejected': return <XCircle className="h-4 w-4" />
      case 'Additional Info Required': return <AlertCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">My Applications</h2>
        <Badge variant="outline" className="text-brand-blue border-brand-blue/30">
          {mockApplications.length} Active Applications
        </Badge>
      </div>

      <div className="space-y-4">
        {mockApplications.map((app) => (
          <Card key={app.id} className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-brand-navy mb-1">{app.licenseType}</h3>
                  <p className="text-gray-600">{app.companyName}</p>
                  <p className="text-sm text-gray-500">Application ID: {app.id}</p>
                </div>
                <Badge className={getStatusColor(app.status) + " border flex items-center gap-1"}>
                  {getStatusIcon(app.status)}
                  {app.status}
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Submitted</p>
                  <p className="font-medium text-brand-navy">{new Date(app.submissionDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Expected Decision</p>
                  <p className="font-medium text-brand-navy">{new Date(app.expectedDecision).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Progress</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-brand-blue h-2 rounded-full transition-all duration-300"
                        style={{ width: `${app.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-brand-navy">{app.progress}%</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Next Action:</span> {app.nextAction}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white"
                >
                  View Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
