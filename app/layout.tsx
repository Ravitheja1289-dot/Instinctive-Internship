import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ErrorBoundary } from '@/components/error-boundary'
import { RuntimeCheck } from '@/components/runtime-check'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SecureSight Dashboard',
  description: 'CCTV monitoring dashboard for security incidents',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Immediate loading state before React loads */
            #__next:empty::before {
              content: "";
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background: linear-gradient(to bottom, #19181c, #23201e, #2a231a);
              z-index: 9999;
            }
            
            #__next:empty::after {
              content: "🛡️\\ASecureSight Dashboard\\ALoading...";
              white-space: pre;
              position: fixed;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: white;
              font-family: system-ui, -apple-system, sans-serif;
              text-align: center;
              font-size: 1.5rem;
              line-height: 1.6;
              z-index: 10000;
            }
            
            /* Ensure body has proper background */
            body {
              background: linear-gradient(to bottom, #19181c, #23201e, #2a231a) !important;
              min-height: 100vh;
              margin: 0;
            }
          `
        }} />
      </head>
      <body className={inter.className}>
        <ErrorBoundary>
          <RuntimeCheck>
            {children}
          </RuntimeCheck>
        </ErrorBoundary>
      </body>
    </html>
  )
}