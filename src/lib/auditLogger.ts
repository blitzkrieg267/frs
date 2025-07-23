// Audit Logger for tracking all system activities
export interface AuditLog {
  id: string
  timestamp: string
  user_id: string
  user_email: string
  action: string
  resource_type: 'document' | 'news' | 'event' | 'user' | 'auth' | 'system'
  resource_id?: string
  details: string
  ip_address?: string
  user_agent?: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  status: 'success' | 'failure' | 'warning'
  metadata?: Record<string, any>
}

// Storage key for audit logs
const AUDIT_LOGS_KEY = 'fsrf_audit_logs'

// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Get current timestamp
const getCurrentTimestamp = () => new Date().toISOString()

// Get client info (simplified for demo)
const getClientInfo = () => {
  if (typeof window === 'undefined') return {}
  
  return {
    ip_address: 'localhost', // In real app, get from server
    user_agent: navigator.userAgent
  }
}

export class AuditLogger {
  private static instance: AuditLogger
  
  static getInstance(): AuditLogger {
    if (!AuditLogger.instance) {
      AuditLogger.instance = new AuditLogger()
    }
    return AuditLogger.instance
  }

  // Log an audit event
  log(params: {
    user_id: string
    user_email: string
    action: string
    resource_type: AuditLog['resource_type']
    resource_id?: string
    details: string
    severity?: AuditLog['severity']
    status?: AuditLog['status']
    metadata?: Record<string, any>
  }): void {
    if (typeof window === 'undefined') return

    const clientInfo = getClientInfo()
    
    const auditLog: AuditLog = {
      id: generateId(),
      timestamp: getCurrentTimestamp(),
      user_id: params.user_id,
      user_email: params.user_email,
      action: params.action,
      resource_type: params.resource_type,
      resource_id: params.resource_id,
      details: params.details,
      severity: params.severity || 'medium',
      status: params.status || 'success',
      metadata: params.metadata,
      ...clientInfo
    }

    // Get existing logs
    const existingLogs = this.getAllLogs()
    
    // Add new log
    existingLogs.unshift(auditLog) // Add to beginning for chronological order
    
    // Keep only last 1000 logs to prevent storage bloat
    const trimmedLogs = existingLogs.slice(0, 1000)
    
    // Save to localStorage
    localStorage.setItem(AUDIT_LOGS_KEY, JSON.stringify(trimmedLogs))
  }

  // Get all audit logs
  getAllLogs(): AuditLog[] {
    if (typeof window === 'undefined') return []
    
    const data = localStorage.getItem(AUDIT_LOGS_KEY)
    return data ? JSON.parse(data) : []
  }

  // Get logs with filters
  getFilteredLogs(filters: {
    user_id?: string
    action?: string
    resource_type?: string
    severity?: string
    status?: string
    dateFrom?: string
    dateTo?: string
    searchTerm?: string
  }): AuditLog[] {
    let logs = this.getAllLogs()

    if (filters.user_id) {
      logs = logs.filter(log => log.user_id === filters.user_id)
    }

    if (filters.action) {
      logs = logs.filter(log => log.action.toLowerCase().includes(filters.action.toLowerCase()))
    }

    if (filters.resource_type) {
      logs = logs.filter(log => log.resource_type === filters.resource_type)
    }

    if (filters.severity) {
      logs = logs.filter(log => log.severity === filters.severity)
    }

    if (filters.status) {
      logs = logs.filter(log => log.status === filters.status)
    }

    if (filters.dateFrom) {
      logs = logs.filter(log => new Date(log.timestamp) >= new Date(filters.dateFrom!))
    }

    if (filters.dateTo) {
      logs = logs.filter(log => new Date(log.timestamp) <= new Date(filters.dateTo!))
    }

    if (filters.searchTerm) {
      const searchLower = filters.searchTerm.toLowerCase()
      logs = logs.filter(log => 
        log.details.toLowerCase().includes(searchLower) ||
        log.user_email.toLowerCase().includes(searchLower) ||
        log.action.toLowerCase().includes(searchLower)
      )
    }

    return logs
  }

  // Get logs statistics
  getStatistics(): {
    total: number
    byResourceType: Record<string, number>
    bySeverity: Record<string, number>
    byStatus: Record<string, number>
    recentActivity: number
  } {
    const logs = this.getAllLogs()
    const now = new Date()
    const last24Hours = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const stats = {
      total: logs.length,
      byResourceType: {} as Record<string, number>,
      bySeverity: {} as Record<string, number>,
      byStatus: {} as Record<string, number>,
      recentActivity: logs.filter(log => new Date(log.timestamp) > last24Hours).length
    }

    logs.forEach(log => {
      // Count by resource type
      stats.byResourceType[log.resource_type] = (stats.byResourceType[log.resource_type] || 0) + 1
      
      // Count by severity
      stats.bySeverity[log.severity] = (stats.bySeverity[log.severity] || 0) + 1
      
      // Count by status
      stats.byStatus[log.status] = (stats.byStatus[log.status] || 0) + 1
    })

    return stats
  }

  // Clear all logs (admin only)
  clearAllLogs(): void {
    if (typeof window === 'undefined') return
    localStorage.removeItem(AUDIT_LOGS_KEY)
  }

  // Export logs as JSON
  exportLogs(): string {
    return JSON.stringify(this.getAllLogs(), null, 2)
  }
}

// Convenience function to get logger instance
export const auditLogger = AuditLogger.getInstance()

// Predefined action types for consistency
export const AUDIT_ACTIONS = {
  // Authentication
  LOGIN: 'user_login',
  LOGOUT: 'user_logout',
  REGISTER: 'user_register',
  LOGIN_FAILED: 'login_failed',
  
  // Document management
  DOCUMENT_CREATE: 'document_create',
  DOCUMENT_UPDATE: 'document_update',
  DOCUMENT_DELETE: 'document_delete',
  DOCUMENT_VIEW: 'document_view',
  DOCUMENT_DOWNLOAD: 'document_download',
  
  // News management
  NEWS_CREATE: 'news_create',
  NEWS_UPDATE: 'news_update',
  NEWS_DELETE: 'news_delete',
  NEWS_PUBLISH: 'news_publish',
  NEWS_UNPUBLISH: 'news_unpublish',
  
  // Event management
  EVENT_CREATE: 'event_create',
  EVENT_UPDATE: 'event_update',
  EVENT_DELETE: 'event_delete',
  
  // User management
  USER_CREATE: 'user_create',
  USER_UPDATE: 'user_update',
  USER_DELETE: 'user_delete',
  USER_ROLE_CHANGE: 'user_role_change',
  
  // System
  SYSTEM_BACKUP: 'system_backup',
  SYSTEM_RESTORE: 'system_restore',
  SYSTEM_CONFIG_CHANGE: 'system_config_change',
  
  // Search and access
  SEARCH_PERFORMED: 'search_performed',
  ADMIN_ACCESS: 'admin_access',
  UNAUTHORIZED_ACCESS: 'unauthorized_access'
} as const