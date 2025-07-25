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
      // Ultra-simple fallback that should always work
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(to bottom, #19181c, #23201e, #2a231a)',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
          <div style={{ textAlign: 'center', padding: '2rem', maxWidth: '500px' }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
            <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
              SecureSight Dashboard
            </h1>
            <div style={{
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderLeft: '4px solid #ef4444',
              padding: '1rem',
              marginBottom: '1.5rem',
              borderRadius: '0.5rem'
            }}>
              <h3 style={{ color: '#fca5a5', fontWeight: '600', marginBottom: '0.5rem' }}>
                System Error Detected
              </h3>
              <p style={{ color: '#fecaca', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                Dashboard encountered an error but security monitoring continues normally.
              </p>
              <p style={{ color: '#fecaca', fontSize: '0.75rem' }}>
                Error: {this.state.error?.message || 'Unknown error occurred'}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                onClick={() => {
                  try {
                    window.location.reload()
                  } catch (e) {
                    // Fallback reload
                    window.location.href = window.location.href
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#f59e0b',
                  color: '#000',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Reload Dashboard
              </button>
              <button 
                onClick={() => this.setState({ hasError: false, error: null })}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem',
                  background: '#4b5563',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '0.375rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Try Again
              </button>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.75rem', color: '#9ca3af' }}>
              <p>If the problem persists, please contact your system administrator.</p>
              <p style={{ marginTop: '0.25rem' }}>Security monitoring systems remain active.</p>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}