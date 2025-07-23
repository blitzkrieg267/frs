"use client"

import { LicenseType } from "@/types/license";
import React, { useState } from 'react'
import { FileText, Clock, CheckCircle, DollarSign, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

export function LicenseDetailsModal({ license, onClose, onStartApplication }: {
  license: LicenseType | null;
  onClose: () => void;
  onStartApplication: (license: LicenseType) => void;
}) {
  const [activeTab, setActiveTab] = useState<'overview' | 'requirements' | 'process' | 'contact'>('overview')

  if (!license) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-2">{license.name}</h2>
              <div className="flex items-center gap-2">
                <Badge className="bg-brand-blue/10 text-brand-blue border-brand-blue/20">
                  {license.regulator}
                </Badge>
                <Badge variant="outline" className="border-brand-blue/30 text-brand-blue">
                  {license.category}
                </Badge>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {(['overview', 'requirements', 'process', 'contact'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${activeTab === tab
                  ? 'border-brand-blue text-brand-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-navy mb-3">License Overview</h3>
                <p className="text-gray-600 mb-4">{license.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Card className="p-4 border-brand-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="h-5 w-5 text-brand-blue" />
                      <span className="font-medium text-brand-navy">Processing Time</span>
                    </div>
                    <p className="text-lg font-bold text-brand-blue">{license.processingTime}</p>
                  </Card>

                  <Card className="p-4 border-brand-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="h-5 w-5 text-brand-blue" />
                      <span className="font-medium text-brand-navy">Application Fee</span>
                    </div>
                    <p className="text-lg font-bold text-brand-blue">{license.applicationFee}</p>
                  </Card>

                  <Card className="p-4 border-brand-blue/20">
                    <div className="flex items-center gap-2 mb-2">
                      <Shield className="h-5 w-5 text-brand-blue" />
                      <span className="font-medium text-brand-navy">Annual Fee</span>
                    </div>
                    <p className="text-lg font-bold text-brand-blue">{license.annualFee}</p>
                  </Card>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'requirements' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Licensing Requirements</h3>
                <div className="space-y-3">
                  {license.requirements.map((req, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{req}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-brand-navy mb-4">Required Documents</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {license.documents.map((doc, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg">
                      <FileText className="h-4 w-4 text-brand-blue flex-shrink-0" />
                      <span className="text-gray-700 text-sm">{doc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'process' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Application Process</h3>
              <div className="space-y-4">
                {license.applicationSteps.map((step, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-brand-blue text-white rounded-full flex items-center justify-center text-sm font-medium">
                        {step.step}
                      </div>
                      {index < license.applicationSteps.length - 1 && (
                        <div className="w-0.5 h-12 bg-gray-300 mt-2"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h4 className="font-semibold text-brand-navy mb-1">{step.title}</h4>
                      <p className="text-gray-600 mb-2">{step.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {step.estimatedTime}
                        </span>
                        {step.requiredDocuments.length > 0 && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {step.requiredDocuments.length} documents
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-brand-navy mb-4">Contact Information</h3>
              <Card className="p-6 border-brand-blue/20">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-brand-navy mb-1">{license.contactInfo.department}</h4>
                    <p className="text-gray-600">{license.regulator}</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Email</p>
                      <p className="text-brand-blue">{license.contactInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Phone</p>
                      <p className="text-brand-navy">{license.contactInfo.phone}</p>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="text-gray-700">{license.contactInfo.address}</p>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-500">
              Last updated: {new Date(license.lastUpdated).toLocaleDateString()}
            </p>
            <div className="flex gap-3">
              <Button
                onClick={onClose}
                variant="outline"
                className="border-gray-300 text-gray-600 hover:bg-gray-50"
              >
                Close
              </Button>
              <Button
                onClick={() => onStartApplication(license)}
                className="bg-brand-blue hover:bg-brand-navy text-white"
              >
                Start Application
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
