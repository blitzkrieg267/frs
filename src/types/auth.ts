export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  name: string
  role: UserRole
  company?: string
  entityType?: string
  licenseNumber?: string
  phone?: string
  regulatoryBody?: string
  isVerified: boolean
  permissions: string[]
}

export type UserRole = 'PUBLIC' | 'PROFESSIONAL' | 'INSTITUTIONAL' | 'REGULATOR'

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (email: string, password: string) => Promise<void>
  register: (data: RegisterData) => Promise<void>
  logout: () => void
  clearError: () => void
}

export interface RegisterData {
  accountType: UserRole
  firstName: string
  lastName: string
  email: string
  password: string
  confirmPassword: string
  company?: string
  entityType?: string
  licenseNumber?: string
  phone: string
  regulatoryBody?: string
}
