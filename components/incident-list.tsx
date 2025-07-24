'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Check, Clock, MapPin, RefreshCw, AlertTriangle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { format } from 'date-fns'
import Image from 'next/image'

interface Incident {
  id: string
  type: string
  tsStart: string
  tsEnd: string
  thumbnailUrl: string
  resolved: boolean
  camera: {
    id: string
    name: string
    location: string
  }
}

interface IncidentListProps {
  incidents: Incident[]
  selectedIncident?: Incident | null
  onSelectIncident: (incident: Incident) => void
  onResolveIncident: (incidentId: string) => Promise<void>
  onRefresh?: () => void
  isRefreshing?: boolean
}

export function IncidentList({ 
  incidents, 
  selectedIncident, 
  onSelectIncident, 
  onResolveIncident,
  onRefresh,
  isRefreshing = false
}: IncidentListProps) {
  const [resolvingIds, setResolvingIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return 'text-red-500 bg-red-500/20'
      case 'Unauthorised Access':
        return 'text-orange-500 bg-orange-500/20'
      case 'Face Recognised':
        return 'text-emerald-500 bg-emerald-500/20'
      case 'Suspicious Activity':
        return 'text-amber-500 bg-amber-500/20'
      case 'Perimeter Breach':
        return 'text-purple-500 bg-purple-500/20'
      case 'Equipment Tampering':
        return 'text-blue-500 bg-blue-500/20'
      default:
        return 'text-gray-500 bg-gray-500/20'
    }
  }

  const getIncidentIcon = (type: string) => {
    switch (type) {
      case 'Gun Threat':
        return '🔫'
      case 'Unauthorised Access':
        return '🚪'
      case 'Face Recognised':
        return '👤'
      case 'Suspicious Activity':
        return '👁️'
      case 'Perimeter Breach':
        return '🚧'
      case 'Equipment Tampering':
        return '🔧'
      default:
        return '⚠️'
    }
  }

  const handleResolve = async (incidentId: string) => {
    setResolvingIds(prev => new Set(prev).add(incidentId))
    
    startTransition(() => {
      try {
        onResolveIncident(incidentId)
      } finally {
        setResolvingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(incidentId)
          return newSet
        })
      }
    })
  }

  const unresolvedIncidents = incidents.filter(incident => !incident.resolved)
  const resolvedIncidents = incidents.filter(incident => incident.resolved)

  return (
    <div className="h-full w-full bg-[#19181c] rounded-xl shadow-lg border border-[#23201e] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-4 pt-3 sm:pt-4 pb-2 border-b border-[#23201e]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2 sm:mb-0">
          <span className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            {unresolvedIncidents.length} Unresolved
          </span>
          <span className="sm:ml-2 px-2 py-1 rounded bg-[#23201e] text-xs text-gray-400 font-semibold">{resolvedIncidents.length} resolved</span>
        </div>
        {onRefresh && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="h-8 w-8 p-0 text-gold-400 hover:text-gold-300"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin' : ''}`} />
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto px-2 pb-4 pt-2">
        {unresolvedIncidents.length > 0 ? (
          <div className="space-y-3">
            {unresolvedIncidents.map((incident) => (
              <IncidentItem
                key={incident.id}
                incident={incident}
                isSelected={selectedIncident?.id === incident.id}
                isResolving={resolvingIds.has(incident.id)}
                onSelect={() => onSelectIncident(incident)}
                onResolve={() => handleResolve(incident.id)}
                getIncidentTypeColor={getIncidentTypeColor}
                getIncidentIcon={getIncidentIcon}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-gray-500">
            <div className="text-4xl mb-2">🔍</div>
            <p>No incidents found</p>
          </div>
        )}
      </div>
    </div>
  )
}

interface IncidentItemProps {
  incident: Incident
  isSelected: boolean
  isResolving: boolean
  isResolved?: boolean
  onSelect: () => void
  onResolve: () => void
  getIncidentTypeColor: (type: string) => string
  getIncidentIcon: (type: string) => string
}

function IncidentItem({
  incident,
  isSelected,
  isResolving,
  isResolved = false,
  onSelect,
  onResolve,
  getIncidentTypeColor,
  getIncidentIcon,
}: IncidentItemProps) {
  return (
    <div
      className={`p-2 sm:p-3 rounded-lg cursor-pointer transition-all bg-zinc-800 hover:bg-zinc-700 ${
        isSelected ? 'border-amber-500 border-2' : 'border border-zinc-700'
      } ${isResolved ? 'opacity-75' : ''}`}
      onClick={onSelect}
    >
      <div className="flex items-start space-x-2 sm:space-x-3">
        {/* Thumbnail */}
        <div className="w-16 h-12 sm:w-24 sm:h-16 bg-black rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
          <Image
            src={incident.thumbnailUrl || `/thumbnails/incident-${incident.type.toLowerCase().replace(/ /g, '-')}.svg`}
            alt={`${incident.type} incident`}
            width={96}
            height={64}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Fallback to icon if image fails to load
              const target = e.target as HTMLImageElement
              target.style.display = 'none'
              target.nextElementSibling?.classList.remove('hidden')
            }}
          />
          <span className="text-2xl hidden">{getIncidentIcon(incident.type)}</span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between mb-1 gap-1">
            <span className={`px-2 py-0.5 rounded text-xs font-bold ${getIncidentTypeColor(incident.type)}`}>{incident.type}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                onResolve()
              }}
              disabled={isResolving}
              className="flex-shrink-0 h-6 sm:h-7 text-xs bg-transparent border-amber-500/50 text-amber-500 hover:bg-amber-500/10"
            >
              {isResolving ? '...' : isResolved ? 'Unresolve' : 'Resolve'}
            </Button>
          </div>

          <div className="flex items-center text-xs text-gray-400 mb-1">
            <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
            <span className="truncate">{incident.camera.location}</span>
          </div>

          <div className="text-xs text-gray-500">
            {format(new Date(incident.tsStart), 'MMM d, HH:mm')} - {format(new Date(incident.tsEnd), 'HH:mm')}
          </div>
        </div>
      </div>
    </div>
  )
}