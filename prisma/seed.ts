import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Clear existing data
  await prisma.incident.deleteMany()
  await prisma.camera.deleteMany()
  console.log('🧹 Cleared existing data')

  // Create cameras with more realistic data
  const cameraData = [
    { name: 'Shop Floor A', location: 'Main Production Area - Building A' },
    { name: 'Vault', location: 'Security Vault - Level B1' },
    { name: 'Entrance', location: 'Main Building Entrance - Lobby' },
    { name: 'Parking Lot', location: 'Employee Parking - North Side' },
    { name: 'Loading Dock', location: 'Warehouse Loading Bay - Dock 3' },
    { name: 'Server Room', location: 'IT Server Room - Level 2' },
    { name: 'Cafeteria', location: 'Employee Cafeteria - Ground Floor' },
    { name: 'Emergency Exit', location: 'Emergency Exit - East Wing' },
  ]

  const cameras = await Promise.all(
    cameraData.map(camera => 
      prisma.camera.create({ data: camera })
    )
  )

  console.log(`📹 Created ${cameras.length} cameras`)

  // Create incidents with more realistic patterns
  const now = new Date()
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)

  const incidentTypes = [
    'Unauthorised Access',
    'Gun Threat',
    'Face Recognised',
    'Suspicious Activity',
    'Perimeter Breach',
    'Equipment Tampering'
  ]

  // Weight incidents by type (some are more common than others)
  const incidentWeights = {
    'Unauthorised Access': 0.3,
    'Suspicious Activity': 0.25,
    'Face Recognised': 0.2,
    'Perimeter Breach': 0.15,
    'Equipment Tampering': 0.08,
    'Gun Threat': 0.02, // Very rare but critical
  }

  const incidents: any[] = []

  // Generate incidents over the past 24 hours with realistic patterns
  const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
  
  // Ensure we have at least 12 incidents as required
  const totalIncidents = Math.floor(Math.random() * 8) + 12 // 12-20 incidents
  
  for (let i = 0; i < totalIncidents; i++) {
    const randomCamera = cameras[Math.floor(Math.random() * cameras.length)]
    
    // Select incident type based on weights
    const randomValue = Math.random()
    let cumulativeWeight = 0
    let selectedType = incidentTypes[0]
    
    for (const [type, weight] of Object.entries(incidentWeights)) {
      cumulativeWeight += weight
      if (randomValue <= cumulativeWeight) {
        selectedType = type
        break
      }
    }
    
    // Generate random time within the past 24 hours
    const randomTimeOffset = Math.random() * 24 * 60 * 60 * 1000 // Random milliseconds in 24 hours
    const incidentTime = new Date(twentyFourHoursAgo.getTime() + randomTimeOffset)
    
    // Incident duration: 30 seconds to 15 minutes
    const durationMs = (Math.random() * 14.5 * 60 + 0.5 * 60) * 1000
    const endTime = new Date(incidentTime.getTime() + durationMs)
    
    // Resolution probability based on incident type and age
    const hoursSinceIncident = (now.getTime() - incidentTime.getTime()) / (60 * 60 * 1000)
    let resolutionProbability = Math.min(hoursSinceIncident * 0.05, 0.8) // Older incidents more likely to be resolved
    
    // Critical incidents (Gun Threat) are resolved faster
    if (selectedType === 'Gun Threat') {
      resolutionProbability = Math.min(hoursSinceIncident * 0.15, 0.95)
    }
    
    const resolved = Math.random() < resolutionProbability
      
    const incident = await prisma.incident.create({
      data: {
        cameraId: randomCamera.id,
        type: selectedType,
        tsStart: incidentTime,
        tsEnd: endTime,
        thumbnailUrl: `/thumbnails/incident-${selectedType.toLowerCase().replace(/\s+/g, '-')}.svg`,
        resolved,
      },
    })
    
    incidents.push(incident)
  }

  console.log(`🚨 Created ${incidents.length} incidents`)

  // Print summary statistics
  const stats = {
    totalIncidents: incidents.length,
    resolved: incidents.filter(i => i.resolved).length,
    unresolved: incidents.filter(i => !i.resolved).length,
    byType: incidentTypes.reduce((acc, type) => {
      acc[type] = incidents.filter(i => i.type === type).length
      return acc
    }, {} as Record<string, number>),
  }

  console.log('📊 Incident Statistics:')
  console.log(`   Total: ${stats.totalIncidents}`)
  console.log(`   Resolved: ${stats.resolved}`)
  console.log(`   Unresolved: ${stats.unresolved}`)
  console.log('   By Type:')
  Object.entries(stats.byType).forEach(([type, count]) => {
    console.log(`     ${type}: ${count}`)
  })

  console.log('✅ Database seed completed successfully!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })