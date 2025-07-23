import { NextRequest, NextResponse } from 'next/server'

const apiDocumentation = {
  title: 'Security Incident Management System API',
  version: '1.0.0',
  description: 'RESTful API for managing security incidents and camera surveillance data',
  baseUrl: '/api',
  endpoints: {
    // Health Check
    '/health': {
      GET: {
        description: 'Check system health and database connectivity',
        parameters: [],
        responses: {
          200: {
            description: 'System is healthy',
            example: {
              status: 'healthy',
              timestamp: '2025-01-01T00:00:00.000Z',
              services: { database: 'connected' },
              uptime: 3600000,
              version: '1.0.0'
            }
          },
          503: { description: 'System is unhealthy' }
        }
      }
    },

    // Incidents
    '/incidents': {
      GET: {
        description: 'Get all incidents with optional filtering and pagination',
        parameters: [
          { name: 'resolved', type: 'boolean', description: 'Filter by resolution status' },
          { name: 'cameraId', type: 'string', description: 'Filter by camera ID' },
          { name: 'type', type: 'string', description: 'Filter by incident type' },
          { name: 'limit', type: 'number', description: 'Maximum number of results' },
          { name: 'offset', type: 'number', description: 'Number of results to skip' }
        ],
        responses: {
          200: {
            description: 'List of incidents',
            example: [
              {
                id: 'incident_id',
                type: 'Unauthorised Access',
                tsStart: '2025-01-01T10:00:00.000Z',
                tsEnd: '2025-01-01T10:05:00.000Z',
                thumbnailUrl: '/thumbnails/incident.jpg',
                resolved: false,
                camera: {
                  id: 'camera_id',
                  name: 'Main Entrance',
                  location: 'Building A - Lobby'
                }
              }
            ]
          }
        }
      },
      POST: {
        description: 'Create a new incident',
        requestBody: {
          type: 'Unauthorised Access',
          tsStart: '2025-01-01T10:00:00.000Z',
          tsEnd: '2025-01-01T10:05:00.000Z',
          cameraId: 'camera_id',
          thumbnailUrl: '/thumbnails/incident.jpg',
          resolved: false
        },
        responses: {
          201: { description: 'Incident created successfully' },
          400: { description: 'Invalid request data' },
          404: { description: 'Camera not found' }
        }
      }
    },

    '/incidents/[id]': {
      GET: {
        description: 'Get a specific incident by ID',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Incident ID' }
        ],
        responses: {
          200: { description: 'Incident details' },
          404: { description: 'Incident not found' }
        }
      },
      PUT: {
        description: 'Update an incident',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Incident ID' }
        ],
        responses: {
          200: { description: 'Incident updated successfully' },
          404: { description: 'Incident not found' }
        }
      },
      DELETE: {
        description: 'Delete an incident',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Incident ID' }
        ],
        responses: {
          200: { description: 'Incident deleted successfully' },
          404: { description: 'Incident not found' }
        }
      }
    },

    '/incidents/[id]/resolve': {
      PATCH: {
        description: 'Toggle incident resolution status',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Incident ID' }
        ],
        responses: {
          200: { description: 'Incident resolution status updated' },
          404: { description: 'Incident not found' }
        }
      }
    },

    '/incidents/bulk': {
      GET: {
        description: 'Get multiple incidents by IDs',
        parameters: [
          { name: 'ids', type: 'string', required: true, description: 'Comma-separated incident IDs' }
        ],
        responses: {
          200: { description: 'List of requested incidents' }
        }
      },
      POST: {
        description: 'Perform bulk operations on incidents',
        requestBody: {
          action: 'resolve', // 'resolve', 'unresolve', 'delete'
          incidentIds: ['id1', 'id2', 'id3']
        },
        responses: {
          200: { description: 'Bulk operation completed' },
          400: { description: 'Invalid action or incident IDs' }
        }
      }
    },

    '/incidents/export': {
      GET: {
        description: 'Export incidents data',
        parameters: [
          { name: 'format', type: 'string', description: 'Export format (json, csv)' },
          { name: 'resolved', type: 'boolean', description: 'Filter by resolution status' },
          { name: 'startDate', type: 'string', description: 'Start date filter (ISO 8601)' },
          { name: 'endDate', type: 'string', description: 'End date filter (ISO 8601)' }
        ],
        responses: {
          200: { description: 'Exported data' }
        }
      }
    },

    // Cameras
    '/cameras': {
      GET: {
        description: 'Get all cameras',
        parameters: [
          { name: 'includeIncidents', type: 'boolean', description: 'Include incident data' }
        ],
        responses: {
          200: { description: 'List of cameras' }
        }
      },
      POST: {
        description: 'Create a new camera',
        requestBody: {
          name: 'Camera Name',
          location: 'Camera Location'
        },
        responses: {
          201: { description: 'Camera created successfully' },
          409: { description: 'Camera name already exists' }
        }
      }
    },

    '/cameras/[id]': {
      GET: {
        description: 'Get a specific camera by ID',
        parameters: [
          { name: 'id', type: 'string', required: true, description: 'Camera ID' },
          { name: 'includeIncidents', type: 'boolean', description: 'Include incident data' }
        ],
        responses: {
          200: { description: 'Camera details' },
          404: { description: 'Camera not found' }
        }
      },
      PUT: {
        description: 'Update a camera',
        responses: {
          200: { description: 'Camera updated successfully' },
          404: { description: 'Camera not found' },
          409: { description: 'Camera name already exists' }
        }
      },
      DELETE: {
        description: 'Delete a camera',
        responses: {
          200: { description: 'Camera deleted successfully' },
          404: { description: 'Camera not found' },
          409: { description: 'Camera has existing incidents' }
        }
      }
    },

    // Dashboard & Analytics
    '/dashboard/stats': {
      GET: {
        description: 'Get dashboard statistics',
        parameters: [
          { name: 'timeRange', type: 'string', description: 'Time range (24h, 7d, 30d)' }
        ],
        responses: {
          200: {
            description: 'Dashboard statistics',
            example: {
              summary: {
                totalIncidents: 50,
                unresolvedIncidents: 10,
                resolvedIncidents: 40,
                resolutionRate: 80
              },
              incidentsByType: [
                { type: 'Unauthorised Access', count: 20 }
              ]
            }
          }
        }
      }
    },

    '/reports': {
      GET: {
        description: 'Generate various reports',
        parameters: [
          { name: 'type', type: 'string', description: 'Report type (summary, trends, performance, security)' },
          { name: 'timeRange', type: 'string', description: 'Time range (24h, 7d, 30d, 90d)' },
          { name: 'cameraId', type: 'string', description: 'Filter by camera ID' }
        ],
        responses: {
          200: { description: 'Generated report data' }
        }
      }
    },

    '/alerts': {
      GET: {
        description: 'Get current alerts and notifications',
        parameters: [
          { name: 'severity', type: 'string', description: 'Filter by severity (critical, high, medium, low)' },
          { name: 'limit', type: 'number', description: 'Maximum number of alerts' }
        ],
        responses: {
          200: { description: 'List of active alerts' }
        }
      },
      POST: {
        description: 'Perform actions on alerts',
        requestBody: {
          action: 'mark_read', // 'mark_read', 'resolve_incident', 'dismiss_alert'
          alertId: 'alert_id',
          data: {}
        },
        responses: {
          200: { description: 'Alert action completed' }
        }
      }
    },

    // Search
    '/search': {
      GET: {
        description: 'Search incidents and cameras',
        parameters: [
          { name: 'q', type: 'string', required: true, description: 'Search query' },
          { name: 'type', type: 'string', description: 'Search type (incidents, cameras, all)' },
          { name: 'limit', type: 'number', description: 'Maximum results per type' }
        ],
        responses: {
          200: { description: 'Search results' }
        }
      }
    },

    // Configuration
    '/config': {
      GET: {
        description: 'Get system configuration',
        parameters: [
          { name: 'section', type: 'string', description: 'Configuration section' }
        ],
        responses: {
          200: { description: 'System configuration' }
        }
      },
      PUT: {
        description: 'Update system configuration',
        requestBody: {
          section: 'alerts',
          config: {
            enabled: true,
            autoResolveTimeout: 24
          }
        },
        responses: {
          200: { description: 'Configuration updated' },
          400: { description: 'Invalid configuration' }
        }
      }
    }
  },

  // Data Models
  models: {
    Incident: {
      id: 'string (UUID)',
      cameraId: 'string (UUID)',
      type: 'string (IncidentType)',
      tsStart: 'string (ISO 8601 datetime)',
      tsEnd: 'string (ISO 8601 datetime)',
      thumbnailUrl: 'string (URL)',
      resolved: 'boolean',
      createdAt: 'string (ISO 8601 datetime)',
      updatedAt: 'string (ISO 8601 datetime)',
      camera: 'Camera object (when included)'
    },
    Camera: {
      id: 'string (UUID)',
      name: 'string',
      location: 'string',
      createdAt: 'string (ISO 8601 datetime)',
      updatedAt: 'string (ISO 8601 datetime)',
      incidents: 'Incident[] (when included)'
    },
    IncidentType: {
      enum: [
        'Unauthorised Access',
        'Gun Threat',
        'Face Recognised',
        'Suspicious Activity',
        'Perimeter Breach',
        'Equipment Tampering'
      ]
    }
  },

  // Error Responses
  errorResponses: {
    400: {
      description: 'Bad Request - Invalid request data',
      example: {
        error: 'Missing required fields: name, location',
        timestamp: '2025-01-01T00:00:00.000Z'
      }
    },
    404: {
      description: 'Not Found - Resource not found',
      example: {
        error: 'Incident not found',
        timestamp: '2025-01-01T00:00:00.000Z'
      }
    },
    409: {
      description: 'Conflict - Resource already exists',
      example: {
        error: 'Camera with this name already exists',
        timestamp: '2025-01-01T00:00:00.000Z'
      }
    },
    500: {
      description: 'Internal Server Error',
      example: {
        error: 'Internal server error',
        message: 'Database connection failed',
        timestamp: '2025-01-01T00:00:00.000Z'
      }
    }
  },

  // Authentication (placeholder for future implementation)
  authentication: {
    type: 'Bearer Token',
    description: 'Include Authorization header with Bearer token',
    example: 'Authorization: Bearer your-jwt-token-here'
  },

  // Rate Limiting
  rateLimiting: {
    description: 'API requests are rate limited',
    limits: {
      default: '100 requests per 15 minutes',
      authenticated: '1000 requests per 15 minutes'
    },
    headers: {
      'X-RateLimit-Limit': 'Request limit per window',
      'X-RateLimit-Remaining': 'Requests remaining in current window',
      'X-RateLimit-Reset': 'Time when the rate limit resets'
    }
  }
}

// GET /api/docs - Get API documentation
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const format = searchParams.get('format') || 'json'
    const section = searchParams.get('section')
    
    if (section) {
      if (!(section in apiDocumentation)) {
        return NextResponse.json(
          { error: `Invalid documentation section: ${section}` },
          { status: 400 }
        )
      }
      
      return NextResponse.json({
        section,
        documentation: (apiDocumentation as any)[section],
      })
    }
    
    if (format === 'html') {
      // Return HTML documentation (basic version)
      const html = generateHtmlDocumentation(apiDocumentation)
      return new NextResponse(html, {
        headers: {
          'Content-Type': 'text/html',
        },
      })
    }
    
    return NextResponse.json(apiDocumentation)
  } catch (error) {
    console.error('Error fetching API documentation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch API documentation' },
      { status: 500 }
    )
  }
}

function generateHtmlDocumentation(docs: any): string {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${docs.title}</title>
    <style>
        body { font-family: Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; }
        h1, h2, h3 { color: #333; }
        .endpoint { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
        .method { display: inline-block; padding: 4px 8px; border-radius: 3px; color: white; font-weight: bold; }
        .get { background-color: #61affe; }
        .post { background-color: #49cc90; }
        .put { background-color: #fca130; }
        .patch { background-color: #50e3c2; }
        .delete { background-color: #f93e3e; }
        pre { background-color: #f5f5f5; padding: 10px; border-radius: 3px; overflow-x: auto; }
        .parameter { margin: 5px 0; }
        .required { color: #f93e3e; }
    </style>
</head>
<body>
    <h1>${docs.title}</h1>
    <p><strong>Version:</strong> ${docs.version}</p>
    <p><strong>Description:</strong> ${docs.description}</p>
    <p><strong>Base URL:</strong> ${docs.baseUrl}</p>
    
    <h2>Endpoints</h2>
    ${Object.entries(docs.endpoints).map(([path, methods]: [string, any]) => `
        <div class="endpoint">
            <h3>${path}</h3>
            ${Object.entries(methods).map(([method, details]: [string, any]) => `
                <div>
                    <span class="method ${method.toLowerCase()}">${method}</span>
                    <p>${details.description}</p>
                    ${details.parameters && details.parameters.length > 0 ? `
                        <h4>Parameters:</h4>
                        ${details.parameters.map((param: any) => `
                            <div class="parameter">
                                <strong>${param.name}</strong> 
                                <em>(${param.type})</em>
                                ${param.required ? '<span class="required">*</span>' : ''}
                                - ${param.description || 'No description'}
                            </div>
                        `).join('')}
                    ` : ''}
                    ${details.requestBody ? `
                        <h4>Request Body:</h4>
                        <pre>${JSON.stringify(details.requestBody, null, 2)}</pre>
                    ` : ''}
                </div>
            `).join('')}
        </div>
    `).join('')}
    
    <h2>Data Models</h2>
    ${Object.entries(docs.models).map(([name, model]: [string, any]) => `
        <div class="endpoint">
            <h3>${name}</h3>
            <pre>${JSON.stringify(model, null, 2)}</pre>
        </div>
    `).join('')}
</body>
</html>
  `
}