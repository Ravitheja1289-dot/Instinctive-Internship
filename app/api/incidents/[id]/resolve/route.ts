import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function PATCH(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params

    // First get the current incident to flip the resolved status
    const currentIncident = await prisma.incident.findUnique({
      where: { id },
    })

    if (!currentIncident) {
      return NextResponse.json(
        { error: 'Incident not found' },
        { status: 404 }
      )
    }

    // Update the incident with flipped resolved status
    const updatedIncident = await prisma.incident.update({
      where: { id },
      data: {
        resolved: !currentIncident.resolved,
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