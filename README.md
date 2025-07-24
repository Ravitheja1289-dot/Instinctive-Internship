# SecureSight CCTV Dashboard

A comprehensive CCTV monitoring dashboard built with Next.js 15, featuring real-time incident management and monitoring capabilities. Deploy-ready with Vercel support.

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

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Database**: SQLite with Prisma ORM
- **Icons**: Lucide React
- **Date Handling**: date-fns

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up the database:
```bash
npm run db:generate
npm run db:push
npm run db:seed
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

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

## Future Enhancements (Optional Scope)

- Incident timeline visualization
- 3D frontend assessment features
- Real video streaming integration
- Advanced filtering and search
- Real-time notifications
- Multi-user authentication
- Camera health monitoring
