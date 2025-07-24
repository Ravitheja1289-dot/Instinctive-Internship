'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { IncidentPlayer } from '@/components/incident-player'
import { IncidentList } from '@/components/incident-list'
import { Timeline } from '@/components/timeline'

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

export default function Dashboard() {
  const [incidents, setIncidents] = useState<Incident[]>([])
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [notification, setNotification] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Fetch incidents
  useEffect(() => {
    fetchIncidents()
  }, [])

  const fetchIncidents = async () => {
    try {
      setError(null)
      const response = await fetch('/api/incidents')
      if (response.ok) {
        const data = await response.json()
        setIncidents(data)
        // Auto-select the first unresolved incident
        const firstUnresolved = data.find((incident: Incident) => !incident.resolved)
        if (firstUnresolved) {
          setSelectedIncident(firstUnresolved)
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
      // Instead of setting error state, show UI with mock data
      loadMockData()
      setError(error instanceof Error ? error.message : 'Failed to fetch incidents')
    } finally {
      setLoading(false)
    }
  }

  const loadMockData = () => {
    const mockIncidents: Incident[] = [
      {
        id: 'mock-1',
        type: 'Motion Detected',
        tsStart: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 28 * 60 * 1000).toISOString(),
        thumbnailUrl: '/placeholder-thumbnail.jpg',
        resolved: false,
        camera: {
          id: 'mock-cam-1',
          name: 'Front Entrance',
          location: 'Building A - Main Floor'
        }
      },
      {
        id: 'mock-2',
        type: 'Face Recognised',
        tsStart: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 58 * 60 * 1000).toISOString(),
        thumbnailUrl: '/placeholder-thumbnail.jpg',
        resolved: true,
        camera: {
          id: 'mock-cam-2',
          name: 'Reception Area',
          location: 'Building A - Ground Floor'
        }
      },
      {
        id: 'mock-3',
        type: 'Perimeter Breach',
        tsStart: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 87 * 60 * 1000).toISOString(),
        thumbnailUrl: '/placeholder-thumbnail.jpg',
        resolved: false,
        camera: {
          id: 'mock-cam-3',
          name: 'Parking Lot',
          location: 'Building A - External'
        }
      }
    ]
    
    setIncidents(mockIncidents)
    setSelectedIncident(mockIncidents.find(i => !i.resolved) || mockIncidents[0])
  }

  const handleResolveIncident = async (incidentId: string) => {
    try {
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
      })
      
      if (response.ok) {
        const updatedIncident = await response.json()
        
        // Update the incidents list
        setIncidents(prev => 
          prev.map(incident => 
            incident.id === incidentId ? updatedIncident : incident
          )
        )
        
        // If the resolved incident was selected, update the selected incident
        if (selectedIncident?.id === incidentId) {
          setSelectedIncident(updatedIncident)
        }

        // Show success notification
        setNotification(`Incident ${updatedIncident.resolved ? 'resolved' : 'reopened'} successfully`)
        setTimeout(() => setNotification(null), 3000)
      } else {
        throw new Error(`Failed to resolve incident: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error resolving incident:', error)
      
      // For demo mode, still update the UI locally
      const updatedIncident = {
        ...incidents.find(i => i.id === incidentId)!,
        resolved: !incidents.find(i => i.id === incidentId)?.resolved
      }
      
      setIncidents(prev => 
        prev.map(incident => 
          incident.id === incidentId ? updatedIncident : incident
        )
      )
      
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updatedIncident)
      }
      
      setNotification(`Incident ${updatedIncident.resolved ? 'resolved' : 'reopened'} (demo mode)`)
      setTimeout(() => setNotification(null), 3000)
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchIncidents()
    setIsRefreshing(false)
  }

  // Always show the UI, even when loading
  const showingData = loading ? [] : incidents



  return (
    <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
      <Navbar />

      {/* Loading Banner */}
      {loading && (
        <div className="bg-blue-900/50 border-l-4 border-blue-500 p-4 mx-4 my-2 rounded">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
            <div>
              <h4 className="text-blue-300 font-semibold">Loading Dashboard...</h4>
              <p className="text-blue-200 text-sm">Fetching latest incident data</p>
            </div>
          </div>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mx-4 my-2 rounded">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="text-red-400 mr-3">⚠️</div>
              <div>
                <h4 className="text-red-300 font-semibold">Backend Connection Issue</h4>
                <p className="text-red-200 text-sm">Showing demo data. Try refreshing or check your connection.</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <button 
                onClick={() => {
                  setError(null)
                  setLoading(true)
                  fetchIncidents()
                }}
                className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-500"
              >
                Retry
              </button>
              <button 
                onClick={() => setError(null)}
                className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-500"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notification Toast */}
      {notification && (
        <div className="fixed top-4 right-4 z-50 bg-amber-500 text-black px-4 py-2 rounded-lg shadow-lg font-medium">
          {notification}
        </div>
      )}

      <main className="w-full">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-0 min-h-[calc(100vh-80px)]">
          {/* Incident Player - Left Side (3/4 width on large screens, full width on mobile) */}
          <div className="lg:col-span-3 bg-[#23201e] p-3 sm:p-6 flex flex-col justify-start border-b lg:border-b-0 lg:border-r border-[#2a231a] min-h-[50vh] lg:min-h-[calc(100vh-80px)]">
            <IncidentPlayer incident={selectedIncident} />
            <Timeline
              cameras={showingData.length > 0 ? Array.from(new Set(showingData.map(i => i.camera.id))).map(id => showingData.find(i => i.camera.id === id)!.camera) : []}
              incidents={showingData}
            />
          </div>

          {/* Incident List - Right Side (1/4 width on large screens, full width on mobile) */}
          <div className="lg:col-span-1 bg-[#19181c] p-3 sm:p-6 min-h-[50vh] lg:min-h-[calc(100vh-80px)]">
            <IncidentList
              incidents={showingData}
              selectedIncident={selectedIncident}
              onSelectIncident={setSelectedIncident}
              onResolveIncident={handleResolveIncident}
              onRefresh={handleRefresh}
              isRefreshing={isRefreshing}
            />
          </div>
        </div>
      </main>
    </div>
  )
}