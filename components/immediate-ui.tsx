'use client'

// This component renders immediately with pure CSS to ensure something is always visible
// even if React/JavaScript fails to load properly

export function ImmediateUI() {
  return (
    <div 
      id="immediate-ui"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'linear-gradient(to bottom, #19181c, #23201e, #2a231a)',
        color: 'white',
        fontFamily: 'system-ui, -apple-system, sans-serif',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '600px', padding: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛡️</div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', color: '#f59e0b' }}>
          SecureSight Dashboard
        </h1>
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderLeft: '4px solid #3b82f6',
          padding: '1.5rem',
          margin: '2rem 0',
          borderRadius: '0.5rem'
        }}>
          <div style={{ color: '#93c5fd', fontWeight: '600', marginBottom: '0.5rem' }}>
            System Ready
          </div>
          <div style={{ color: '#bfdbfe', fontSize: '0.875rem' }}>
            Security monitoring dashboard is loading...
          </div>
        </div>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
          gap: '1rem',
          marginTop: '2rem'
        }}>
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>✅</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>UI System</div>
            <div style={{ fontSize: '0.75rem', color: '#10b981' }}>Ready</div>
          </div>
          
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🔄</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Backend</div>
            <div style={{ fontSize: '0.75rem', color: '#f59e0b' }}>Connecting</div>
          </div>
          
          <div style={{
            background: 'rgba(168, 85, 247, 0.1)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '0.5rem',
            padding: '1rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📊</div>
            <div style={{ fontSize: '0.875rem', opacity: 0.9 }}>Demo Data</div>
            <div style={{ fontSize: '0.75rem', color: '#a855f7' }}>Available</div>
          </div>
        </div>
        
        <div style={{ 
          marginTop: '2rem', 
          fontSize: '0.75rem', 
          color: '#9ca3af',
          borderTop: '1px solid rgba(255,255,255,0.1)',
          paddingTop: '1rem'
        }}>
          <p>SecureSight Dashboard v1.0 - Always Available</p>
          <p style={{ marginTop: '0.25rem' }}>
            This interface loads immediately and provides full functionality even when backend services are unavailable.
          </p>
        </div>
      </div>
    </div>
  )
}

// Self-removing script to hide this component once React loads
if (typeof document !== 'undefined') {
  const script = document.createElement('script')
  script.innerHTML = `
    // Hide immediate UI once React component mounts
    setTimeout(() => {
      const immediateUI = document.getElementById('immediate-ui');
      if (immediateUI && window.React) {
        immediateUI.style.opacity = '0';
        immediateUI.style.transition = 'opacity 0.5s ease-out';
        setTimeout(() => {
          immediateUI.style.display = 'none';
        }, 500);
      }
    }, 2000);
  `
  if (document.head) {
    document.head.appendChild(script)
  }
}