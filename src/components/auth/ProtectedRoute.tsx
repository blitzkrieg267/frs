"use client"

import { hasPermission } from "@/lib/permissions"
import { useAuth } from "./AuthProvider"
import { Card, CardContent } from '@/components/ui/card'
import { Lock } from "lucide-react"
import { AuthPages } from "./AuthPages"

export function ProtectedRoute({
  children,
  requiredPermissions = [],
  fallback
}: {
  children: React.ReactNode
  requiredPermissions?: string[]
  fallback?: React.ReactNode
}) {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue flex items-center justify-center">
        <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <AuthPages />
  }

  if (requiredPermissions.length > 0) {
    const hasRequiredPermissions = requiredPermissions.every(permission =>
      hasPermission(user, permission)
    )

    if (!hasRequiredPermissions) {
      return fallback || (
        <div className="min-h-screen bg-gradient-to-br from-brand-cream to-brand-light-blue flex items-center justify-center">
          <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="text-center py-12">
              <Lock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">Access Denied</h3>
              <p className="text-gray-500">You dont have permission to access this feature.</p>
            </CardContent>
          </Card>
        </div>
      )
    }
  }

  return <>{children}</>
}
