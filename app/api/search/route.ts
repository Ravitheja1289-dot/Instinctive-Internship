import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// GET /api/search - Search incidents and cameras
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') // 'incidents', 'cameras', or 'all'
    const limit = parseInt(searchParams.get('limit') || '10')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const results: any = {
      query,
      incidents: [],
      cameras: [],
    }

    // Search incidents
    if (type === 'incidents' || type === 'all' || !type) {
      const incidents = await prisma.incident.findMany({
        where: {
          OR: [
            {
              type: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              camera: {
                name: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
            {
              camera: {
                location: {
                  contains: query,
                  mode: 'insensitive',
                },
              },
            },
          ],
        },
        include: {
          camera: true,
        },
        orderBy: {
          tsStart: 'desc',
        },
        take: limit,
      })
      
      results.incidents = incidents
    }

    // Search cameras
    if (type === 'cameras' || type === 'all' || !type) {
      const cameras = await prisma.camera.findMany({
        where: {
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive',
              },
            },
            {
              location: {
                contains: query,
                mode: 'insensitive',
              },
            },
          ],
        },
        include: {
          incidents: {
            take: 5,
            orderBy: {
              tsStart: 'desc',
            },
          },
        },
        take: limit,
      })
      
      results.cameras = cameras
    }

    // Add result counts
    results.totalResults = results.incidents.length + results.cameras.length

    return NextResponse.json(results)
  } catch (error) {
    console.error('Error performing search:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}