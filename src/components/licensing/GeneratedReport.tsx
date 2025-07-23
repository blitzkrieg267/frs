"use client"

import { Download, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { GeneratedReport } from '@/types/requirements'
import { RequirementCard } from './RequirementCard'

export function GeneratedReportPage({ report, onDownload, onClose }: {
  report: GeneratedReport
  onDownload: (format: string) => void
  onClose: () => void
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-6xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-brand-navy mb-2">Generated Requirements Report</h2>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span>Generated: {new Date(report.generatedAt).toLocaleString()}</span>
                <span>Total Requirements: {report.totalRequirements}</span>
                <span>Critical: {report.criticalRequirements}</span>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        <div className="p-6">
          {/* Search Criteria Summary */}
          <Card className="mb-6 border-brand-blue/20">
            <CardHeader>
              <CardTitle className="text-lg text-brand-navy">Search Criteria Applied</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-gray-700 mb-1">Entity Types:</p>
                  <p className="text-gray-600">{report.criteria.entityTypes.join(', ') || 'All'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Regulators:</p>
                  <p className="text-gray-600">{report.criteria.regulators.join(', ') || 'All'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Categories:</p>
                  <p className="text-gray-600">{report.criteria.categories.join(', ') || 'All'}</p>
                </div>
                <div>
                  <p className="font-medium text-gray-700 mb-1">Priorities:</p>
                  <p className="text-gray-600">{report.criteria.priorities.join(', ') || 'All'}</p>
                </div>
                {report.criteria.keywords && (
                  <div>
                    <p className="font-medium text-gray-700 mb-1">Keywords:</p>
                    <p className="text-gray-600">{report.criteria.keywords}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Requirements List */}
          <div className="space-y-4 mb-6">
            {report.requirements.map(requirement => (
              <RequirementCard key={requirement.id} requirement={requirement} />
            ))}
          </div>
        </div>

        {/* Footer with Download Options */}
        <div className="p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Ready to download your customized requirements list
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
                onClick={() => onDownload('pdf')}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
              <Button
                onClick={() => onDownload('excel')}
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Download Excel
              </Button>
              <Button
                onClick={() => onDownload('checklist')}
                className="hover:bg-brand-navy text-white"
              >
                <Download className="h-4 w-4 mr-2" />
                Compliance Checklist
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
