import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/cameras/[id] - Get a specific camera
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const { searchParams } = new URL(request.url)
    const includeIncidents = searchParams.get('includeIncidents') === 'true'

    const camera = await prisma.camera.findUnique({
      where: { id },
      include: includeIncidents ? {
        incidents: {
          orderBy: {
            tsStart: 'desc',
          },
        },
      } : undefined,
    })

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(camera)
  } catch (error) {
    console.error('Error fetching camera:', error)
    return NextResponse.json(
      { error: 'Failed to fetch camera' },
      { status: 500 }
    )
  }
}

// PUT /api/cameras/[id] - Update a camera
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validate required fields
    const { name, location } = body

    if (!name || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location' },
        { status: 400 }
      )
    }

    // Check if camera exists
    const existingCamera = await prisma.camera.findUnique({
      where: { id },
    })

    if (!existingCamera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    // Check if another camera with same name exists (excluding current one)
    const duplicateCamera = await prisma.camera.findFirst({
      where: { 
        name,
        id: { not: id }
      },
    })

    if (duplicateCamera) {
      return NextResponse.json(
        { error: 'Camera with this name already exists' },
        { status: 409 }
      )
    }

    const updatedCamera = await prisma.camera.update({
      where: { id },
      data: {
        name,
        location,
      },
    })

    return NextResponse.json(updatedCamera)
  } catch (error) {
    console.error('Error updating camera:', error)
    return NextResponse.json(
      { error: 'Failed to update camera' },
      { status: 500 }
    )
  }
}

// DELETE /api/cameras/[id] - Delete a camera
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Check if camera exists
    const camera = await prisma.camera.findUnique({
      where: { id },
      include: {
        incidents: true,
      },
    })

    if (!camera) {
      return NextResponse.json(
        { error: 'Camera not found' },
        { status: 404 }
      )
    }

    // Check if camera has incidents
    if (camera.incidents.length > 0) {
      return NextResponse.json(
        { error: 'Cannot delete camera with existing incidents. Delete incidents first or use force=true parameter.' },
        { status: 409 }
      )
    }

    await prisma.camera.delete({
      where: { id },
    })

    return NextResponse.json({ message: 'Camera deleted successfully' })
  } catch (error) {
    console.error('Error deleting camera:', error)
    return NextResponse.json(
      { error: 'Failed to delete camera' },
      { status: 500 }
    )
  }
}