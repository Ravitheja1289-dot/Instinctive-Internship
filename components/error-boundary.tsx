'use client'

import React from 'react'
import { Navbar } from '@/components/navbar'

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error boundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-[#19181c] via-[#23201e] to-[#2a231a] text-white">
          <Navbar />
          <div className="flex items-center justify-center h-96">
            <div className="text-center px-4 max-w-md">
              <div className="text-6xl mb-4">🛡️</div>
              <h1 className="text-2xl font-bold mb-4">SecureSight Dashboard</h1>
              <div className="bg-red-900/50 border-l-4 border-red-500 p-4 mb-6 rounded text-left">
                <h3 className="text-red-300 font-semibold mb-2">Application Error</h3>
                <p className="text-red-200 text-sm mb-2">
                  The dashboard encountered an error but your security monitoring continues.
                </p>
                <p className="text-red-200 text-xs">
                  Error: {this.state.error?.message || 'Unknown error occurred'}
                </p>
              </div>
              <div className="space-y-3">
                <button 
                  onClick={() => window.location.reload()}
                  className="w-full px-4 py-2 bg-amber-500 text-black rounded hover:bg-amber-400 font-medium transition-colors"
                >
                  Reload Dashboard
                </button>
                <button 
                  onClick={() => this.setState({ hasError: false, error: null })}
                  className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
              <div className="mt-6 text-xs text-gray-400">
                <p>If the problem persists, please contact your system administrator.</p>
                <p className="mt-1">Monitoring systems remain active.</p>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}