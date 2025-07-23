import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/reports - Generate various reports
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const reportType = searchParams.get('type') || 'summary'
    const timeRange = searchParams.get('timeRange') || '30d'
    const cameraId = searchParams.get('cameraId')
    
    // Calculate time range
    const now = new Date()
    let startDate: Date
    
    switch (timeRange) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
        break
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
        break
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000)
        break
      case '24h':
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
    }

    const baseWhere = {
      tsStart: {
        gte: startDate,
      },
      ...(cameraId && { cameraId }),
    }

    switch (reportType) {
      case 'summary':
        return await generateSummaryReport(baseWhere, startDate, now)
      
      case 'trends':
        return await generateTrendsReport(baseWhere, startDate, now, timeRange)
      
      case 'performance':
        return await generatePerformanceReport(baseWhere, startDate, now)
      
      case 'security':
        return await generateSecurityReport(baseWhere, startDate, now)
      
      default:
        return NextResponse.json(
          { error: 'Invalid report type. Supported types: summary, trends, performance, security' },
          { status: 400 }
        )
    }
  } catch (error) {
    console.error('Error generating report:', error)
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    )
  }
}

async function generateSummaryReport(where: any, startDate: Date, endDate: Date) {
  const [
    totalIncidents,
    resolvedIncidents,
    incidentsByType,
    incidentsByCamera,
    avgResolutionTime,
    criticalIncidents
  ] = await Promise.all([
    prisma.incident.count({ where }),
    prisma.incident.count({ where: { ...where, resolved: true } }),
    prisma.incident.groupBy({
      by: ['type'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    prisma.incident.groupBy({
      by: ['cameraId'],
      where,
      _count: { id: true },
      orderBy: { _count: { id: 'desc' } },
    }),
    calculateAverageResolutionTime(where),
    prisma.incident.count({
      where: {
        ...where,
        type: { in: ['Gun Threat', 'Unauthorised Access'] },
      },
    }),
  ])

  // Get camera details for camera stats
  const cameraIds = incidentsByCamera.map(item => item.cameraId)
  const cameras = await prisma.camera.findMany({
    where: { id: { in: cameraIds } },
  })
  const cameraMap = cameras.reduce((acc, camera) => {
    acc[camera.id] = camera
    return acc
  }, {} as Record<string, any>)

  const report = {
    reportType: 'summary',
    period: { start: startDate, end: endDate },
    summary: {
      totalIncidents,
      resolvedIncidents,
      unresolvedIncidents: totalIncidents - resolvedIncidents,
      resolutionRate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0,
      criticalIncidents,
      avgResolutionTimeHours: avgResolutionTime,
    },
    incidentsByType: incidentsByType.map(item => ({
      type: item.type,
      count: item._count.id,
      percentage: Math.round((item._count.id / totalIncidents) * 100),
    })),
    incidentsByCamera: incidentsByCamera.map(item => ({
      camera: cameraMap[item.cameraId],
      count: item._count.id,
      percentage: Math.round((item._count.id / totalIncidents) * 100),
    })),
  }

  return NextResponse.json(report)
}

async function generateTrendsReport(where: any, startDate: Date, endDate: Date, timeRange: string) {
  // Get incidents over time
  const incidents = await prisma.incident.findMany({
    where,
    select: {
      tsStart: true,
      type: true,
      resolved: true,
    },
    orderBy: { tsStart: 'asc' },
  })

  // Group by time periods
  const timeGroups: Record<string, any> = {}
  const groupBy = timeRange === '24h' ? 'hour' : 'day'

  incidents.forEach(incident => {
    let key: string
    if (groupBy === 'hour') {
      key = incident.tsStart.toISOString().substring(0, 13) // YYYY-MM-DDTHH
    } else {
      key = incident.tsStart.toISOString().substring(0, 10) // YYYY-MM-DD
    }

    if (!timeGroups[key]) {
      timeGroups[key] = {
        timestamp: key,
        total: 0,
        resolved: 0,
        byType: {},
      }
    }

    timeGroups[key].total++
    if (incident.resolved) {
      timeGroups[key].resolved++
    }

    if (!timeGroups[key].byType[incident.type]) {
      timeGroups[key].byType[incident.type] = 0
    }
    timeGroups[key].byType[incident.type]++
  })

  const trends = Object.values(timeGroups).sort((a: any, b: any) => 
    a.timestamp.localeCompare(b.timestamp)
  )

  const report = {
    reportType: 'trends',
    period: { start: startDate, end: endDate },
    groupBy,
    trends,
    insights: {
      peakPeriod: trends.reduce((max: any, current: any) => 
        current.total > (max?.total || 0) ? current : max, null
      ),
      averagePerPeriod: trends.length > 0 ? 
        Math.round(trends.reduce((sum: number, item: any) => sum + item.total, 0) / trends.length) : 0,
    },
  }

  return NextResponse.json(report)
}

async function generatePerformanceReport(where: any, startDate: Date, endDate: Date) {
  const [
    totalIncidents,
    resolvedIncidents,
    cameras,
    resolutionTimes
  ] = await Promise.all([
    prisma.incident.count({ where }),
    prisma.incident.count({ where: { ...where, resolved: true } }),
    prisma.camera.findMany({
      include: {
        incidents: {
          where,
          select: {
            id: true,
            resolved: true,
            tsStart: true,
            updatedAt: true,
          },
        },
      },
    }),
    prisma.incident.findMany({
      where: { ...where, resolved: true },
      select: {
        tsStart: true,
        updatedAt: true,
        type: true,
      },
    }),
  ])

  // Calculate performance metrics per camera
  const cameraPerformance = cameras.map(camera => {
    const cameraIncidents = camera.incidents
    const resolved = cameraIncidents.filter(i => i.resolved).length
    const total = cameraIncidents.length
    
    return {
      camera: {
        id: camera.id,
        name: camera.name,
        location: camera.location,
      },
      totalIncidents: total,
      resolvedIncidents: resolved,
      resolutionRate: total > 0 ? Math.round((resolved / total) * 100) : 0,
      avgResolutionTime: calculateCameraResolutionTime(cameraIncidents.filter(i => i.resolved)),
    }
  }).sort((a, b) => b.totalIncidents - a.totalIncidents)

  // Calculate resolution times by incident type
  const resolutionByType = resolutionTimes.reduce((acc, incident) => {
    if (!acc[incident.type]) {
      acc[incident.type] = []
    }
    const resolutionTime = incident.updatedAt.getTime() - incident.tsStart.getTime()
    acc[incident.type].push(resolutionTime)
    return acc
  }, {} as Record<string, number[]>)

  const typePerformance = Object.entries(resolutionByType).map(([type, times]) => ({
    type,
    count: times.length,
    avgResolutionTimeHours: Math.round((times.reduce((sum, time) => sum + time, 0) / times.length) / (1000 * 60 * 60) * 10) / 10,
    minResolutionTimeHours: Math.round(Math.min(...times) / (1000 * 60 * 60) * 10) / 10,
    maxResolutionTimeHours: Math.round(Math.max(...times) / (1000 * 60 * 60) * 10) / 10,
  }))

  const report = {
    reportType: 'performance',
    period: { start: startDate, end: endDate },
    overall: {
      totalIncidents,
      resolvedIncidents,
      resolutionRate: totalIncidents > 0 ? Math.round((resolvedIncidents / totalIncidents) * 100) : 0,
    },
    cameraPerformance,
    typePerformance,
  }

  return NextResponse.json(report)
}

async function generateSecurityReport(where: any, startDate: Date, endDate: Date) {
  const [
    criticalIncidents,
    unauthorizedAccess,
    gunThreats,
    perimeterBreaches,
    unresolvedCritical
  ] = await Promise.all([
    prisma.incident.findMany({
      where: {
        ...where,
        type: { in: ['Gun Threat', 'Unauthorised Access', 'Perimeter Breach'] },
      },
      include: { camera: true },
      orderBy: { tsStart: 'desc' },
    }),
    prisma.incident.count({
      where: { ...where, type: 'Unauthorised Access' },
    }),
    prisma.incident.count({
      where: { ...where, type: 'Gun Threat' },
    }),
    prisma.incident.count({
      where: { ...where, type: 'Perimeter Breach' },
    }),
    prisma.incident.count({
      where: {
        ...where,
        type: { in: ['Gun Threat', 'Unauthorised Access', 'Perimeter Breach'] },
        resolved: false,
      },
    }),
  ])

  const report = {
    reportType: 'security',
    period: { start: startDate, end: endDate },
    summary: {
      totalCriticalIncidents: criticalIncidents.length,
      unauthorizedAccess,
      gunThreats,
      perimeterBreaches,
      unresolvedCritical,
    },
    criticalIncidents: criticalIncidents.slice(0, 20), // Latest 20 critical incidents
    riskAssessment: {
      level: gunThreats > 0 ? 'HIGH' : unauthorizedAccess > 5 ? 'MEDIUM' : 'LOW',
      factors: [
        ...(gunThreats > 0 ? ['Gun threats detected'] : []),
        ...(unauthorizedAccess > 10 ? ['High unauthorized access attempts'] : []),
        ...(perimeterBreaches > 5 ? ['Multiple perimeter breaches'] : []),
        ...(unresolvedCritical > 0 ? ['Unresolved critical incidents'] : []),
      ],
    },
  }

  return NextResponse.json(report)
}

async function calculateAverageResolutionTime(where: any): Promise<number> {
  const resolvedIncidents = await prisma.incident.findMany({
    where: { ...where, resolved: true },
    select: {
      tsStart: true,
      updatedAt: true,
    },
  })

  if (resolvedIncidents.length === 0) return 0

  const totalTime = resolvedIncidents.reduce((sum, incident) => {
    return sum + (incident.updatedAt.getTime() - incident.tsStart.getTime())
  }, 0)

  return Math.round((totalTime / resolvedIncidents.length) / (1000 * 60 * 60) * 10) / 10 // Hours
}

function calculateCameraResolutionTime(incidents: any[]): number {
  if (incidents.length === 0) return 0

  const totalTime = incidents.reduce((sum, incident) => {
    return sum + (incident.updatedAt.getTime() - incident.tsStart.getTime())
  }, 0)

  return Math.round((totalTime / incidents.length) / (1000 * 60 * 60) * 10) / 10 // Hours
}