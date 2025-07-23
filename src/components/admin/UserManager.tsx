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
import { localDB, User } from '@/lib/localStorage'

export function UserManager() {
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const data = localDB.users.getAll()
      setUsers(data)
    } catch (error) {
      console.error('Error fetching users:', error)
      setUsers([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredUsers = users.filter(user => 
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.company?.toLowerCase().includes(searchTerm.toLowerCase())
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
    <div className="space-y-6 max-w-7xl">
      <div className="flex justify-between items-center">
        <Badge variant="outline" className="text-indigo-600 border-indigo-300">
          {users.length} Total Users
        </Badge>
      </div>

      {/* Search */}
      <Card className="bg-white shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center gap-2 text-gray-900">
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
              className="pl-10 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </CardContent>
      </Card>

      {/* User Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white shadow-sm border-l-4 border-l-indigo-500 text-center p-6">
          <Users className="h-8 w-8 text-indigo-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">{users.length}</div>
          <p className="text-sm text-gray-600">Total Users</p>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-green-500 text-center p-6">
          <UserCheck className="h-8 w-8 text-green-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {users.filter(u => u.email).length}
          </div>
          <p className="text-sm text-gray-600">Verified Users</p>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-orange-500 text-center p-6">
          <Shield className="h-8 w-8 text-orange-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {users.filter(u => u.is_admin).length}
          </div>
          <p className="text-sm text-gray-600">Admin Users</p>
        </Card>

        <Card className="bg-white shadow-sm border-l-4 border-l-blue-500 text-center p-6">
          <Calendar className="h-8 w-8 text-blue-600 mx-auto mb-3" />
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {users.filter(u => u.last_login && 
              new Date(u.last_login) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            ).length}
          </div>
          <p className="text-sm text-gray-600">Active This Week</p>
        </Card>
      </div>

      {/* Results Summary */}
      <div className="flex justify-between items-center">
        <p className="text-gray-600">
          Showing <span className="font-semibold text-gray-900">{filteredUsers.length}</span> users
        </p>
      </div>

      {/* Users List */}
      <div className="space-y-4">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <Card key={user.id} className="bg-white shadow-sm border border-gray-200">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-medium">
                          {user.email[0].toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {user.full_name || user.email}
                        </h3>
                        <p className="text-gray-600">{user.email}</p>
                      </div>
                      {user.is_admin && (
                        <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                          Admin
                        </Badge>
                      )}
                      <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                        Verified
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-500">
                      {user.company && (
                        <div className="flex items-center gap-1">
                          <Building className="h-4 w-4" />
                          <span>{user.company}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        <span>Joined: {new Date(user.created_at).toLocaleDateString()}</span>
                      </div>
                      {user.last_login && (
                        <div className="flex items-center gap-1">
                          <UserCheck className="h-4 w-4" />
                          <span>Last login: {new Date(user.last_login).toLocaleDateString()}</span>
                        </div>
                      )}
                    </div>

                    {user.role && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs border-indigo-300 text-indigo-600">
                          {user.role}
                        </Badge>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 ml-4">
                    <Button size="sm" variant="outline" className="border-indigo-300 text-indigo-600 hover:bg-indigo-50">
                      <Mail className="h-3 w-3 mr-1" />
                      Contact
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="bg-white shadow-sm border border-gray-200">
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