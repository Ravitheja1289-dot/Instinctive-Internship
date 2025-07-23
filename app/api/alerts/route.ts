import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/alerts - Get current alerts and notifications
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const severity = searchParams.get('severity') // 'critical', 'high', 'medium', 'low'
    const limit = parseInt(searchParams.get('limit') || '50')
    
    // Get unresolved critical incidents
    const criticalIncidents = await prisma.incident.findMany({
      where: {
        resolved: false,
        type: { in: ['Gun Threat', 'Unauthorised Access'] },
      },
      include: { camera: true },
      orderBy: { tsStart: 'desc' },
      take: limit,
    })

    // Get recent incidents (last 2 hours)
    const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000)
    const recentIncidents = await prisma.incident.findMany({
      where: {
        tsStart: { gte: twoHoursAgo },
        resolved: false,
      },
      include: { camera: true },
      orderBy: { tsStart: 'desc' },
      take: limit,
    })

    // Get cameras with multiple recent incidents (potential issues)
    const cameraAlerts = await prisma.$queryRaw`
      SELECT 
        c.id,
        c.name,
        c.location,
        COUNT(i.id) as incident_count
      FROM cameras c
      JOIN incidents i ON c.id = i.cameraId
      WHERE i.tsStart >= ${twoHoursAgo}
        AND i.resolved = false
      GROUP BY c.id, c.name, c.location
      HAVING COUNT(i.id) >= 3
      ORDER BY incident_count DESC
    ` as any[]

    // Generate alerts
    const alerts = []

    // Critical incident alerts
    criticalIncidents.forEach(incident => {
      alerts.push({
        id: `critical-${incident.id}`,
        type: 'critical_incident',
        severity: incident.type === 'Gun Threat' ? 'critical' : 'high',
        title: `${incident.type} Detected`,
        message: `${incident.type} detected at ${incident.camera.name} (${incident.camera.location})`,
        timestamp: incident.tsStart,
        data: {
          incidentId: incident.id,
          incident,
        },
        actions: [
          { label: 'View Incident', action: 'view_incident', data: { id: incident.id } },
          { label: 'Resolve', action: 'resolve_incident', data: { id: incident.id } },
        ],
      })
    })

    // Camera alerts for multiple incidents
    cameraAlerts.forEach(camera => {
      alerts.push({
        id: `camera-${camera.id}`,
        type: 'camera_alert',
        severity: 'medium',
        title: 'Multiple Incidents Detected',
        message: `${camera.incident_count} unresolved incidents at ${camera.name} in the last 2 hours`,
        timestamp: new Date(),
        data: {
          cameraId: camera.id,
          camera,
          incidentCount: camera.incident_count,
        },
        actions: [
          { label: 'View Camera', action: 'view_camera', data: { id: camera.id } },
          { label: 'View Incidents', action: 'view_camera_incidents', data: { id: camera.id } },
        ],
      })
    })

    // System alerts
    const totalUnresolved = await prisma.incident.count({
      where: { resolved: false },
    })

    if (totalUnresolved > 20) {
      alerts.push({
        id: 'system-backlog',
        type: 'system_alert',
        severity: 'high',
        title: 'High Incident Backlog',
        message: `${totalUnresolved} unresolved incidents require attention`,
        timestamp: new Date(),
        data: {
          unresolvedCount: totalUnresolved,
        },
        actions: [
          { label: 'View All Incidents', action: 'view_incidents', data: { resolved: false } },
          { label: 'Bulk Resolve', action: 'bulk_resolve', data: {} },
        ],
      })
    }

    // Filter by severity if requested
    let filteredAlerts = alerts
    if (severity) {
      filteredAlerts = alerts.filter(alert => alert.severity === severity)
    }

    // Sort by severity and timestamp
    const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 }
    filteredAlerts.sort((a, b) => {
      const severityDiff = (severityOrder[b.severity as keyof typeof severityOrder] || 0) - 
                          (severityOrder[a.severity as keyof typeof severityOrder] || 0)
      if (severityDiff !== 0) return severityDiff
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    })

    const response = {
      alerts: filteredAlerts.slice(0, limit),
      summary: {
        total: filteredAlerts.length,
        critical: alerts.filter(a => a.severity === 'critical').length,
        high: alerts.filter(a => a.severity === 'high').length,
        medium: alerts.filter(a => a.severity === 'medium').length,
        low: alerts.filter(a => a.severity === 'low').length,
      },
      lastUpdated: new Date().toISOString(),
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching alerts:', error)
    return NextResponse.json(
      { error: 'Failed to fetch alerts' },
      { status: 500 }
    )
  }
}

// POST /api/alerts - Mark alerts as read or perform actions
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, alertId, data } = body

    if (!action) {
      return NextResponse.json(
        { error: 'Missing required field: action' },
        { status: 400 }
      )
    }

    let result: any = {}

    switch (action) {
      case 'mark_read':
        // In a real implementation, you'd store alert read status in the database
        result = { message: 'Alert marked as read', alertId }
        break

      case 'resolve_incident':
        if (!data?.id) {
          return NextResponse.json(
            { error: 'Missing incident ID' },
            { status: 400 }
          )
        }
        
        const incident = await prisma.incident.findUnique({
          where: { id: data.id },
        })

        if (!incident) {
          return NextResponse.json(
            { error: 'Incident not found' },
            { status: 404 }
          )
        }

        const updatedIncident = await prisma.incident.update({
          where: { id: data.id },
          data: { resolved: !incident.resolved },
          include: { camera: true },
        })

        result = { message: 'Incident resolved', incident: updatedIncident }
        break

      case 'dismiss_alert':
        // In a real implementation, you'd store dismissed alerts
        result = { message: 'Alert dismissed', alertId }
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error processing alert action:', error)
    return NextResponse.json(
      { error: 'Failed to process alert action' },
      { status: 500 }
    )
  }
}