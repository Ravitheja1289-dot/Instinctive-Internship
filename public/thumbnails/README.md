# Thumbnail Images

This directory contains placeholder thumbnail images for security incidents.

In a production system, these would be actual screenshots or video thumbnails captured from CCTV footage.

## Placeholder Files

The following placeholder files are referenced by the seed data:
- `incident-1.jpg` through `incident-15.jpg`

These are placeholder paths - in a real implementation, you would:
1. Generate actual thumbnails from video footage
2. Store them with meaningful names (e.g., `incident-{id}-{timestamp}.jpg`)
3. Implement proper image optimization and serving

## File Naming Convention

Current format: `/thumbnails/incident-{number}.jpg`
Production format: `/thumbnails/incident-{id}-{timestamp}.jpg`

## Image Requirements

- Format: JPEG or PNG
- Recommended size: 320x240 pixels (4:3 aspect ratio)
- File size: < 100KB for optimal loading
- Quality: 70-80% JPEG compression