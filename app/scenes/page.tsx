'use client'

import { useState, useEffect } from 'react'
import { Navbar } from '@/components/navbar'
import { Film, Play, Pause, Calendar, Clock, Camera, Download, Share, Trash2 } from 'lucide-react'

interface SceneData {
  id: string
  title: string
  description: string
  duration: number // in seconds
  timestamp: string
  cameraId: string
  cameraName: string
  thumbnailUrl: string
  fileSize: string
  resolution: string
  type: 'incident' | 'scheduled' | 'manual'
  tags: string[]
}

export default function ScenesPage() {
  const [scenes, setScenes] = useState<SceneData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedScene, setSelectedScene] = useState<SceneData | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  const mockScenes: SceneData[] = [
    {
      id: 'scene-001',
      title: 'Security Incident - Front Entrance',
      description: 'Unauthorized access attempt detected at main entrance',
      duration: 180,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      cameraId: 'cam-001',
      cameraName: 'Front Entrance',
      thumbnailUrl: '/thumbnails/scene-001.jpg',
      fileSize: '45.2 MB',
      resolution: '1920x1080',
      type: 'incident',
      tags: ['security', 'unauthorized', 'entrance']
    },
    {
      id: 'scene-002',
      title: 'Daily Security Roundup',
      description: 'Scheduled recording of parking area during peak hours',
      duration: 300,
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      cameraId: 'cam-003',
      cameraName: 'Parking Area',
      thumbnailUrl: '/thumbnails/scene-002.jpg',
      fileSize: '67.8 MB',
      resolution: '1920x1080',
      type: 'scheduled',
      tags: ['routine', 'parking', 'surveillance']
    },
    {
      id: 'scene-003',
      title: 'Equipment Maintenance Check',
      description: 'Manual recording during security checkpoint maintenance',
      duration: 450,
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      cameraId: 'cam-005',
      cameraName: 'Security Checkpoint',
      thumbnailUrl: '/thumbnails/scene-003.jpg',
      fileSize: '89.1 MB',
      resolution: '1920x1080',
      type: 'manual',
      tags: ['maintenance', 'checkpoint', 'manual']
    },
    {
      id: 'scene-004',
      title: 'Suspicious Activity Alert',
      description: 'Motion detected in restricted area after hours',
      duration: 240,
      timestamp: new Date(Date.now() - 18 * 60 * 60 * 1000).toISOString(),
      cameraId: 'cam-006',
      cameraName: 'Corridor West',
      thumbnailUrl: '/thumbnails/scene-004.jpg',
      fileSize: '52.7 MB',
      resolution: '1920x1080',
      type: 'incident',
      tags: ['suspicious', 'after-hours', 'motion']
    },
    {
      id: 'scene-005',
      title: 'Reception Area Overview',
      description: 'Scheduled monitoring of reception desk activities',
      duration: 600,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      cameraId: 'cam-002',
      cameraName: 'Reception Desk',
      thumbnailUrl: '/thumbnails/scene-005.jpg',
      fileSize: '112.3 MB',
      resolution: '1920x1080',
      type: 'scheduled',
      tags: ['reception', 'overview', 'routine']
    },
    {
      id: 'scene-006',
      title: 'Emergency Response Documentation',
      description: 'Manual recording during emergency drill procedures',
      duration: 720,
      timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
      cameraId: 'cam-004',
      cameraName: 'Back Gate',
      thumbnailUrl: '/thumbnails/scene-006.jpg',
      fileSize: '134.5 MB',
      resolution: '2560x1440',
      type: 'manual',
      tags: ['emergency', 'drill', 'documentation']
    }
  ]

  useEffect(() => {
    // Simulate loading scenes
    const timer = setTimeout(() => {
      setScenes(mockScenes)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'incident': return 'text-red-400 bg-red-400/10 border-red-400/20'
      case 'scheduled': return 'text-blue-400 bg-blue-400/10 border-blue-400/20'
      case 'manual': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20'
    }
  }

  const incidentScenes = scenes.filter(s => s.type === 'incident').length
  const scheduledScenes = scenes.filter(s => s.type === 'scheduled').length
  const manualScenes = scenes.filter(s => s.type === 'manual').length

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-400 mx-auto mb-4"></div>
            <p className="text-gray-300">Loading scenes...</p>
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
          <h1 className="text-3xl font-bold text-white mb-2">Scene Library</h1>
          <p className="text-gray-400">View and manage recorded security footage</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Scenes</p>
                <p className="text-3xl font-bold text-white">{scenes.length}</p>
              </div>
              <Film className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Incident</p>
                <p className="text-3xl font-bold text-red-400">{incidentScenes}</p>
              </div>
              <Film className="h-8 w-8 text-red-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Scheduled</p>
                <p className="text-3xl font-bold text-blue-400">{scheduledScenes}</p>
              </div>
              <Calendar className="h-8 w-8 text-blue-400" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Manual</p>
                <p className="text-3xl font-bold text-yellow-400">{manualScenes}</p>
              </div>
              <Film className="h-8 w-8 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Scenes Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {scenes.map((scene) => (
            <div 
              key={scene.id}
              className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg overflow-hidden hover:border-amber-400/50 transition-all"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video bg-black flex items-center justify-center">
                <div className="text-center">
                  <Film className="h-12 w-12 text-gray-600 mx-auto mb-2" />
                  <p className="text-xs text-gray-500">Scene Preview</p>
                </div>
                <div className="absolute top-3 left-3">
                  <div className={`px-2 py-1 rounded-full border text-xs font-medium capitalize ${getTypeColor(scene.type)}`}>
                    {scene.type}
                  </div>
                </div>
                <div className="absolute bottom-3 right-3 bg-black/70 px-2 py-1 rounded text-xs text-white">
                  {formatDuration(scene.duration)}
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                <h3 className="font-semibold text-white mb-2 line-clamp-1">{scene.title}</h3>
                <p className="text-sm text-gray-400 mb-3 line-clamp-2">{scene.description}</p>
                
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Camera className="h-3 w-3" />
                      <span>{scene.cameraName}</span>
                    </div>
                    <span>{scene.fileSize}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimestamp(scene.timestamp)}</span>
                    </div>
                    <span>{scene.resolution}</span>
                  </div>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {scene.tags.slice(0, 3).map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-amber-400/10 text-amber-400 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-700">
                  <button 
                    className="flex items-center space-x-1 text-amber-400 hover:text-amber-300 text-sm"
                    onClick={() => setSelectedScene(scene)}
                  >
                    <Play className="h-4 w-4" />
                    <span>Play</span>
                  </button>
                  
                  <div className="flex items-center space-x-2">
                    <button className="text-gray-400 hover:text-white">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-white">
                      <Share className="h-4 w-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-400">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Scene Player Modal */}
        {selectedScene && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50" onClick={() => setSelectedScene(null)}>
            <div className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] border border-gray-700 rounded-lg max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div>
                  <h2 className="text-xl font-bold text-white">{selectedScene.title}</h2>
                  <p className="text-sm text-gray-400">{selectedScene.cameraName} • {formatTimestamp(selectedScene.timestamp)}</p>
                </div>
                <button 
                  onClick={() => setSelectedScene(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              
              {/* Video Player */}
              <div className="aspect-video bg-black flex items-center justify-center">
                <div className="text-center">
                  <Film className="h-20 w-20 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg mb-2">Video Player</p>
                  <p className="text-gray-500">{selectedScene.title}</p>
                  <div className="flex items-center justify-center space-x-4 mt-6">
                    <button 
                      className="flex items-center space-x-2 bg-amber-400 text-black px-4 py-2 rounded-lg hover:bg-amber-300"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                      <span>{isPlaying ? 'Pause' : 'Play'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scene Details */}
              <div className="p-6 border-t border-gray-700">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Scene Details</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Duration:</span>
                        <span className="text-white">{formatDuration(selectedScene.duration)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">File Size:</span>
                        <span className="text-white">{selectedScene.fileSize}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Resolution:</span>
                        <span className="text-white">{selectedScene.resolution}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Type:</span>
                        <div className={`inline-flex px-2 py-1 rounded-full border text-xs font-medium capitalize ${getTypeColor(selectedScene.type)}`}>
                          {selectedScene.type}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-3">Description</h3>
                    <p className="text-gray-400 text-sm mb-4">{selectedScene.description}</p>
                    <div>
                      <p className="text-gray-400 text-sm mb-2">Tags:</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedScene.tags.map((tag, index) => (
                          <span key={index} className="px-2 py-1 bg-amber-400/10 text-amber-400 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
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