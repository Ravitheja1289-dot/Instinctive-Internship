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
      setError(error instanceof Error ? error.message : 'Failed to fetch incidents')
    } finally {
      setLoading(false)
    }
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
      setError(error instanceof Error ? error.message : 'Failed to resolve incident')
    }
  }

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchIncidents()
    setIsRefreshing(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a]">
        <Navbar />
        <div className="flex items-center justify-center h-64 sm:h-96">
          <div className="text-center px-4">
            <div className="animate-spin rounded-full h-10 w-10 sm:h-12 sm:w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a]">
        <Navbar />
        <div className="flex items-center justify-center h-64 sm:h-96">
          <div className="text-center px-4">
            <div className="text-red-500 text-4xl sm:text-6xl mb-4">⚠️</div>
            <h2 className="text-lg sm:text-xl font-semibold text-white mb-2">Error Loading Dashboard</h2>
            <p className="text-gray-400 mb-4">{error}</p>
            <button 
              onClick={() => {
                setError(null)
                setLoading(true)
                fetchIncidents()
              }}
              className="px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400 font-medium"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
      <Navbar />

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
              cameras={Array.from(new Set(incidents.map(i => i.camera.id))).map(id => incidents.find(i => i.camera.id === id)!.camera)}
              incidents={incidents}
            />
          </div>

          {/* Incident List - Right Side (1/4 width on large screens, full width on mobile) */}
          <div className="lg:col-span-1 bg-[#19181c] p-3 sm:p-6 min-h-[50vh] lg:min-h-[calc(100vh-80px)]">
            <IncidentList
              incidents={incidents}
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