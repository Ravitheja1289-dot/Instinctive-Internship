// Database types (matching Prisma schema)
export interface Camera {
  id: string
  name: string
  location: string
  incidents?: Incident[]
  createdAt: Date
  updatedAt: Date
}

export interface Incident {
  id: string
  cameraId: string
  camera?: Camera
  type: IncidentType
  tsStart: Date
  tsEnd: Date
  thumbnailUrl: string
  resolved: boolean
  createdAt: Date
  updatedAt: Date
}

// Incident types
export type IncidentType = 
  | 'Unauthorised Access'
  | 'Gun Threat'
  | 'Face Recognised'
  | 'Suspicious Activity'
  | 'Perimeter Breach'
  | 'Equipment Tampering'

// API Request/Response types
export interface CreateIncidentRequest {
  cameraId: string
  type: IncidentType
  tsStart: string
  tsEnd: string
  thumbnailUrl?: string
  resolved?: boolean
}

export interface UpdateIncidentRequest {
  cameraId?: string
  type?: IncidentType
  tsStart?: string
  tsEnd?: string
  thumbnailUrl?: string
  resolved?: boolean
}

export interface CreateCameraRequest {
  name: string
  location: string
}

export interface UpdateCameraRequest {
  name?: string
  location?: string
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  timestamp?: string
}

export interface PaginatedResponse<T = any> {
  data: T[]
  pagination: {
    page: number
    limit: number
    totalCount: number
    totalPages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

export interface IncidentsResponse {
  incidents: Incident[]
  totalCount: number
  hasMore: boolean
}

// Dashboard statistics types
export interface DashboardStats {
  timeRange: string
  period: {
    start: Date
    end: Date
  }
  summary: {
    totalIncidents: number
    unresolvedIncidents: number
    resolvedIncidents: number
    totalCameras: number
    resolutionRate: number
    avgResolutionTimeMs: number
    avgResolutionTimeHours: number
  }
  recentIncidents: Incident[]
  incidentsByType: Array<{
    type: string
    count: number
  }>
  incidentsByCamera: Array<{
    camera: Camera
    count: number
  }>
  incidentsOverTime: Array<{
    date: string
    hour: number
    count: number
  }>
}

// Search types
export interface SearchResults {
  query: string
  incidents: Incident[]
  cameras: Camera[]
  totalResults: number
}

// Filter types
export interface IncidentFilters {
  resolved?: boolean
  cameraId?: string
  type?: IncidentType
  startDate?: Date
  endDate?: Date
  limit?: number
  offset?: number
}

export interface CameraFilters {
  includeIncidents?: boolean
  name?: string
  location?: string
}

// Validation types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
}

export interface ValidationRule<T = any> {
  field: keyof T
  required?: boolean
  type?: 'string' | 'number' | 'boolean' | 'date' | 'email'
  minLength?: number
  maxLength?: number
  min?: number
  max?: number
  pattern?: RegExp
  custom?: (value: any) => boolean
  message?: string
}

// Error types
export interface ApiError {
  error: string
  message?: string
  code?: string
  details?: any
  timestamp: string
}

// Time range types
export type TimeRange = '24h' | '7d' | '30d'

// Sort types
export type SortOrder = 'asc' | 'desc'

export interface SortOptions {
  field: string
  order: SortOrder
}

// Query parameter types
export interface QueryParams {
  [key: string]: string | string[] | undefined
}

// Middleware types
export interface RequestContext {
  user?: {
    id: string
    role: string
    permissions?: string[]
  }
  startTime: number
  requestId: string
}

// Rate limiting types
export interface RateLimitInfo {
  count: number
  resetTime: number
  remaining: number
}

// File upload types (for future use)
export interface FileUpload {
  filename: string
  mimetype: string
  size: number
  buffer: Buffer
}

// Webhook types (for future use)
export interface WebhookPayload {
  event: string
  data: any
  timestamp: Date
  signature?: string
}

// Configuration types
export interface ApiConfig {
  rateLimit: {
    maxRequests: number
    windowMs: number
  }
  cors: {
    origin: string | string[]
    methods: string[]
    headers: string[]
  }
  pagination: {
    defaultLimit: number
    maxLimit: number
  }
}

// Health check types
export interface HealthCheck {
  status: 'healthy' | 'unhealthy'
  timestamp: Date
  services: {
    database: 'connected' | 'disconnected'
    [key: string]: string
  }
  uptime: number
  version: string
}