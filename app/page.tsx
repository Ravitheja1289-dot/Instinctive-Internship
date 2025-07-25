'use client'

import { useState, useEffect, useCallback } from 'react'
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
  const [isInitialized, setIsInitialized] = useState(false)

  // Initialize app immediately with fallback data to ensure UI always loads
  useEffect(() => {
    // Immediately show demo data to prevent blank screen
    if (!isInitialized) {
      const initTimer = setTimeout(() => {
        if (!isInitialized) {
          console.log('Initializing with demo data for immediate UI display')
          loadMockData()
          setIsInitialized(true)
          setLoading(false)
          setError('Started in demo mode - attempting to connect to backend...')
        }
      }, 100) // Show UI almost immediately

      // Try to fetch real data in parallel
      fetchIncidents()
        .then(() => {
          if (isInitialized) {
            setError(null) // Clear demo mode message if real data loads
          }
        })
        .finally(() => {
          clearTimeout(initTimer)
          setIsInitialized(true)
        })

      return () => clearTimeout(initTimer)
    }
  }, [isInitialized, fetchIncidents, loadMockData])

  // Backup initialization - absolutely ensure UI loads
  useEffect(() => {
    const emergencyFallback = setTimeout(() => {
      if (loading && !isInitialized) {
        console.error('Emergency fallback activated - forcing UI display')
        loadMockData()
        setIsInitialized(true)
        setLoading(false)
        setError('Emergency mode - backend connection failed')
      }
    }, 3000) // 3 second emergency fallback

    return () => clearTimeout(emergencyFallback)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const loadMockData = useCallback(() => {
    const mockIncidents: Incident[] = [
      {
        id: 'demo-1',
        type: 'Unauthorised Access',
        tsStart: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
        thumbnailUrl: '/thumbnails/incident-unauthorised-access.svg',
        resolved: false,
        camera: {
          id: 'demo-cam-1',
          name: 'Front Entrance',
          location: 'Building A - Main Lobby'
        }
      },
      {
        id: 'demo-2',
        type: 'Face Recognised',
        tsStart: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 43 * 60 * 1000).toISOString(),
        thumbnailUrl: '/thumbnails/incident-face-recognised.svg',
        resolved: true,
        camera: {
          id: 'demo-cam-2',
          name: 'Reception Desk',
          location: 'Building A - Ground Floor'
        }
      },
      {
        id: 'demo-3',
        type: 'Suspicious Activity',
        tsStart: new Date(Date.now() - 75 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 72 * 60 * 1000).toISOString(),
        thumbnailUrl: '/thumbnails/incident-suspicious-activity.svg',
        resolved: false,
        camera: {
          id: 'demo-cam-3',
          name: 'Parking Area',
          location: 'Building A - External'
        }
      },
      {
        id: 'demo-4',
        type: 'Perimeter Breach',
        tsStart: new Date(Date.now() - 105 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 102 * 60 * 1000).toISOString(),
        thumbnailUrl: '/thumbnails/incident-perimeter-breach.svg',
        resolved: true,
        camera: {
          id: 'demo-cam-4',
          name: 'Back Gate',
          location: 'Building A - Rear Access'
        }
      },
      {
        id: 'demo-5',
        type: 'Gun Threat',
        tsStart: new Date(Date.now() - 135 * 60 * 1000).toISOString(),
        tsEnd: new Date(Date.now() - 132 * 60 * 1000).toISOString(),
        thumbnailUrl: '/thumbnails/incident-gun-threat.svg',
        resolved: true,
        camera: {
          id: 'demo-cam-5',
          name: 'Security Checkpoint',
          location: 'Building A - Main Entrance'
        }
      }
    ]
    
    setIncidents(mockIncidents)
    const firstUnresolved = mockIncidents.find(i => !i.resolved)
    setSelectedIncident(firstUnresolved || mockIncidents[0])
  }, [])

  const fetchIncidents = useCallback(async () => {
    try {
      setError(null)
      // Add timeout to prevent hanging requests in deployment
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 8000) // 8 second timeout
      
      const response = await fetch('/api/incidents', {
        signal: controller.signal,
        headers: {
          'Cache-Control': 'no-cache',
        }
      })
      
      clearTimeout(timeoutId)
      
      if (response.ok) {
        const data = await response.json()
        setIncidents(data || [])
        // Auto-select the first unresolved incident
        const firstUnresolved = data?.find((incident: Incident) => !incident.resolved)
        if (firstUnresolved) {
          setSelectedIncident(firstUnresolved)
        } else if (data?.length > 0) {
          setSelectedIncident(data[0])
        }
      } else {
        throw new Error(`Backend Error: ${response.status} - ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error fetching incidents:', error)
      // Always load mock data to ensure UI is functional
      loadMockData()
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setError('Connection timeout - showing demo data')
        } else {
          setError(`${error.message} - showing demo data`)
        }
      } else {
        setError('Backend unavailable - showing demo data')
      }
    } finally {
      setLoading(false)
    }
  }, [loadMockData])



  const handleResolveIncident = async (incidentId: string) => {
    const incident = incidents.find(i => i.id === incidentId)
    if (!incident) return

    try {
      // Add timeout for resolve requests too
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 5000) // 5 second timeout
      
      const response = await fetch(`/api/incidents/${incidentId}/resolve`, {
        method: 'PATCH',
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        }
      })
      
      clearTimeout(timeoutId)
      
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
        throw new Error(`Failed to update incident: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error resolving incident:', error)
      
      // Always update the UI locally for better UX (demo mode)
      const updatedIncident = {
        ...incident,
        resolved: !incident.resolved
      }
      
      setIncidents(prev => 
        prev.map(inc => 
          inc.id === incidentId ? updatedIncident : inc
        )
      )
      
      if (selectedIncident?.id === incidentId) {
        setSelectedIncident(updatedIncident)
      }
      
      const action = updatedIncident.resolved ? 'resolved' : 'reopened'
      const message = error instanceof Error && error.name === 'AbortError' 
        ? `Incident ${action} locally (connection timeout)`
        : `Incident ${action} locally (backend unavailable)`
        
      setNotification(message)
      setTimeout(() => setNotification(null), 4000)
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