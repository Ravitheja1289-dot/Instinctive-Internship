import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/cameras - Get all cameras
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const includeIncidents = searchParams.get('includeIncidents') === 'true'
    
    const cameras = await prisma.camera.findMany({
      include: includeIncidents ? {
        incidents: {
          orderBy: {
            tsStart: 'desc',
          },
        },
      } : undefined,
      orderBy: {
        name: 'asc',
      },
    })

    return NextResponse.json(cameras)
  } catch (error) {
    console.error('Error fetching cameras:', error)
    return NextResponse.json(
      { error: 'Failed to fetch cameras' },
      { status: 500 }
    )
  }
}

// POST /api/cameras - Create a new camera
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate required fields
    const { name, location } = body
    
    if (!name || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: name, location' },
        { status: 400 }
      )
    }

    // Check if camera with same name already exists
    const existingCamera = await prisma.camera.findFirst({
      where: { name },
    })

    if (existingCamera) {
      return NextResponse.json(
        { error: 'Camera with this name already exists' },
        { status: 409 }
      )
    }

    const camera = await prisma.camera.create({
      data: {
        name,
        location,
      },
    })

    return NextResponse.json(camera, { status: 201 })
  } catch (error) {
    console.error('Error creating camera:', error)
    return NextResponse.json(
      { error: 'Failed to create camera' },
      { status: 500 }
    )
  }
}