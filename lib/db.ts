import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with better error handling for production
let prismaInstance: PrismaClient | null = null

try {
  prismaInstance = globalForPrisma.prisma ?? new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
    errorFormat: 'pretty',
    datasources: {
      db: {
        url: process.env.DATABASE_URL || 'file:./dev.db'
      }
    }
  })
} catch (error) {
  console.error('Failed to initialize Prisma client:', error)
  // Create a mock client that won't crash the app
  prismaInstance = {
    $queryRaw: async () => { throw new Error('Database unavailable') },
    $disconnect: async () => {},
    incident: {
      findMany: async () => { throw new Error('Database unavailable') },
      findUnique: async () => { throw new Error('Database unavailable') },
      create: async () => { throw new Error('Database unavailable') },
      update: async () => { throw new Error('Database unavailable') },
      count: async () => { throw new Error('Database unavailable') }
    },
    camera: {
      findMany: async () => { throw new Error('Database unavailable') },
      findUnique: async () => { throw new Error('Database unavailable') }
    }
  } as any
}

export const prisma = prismaInstance!

// Connection test function for health checks
export async function testDatabaseConnection(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Graceful shutdown
export async function disconnectDatabase() {
  try {
    await prisma.$disconnect()
  } catch (error) {
    console.error('Error during database disconnect:', error)
  }
}

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}