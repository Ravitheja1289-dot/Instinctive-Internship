import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/incidents/export - Export incidents data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json' // json, csv
    const resolved = searchParams.get('resolved')
    const cameraId = searchParams.get('cameraId')
    const type = searchParams.get('type')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    
    // Build where clause
    const where: any = {}
    
    if (resolved !== null) {
      where.resolved = resolved === 'true'
    }
    
    if (cameraId) {
      where.cameraId = cameraId
    }
    
    if (type) {
      where.type = type
    }
    
    if (startDate || endDate) {
      where.tsStart = {}
      if (startDate) {
        where.tsStart.gte = new Date(startDate)
      }
      if (endDate) {
        where.tsStart.lte = new Date(endDate)
      }
    }
    
    const incidents = await prisma.incident.findMany({
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        camera: true,
      },
      orderBy: {
        tsStart: 'desc',
      },
    })

    if (format === 'csv') {
      // Generate CSV
      const csvHeaders = [
        'ID',
        'Type',
        'Camera Name',
        'Camera Location',
        'Start Time',
        'End Time',
        'Duration (minutes)',
        'Resolved',
        'Created At',
        'Updated At'
      ]
      
      const csvRows = incidents.map(incident => {
        const duration = Math.round((new Date(incident.tsEnd).getTime() - new Date(incident.tsStart).getTime()) / (1000 * 60))
        return [
          incident.id,
          incident.type,
          incident.camera.name,
          incident.camera.location,
          incident.tsStart.toISOString(),
          incident.tsEnd.toISOString(),
          duration.toString(),
          incident.resolved ? 'Yes' : 'No',
          incident.createdAt.toISOString(),
          incident.updatedAt.toISOString()
        ]
      })
      
      const csvContent = [
        csvHeaders.join(','),
        ...csvRows.map(row => row.map(field => `"${field}"`).join(','))
      ].join('\n')
      
      return new NextResponse(csvContent, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="incidents-export-${new Date().toISOString().split('T')[0]}.csv"`,
        },
      })
    }
    
    // Default JSON format
    const exportData = {
      exportDate: new Date().toISOString(),
      totalIncidents: incidents.length,
      filters: {
        resolved: resolved !== null ? resolved === 'true' : null,
        cameraId,
        type,
        startDate,
        endDate,
      },
      incidents: incidents.map(incident => ({
        id: incident.id,
        type: incident.type,
        camera: {
          id: incident.camera.id,
          name: incident.camera.name,
          location: incident.camera.location,
        },
        tsStart: incident.tsStart.toISOString(),
        tsEnd: incident.tsEnd.toISOString(),
        durationMinutes: Math.round((incident.tsEnd.getTime() - incident.tsStart.getTime()) / (1000 * 60)),
        thumbnailUrl: incident.thumbnailUrl,
        resolved: incident.resolved,
        createdAt: incident.createdAt.toISOString(),
        updatedAt: incident.updatedAt.toISOString(),
      })),
    }

    return NextResponse.json(exportData)
  } catch (error) {
    console.error('Error exporting incidents:', error)
    return NextResponse.json(
      { error: 'Failed to export incidents' },
      { status: 500 }
    )
  }
}