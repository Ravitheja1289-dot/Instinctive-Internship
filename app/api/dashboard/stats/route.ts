import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/dashboard/stats - Get dashboard statistics
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const timeRange = searchParams.get('timeRange') || '24h' // 24h, 7d, 30d
    
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
      case '24h':
      default:
        startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000)
        break
    }

    // Get basic counts
    const [
      totalIncidents,
      unresolvedIncidents,
      resolvedIncidents,
      totalCameras,
      recentIncidents,
      incidentsByType,
      incidentsByCamera,
      incidentsOverTime
    ] = await Promise.all([
      // Total incidents in time range
      prisma.incident.count({
        where: {
          tsStart: {
            gte: startDate,
          },
        },
      }),
      
      // Unresolved incidents in time range
      prisma.incident.count({
        where: {
          resolved: false,
          tsStart: {
            gte: startDate,
          },
        },
      }),
      
      // Resolved incidents in time range
      prisma.incident.count({
        where: {
          resolved: true,
          tsStart: {
            gte: startDate,
          },
        },
      }),
      
      // Total cameras
      prisma.camera.count(),
      
      // Recent incidents (last 10)
      prisma.incident.findMany({
        take: 10,
        orderBy: {
          tsStart: 'desc',
        },
        include: {
          camera: true,
        },
        where: {
          tsStart: {
            gte: startDate,
          },
        },
      }),
      
      // Incidents by type
      prisma.incident.groupBy({
        by: ['type'],
        _count: {
          id: true,
        },
        where: {
          tsStart: {
            gte: startDate,
          },
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),
      
      // Incidents by camera
      prisma.incident.groupBy({
        by: ['cameraId'],
        _count: {
          id: true,
        },
        where: {
          tsStart: {
            gte: startDate,
          },
        },
        orderBy: {
          _count: {
            id: 'desc',
          },
        },
      }),
      
      // Incidents over time (hourly for 24h, daily for longer periods)
      prisma.$queryRaw`
        SELECT 
          DATE(tsStart) as date,
          HOUR(tsStart) as hour,
          COUNT(*) as count
        FROM incidents 
        WHERE tsStart >= ${startDate}
        GROUP BY DATE(tsStart), HOUR(tsStart)
        ORDER BY DATE(tsStart), HOUR(tsStart)
      `
    ])

    // Cast incidentsOverTime to proper type
    const timeSeriesData = incidentsOverTime as any[]

    // Get camera names for incident by camera stats
    const cameraIds = incidentsByCamera.map(item => item.cameraId)
    const cameras = await prisma.camera.findMany({
      where: {
        id: {
          in: cameraIds,
        },
      },
    })

    const cameraMap = cameras.reduce((acc, camera) => {
      acc[camera.id] = camera
      return acc
    }, {} as Record<string, any>)

    // Format incidents by camera with camera names
    const formattedIncidentsByCamera = incidentsByCamera.map(item => ({
      camera: cameraMap[item.cameraId],
      count: item._count.id,
    }))

    // Calculate resolution rate
    const resolutionRate = totalIncidents > 0 
      ? Math.round((resolvedIncidents / totalIncidents) * 100) 
      : 0

    // Calculate average resolution time for resolved incidents
    const resolvedIncidentsWithTimes = await prisma.incident.findMany({
      where: {
        resolved: true,
        tsStart: {
          gte: startDate,
        },
      },
      select: {
        tsStart: true,
        updatedAt: true,
      },
    })

    const avgResolutionTime = resolvedIncidentsWithTimes.length > 0
      ? resolvedIncidentsWithTimes.reduce((acc, incident) => {
          const resolutionTime = incident.updatedAt.getTime() - incident.tsStart.getTime()
          return acc + resolutionTime
        }, 0) / resolvedIncidentsWithTimes.length
      : 0

    const stats = {
      timeRange,
      period: {
        start: startDate,
        end: now,
      },
      summary: {
        totalIncidents,
        unresolvedIncidents,
        resolvedIncidents,
        totalCameras,
        resolutionRate,
        avgResolutionTimeMs: Math.round(avgResolutionTime),
        avgResolutionTimeHours: Math.round(avgResolutionTime / (1000 * 60 * 60) * 10) / 10,
      },
      recentIncidents,
      incidentsByType: incidentsByType.map(item => ({
        type: item.type,
        count: item._count.id,
      })),
      incidentsByCamera: formattedIncidentsByCamera,
      incidentsOverTime: timeSeriesData,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    )
  }
}