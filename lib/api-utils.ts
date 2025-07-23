import { NextResponse } from 'next/server'

// Standard error responses
export const ErrorResponses = {
  notFound: (resource: string) => 
    NextResponse.json({ error: `${resource} not found` }, { status: 404 }),
  
  badRequest: (message: string) => 
    NextResponse.json({ error: message }, { status: 400 }),
  
  conflict: (message: string) => 
    NextResponse.json({ error: message }, { status: 409 }),
  
  internalError: (message: string = 'Internal server error') => 
    NextResponse.json({ error: message }, { status: 500 }),
  
  unauthorized: (message: string = 'Unauthorized') => 
    NextResponse.json({ error: message }, { status: 401 }),
  
  forbidden: (message: string = 'Forbidden') => 
    NextResponse.json({ error: message }, { status: 403 }),
}

// Validation helpers
export const Validators = {
  isValidEmail: (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },
  
  isValidDate: (dateString: string): boolean => {
    const date = new Date(dateString)
    return !isNaN(date.getTime())
  },
  
  isValidIncidentType: (type: string): boolean => {
    const validTypes = [
      'Unauthorised Access',
      'Gun Threat', 
      'Face Recognised',
      'Suspicious Activity',
      'Perimeter Breach',
      'Equipment Tampering'
    ]
    return validTypes.includes(type)
  },
  
  isValidTimeRange: (range: string): boolean => {
    const validRanges = ['24h', '7d', '30d']
    return validRanges.includes(range)
  },
}

// Pagination helpers
export interface PaginationParams {
  page?: number
  limit?: number
  offset?: number
}

export const parsePaginationParams = (searchParams: URLSearchParams): PaginationParams => {
  const page = searchParams.get('page')
  const limit = searchParams.get('limit')
  const offset = searchParams.get('offset')
  
  return {
    page: page ? parseInt(page) : undefined,
    limit: limit ? parseInt(limit) : undefined,
    offset: offset ? parseInt(offset) : undefined,
  }
}

export const calculatePagination = (page?: number, limit?: number) => {
  const defaultLimit = 20
  const actualLimit = limit || defaultLimit
  const actualPage = page || 1
  const skip = (actualPage - 1) * actualLimit
  
  return {
    take: actualLimit,
    skip,
    page: actualPage,
    limit: actualLimit,
  }
}

// Response helpers
export const createPaginatedResponse = (
  data: any[],
  totalCount: number,
  page: number,
  limit: number
) => {
  const totalPages = Math.ceil(totalCount / limit)
  const hasNext = page < totalPages
  const hasPrev = page > 1
  
  return {
    data,
    pagination: {
      page,
      limit,
      totalCount,
      totalPages,
      hasNext,
      hasPrev,
    },
  }
}

// Date helpers
export const DateHelpers = {
  getTimeRangeStart: (range: string): Date => {
    const now = new Date()
    
    switch (range) {
      case '7d':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
      case '30d':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
      case '24h':
      default:
        return new Date(now.getTime() - 24 * 60 * 60 * 1000)
    }
  },
  
  formatDuration: (milliseconds: number): string => {
    const seconds = Math.floor(milliseconds / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)
    
    if (days > 0) return `${days}d ${hours % 24}h`
    if (hours > 0) return `${hours}h ${minutes % 60}m`
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`
    return `${seconds}s`
  },
}

// Logging helpers
export const logRequest = (method: string, url: string, params?: any) => {
  console.log(`[API] ${method} ${url}`, params ? { params } : '')
}

export const logError = (error: any, context: string) => {
  console.error(`[API Error] ${context}:`, error)
}

// Type guards
export const isString = (value: any): value is string => {
  return typeof value === 'string'
}

export const isNumber = (value: any): value is number => {
  return typeof value === 'number' && !isNaN(value)
}

export const isBoolean = (value: any): value is boolean => {
  return typeof value === 'boolean'
}

export const isValidId = (id: any): id is string => {
  return isString(id) && id.length > 0
}