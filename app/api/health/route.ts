import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { HealthCheck } from '@/lib/types'

const startTime = Date.now()

// GET /api/health - Health check endpoint
export async function GET(request: NextRequest) {
  try {
    const now = new Date()
    
    // Test database connection
    let databaseStatus: 'connected' | 'disconnected' = 'disconnected'
    try {
      await prisma.$queryRaw`SELECT 1`
      databaseStatus = 'connected'
    } catch (error) {
      console.error('Database health check failed:', error)
    }
    
    // Calculate uptime
    const uptime = Date.now() - startTime
    
    // Determine overall status
    const status: 'healthy' | 'unhealthy' = databaseStatus === 'connected' ? 'healthy' : 'unhealthy'
    
    const healthCheck: HealthCheck = {
      status,
      timestamp: now,
      services: {
        database: databaseStatus,
      },
      uptime,
      version: process.env.npm_package_version || '1.0.0',
    }
    
    // Return appropriate status code
    const statusCode = status === 'healthy' ? 200 : 503
    
    return NextResponse.json(healthCheck, { status: statusCode })
  } catch (error) {
    console.error('Health check error:', error)
    
    const healthCheck: HealthCheck = {
      status: 'unhealthy',
      timestamp: new Date(),
      services: {
        database: 'disconnected',
      },
      uptime: Date.now() - startTime,
      version: process.env.npm_package_version || '1.0.0',
    }
    
    return NextResponse.json(healthCheck, { status: 503 })
  }
}