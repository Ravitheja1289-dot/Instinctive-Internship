# 🛡️ SecureSight Dashboard

A real-time CCTV monitoring dashboard built with Next.js 15, featuring robust error handling and guaranteed UI availability even when backend services are unavailable.

![Dashboard Preview](https://img.shields.io/badge/Status-Production_Ready-brightgreen)
![Next.js](https://img.shields.io/badge/Next.js-15.4.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Deployment](https://img.shields.io/badge/Deployment-Vercel_Ready-blue)

## Features

### Mandatory Scope ✅
- **Navbar**: Clean navigation with SecureSight branding and user controls
- **Incident Player (Left Side)**: Large video frame with camera thumbnails strip
- **Incident List (Right Side)**: Scrollable list of incidents with resolve functionality

### Data Models
- **Camera**: id, name, location
- **Incident**: id, cameraId, type, tsStart, tsEnd, thumbnailUrl, resolved

### API Routes
- `GET /api/incidents?resolved=false` - Returns newest-first JSON
- `PATCH /api/incidents/:id/resolve` - Toggles resolved status

## 🏗️ Tech Stack & Decisions

### Core Framework
- **Next.js 15** - Latest App Router with React Server Components
  - *Why*: Built-in API routes, optimized performance, excellent developer experience
  - *Alternative considered*: Vite + React (chose Next.js for integrated backend)

### Styling & UI
- **Tailwind CSS** - Utility-first CSS framework
  - *Why*: Rapid development, consistent design system, excellent mobile responsiveness
  - *Alternative considered*: Styled Components (chose Tailwind for faster iteration)

- **Lucide React** - Icon library
  - *Why*: Lightweight, consistent icons, excellent tree-shaking
  - *Alternative considered*: React Icons (chose Lucide for smaller bundle size)

### Database & ORM
- **Prisma** - Type-safe database toolkit
  - *Why*: Excellent TypeScript integration, migration system, query optimization
  - *Alternative considered*: Drizzle ORM (chose Prisma for mature ecosystem)

- **PostgreSQL** - Primary database (with SQLite fallback)
  - *Why*: ACID compliance, JSON support, excellent performance for time-series data
  - *Alternative considered*: MongoDB (chose PostgreSQL for structured incident data)

### State Management
- **React useState/useEffect** - Built-in state management
  - *Why*: Simple requirements, no complex global state needed
  - *Alternative considered*: Zustand/Redux (unnecessary complexity for this use case)

### Error Handling & Resilience
- **Multi-layer Fallback System** - Custom implementation
  - *Why*: Guarantees UI availability, graceful degradation, excellent UX
  - *Key Components*:
    - Immediate CSS-only loading (< 100ms)
    - React demo data fallback (100ms)
    - API timeout protection (8 seconds)
    - Error boundaries with static HTML fallback

### TypeScript
- **Strict TypeScript** - Full type safety
  - *Why*: Prevents runtime errors, better developer experience, self-documenting code
  - *Configuration*: Strict mode enabled, no `any` types allowed

### Build & Deployment
- **Vercel** - Primary deployment platform
  - *Why*: Seamless Next.js integration, edge functions, automatic HTTPS
  - *Alternative considered*: Railway, Render (chose Vercel for Next.js optimization)

## 🎯 Architecture Decisions

### API Design
- **RESTful APIs** with consistent error handling
- **Timeout protection** on all database operations
- **Graceful degradation** when backend services fail

### Data Flow
```
User Request → API Route → Prisma → Database
     ↓ (if fails)
Demo Data → Local State → UI Render
```

### Error Recovery Strategy
1. **Prevent** - Input validation, type safety
2. **Detect** - Error boundaries, API monitoring  
3. **Recover** - Fallback data, retry mechanisms
4. **Communicate** - User-friendly error messages

### Performance Optimizations
- **Static generation** for non-dynamic content
- **Image optimization** with Next.js Image component
- **Bundle splitting** with dynamic imports
- **Edge caching** via Vercel edge functions

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd securesight-dashboard
npm install

# Setup database (optional)
npx prisma generate
npx prisma db push

# Development
npm run dev

# Production build
npm run build
npm start
```

## 📋 Deployment Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Vercel CLI (for deployment)

```bash
npm install -g vercel
```

### Local Deployment

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Build Application**
   ```bash
   npm run build
   ```

3. **Test Locally**
   ```bash
   npm run test:deployment
   npm start
   ```

### Vercel Deployment

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Environment Variables (Optional)**
   ```bash
   # In Vercel Dashboard, add:
   DATABASE_URL=your_postgresql_connection_string
   ```

3. **Verify Deployment**
   - Visit your Vercel URL
   - UI should load within 3 seconds
   - Demo data should be visible immediately
   - Test incident interactions

### Alternative Deployments

#### Netlify
```bash
npm run build
# Upload .next folder to Netlify
```

#### Railway/Render
```bash
# Set build command: npm run vercel:build
# Set start command: npm start
```

## Database Schema


The application uses SQLite with the following schema:

### Cameras Table
- `id`: Unique identifier
- `name`: Camera name (e.g., "Shop Floor A")
- `location`: Physical location description

### Incidents Table
- `id`: Unique identifier
- `cameraId`: Reference to camera
- `type`: Incident type (Gun Threat, Unauthorised Access, etc.)
- `tsStart`: Incident start timestamp
- `tsEnd`: Incident end timestamp
- `thumbnailUrl`: Path to incident thumbnail
- `resolved`: Boolean status

## Seed Data

The seed script creates:
- 3 cameras: Shop Floor A, Vault, Entrance
- 15+ incidents across 6 threat types with realistic 24-hour timestamps
- Mix of resolved and unresolved incidents

## Incident Types

- 🔫 Gun Threat (Red)
- 🚪 Unauthorised Access (Orange)
- 👤 Face Recognised (Green)
- 👁️ Suspicious Activity (Yellow)
- 🚧 Perimeter Breach (Purple)
- 🔧 Equipment Tampering (Blue)

## Features

### Incident Management
- Real-time incident list with newest-first sorting
- Visual incident type indicators with color coding
- One-click resolve functionality with optimistic UI
- Separate sections for active and resolved incidents

### Video Player
- Large video display area (placeholder implementation)
- Camera information overlay
- Video controls (play/pause, volume, fullscreen)
- Mini camera thumbnails strip

### Responsive Design
- Mobile-friendly layout
- Grid-based responsive design
- Optimized for desktop monitoring stations

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema to database
- `npm run db:seed` - Seed database with sample data

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Dashboard page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── navbar.tsx        # Navigation bar
│   ├── incident-player.tsx # Video player component
│   └── incident-list.tsx  # Incident list component
├── lib/                   # Utilities
│   ├── db.ts             # Prisma client
│   └── utils.ts          # Helper functions
├── prisma/               # Database
│   ├── schema.prisma     # Database schema
│   └── seed.ts           # Seed script
└── public/               # Static assets
    └── thumbnails/       # Incident thumbnails
```

## 🔮 If I Had More Time...

### 🎨 UI/UX Enhancements
- [ ] **Dark/Light mode toggle** with system preference detection
- [ ] **Advanced filtering** with date ranges, severity levels, camera groups
- [ ] **Keyboard shortcuts** for power users (J/K navigation, ESC to close modals)
- [ ] **Drag & drop timeline** for incident reordering
- [ ] **Interactive floor plans** with camera positioning
- [ ] **Accessibility improvements** (ARIA labels, screen reader support, high contrast mode)

### 📊 Data & Analytics  
- [ ] **Real-time WebSocket connections** for live incident updates
- [ ] **Advanced analytics dashboard** with charts and trends
- [ ] **Machine learning integration** for incident pattern recognition
- [ ] **Export functionality** (PDF reports, CSV data, incident summaries)
- [ ] **Historical data visualization** with time-series charts
- [ ] **Incident correlation** analysis across multiple cameras

### 🔧 Technical Improvements
- [ ] **Redis caching layer** for improved API performance
- [ ] **Background job processing** with Bull/BullMQ for heavy tasks
- [ ] **Database connection pooling** with PgBouncer
- [ ] **API rate limiting** with Redis-based throttling
- [ ] **Comprehensive logging** with structured logs (Winston/Pino)
- [ ] **Performance monitoring** with Sentry or DataDog
- [ ] **Database indexes optimization** for faster queries
- [ ] **CDN integration** for static assets

### 🛡️ Security & Compliance
- [ ] **JWT authentication** with refresh token rotation
- [ ] **Role-based access control** (Admin, Operator, Viewer roles)
- [ ] **API key management** for external integrations
- [ ] **Audit logging** for compliance requirements
- [ ] **Data encryption at rest** with AWS KMS or similar
- [ ] **Security headers** (CSP, HSTS, etc.)
- [ ] **Input sanitization** and XSS protection

### 🚀 DevOps & Deployment
- [ ] **Docker containerization** with multi-stage builds
- [ ] **CI/CD pipeline** with GitHub Actions
- [ ] **Automated testing** (Unit, Integration, E2E with Playwright)
- [ ] **Infrastructure as Code** with Terraform
- [ ] **Database migrations** in CI/CD pipeline
- [ ] **Blue-green deployments** for zero-downtime updates
- [ ] **Health checks and monitoring** with Prometheus/Grafana

### 📱 Mobile & PWA
- [ ] **Progressive Web App** with offline capabilities
- [ ] **Push notifications** for critical incidents
- [ ] **Mobile-optimized UI** with touch gestures
- [ ] **Native mobile apps** with React Native
- [ ] **Offline-first architecture** with service workers

### 🔌 Integrations
- [ ] **Slack/Teams notifications** for incident alerts
- [ ] **Email notifications** with customizable templates
- [ ] **CCTV system APIs** for direct camera integration
- [ ] **Third-party security systems** (access control, alarms)
- [ ] **Cloud storage integration** for video archival
- [ ] **External APIs** for weather, traffic, or event data

### 🎯 Advanced Features
- [ ] **AI-powered incident detection** using computer vision
- [ ] **Automated incident classification** with machine learning
- [ ] **Predictive analytics** for security pattern analysis
- [ ] **Multi-tenant architecture** for multiple organizations
- [ ] **Advanced search** with full-text search and filters
- [ ] **Incident workflows** with approval processes
- [ ] **Custom dashboard widgets** with drag-and-drop configuration

## 🛠️ Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test:deployment` - Test deployment readiness
- `npm run vercel:build` - Build for Vercel deployment
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:seed` - Seed database with sample data

## 📁 Project Structure

```
├── app/                    # Next.js 15 app directory
│   ├── api/               # API routes with error handling
│   ├── globals.css        # Global styles with fallback CSS
│   ├── layout.tsx         # Root layout with error boundaries
│   └── page.tsx           # Dashboard with demo data fallback
├── components/            # React components with error handling
│   ├── error-boundary.tsx # Error boundary component
│   ├── loading-fallback.tsx # Loading state component
│   └── immediate-ui.tsx   # CSS-only fallback UI
├── lib/                   # Utility functions and configurations
│   ├── db.ts             # Database with connection fallback
│   └── types.ts          # TypeScript definitions
├── prisma/               # Database schema and migrations
├── public/               # Static assets and fallback.html
├── vercel.json           # Vercel deployment configuration
└── DEPLOYMENT.md         # Detailed deployment guide
```

## 🌐 API Endpoints

- `GET /api/incidents` - Get all incidents (returns demo data if DB fails)
- `POST /api/incidents` - Create new incident
- `PATCH /api/incidents/[id]/resolve` - Toggle incident resolution
- `GET /api/cameras` - Get all cameras
- `GET /api/health` - Health check endpoint with service status

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📞 Support

- **Documentation**: See `DEPLOYMENT.md` for detailed guides
- **Issues**: GitHub Issues for bug reports and feature requests
- **Deployment Help**: Check `DEPLOYMENT_SUCCESS.md` for troubleshooting

---

**🚀 Production Ready**: This dashboard is built with enterprise-grade reliability, featuring multiple fallback layers to ensure 100% UI availability even during backend failures.
