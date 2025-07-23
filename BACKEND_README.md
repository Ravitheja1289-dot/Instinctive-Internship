# Security Incident Management System - Backend API

A comprehensive RESTful API for managing security incidents and camera surveillance data built with Next.js 14, Prisma, and SQLite.

## 🚀 Features

- **Incident Management**: Create, read, update, delete security incidents
- **Camera Management**: Manage surveillance cameras and their locations
- **Real-time Alerts**: Get notifications for critical incidents
- **Analytics & Reports**: Generate detailed reports and statistics
- **Bulk Operations**: Perform operations on multiple incidents at once
- **Data Export**: Export incident data in JSON or CSV format
- **Search**: Full-text search across incidents and cameras
- **Health Monitoring**: System health checks and monitoring
- **Configuration**: Flexible system configuration management

## 📋 API Endpoints

### Core Resources

#### Incidents
- `GET /api/incidents` - List all incidents with filtering
- `POST /api/incidents` - Create a new incident
- `GET /api/incidents/[id]` - Get specific incident
- `PUT /api/incidents/[id]` - Update incident
- `DELETE /api/incidents/[id]` - Delete incident
- `PATCH /api/incidents/[id]/resolve` - Toggle incident resolution

#### Cameras
- `GET /api/cameras` - List all cameras
- `POST /api/cameras` - Create a new camera
- `GET /api/cameras/[id]` - Get specific camera
- `PUT /api/cameras/[id]` - Update camera
- `DELETE /api/cameras/[id]` - Delete camera

### Advanced Features

#### Bulk Operations
- `GET /api/incidents/bulk?ids=id1,id2,id3` - Get multiple incidents
- `POST /api/incidents/bulk` - Perform bulk operations (resolve, unresolve, delete)

#### Analytics & Reports
- `GET /api/dashboard/stats?timeRange=24h` - Dashboard statistics
- `GET /api/reports?type=summary&timeRange=7d` - Generate reports
  - Report types: `summary`, `trends`, `performance`, `security`

#### Alerts & Notifications
- `GET /api/alerts?severity=critical` - Get active alerts
- `POST /api/alerts` - Perform alert actions

#### Data Export
- `GET /api/incidents/export?format=csv` - Export incidents data
- Formats: `json`, `csv`

#### Search
- `GET /api/search?q=unauthorized&type=incidents` - Search incidents and cameras

#### System Management
- `GET /api/health` - System health check
- `GET /api/config` - Get system configuration
- `PUT /api/config` - Update configuration
- `GET /api/docs` - API documentation

## 🗄️ Database Schema

### Incident Model
```typescript
interface Incident {
  id: string              // Unique identifier
  cameraId: string        // Associated camera ID
  type: IncidentType      // Type of incident
  tsStart: DateTime       // Incident start time
  tsEnd: DateTime         // Incident end time
  thumbnailUrl: string    // Thumbnail image URL
  resolved: boolean       // Resolution status
  createdAt: DateTime     // Creation timestamp
  updatedAt: DateTime     // Last update timestamp
  camera: Camera          // Associated camera (relation)
}
```

### Camera Model
```typescript
interface Camera {
  id: string              // Unique identifier
  name: string            // Camera name
  location: string        // Camera location
  incidents: Incident[]   // Associated incidents (relation)
  createdAt: DateTime     // Creation timestamp
  updatedAt: DateTime     // Last update timestamp
}
```

### Incident Types
- `Unauthorised Access`
- `Gun Threat`
- `Face Recognised`
- `Suspicious Activity`
- `Perimeter Breach`
- `Equipment Tampering`

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- SQLite (included)

### Installation Steps

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Setup Database**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Push schema to database
   npx prisma db push
   
   # Seed database with sample data
   npx tsx prisma/seed.ts
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Verify Installation**
   ```bash
   curl http://localhost:3000/api/health
   ```

## 📊 Sample Data

The seed script creates:
- **8 cameras** across different locations
- **30+ incidents** over the past 7 days
- Realistic incident distribution with proper timestamps
- Mix of resolved and unresolved incidents

### Sample Cameras
- Shop Floor A (Main Production Area)
- Vault (Security Vault - Level B1)
- Main Entrance (Building Lobby)
- Parking Lot (Employee Parking)
- Loading Dock (Warehouse)
- Server Room (IT Level 2)
- Cafeteria (Ground Floor)
- Emergency Exit (East Wing)

## 🔧 Configuration

The system supports flexible configuration through `/api/config`:

### Available Sections
- `system` - Basic system settings
- `alerts` - Alert and notification settings
- `incidents` - Incident management settings
- `cameras` - Camera management settings
- `dashboard` - Dashboard display settings
- `export` - Data export settings
- `security` - Security and authentication settings
- `api` - API behavior settings

### Example Configuration Update
```bash
curl -X PUT http://localhost:3000/api/config \
  -H "Content-Type: application/json" \
  -d '{
    "section": "alerts",
    "config": {
      "enabled": true,
      "autoResolveTimeout": 48,
      "maxUnresolvedAlerts": 100
    }
  }'
```

## 📈 Analytics & Reporting

### Dashboard Statistics
Get comprehensive dashboard data:
```bash
curl "http://localhost:3000/api/dashboard/stats?timeRange=7d"
```

Returns:
- Total incidents count
- Resolution rates
- Incidents by type and camera
- Recent incidents
- Time-based trends

### Report Types

1. **Summary Report** - Overview of incidents and resolution rates
2. **Trends Report** - Time-based incident patterns
3. **Performance Report** - Camera and resolution performance metrics
4. **Security Report** - Critical incidents and risk assessment

## 🚨 Alerts System

The alerts system monitors:
- **Critical Incidents** - Gun threats, unauthorized access
- **Camera Issues** - Multiple incidents from same camera
- **System Alerts** - High incident backlog, system issues

### Alert Severities
- `critical` - Immediate attention required
- `high` - Important but not critical
- `medium` - Moderate priority
- `low` - Informational

## 🔍 Search Functionality

Full-text search across:
- Incident types
- Camera names and locations
- Incident metadata

### Search Examples
```bash
# Search all resources
curl "http://localhost:3000/api/search?q=unauthorized"

# Search only incidents
curl "http://localhost:3000/api/search?q=gun&type=incidents"

# Search with limit
curl "http://localhost:3000/api/search?q=entrance&limit=5"
```

## 📤 Data Export

Export incident data for external analysis:

### JSON Export
```bash
curl "http://localhost:3000/api/incidents/export?format=json&resolved=false"
```

### CSV Export
```bash
curl "http://localhost:3000/api/incidents/export?format=csv&startDate=2025-01-01" \
  -o incidents.csv
```

## 🔒 Security Features

- Input validation on all endpoints
- SQL injection prevention via Prisma
- Rate limiting (configurable)
- Error handling and logging
- Data sanitization

## 🧪 Testing the API

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Get All Incidents
```bash
curl http://localhost:3000/api/incidents
```

### Create New Incident
```bash
curl -X POST http://localhost:3000/api/incidents \
  -H "Content-Type: application/json" \
  -d '{
    "type": "Suspicious Activity",
    "tsStart": "2025-01-01T10:00:00.000Z",
    "tsEnd": "2025-01-01T10:05:00.000Z",
    "cameraId": "your-camera-id"
  }'
```

### Resolve Incident
```bash
curl -X PATCH http://localhost:3000/api/incidents/[incident-id]/resolve
```

## 📚 API Documentation

Access interactive API documentation:
- JSON format: `GET /api/docs`
- HTML format: `GET /api/docs?format=html`
- Specific section: `GET /api/docs?section=endpoints`

## 🐛 Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message",
  "message": "Detailed error description",
  "timestamp": "2025-01-01T00:00:00.000Z"
}
```

### HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🔧 Development

### File Structure
```
app/api/
├── alerts/          # Alert management
├── cameras/         # Camera CRUD operations
├── config/          # System configuration
├── dashboard/       # Dashboard statistics
├── docs/           # API documentation
├── health/         # Health checks
├── incidents/      # Incident management
│   ├── [id]/       # Individual incident operations
│   ├── bulk/       # Bulk operations
│   └── export/     # Data export
├── reports/        # Analytics and reports
└── search/         # Search functionality

lib/
├── api-middleware.ts  # API middleware utilities
├── api-utils.ts      # API helper functions
├── db.ts            # Database connection
├── types.ts         # TypeScript type definitions
└── validators.ts    # Input validation

prisma/
├── schema.prisma    # Database schema
└── seed.ts         # Database seeding
```

### Adding New Endpoints

1. Create route file in appropriate directory
2. Implement HTTP methods (GET, POST, PUT, DELETE)
3. Add input validation using validators
4. Update API documentation
5. Add tests

### Database Changes

1. Update `prisma/schema.prisma`
2. Run `npx prisma db push`
3. Update seed script if needed
4. Update TypeScript types in `lib/types.ts`

## 🚀 Production Deployment

### Environment Variables
```env
DATABASE_URL="file:./prod.db"
NODE_ENV="production"
API_BASE_URL="https://your-domain.com/api"
```

### Performance Considerations
- Enable database connection pooling
- Implement caching for frequently accessed data
- Add database indexes for search queries
- Configure rate limiting based on usage patterns
- Set up monitoring and logging

### Security Checklist
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Implement authentication
- [ ] Set up rate limiting
- [ ] Enable request logging
- [ ] Validate all inputs
- [ ] Sanitize outputs
- [ ] Regular security updates

## 📞 Support

For issues and questions:
1. Check the API documentation at `/api/docs`
2. Review error logs for debugging
3. Test endpoints using the health check
4. Verify database connectivity

## 🔄 Version History

- **v1.0.0** - Initial release with full CRUD operations, analytics, and export functionality

---

**Built with ❤️ using Next.js, Prisma, and TypeScript**