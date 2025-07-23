"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Users, 
  Search, 
  Shield, 
  Mail,
  Calendar,
  Building,
  UserCheck,
  UserX
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface UserProfile {
  id: string
  email: string
  created_at: string
  last_sign_in_at?: string
  email_confirmed_at?: string
  user_metadata?: {
    full_name?: string
    company?: string
    role?: string
  }
  app_metadata?: {
    provider?: string
    providers?: string[]
  }
}

export function UserManager() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      // Note: This requires service role key and should be done server-side in production
      const { data, error } = await supabase.auth.admin.listUsers()

      if (error) throw error
      setUsers(data.users || [])
    } catch (error) {
      console.error('Error fetching users:', error)
      // For demo purposes, show mock data if admin access isn't available
      setUsers([
        {
          id: '1',
          email: 'admin@bob.bw',
          created_at: '2024-01-15T10:00:00Z',
          last_sign_in_at: '2024-03-15T14:30:00Z',
          email_confirmed_at: '2024-01-15T10:05:00Z',
          user_metadata: {
            full_name: 'Admin User',
            company: 'Bank of Botswana',
            role: 'Administrator'
          }
        },
        {
          id: '2',
          email: 'user@nbfira.bw',
          created_at: '2024-02-01T09:00:00Z',
          last_sign_in_at: '2024-03-14T16:20:00Z',
          email_confirmed_at: '2024-02-01T09:05:00Z',
          user_metadata: {
            full_name: 'NBFIRA User',
            company: 'NBFIRA',
            role: 'Regulator'
          }
        }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata?.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.user_metadata?.company?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-brand-navy">User Management</h2>
        </div>
        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
          <CardContent className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue mx-auto mb-4"></div>
            <p className="text-gray-600">Loading users...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-brand-navy">User Management</h2>
        <Badge variant="outline" className="text-brand-blue border-brand-blue/30">
          {users.length} Total Users
        </Badge>
      </div>

      {/* Search */}
      <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-brand-navy">
            <Search className="h-5 w-5" />
            Search Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search by email, name, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-brand-blue/20 focus:ring-brand-blue focus:border-brand-blue"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white/90 backdrop-blur-sm border-brand-blue/20 text-center p-6">
          <Users className="h-8 w-8 text-brand-blue mx-auto mb-3" />
          <div className="text-2xl font-bold text-brand-blue mb-1">{users.length}</div>
          <p className="text-sm text-gray-600">Total Users</p>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-green-200 text-center p-6">
          <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-green-600 mb-1">
            {users.filter(u => u.email_confirmed_at).length}
          </div>
          <p className="text-sm text-gray-600">Verified Users</p>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-orange-200 text-center p-6">
          <Shield className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {users.filter(u => u.email.includes('admin')).length}
          </div>
          <p className="text-sm text-gray-600">Admin Users</p>
        </Card>

        <Card className="bg-white/90 backdrop-blur-sm border-blue-200 text-center p-6">
          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {users.filter(u => u.last_sign_in_at && 
              new Date(u.last_sign_in_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}
          </div>
          <p className="text-sm text-gray-600">Active This Week</p>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-brand-navy">{filteredUsers.length}</span> users
        </p>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white/90 backdrop-blur-sm border-brand-blue/20">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-brand-blue rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-brand-navy">
                          {user.user_metadata?.full_name || user.email}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      {user.email.includes('admin') && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                          Admin
                        </Badge>
                      )}
                      {user.email_confirmed_at ? (
                        <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                          Verified
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs">
                          Unverified
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      {user.user_metadata?.company && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{user.user_metadata.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      {user.last_sign_in_at && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          <span>Last login: {new Date(user.last_sign_in_at).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {user.user_metadata?.role && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs border-brand-blue/30 text-brand-blue">
                          {user.user_metadata.role}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-brand-blue/30 text-brand-blue hover:bg-brand-blue hover:text-white">
                      <Mail className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                    {!user.email_confirmed_at && (
                      <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Verify
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white/80 backdrop-blur-sm border-brand-blue/20">
            <CardContent className="text-center py-12">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Users Found</h3>
              <p className="text-gray-500">
                {searchTerm ? 'Try adjusting your search criteria' : 'No users registered yet'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}