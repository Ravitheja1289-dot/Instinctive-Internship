'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { AlertTriangle, CheckCircle, Clock, Camera, MapPin, Filter, Search, Eye } from 'lucide-react'

interface IncidentData {
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
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
}

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<IncidentData[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved'>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedIncident, setSelectedIncident] = useState<IncidentData | null>(null)

  const mockIncidents: IncidentData[] = [
    {
      id: 'inc-001',
      type: 'Unauthorised Access',
      tsStart: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      tsEnd: new Date(Date.now() - 27 * 60 * 1000).toISOString(),
      thumbnailUrl: '/thumbnails/incident-unauthorised-access.svg',
      resolved: false,
      camera: {
        id: 'cam-001',
        name: 'Front Entrance',
        location: 'Building A - Main Lobby'
      },
      severity: 'high',
      description: 'Individual attempting to access restricted areas without proper authorization'
    },
    {
      id: 'inc-002',
      type: 'Gun Threat',
      tsStart: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      tsEnd: new Date(Date.now() - 115 * 60 * 1000).toISOString(),
      thumbnailUrl: '/thumbnails/incident-gun-threat.svg',
      resolved: true,
      camera: {
        id: 'cam-005',
        name: 'Security Checkpoint',
        location: 'Building A - Main Entrance'
      },
      severity: 'critical',
      description: 'Weapon detected during security screening process'
    },
    {
      id: 'inc-003',
      type: 'Face Recognised',
      tsStart: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      tsEnd: new Date(Date.now() - 235 * 60 * 1000).toISOString(),
      thumbnailUrl: '/thumbnails/incident-face-recognised.svg',
      resolved: true,
      camera: {
        id: 'cam-002',
        name: 'Reception Desk',
        location: 'Building A - Ground Floor'
      },
      severity: 'low',
      description: 'Known individual from watchlist identified in reception area'
    },
    {
      id: 'inc-004',
      type: 'Suspicious Activity',
      tsStart: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      tsEnd: new Date(Date.now() - 355 * 60 * 1000).toISOString(),
      thumbnailUrl: '/thumbnails/incident-suspicious-activity.svg',
      resolved: false,
      camera: {
        id: 'cam-006',
        name: 'Corridor West',
        location: 'Building A - Level 2'
      },
      severity: 'medium',
      description: 'Unusual behavior patterns detected - individual loitering in restricted area'
    },
    {
      id: 'inc-005',
      type: 'Perimeter Breach',
      tsStart: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      tsEnd: new Date(Date.now() - 475 * 60 * 1000).toISOString(),
      thumbnailUrl: '/thumbnails/incident-perimeter-breach.svg',
      resolved: true,
      camera: {
        id: 'cam-004',
        name: 'Back Gate',
        location: 'Building A - Rear Access'
      },
      severity: 'high',
      description: 'Unauthorized entry detected through rear access point'
    },
    {
      id: 'inc-006',
      type: 'Equipment Tampering',
      tsStart: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      tsEnd: new Date(Date.now() - 715 * 60 * 1000).toISOString(),
      thumbnailUrl: '/thumbnails/incident-equipment-tampering.svg',
      resolved: false,
      camera: {
        id: 'cam-003',
        name: 'Parking Area',
        location: 'Building A - External'
      },
      severity: 'medium',
      description: 'Potential interference with security equipment detected'
    }
  ]

  useEffect(() => {
    // Simulate loading incidents
    const timer = setTimeout(() => {
      setIncidents(mockIncidents)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const handleResolveIncident = async (incidentId: string) => {
    setIncidents(prevIncidents =>
      prevIncidents.map(incident =>
        incident.id === incidentId
          ? { ...incident, resolved: !incident.resolved }
          : incident
      )
    )
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      case 'high': return 'text-orange-400 bg-orange-400/10 border-orange-400/20'
      case 'critical': return 'text-red-400 bg-red-400/10 border-red-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getIncidentTypeColor = (type: string) => {
    switch (type) {
      case 'Gun Threat': return 'text-red-400'
      case 'Unauthorised Access': return 'text-orange-400'
      case 'Face Recognised': return 'text-green-400'
      case 'Suspicious Activity': return 'text-yellow-400'
      case 'Perimeter Breach': return 'text-purple-400'
      case 'Equipment Tampering': return 'text-blue-400'
      default: return 'text-gray-400'
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (hours > 0) {
      return `${hours}h ${minutes}m ago`
    }
    return `${minutes}m ago`
  }

  const filteredIncidents = incidents.filter(incident => {
    const matchesFilter = filter === 'all' || 
      (filter === 'active' && !incident.resolved) ||
      (filter === 'resolved' && incident.resolved)
    
    const matchesSearch = incident.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.camera.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      incident.description.toLowerCase().includes(searchTerm.toLowerCase())

    return matchesFilter && matchesSearch
  })

  const activeIncidents = incidents.filter(i => !i.resolved).length
  const resolvedIncidents = incidents.filter(i => i.resolved).length
  const criticalIncidents = incidents.filter(i => i.severity === 'critical').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading incidents...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
      <Navbar />
      
      <div className="px-4 sm:px-8 py-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Security Incidents</h1>
          <p className="text-gray-400">Monitor and manage security incidents across all locations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Incidents</p>
                <p className="text-3xl font-bold text-white">{incidents.length}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Active</p>
                <p className="text-3xl font-bold text-orange-400">{activeIncidents}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Resolved</p>
                <p className="text-3xl font-bold text-green-400">{resolvedIncidents}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Critical</p>
                <p className="text-3xl font-bold text-red-400">{criticalIncidents}</p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-400" />
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search incidents..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#2a2a2a] border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all' 
                  ? 'bg-amber-400 text-black' 
                  : 'bg-[#2a2a2a] text-gray-300 hover:text-white'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'active' 
                  ? 'bg-amber-400 text-black' 
                  : 'bg-[#2a2a2a] text-gray-300 hover:text-white'
              }`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('resolved')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'resolved' 
                  ? 'bg-amber-400 text-black' 
                  : 'bg-[#2a2a2a] text-gray-300 hover:text-white'
              }`}
            >
              Resolved
            </button>
          </div>
        </div>

        {/* Incidents List */}
        <div className="space-y-4">
          {filteredIncidents.map((incident) => (
            <div 
              key={incident.id}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6 hover:border-amber-400/50 transition-all"
            >
              <div className="flex items-start gap-4">
                {/* Thumbnail */}
                <div className="w-16 h-16 bg-black rounded-lg flex items-center justify-center flex-shrink-0">
                  <AlertTriangle className={`h-8 w-8 ${getIncidentTypeColor(incident.type)}`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className={`font-semibold text-lg ${getIncidentTypeColor(incident.type)}`}>
                        {incident.type}
                      </h3>
                      <p className="text-gray-400 text-sm">{incident.description}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className={`px-2 py-1 rounded-full border text-xs font-medium uppercase ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        incident.resolved 
                          ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                          : 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                      }`}>
                        {incident.resolved ? 'Resolved' : 'Active'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <Camera className="h-4 w-4 mr-1" />
                    <span className="mr-4">{incident.camera.name}</span>
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="mr-4">{incident.camera.location}</span>
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{formatTimestamp(incident.tsStart)}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedIncident(incident)}
                        className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-sm"
                      >
                        <Eye className="h-4 w-4" />
                        <span>View Details</span>
                      </button>
                    </div>
                    
                    <button
                      onClick={() => handleResolveIncident(incident.id)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        incident.resolved
                          ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                          : 'bg-green-600 text-white hover:bg-green-500'
                      }`}
                    >
                      {incident.resolved ? 'Reopen' : 'Resolve'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredIncidents.length === 0 && (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400">No incidents found matching your criteria</p>
          </div>
        )}

        {/* Incident Detail Modal */}
        {selectedIncident && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedIncident(null)}>
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                  <h2 className={`text-2xl font-bold ${getIncidentTypeColor(selectedIncident.type)}`}>
                    {selectedIncident.type}
                  </h2>
                  <p className="text-gray-400">{selectedIncident.camera.name} • {formatTimestamp(selectedIncident.tsStart)}</p>
                </div>
                <button 
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Incident Preview */}
                  <div>
                    <div className="aspect-video bg-black rounded-lg flex items-center justify-center mb-4">
                      <div className="text-center">
                        <AlertTriangle className={`h-16 w-16 mx-auto mb-4 ${getIncidentTypeColor(selectedIncident.type)}`} />
                        <p className="text-gray-400">Incident Footage</p>
                        <p className="text-sm text-gray-500">{selectedIncident.type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Details */}
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4">Incident Details</h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status:</span>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedIncident.resolved 
                            ? 'bg-green-400/10 text-green-400 border border-green-400/20' 
                            : 'bg-orange-400/10 text-orange-400 border border-orange-400/20'
                        }`}>
                          {selectedIncident.resolved ? 'Resolved' : 'Active'}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Severity:</span>
                        <div className={`px-2 py-1 rounded-full border text-xs font-medium uppercase ${getSeverityColor(selectedIncident.severity)}`}>
                          {selectedIncident.severity}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Camera:</span>
                        <span className="text-white">{selectedIncident.camera.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Location:</span>
                        <span className="text-white">{selectedIncident.camera.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Started:</span>
                        <span className="text-white">{new Date(selectedIncident.tsStart).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Ended:</span>
                        <span className="text-white">{new Date(selectedIncident.tsEnd).toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-6">
                      <h4 className="text-gray-400 text-sm mb-2">Description:</h4>
                      <p className="text-white text-sm">{selectedIncident.description}</p>
                    </div>

                    <div className="mt-6">
                      <button
                        onClick={() => handleResolveIncident(selectedIncident.id)}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedIncident.resolved
                            ? 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                            : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                      >
                        {selectedIncident.resolved ? 'Reopen Incident' : 'Mark as Resolved'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}