import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

interface RouteParams {
  params: Promise<{ path: string[] }>
}

export async function GET(
  request: NextRequest,
  { params }: RouteParams
) {
  try {
    const { path: filePath } = await params
    const fileName = filePath.join('/')
    
    // Construct the full path to the video file
    const videoPath = path.join(process.cwd(), 'camera-footage', fileName)
    
    // Check if file exists
    if (!fs.existsSync(videoPath)) {
      return NextResponse.json(
        { error: 'Video file not found' },
        { status: 404 }
      )
    }
    
    // Get file stats for Content-Length header
    const stat = fs.statSync(videoPath)
    const fileSize = stat.size
    
    // Parse range header for video streaming
    const range = request.headers.get('range')
    
    if (range) {
      // Parse range header (format: "bytes=start-end")
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
      const chunksize = (end - start) + 1
      
      // Create read stream for the requested range
      const file = fs.createReadStream(videoPath, { start, end })
      
      // Set appropriate headers for partial content
      const headers = new Headers({
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize.toString(),
        'Content-Type': 'video/mp4',
      })
      
      return new NextResponse(file as any, {
        status: 206, // Partial Content
        headers,
      })
    } else {
      // Serve the entire file
      const file = fs.createReadStream(videoPath)
      
      const headers = new Headers({
        'Content-Length': fileSize.toString(),
        'Content-Type': 'video/mp4',
        'Accept-Ranges': 'bytes',
      })
      
      return new NextResponse(file as any, {
        status: 200,
        headers,
      })
    }
  } catch (error) {
    console.error('Error serving video:', error)
    return NextResponse.json(
      { error: 'Failed to serve video file' },
      { status: 500 }
    )
  }
}