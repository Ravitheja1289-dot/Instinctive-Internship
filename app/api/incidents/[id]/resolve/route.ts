import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

interface RouteParams {
  params: Promise<{ id: string }>
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { id } = await params

    // Add timeout protection for database operations
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database operation timeout')), 5000)
    })

    // First get the current incident to flip the resolved status
    const currentIncident = await Promise.race([
      prisma.incident.findUnique({
        where: { id },
        include: {
          camera: true,
        },
      }),
      timeoutPromise
    ]) as any

    if (!currentIncident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    // Update the incident with flipped resolved status
    const updatedIncident = await Promise.race([
      prisma.incident.update({
        where: { id },
        data: {
          resolved: !currentIncident.resolved,
        },
        include: {
          camera: true,
        },
      }),
      timeoutPromise
    ]) as any

    return NextResponse.json(updatedIncident)
  } catch (error) {
    console.error('Error updating incident:', error)
    
    // For graceful degradation, return a mock response structure
    // This allows the frontend to continue working even if the database is down
    return NextResponse.json(
      { 
        error: 'Database unavailable - operation not persisted',
        message: 'The incident status change was not saved to the database. Please try again later.'
      },
      { 
        status: 503,
        headers: {
          'X-Database-Status': 'unavailable',
          'Cache-Control': 'no-store'
        }
      }
    )
  }
}