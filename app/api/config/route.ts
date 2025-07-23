import { NextRequest, NextResponse } from 'next/server'

// In a real application, these would be stored in a database or configuration service
const defaultConfig = {
  system: {
    name: 'Security Incident Management System',
    version: '1.0.0',
    timezone: 'UTC',
    dateFormat: 'YYYY-MM-DD',
    timeFormat: '24h',
  },
  alerts: {
    enabled: true,
    criticalIncidentNotification: true,
    emailNotifications: false,
    smsNotifications: false,
    autoResolveTimeout: 24, // hours
    maxUnresolvedAlerts: 50,
  },
  incidents: {
    autoArchiveResolved: true,
    archiveAfterDays: 90,
    defaultThumbnailUrl: '/thumbnails/default-incident.jpg',
    allowBulkOperations: true,
    requireApprovalForDeletion: true,
  },
  cameras: {
    defaultLocation: 'Unknown Location',
    allowDuplicateNames: false,
    maxCamerasPerLocation: 10,
    healthCheckInterval: 300, // seconds
  },
  dashboard: {
    defaultTimeRange: '24h',
    refreshInterval: 30, // seconds
    maxIncidentsDisplay: 100,
    showResolvedIncidents: true,
    autoSelectFirstUnresolved: true,
  },
  export: {
    maxRecords: 10000,
    allowedFormats: ['json', 'csv'],
    includePersonalData: false,
  },
  security: {
    sessionTimeout: 3600, // seconds
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireMFA: false,
  },
  api: {
    rateLimit: {
      enabled: true,
      maxRequests: 100,
      windowMinutes: 15,
    },
    cors: {
      enabled: true,
      allowedOrigins: ['*'],
    },
    logging: {
      enabled: true,
      level: 'info', // debug, info, warn, error
      includeRequestBody: false,
    },
  },
}

// GET /api/config - Get system configuration
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    
    if (section) {
      if (!(section in defaultConfig)) {
        return NextResponse.json(
          { error: `Invalid configuration section: ${section}` },
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        section,
        config: (defaultConfig as any)[section],
      })
    }
    
    return NextResponse.json({
      config: defaultConfig,
      lastUpdated: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error fetching configuration:', error)
    return NextResponse.json(
      { error: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

// PUT /api/config - Update system configuration
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { section, config } = body
    
    if (!section || !config) {
      return NextResponse.json(
        { error: 'Missing required fields: section, config' },
        { status: 400 }
      )
    }
    
    if (!(section in defaultConfig)) {
      return NextResponse.json(
        { error: `Invalid configuration section: ${section}` },
        { status: 400 }
      )
    }
    
    // Validate configuration based on section
    const validationResult = validateConfig(section, config)
    if (!validationResult.isValid) {
      return NextResponse.json(
        { error: 'Configuration validation failed', errors: validationResult.errors },
        { status: 400 }
      )
    }
    
    // In a real implementation, you would save this to a database
    // For now, we'll just return the updated config
    const updatedConfig = {
      ...(defaultConfig as any)[section],
      ...config,
    }
    
    return NextResponse.json({
      message: 'Configuration updated successfully',
      section,
      config: updatedConfig,
      updatedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error updating configuration:', error)
    return NextResponse.json(
      { error: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}

// POST /api/config/reset - Reset configuration to defaults
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { section } = body
    
    if (section) {
      if (!(section in defaultConfig)) {
        return NextResponse.json(
          { error: `Invalid configuration section: ${section}` },
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        message: `Configuration section '${section}' reset to defaults`,
        section,
        config: (defaultConfig as any)[section],
        resetAt: new Date().toISOString(),
      })
    }
    
    return NextResponse.json({
      message: 'All configuration reset to defaults',
      config: defaultConfig,
      resetAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Error resetting configuration:', error)
    return NextResponse.json(
      { error: 'Failed to reset configuration' },
      { status: 500 }
    )
  }
}

function validateConfig(section: string, config: any): { isValid: boolean; errors: string[] } {
  const errors: string[] = []
  
  switch (section) {
    case 'alerts':
      if (typeof config.enabled !== 'undefined' && typeof config.enabled !== 'boolean') {
        errors.push('alerts.enabled must be a boolean')
      }
      if (typeof config.autoResolveTimeout !== 'undefined') {
        if (typeof config.autoResolveTimeout !== 'number' || config.autoResolveTimeout < 1) {
          errors.push('alerts.autoResolveTimeout must be a positive number')
        }
      }
      if (typeof config.maxUnresolvedAlerts !== 'undefined') {
        if (typeof config.maxUnresolvedAlerts !== 'number' || config.maxUnresolvedAlerts < 1) {
          errors.push('alerts.maxUnresolvedAlerts must be a positive number')
        }
      }
      break
      
    case 'incidents':
      if (typeof config.archiveAfterDays !== 'undefined') {
        if (typeof config.archiveAfterDays !== 'number' || config.archiveAfterDays < 1) {
          errors.push('incidents.archiveAfterDays must be a positive number')
        }
      }
      break
      
    case 'dashboard':
      if (typeof config.refreshInterval !== 'undefined') {
        if (typeof config.refreshInterval !== 'number' || config.refreshInterval < 5) {
          errors.push('dashboard.refreshInterval must be at least 5 seconds')
        }
      }
      if (typeof config.defaultTimeRange !== 'undefined') {
        const validRanges = ['24h', '7d', '30d']
        if (!validRanges.includes(config.defaultTimeRange)) {
          errors.push(`dashboard.defaultTimeRange must be one of: ${validRanges.join(', ')}`)
        }
      }
      break
      
    case 'api':
      if (config.rateLimit) {
        if (typeof config.rateLimit.maxRequests !== 'undefined') {
          if (typeof config.rateLimit.maxRequests !== 'number' || config.rateLimit.maxRequests < 1) {
            errors.push('api.rateLimit.maxRequests must be a positive number')
          }
        }
        if (typeof config.rateLimit.windowMinutes !== 'undefined') {
          if (typeof config.rateLimit.windowMinutes !== 'number' || config.rateLimit.windowMinutes < 1) {
            errors.push('api.rateLimit.windowMinutes must be a positive number')
          }
        }
      }
      break
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}