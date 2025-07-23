import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting minimal database seed...')

  // Clear existing data
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()
  console.log('🧹 Cleared existing data')

  // Create exactly 3 cameras as required
  const cameras = await Promise.all([
    prisma.camera.create({
      data: {
        name: 'Shop Floor A',
        location: 'Main Production Area',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Vault',
        location: 'Security Vault - Level B1',
      },
    }),
    prisma.camera.create({
      data: {
        name: 'Entrance',
        location: 'Main Building Entrance',
      },
    }),
  ])

  console.log(`📹 Created ${cameras.length} cameras`)

  // Create 12+ incidents across 24-hour span with at least 3 threat types
  const now = new Date()
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const incidentTypes = [
    'Unauthorised Access',
    'Gun Threat',
    'Face Recognised',
    'Suspicious Activity',
    'Perimeter Breach',
    'Equipment Tampering'
  ]

  const incidents = []

  // Generate 15 incidents across the 24-hour span
  for (let i = 0; i < 15; i++) {
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)]
    const randomType = incidentTypes[Math.floor(Math.random() * incidentTypes.length)]
    
    // Random time within the last 24 hours
    const randomTime = new Date(yesterday.getTime() + Math.random() * 24 * 60 * 60 * 1000)
    const endTime = new Date(randomTime.getTime() + Math.random() * 10 * 60 * 1000) // 0-10 minutes duration
    
    const incident = await prisma.incident.create({
      data: {
        cameraId: randomCamera.id,
        type: randomType,
        tsStart: randomTime,
        tsEnd: endTime,
        thumbnailUrl: `/thumbnails/incident-${i + 1}.jpg`,
        resolved: Math.random() > 0.7, // 30% chance of being resolved
      },
    })
    
    incidents.push(incident)
  }

  console.log(`🚨 Created ${incidents.length} incidents`)

  // Print summary by type to verify we have at least 3 threat types
  const typeCount = incidents.reduce((acc, incident) => {
    acc[incident.type] = (acc[incident.type] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  console.log('📊 Incidents by type:')
  Object.entries(typeCount).forEach(([type, count]) => {
    console.log(`   ${type}: ${count}`)
  })

  console.log('✅ Minimal seed completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })