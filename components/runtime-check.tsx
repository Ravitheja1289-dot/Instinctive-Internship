'use client'

import React, { useEffect, useState } from 'react'
import { LoadingFallback } from './loading-fallback'

export function RuntimeCheck({ children }: { children: React.ReactNode }) {
  const [isReady, setIsReady] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Simple runtime check
    const checkRuntime = async () => {
      try {
        // Check if basic browser APIs are available
        if (typeof window === 'undefined') {
          throw new Error('Window object not available')
        }

        if (typeof document === 'undefined') {
          throw new Error('Document object not available')  
        }

        // Basic React check
        if (typeof React === 'undefined') {
          throw new Error('React not loaded')
        }

        setIsReady(true)
      } catch (err) {
        console.error('Runtime check failed:', err)
        setError(err instanceof Error ? err.message : 'Runtime check failed')
        
        // Still try to show children after a delay
        setTimeout(() => {
          setIsReady(true)
        }, 2000)
      }
    }

    // Immediate check
    checkRuntime()

    // Fallback timer
    const timer = setTimeout(() => {
      if (!isReady) {
        console.warn('Runtime check timeout - proceeding anyway')
        setIsReady(true)
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [isReady])

  if (!isReady) {
    return <LoadingFallback message={error || "Initializing application..."} />
  }

  return <>{children}</>
}