import { NextRequest, NextResponse } from 'next/server'
import { logRequest, logError } from './api-utils'

// API wrapper for consistent error handling and logging
export function withApiHandler(
  handler: (request: NextRequest, params?: any) => Promise<NextResponse>
) {
  return async (request: NextRequest, context?: any) => {
    const startTime = Date.now()
    const method = request.method
    const url = request.url
    
    try {
      // Log the request
      logRequest(method, url)
      
      // Execute the handler
      const response = await handler(request, context)
      
      // Log successful response
      const duration = Date.now() - startTime
      console.log(`[API] ${method} ${url} - ${response.status} (${duration}ms)`)
      
      return response
    } catch (error) {
      // Log the error
      const duration = Date.now() - startTime
      logError(error, `${method} ${url}`)
      
      // Return standardized error response
      console.error(`[API] ${method} ${url} - ERROR (${duration}ms)`)
      
      return NextResponse.json(
        { 
          error: 'Internal server error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      )
    }
  }
}

// Validation middleware
export function withValidation<T>(
  validator: (data: any) => { isValid: boolean; errors: string[] },
  handler: (request: NextRequest, validatedData: T, params?: any) => Promise<NextResponse>
) {
  return withApiHandler(async (request: NextRequest, params?: any) => {
    if (request.method === 'POST' || request.method === 'PUT' || request.method === 'PATCH') {
      try {
        const body = await request.json()
        const validation = validator(body)
        
        if (!validation.isValid) {
          return NextResponse.json(
            { 
              error: 'Validation failed',
              errors: validation.errors,
            },
            { status: 400 }
          )
        }
        
        return handler(request, body as T, params)
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid JSON in request body' },
          { status: 400 }
        )
      }
    }
    
    return handler(request, {} as T, params)
  })
}

// Rate limiting middleware (simple in-memory implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

export function withRateLimit(
  maxRequests: number = 100,
  windowMs: number = 15 * 60 * 1000, // 15 minutes
  handler: (request: NextRequest, params?: any) => Promise<NextResponse>
) {
  return withApiHandler(async (request: NextRequest, params?: any) => {
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const now = Date.now()
    const windowStart = now - windowMs
    
    // Clean up old entries
    for (const [key, value] of rateLimitMap.entries()) {
      if (value.resetTime < windowStart) {
        rateLimitMap.delete(key)
      }
    }
    
    // Check current client
    const clientData = rateLimitMap.get(clientIp)
    
    if (clientData) {
      if (clientData.count >= maxRequests) {
        return NextResponse.json(
          { 
            error: 'Rate limit exceeded',
            retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
          },
          { status: 429 }
        )
      }
      
      clientData.count++
    } else {
      rateLimitMap.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      })
    }
    
    return handler(request, params)
  })
}

// CORS middleware
export function withCors(
  handler: (request: NextRequest, params?: any) => Promise<NextResponse>,
  options: {
    origin?: string | string[]
    methods?: string[]
    headers?: string[]
  } = {}
) {
  const {
    origin = '*',
    methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    headers = ['Content-Type', 'Authorization'],
  } = options
  
  return withApiHandler(async (request: NextRequest, params?: any) => {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': Array.isArray(origin) ? origin.join(', ') : origin,
          'Access-Control-Allow-Methods': methods.join(', '),
          'Access-Control-Allow-Headers': headers.join(', '),
          'Access-Control-Max-Age': '86400',
        },
      })
    }
    
    const response = await handler(request, params)
    
    // Add CORS headers to response
    response.headers.set('Access-Control-Allow-Origin', Array.isArray(origin) ? origin.join(', ') : origin)
    response.headers.set('Access-Control-Allow-Methods', methods.join(', '))
    response.headers.set('Access-Control-Allow-Headers', headers.join(', '))
    
    return response
  })
}

// Authentication middleware (placeholder - implement based on your auth system)
export function withAuth(
  handler: (request: NextRequest, user: any, params?: any) => Promise<NextResponse>
) {
  return withApiHandler(async (request: NextRequest, params?: any) => {
    const authHeader = request.headers.get('Authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    
    // TODO: Implement actual token validation
    // For now, we'll just pass a mock user
    const user = { id: 'admin', role: 'admin' }
    
    return handler(request, user, params)
  })
}