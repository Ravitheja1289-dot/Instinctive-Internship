'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Play, Pause, Volume2, Maximize, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useState, useEffect } from 'react'

interface Camera {
  id: string;
  name: string;
  location: string;
}

interface Incident {
  id: string
  type: string
  tsStart: string
  tsEnd: string
  thumbnailUrl: string
  resolved: boolean
  camera: Camera
}

// Helper function to get the color for incident type
const getIncidentTypeColor = (type: string): string => {
  const typeColors: Record<string, string> = {
    'FACE_RECOGNIZED': 'text-emerald-500 bg-emerald-500/20',
    'SUSPICIOUS_ACTIVITY': 'text-amber-500 bg-amber-500/20',
    'PERIMETER_BREACH': 'text-red-500 bg-red-500/20',
    'EQUIPMENT_TAMPERING': 'text-purple-500 bg-purple-500/20',
    'GUN_THREAT': 'text-red-600 bg-red-600/20',
    'UNAUTHORIZED_ACCESS': 'text-orange-500 bg-orange-500/20'
  };
  
  return typeColors[type] || 'text-gray-500 bg-gray-500/20';
};

export function IncidentPlayer({ incident }: { incident: Incident | null }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [otherCameras, setOtherCameras] = useState<Camera[]>([]);

  // Fetch other cameras
  useEffect(() => {
    const fetchOtherCameras = async () => {
      try {
        const response = await fetch('/api/cameras');
        if (response.ok) {
          const data = await response.json();
          setOtherCameras(data.cameras.filter((c: Camera) => 
            !incident || c.id !== incident.camera.id
          ).slice(0, 5));
        }
      } catch (error) {
        console.error('Failed to fetch cameras:', error);
      }
    };

    fetchOtherCameras();
  }, [incident]);

  return (
    <div className="w-full h-full bg-[#23201e] rounded-xl shadow-lg border border-[#2a231a] flex flex-col overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between px-4 sm:px-6 pt-4 sm:pt-6 pb-2">
        <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-0">
          <span className="text-base sm:text-lg font-semibold text-white truncate">{incident ? incident.camera.name : 'Camera'}</span>
          {incident && (
            <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${getIncidentTypeColor(incident.type)} ml-1 sm:ml-2`}>{incident.type}</span>
          )}
        </div>
        <span className="text-xs text-gray-400 font-mono">{incident ? new Date(incident.tsStart).toLocaleString() : ''}</span>
      </div>

      {/* Video Container */}
      <div className="flex-1 px-4 sm:px-6 pt-0 pb-4 sm:pb-6">
        <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
          {incident ? (
            <>
              {/* Actual Video Feed */}
              <video 
                className="absolute inset-0 w-full h-full object-cover"
                controls={false}
                autoPlay
                loop
                muted
                poster={incident.thumbnailUrl || `/thumbnails/incident-${incident.type.toLowerCase().replace(/ /g, '-')}.svg`}
                preload="metadata"
                onLoadStart={() => setVideoLoading(true)}
                onCanPlay={() => setVideoLoading(false)}
                onError={() => {
                  setVideoError(true)
                  setVideoLoading(false)
                }}
                onLoadedData={() => setVideoError(false)}
              >
                <source src="/api/video/VIRAT_S_010204_05_000856_000890.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Video Loading Overlay */}
              {videoLoading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-white text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                    <p className="text-sm">Loading video...</p>
                  </div>
                </div>
              )}
              
              {/* Video Error Overlay */}
              {videoError && (
                <div className="absolute inset-0 bg-red-900/70 flex items-center justify-center">
                  <div className="text-white text-center">
                    <AlertCircle className="h-12 w-12 mx-auto mb-4" />
                    <p className="text-sm">Failed to load video</p>
                    <button 
                      onClick={() => {
                        setVideoError(false)
                        setVideoLoading(true)
                        const video = document.querySelector('video')
                        if (video) video.load()
                      }}
                      className="mt-2 px-4 py-2 bg-white/20 rounded hover:bg-white/30 transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                </div>
              )}
              
              {/* Live Indicator */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-2 bg-black/50 rounded-full px-2 py-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-xs text-white font-mono">LIVE</span>
                </div>
              </div>
              
              {/* Video Controls */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <div className="flex items-center justify-between text-white">
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => {
                        const video = document.querySelector('video');
                        if (video) {
                          if (isPlaying) {
                            video.pause();
                          } else {
                            video.play();
                          }
                          setIsPlaying(!isPlaying);
                        }
                      }}
                    >
                      {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => {
                        const video = document.querySelector('video');
                        if (video) {
                          video.muted = !video.muted;
                        }
                      }}
                    >
                      <Volume2 className="h-5 w-5" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-white/20"
                    onClick={() => {
                      const video = document.querySelector('video');
                      if (video) {
                        if (document.fullscreenElement) {
                          document.exitFullscreen();
                        } else {
                          video.requestFullscreen();
                        }
                      }
                    }}
                  >
                    <Maximize className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <div className="text-4xl mb-2">📹</div>
                <p>Select an incident to view video</p>
              </div>
            </div>
          )}
        </div>

        {/* Camera Thumbnails Strip */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-2 sm:space-y-0 sm:space-x-2 mt-4">
          <div className="text-sm font-medium text-gray-400 py-1 sm:py-2 flex-shrink-0">Other Cameras:</div>
          <div className="flex space-x-2 w-full sm:flex-1 overflow-x-auto pb-1">
            {otherCameras.map((camera, index) => (
              <div
                key={camera.id}
                className="relative w-20 h-12 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:border-amber-500 transition-colors flex-shrink-0 overflow-hidden"
              >
                <img 
                  src={`/camera-thumb-${(index % 2) + 1}.svg`}
                  alt={camera.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-600 hidden">
                  📹
                </div>
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs px-1 py-0.5 truncate">
                  {camera.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
