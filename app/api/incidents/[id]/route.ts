import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/incidents/[id] - Get a specific incident
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    const incident = await prisma.incident.findUnique({
      where: { id },
      include: {
        camera: true,
      },
    })

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(incident)
  } catch (error) {
    console.error('Error fetching incident:', error)
    return NextResponse.json(
      { error: 'Failed to fetch incident' },
      { status: 500 }
    )
  }
}

// PUT /api/incidents/[id] - Update an incident
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    const { type, tsStart, tsEnd, thumbnailUrl, resolved, cameraId } = body

    if (!type || !tsStart || !tsEnd || !cameraId) {
      return NextResponse.json(
        { error: 'Missing required fields: type, tsStart, tsEnd, cameraId' },
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

    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: {
        type,
        tsStart: new Date(tsStart),
        tsEnd: new Date(tsEnd),
        thumbnailUrl: thumbnailUrl || `/thumbnails/incident-${Date.now()}.jpg`,
        resolved: resolved || false,
        cameraId,
      },
      include: {
        camera: true,
      },
    })

    return NextResponse.json(updatedIncident)
  } catch (error) {
    console.error('Error updating incident:', error)
    return NextResponse.json(
      { error: 'Failed to update incident' },
      { status: 500 }
    )
  }
}

// DELETE /api/incidents/[id] - Delete an incident
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if incident exists
    const incident = await prisma.incident.findUnique({
      where: { id },
    })

    if (!incident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    await prisma.incident.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Incident deleted successfully' })
  } catch (error) {
    console.error('Error deleting incident:', error)
    return NextResponse.json(
      { error: 'Failed to delete incident' },
      { status: 500 }
    )
  }
}