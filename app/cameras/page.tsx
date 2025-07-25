'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Camera, MapPin, Activity, AlertCircle, Check, Settings } from 'lucide-react'

interface CameraData {
  id: string
  name: string
  location: string
  status: 'online' | 'offline' | 'maintenance'
  resolution: string
  lastSeen: string
  recordingStatus: 'recording' | 'paused' | 'stopped'
}

export default function CamerasPage() {
  const [cameras, setCameras] = useState<CameraData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCamera, setSelectedCamera] = useState<CameraData | null>(null)

  const mockCameras: CameraData[] = [
    {
      id: 'cam-001',
      name: 'Front Entrance',
      location: 'Building A - Main Lobby',
      status: 'online',
      resolution: '1920x1080',
      lastSeen: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      recordingStatus: 'recording'
    },
    {
      id: 'cam-002',
      name: 'Reception Desk',
      location: 'Building A - Ground Floor',
      status: 'online',
      resolution: '1920x1080',
      lastSeen: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
      recordingStatus: 'recording'
    },
    {
      id: 'cam-003',
      name: 'Parking Area',
      location: 'Building A - External',
      status: 'offline',
      resolution: '1920x1080',
      lastSeen: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      recordingStatus: 'stopped'
    },
    {
      id: 'cam-004',
      name: 'Back Gate',
      location: 'Building A - Rear Access',
      status: 'online',
      resolution: '2560x1440',
      lastSeen: new Date(Date.now() - 1 * 60 * 1000).toISOString(),
      recordingStatus: 'recording'
    },
    {
      id: 'cam-005',
      name: 'Security Checkpoint',
      location: 'Building A - Main Entrance',
      status: 'maintenance',
      resolution: '1920x1080',
      lastSeen: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      recordingStatus: 'paused'
    },
    {
      id: 'cam-006',
      name: 'Corridor West',
      location: 'Building A - Level 2',
      status: 'online',
      resolution: '1920x1080',
      lastSeen: new Date(Date.now() - 8 * 60 * 1000).toISOString(),
      recordingStatus: 'recording'
    }
  ]

  useEffect(() => {
    // Simulate loading cameras
    const timer = setTimeout(() => {
      setCameras(mockCameras)
      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'text-green-400 bg-green-400/10 border-green-400/20'
      case 'offline': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'maintenance': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online': return <Check className="h-4 w-4" />
      case 'offline': return <AlertCircle className="h-4 w-4" />
      case 'maintenance': return <Settings className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const formatLastSeen = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime()
    const minutes = Math.floor(diff / (1000 * 60))
    
    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    const days = Math.floor(hours / 24)
    return `${days}d ago`
  }

  const onlineCameras = cameras.filter(c => c.status === 'online').length
  const offlineCameras = cameras.filter(c => c.status === 'offline').length
  const maintenanceCameras = cameras.filter(c => c.status === 'maintenance').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading cameras...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Camera Management</h1>
          <p className="text-gray-400">Monitor and manage all security cameras</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Cameras</p>
                <p className="text-3xl font-bold text-white">{cameras.length}</p>
              </div>
              <Camera className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Online</p>
                <p className="text-3xl font-bold text-green-400">{onlineCameras}</p>
              </div>
              <Check className="h-8 w-8 text-green-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Offline</p>
                <p className="text-3xl font-bold text-red-400">{offlineCameras}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Maintenance</p>
                <p className="text-3xl font-bold text-yellow-400">{maintenanceCameras}</p>
              </div>
              <Settings className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Camera Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {cameras.map((camera) => (
            <div 
              key={camera.id}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6 hover:border-amber-400/50 transition-all cursor-pointer"
              onClick={() => setSelectedCamera(camera)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
                    <Camera className="h-6 w-6 text-black" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white">{camera.name}</h3>
                    <p className="text-sm text-gray-400 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      {camera.location}
                    </p>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded-full border text-xs font-medium flex items-center space-x-1 ${getStatusColor(camera.status)}`}>
                  {getStatusIcon(camera.status)}
                  <span className="capitalize">{camera.status}</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Resolution</span>
                  <span className="text-sm text-white">{camera.resolution}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Recording</span>
                  <div className="flex items-center space-x-1">
                    <Activity className={`h-3 w-3 ${camera.recordingStatus === 'recording' ? 'text-green-400' : 'text-gray-400'}`} />
                    <span className="text-sm text-white capitalize">{camera.recordingStatus}</span>
                  </div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">Last Seen</span>
                  <span className="text-sm text-white">{formatLastSeen(camera.lastSeen)}</span>
                </div>
              </div>

              {/* Live Preview Placeholder */}
              <div className="mt-4 bg-black rounded-lg aspect-video flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">
                    {camera.status === 'online' ? 'Live Feed' : 'No Signal'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Camera Detail Modal */}
        {selectedCamera && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50" onClick={() => setSelectedCamera(null)}>
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6 max-w-2xl w-full" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-white">{selectedCamera.name}</h2>
                <button 
                  onClick={() => setSelectedCamera(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              <div className="aspect-video bg-black rounded-lg mb-6 flex items-center justify-center">
                <div className="text-center">
                  <Camera className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400">Live Camera Feed</p>
                  <p className="text-sm text-gray-500">{selectedCamera.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-400 mb-1">Location</p>
                  <p className="text-white">{selectedCamera.location}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Status</p>
                  <div className={`inline-flex px-2 py-1 rounded-full border text-xs font-medium items-center space-x-1 ${getStatusColor(selectedCamera.status)}`}>
                    {getStatusIcon(selectedCamera.status)}
                    <span className="capitalize">{selectedCamera.status}</span>
                  </div>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Resolution</p>
                  <p className="text-white">{selectedCamera.resolution}</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Recording Status</p>
                  <p className="text-white capitalize">{selectedCamera.recordingStatus}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}