import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// POST /api/incidents/bulk - Bulk operations on incidents
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, incidentIds } = body

    if (!action || !incidentIds || !Array.isArray(incidentIds)) {
      return NextResponse.json(
        { error: 'Missing required fields: action, incidentIds (array)' },
        { status: 400 }
      )
    }

    if (incidentIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one incident ID is required' },
        { status: 400 }
      )
    }

    let result: any = {}

    switch (action) {
      case 'resolve':
        result = await prisma.incident.updateMany({
          where: {
            id: {
              in: incidentIds,
            },
          },
          data: {
            resolved: true,
          },
        })
        break

      case 'unresolve':
        result = await prisma.incident.updateMany({
          where: {
            id: {
              in: incidentIds,
            },
          },
          data: {
            resolved: false,
          },
        })
        break

      case 'delete':
        result = await prisma.incident.deleteMany({
          where: {
            id: {
              in: incidentIds,
            },
          },
        })
        break

      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions: resolve, unresolve, delete' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      message: `Bulk ${action} completed successfully`,
      affectedCount: result.count,
      incidentIds,
    })
  } catch (error) {
    console.error('Error performing bulk operation:', error)
    return NextResponse.json(
      { error: 'Failed to perform bulk operation' },
      { status: 500 }
    )
  }
}

// GET /api/incidents/bulk - Get incidents by IDs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = searchParams.get('ids')

    if (!ids) {
      return NextResponse.json(
        { error: 'Missing required parameter: ids (comma-separated)' },
        { status: 400 }
      )
    }

    const incidentIds = ids.split(',').filter(id => id.trim().length > 0)

    if (incidentIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one incident ID is required' },
        { status: 400 }
      )
    }

    const incidents = await prisma.incident.findMany({
      where: {
        id: {
          in: incidentIds,
        },
      },
      include: {
        camera: true,
      },
      orderBy: {
        tsStart: 'desc',
      },
    })

    return NextResponse.json({
      incidents,
      requestedCount: incidentIds.length,
      foundCount: incidents.length,
    })
  } catch (error) {
    console.error('Error fetching incidents by IDs:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}