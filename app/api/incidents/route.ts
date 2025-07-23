import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/incidents - Get all incidents with optional filtering
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const resolved = searchParams.get('resolved')
    const cameraId = searchParams.get('cameraId')
    const type = searchParams.get('type')
    const limit = searchParams.get('limit')
    const offset = searchParams.get('offset')
    
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
    
    // Build query options
    const queryOptions: any = {
      where: Object.keys(where).length > 0 ? where : undefined,
      include: {
        camera: true,
      },
      orderBy: {
        tsStart: 'desc', // newest first
      },
    }
    
    // Add pagination if specified
    if (limit) {
      queryOptions.take = parseInt(limit)
    }
    
    if (offset) {
      queryOptions.skip = parseInt(offset)
    }
    
    const incidents = await prisma.incident.findMany(queryOptions)

    // Also get total count for pagination
    const totalCount = await prisma.incident.count({
      where: Object.keys(where).length > 0 ? where : undefined,
    })

    // For backward compatibility with the frontend, return just the incidents array
    // if no pagination parameters are provided
    if (!limit && !offset) {
      return NextResponse.json(incidents)
    }
    
    return NextResponse.json({
      incidents,
      totalCount,
      hasMore: limit ? incidents.length === parseInt(limit) : false,
    })
  } catch (error) {
    console.error('Error fetching incidents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incidents' },
      { status: 500 }
    )
  }
}

// POST /api/incidents - Create a new incident
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { type, tsStart, tsEnd, cameraId } = body
    
    if (!type || !tsStart || !tsEnd || !cameraId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, tsStart, tsEnd, cameraId' },
        { status: 400 }
      )
    }

    // Validate incident type
    const validTypes = [
      'Unauthorised Access',
      'Gun Threat', 
      'Face Recognised',
      'Suspicious Activity',
      'Perimeter Breach',
      'Equipment Tampering'
    ]
    
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Invalid incident type. Must be one of: ${validTypes.join(', ')}` },
        { status: 400 }
      )
    }

    // Check if camera exists
    const camera = await prisma.camera.findUnique({
      where: { id: cameraId },
    })

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    // Create the incident
    const incident = await prisma.incident.create({
      data: {
        type,
        tsStart: new Date(tsStart),
        tsEnd: new Date(tsEnd),
        thumbnailUrl: body.thumbnailUrl || `/thumbnails/incident-${Date.now()}.jpg`,
        resolved: body.resolved || false,
        cameraId,
      },
      include: {
        camera: true,
      },
    })

    return NextResponse.json(incident, { status: 201 })
  } catch (error) {
    console.error('Error creating incident:', error)
    return NextResponse.json(
      { error: 'Failed to create incident' },
      { status: 500 }
    )
  }
}