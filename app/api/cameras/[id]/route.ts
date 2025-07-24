import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/cameras/[id] - Get a specific camera
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

// PUT /api/cameras/[id] - Update a specific camera
export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const body = await request.json()
    
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

    // Validate fields if provided
    const { name, location } = body
    
    if (name && typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid name field' },
        { status: 400 }
      )
    }

    if (location && typeof location !== 'string') {
      return NextResponse.json(
        { error: 'Invalid location field' },
        { status: 400 }
      )
    }

    // Check if camera with same name already exists (excluding current camera)
    if (name) {
      const duplicateCamera = await prisma.camera.findFirst({
        where: { 
          name,
          NOT: { id }
        },
      })

      if (duplicateCamera) {
        return NextResponse.json(
          { error: 'Camera with this name already exists' },
          { status: 409 }
        )
      }
    }

    const camera = await prisma.camera.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(location && { location }),
      },
    })

    return NextResponse.json(camera)
  } catch (error) {
    console.error('Error updating camera:', error)
    return NextResponse.json(
      { error: 'Failed to update camera' },
      { status: 500 }
    )
  }
}

// DELETE /api/cameras/[id] - Delete a specific camera
export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    
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

    // Delete camera (this will cascade delete incidents due to foreign key)
    await prisma.camera.delete({
      where: { id },
    })

    return NextResponse.json(
      { message: 'Camera deleted successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error deleting camera:', error)
    return NextResponse.json(
      { error: 'Failed to delete camera' },
      { status: 500 }
    )
  }
}