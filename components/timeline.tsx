import React from 'react'

interface Camera {
  id: string
  name: string
}

interface Incident {
  id: string
  type: string
  tsStart: string
  tsEnd: string
  camera: Camera
}

interface TimelineProps {
  cameras: Camera[]
  incidents: Incident[]
}

const typeColor: Record<string, string> = {
  'Gun Threat': 'bg-red-600/70 text-white',
  'Unauthorised Access': 'bg-amber-500/70 text-white',
  'Face Recognised': 'bg-emerald-500/70 text-white',
  'Suspicious Activity': 'bg-amber-600/70 text-white',
  'Perimeter Breach': 'bg-purple-600/70 text-white',
  'Equipment Tampering': 'bg-blue-600/70 text-white',
  'Traffic congestion': 'bg-green-600/70 text-white',
  'Multiple Events': 'bg-gray-600/70 text-white',
}

export function Timeline({ cameras, incidents }: TimelineProps) {
  // For demo, create a 24-hour timeline
  const hours = Array.from({ length: 25 }, (_, i) => i)
  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className="w-full bg-[#19181c] rounded-xl mt-4 sm:mt-6 p-3 sm:p-6 shadow-lg border border-[#23201e]/80 overflow-x-auto">
      <div className="flex items-center justify-between mb-3 sm:mb-4 min-w-[600px]">
        <h3 className="text-base sm:text-lg font-semibold text-amber-500">Timeline</h3>
        <div className="flex gap-2">
          <span className="text-xs text-amber-500/70">{formattedDate}</span>
        </div>
      </div>
      {/* Timeline header */}
      <div className="flex items-center mb-3 min-w-[600px]">
        <div className="w-32 sm:w-40" />
        <div className="flex-1 flex justify-between text-xs text-amber-500/80 font-medium">
          {hours.filter(h => h % 3 === 0).map((h) => (
            <span key={h} className="relative">
              {h.toString().padStart(2, '0')}:00
            </span>
          ))}
        </div>
      </div>
      {/* Camera rows */}
      {cameras.map((camera) => (
        <div key={camera.id} className="flex items-center mb-3 relative min-w-[600px]">
          <div className="w-32 sm:w-40 flex items-center gap-1 sm:gap-2 text-gray-300 pr-2">
            <div className="h-5 w-5 sm:h-6 sm:w-6 bg-gray-800 rounded-full flex items-center justify-center">
              <span className="text-xs sm:text-sm">🎥</span>
            </div>
            <span className="font-medium text-xs sm:text-sm truncate">{camera.name}</span>
          </div>
          <div className="flex-1 relative h-7 sm:h-8 bg-[#23201e]/60 rounded-md overflow-hidden">
            {/* Timeline grid lines */}
            <div className="absolute inset-0 flex justify-between pointer-events-none">
              {hours.filter(h => h % 6 === 0 && h > 0).map(h => (
                <div key={h} className="w-px h-full bg-gray-800" style={{ left: `${(h/24) * 100}%` }}></div>
              ))}
            </div>
            
            {/* Incidents for this camera */}
            {incidents.filter(i => i.camera.id === camera.id).map((incident, idx) => {
              // Calculate left and width as % of 24h
              const start = new Date(incident.tsStart)
              const end = new Date(incident.tsEnd)
              const left = ((start.getHours() + start.getMinutes()/60) / 24) * 100
              const width = (((end.getTime() - start.getTime()) / (1000*60*60)) / 24) * 100
              return (
                <div
                  key={incident.id + idx}
                  className={`absolute top-0.5 sm:top-1 h-6 rounded-md px-1 sm:px-2 flex items-center text-xs font-semibold shadow-md ${typeColor[incident.type] || 'bg-gray-600/70 text-white'}`}
                  style={{ left: `${left}%`, width: `${width}%`, minWidth: 40 }}
                >
                  <span className="truncate">{incident.type}</span>
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
