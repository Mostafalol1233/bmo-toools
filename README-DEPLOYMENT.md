# BMO Tools - Deployment Guide

## Overview
BMO Tools is a comprehensive web application with calculator tools, image processing, and more.

## Recommended Deployment: Vercel

### Why Vercel?
This application uses Express.js for backend API routes, which Vercel supports natively. The project is pre-configured with `vercel.json` and ready to deploy.

### Vercel Deployment Steps
1. Push code to GitHub: `git push origin main`
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project" and import your GitHub repository
4. Vercel will automatically detect the configuration from `vercel.json`
5. Configure environment variables (all optional):
   - `BACKGROUND_REMOVAL_API_KEY` - For background removal feature (get key from remove.bg)
   - `DESIGNFY_API_KEY` - For image enhancement features (get key from designify.com)
   - `NODE_ENV` - Set to `production`
6. Click "Deploy"
7. Your app will be live at `your-project.vercel.app`

**Note:** The app works without API keys - only background removal and Designify features require them. All other features (calculators, image tools, AI generation, QR codes, PDF tools, URL shortener) work out of the box!

### Alternative: Netlify (Frontend Only)
⚠️ **Note:** The current Netlify configuration (`netlify.toml`) deploys only the frontend. Backend features (URL shortener, background removal, etc.) will not work on Netlify without additional serverless function configuration.

If you want to deploy on Netlify with full functionality, you'll need to:
1. Convert Express routes to Netlify Functions
2. Update the build process accordingly

## Environment Variables (Optional)
- `BACKGROUND_REMOVAL_API_KEY`: For background removal functionality
- `DESIGNFY_API_KEY`: For image enhancement features

## Build Commands
- Development: `npm run dev`
- Production Build: `npm run build`
- Start Production: `npm start`

## Features
- Multiple calculator tools
- Image processing (conversion, resizing, compression)
- AI image generation
- QR code generator and reader
- PDF tools (merge, split)
- URL shortener
- And more!

## Tech Stack
- Frontend: React + Vite + TypeScript
- Backend: Express.js
- UI: Tailwind CSS + Shadcn UI
- State Management: TanStack Query
- Routing: Wouter
