'use client'

import { Navbar } from '@/components/navbar'

export function LoadingFallback({ message = "Loading SecureSight Dashboard..." }: { message?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
      <Navbar />
      <div className="flex items-center justify-center h-96">
        <div className="text-center px-4 max-w-md">
          <div className="text-6xl mb-4">🛡️</div>
          <h1 className="text-2xl font-bold mb-4">SecureSight Dashboard</h1>
          <div className="bg-blue-900/50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-400 mr-3"></div>
              <div>
                <h3 className="text-blue-300 font-semibold">{message}</h3>
                <p className="text-blue-200 text-sm">Please wait while we initialize the system</p>
              </div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div className="bg-amber-500 h-2 rounded-full loading-shimmer"></div>
            </div>
            <p className="text-xs text-gray-400">
              Connecting to monitoring systems...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}