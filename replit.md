# BMO Tools Application

## Overview

This is a full-stack web application (formerly "Arabic Calculator Tools") that provides various web utility tools for daily use. The application features a collection of calculators, converters, and utilities including age calculator, date converter, BMI calculator, scientific calculator, URL shortener, image tools, and more. It's built with a modern tech stack using React for the frontend and Express for the backend, with support for both Arabic (RTL) and English languages.

## System Architecture

The application follows a monorepo structure with clear separation between client and server code:

- **Frontend**: React with TypeScript, using Vite as the build tool
- **Backend**: Express.js with TypeScript, running on Node.js
- **Database**: PostgreSQL with Drizzle ORM (configured but not actively using a live database yet)
- **UI Framework**: Tailwind CSS with shadcn/ui components
- **Deployment**: Configured for Replit with autoscale deployment

## Key Components

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite with custom configuration for client-side routing
- **Styling**: Tailwind CSS with custom Arabic font (Cairo) and RTL support
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **State Management**: TanStack Query for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: Drizzle ORM configured for PostgreSQL
- **Session Management**: Express sessions with PostgreSQL store support
- **Development**: Hot reloading with Vite integration in development mode

### UI Component System
The application uses a comprehensive design system with:
- Consistent theming with CSS custom properties
- Dark/light mode support (configured but not implemented)
- Responsive design patterns
- Accessible components using Radix UI primitives
- Arabic-specific styling with RTL text direction

## Data Flow

### Client-Side Flow
1. User interacts with calculator tools through modal dialogs
2. Form inputs are validated using React Hook Form and Zod schemas
3. Calculations are performed client-side using utility functions
4. Results are displayed immediately without server communication
5. TanStack Query manages any future API calls to the backend

### Server-Side Flow
1. Express server serves the React application in production
2. API routes are prefixed with `/api` for backend functionality
3. Database operations use Drizzle ORM with type-safe queries
4. Session management handles user authentication (when implemented)
5. Error handling middleware processes and formats errors

### Database Schema
Currently defined schema includes:
- **Users table**: Basic user management with username/password
- **Extensible**: Ready for additional calculator data storage
- **Type Safety**: Full TypeScript integration with Drizzle ORM

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form, TanStack Query
- **UI Components**: Radix UI primitives, Lucide React icons
- **Styling**: Tailwind CSS, class-variance-authority, clsx
- **Database**: Drizzle ORM, Neon Database serverless driver
- **Backend**: Express.js, session management libraries
- **Development**: Vite, TypeScript, ESBuild

### Calculator-Specific Tools
- **Date Handling**: date-fns, moment-hijri for accurate Hijri date conversions
- **Form Validation**: Zod for schema validation
- **UI Enhancements**: Embla Carousel, CMDK for command interfaces
- **Media Processing**: qrcode (generation), jsqr (reading), pdf-lib (PDF manipulation)
- **Image Processing**: browser-image-compression for client-side image optimization

## Deployment Strategy

### Replit Configuration
- **Environment**: Node.js 20, PostgreSQL 16, Web modules
- **Development**: `npm run dev` starts both client and server with hot reloading
- **Production Build**: Vite builds client assets, ESBuild bundles server
- **Port Configuration**: Server runs on port 5000, exposed as port 80
- **Auto-scaling**: Configured for automatic scaling based on demand

### Build Process
1. **Development**: Vite dev server with Express backend integration
2. **Production**: 
   - Client assets built to `dist/public`
   - Server bundled to `dist/index.js`
   - Static assets served by Express in production

### Database Strategy
- **Development**: In-memory storage with MemStorage class
- **Production**: Ready for PostgreSQL with environment-based configuration
- **Migrations**: Drizzle Kit handles schema migrations

## Recent Updates

### October 24, 2025 - BMO Tools Branding & AI-Powered Image Tools

**Site Branding Update:**
- Changed site title from "Free Web Tools" to "BMO Tools" across all pages
- Updated translations for both Arabic and English interfaces

**Background Removal Tool (Fully Functional):**
- Integrated with remove.bg API using BACKGROUND_REMOVAL_API_KEY secret
- Upload image, automatically remove background with AI
- Download processed image with transparent background
- Server-side API proxy prevents CORS issues
- Enhanced error handling with detailed API error messages

**Designfy Image Enhancement Tool:**
- Integrated with Designfy API using DESIGNFY_API_KEY secret
- Multiple AI-powered actions: enhance, upscale, recolor, remove-object
- Upload local images (converted to base64 for API)
- Professional image editing capabilities
- Action selector dropdown with visual feedback

**AI Image Generator (Free, No API Key Required):**
- Uses Pollinations AI for free image generation
- Text-to-image generation from natural language prompts
- 5 example prompts in Arabic for user guidance
- No API key needed - uses free web service
- Instant download of generated images
- Server-side proxy fetches and converts images to base64

**Technical Implementation:**
- All three tools use server-side API routes in `/api/` endpoints
- Background removal and Designfy use environment secrets (already configured)
- AI generator uses free Pollinations API (https://image.pollinations.ai)
- Proper error handling and user feedback with toast notifications
- Loading states during API processing
- All tools include comprehensive data-testid attributes for testing

### October 24, 2025 - Advanced Tools & Feature Enhancements

**Random Number Generator Enhancements:**
- Added count control: Generate multiple random numbers at once (1-100)
- Duplicate control: Allow/prevent duplicate numbers with toggle
- Combination feature: Generate formatted number combinations (e.g., lottery numbers)
- Multi-generation: Create multiple sets of random numbers simultaneously
- Advanced validation: Smart input validation with clear error messages
- Complete Arabic/English translations for all new options

**URL Shortener Improvements:**
- Added TinyURL support via free API endpoint
- URL expansion feature: Reveal original URLs from shortened links
- Server-side proxy for TinyURL to avoid CORS issues
- Service-specific UI notes for Bitly (requires API key)
- Enhanced error handling and user feedback

**New Security Tool - Malicious Link Checker:**
- Integration with URLhaus API for free malware/phishing detection
- Check URLs against abuse.ch database
- Display threat status with clear indicators
- Show threat type, tags, and reporter information
- Complete security scanning without requiring API keys
- Accessible via utilities category

**New Image Manipulation Tools:**
- **Image Cropper**: Crop images with custom dimensions
  - Width and height inputs with validation
  - Maintain aspect ratio option
  - Real-time preview (via canvas rendering)
  - Download cropped result
- **Image Combiner**: Merge multiple images into one
  - Support for 2-10 images
  - Horizontal or vertical layout options
  - Automatic canvas sizing
  - Download combined image as PNG

**Technical Improvements:**
- Canvas-based image processing for crop and combine operations
- Client-side only processing (no server uploads required)
- FileReader API for image loading
- Proper error handling for invalid image formats
- All new tools include data-testid attributes for testing
- Enhanced accessibility with ARIA labels

### October 23, 2025 - BMO Tools Rebranding & Feature Enhancements

**Rebranding:**
- Complete rebranding from "Arabic Calculator Tools" to "BMO Tools"
- Updated all meta tags, SEO schemas, and Open Graph tags
- Changed canonical URLs to bmo-tools.vercel.app/bmo-tools.netlify.app
- Updated sitemap and robots.txt with new branding

**Timer Enhancements:**
- Added state persistence using localStorage with drift correction
- Timer continues from where it left off when modal reopens
- Uses Date.now()-based time tracking to prevent accuracy issues

**World Clock Improvements:**
- Expanded from 6 to 11 cities (added Mecca, Istanbul, Paris, Los Angeles, Sydney)
- Added 12/24 hour format toggle with localStorage persistence
- Fixed time accuracy using Intl.DateTimeFormat with proper IANA timezones
- Accurate DST handling for all cities

**Scientific Calculator:**
- Full scientific calculator implementation
- Basic operations: +, -, ×, ÷
- Scientific functions: sin, cos, tan, log, ln, √, ^, π, e
- Memory functions: M+, MR, MC
- Expression evaluation with proper math function replacement
- Note: Uses eval() for calculations (consider mathjs for production)

**URL Shortener Multi-Service Support:**
- Service selection dropdown with 4 options:
  - BMO Shortener (internal) - uses existing backend API
  - is.gd (free external) - server-side proxy to avoid CORS
  - TinyURL (requires API key) - placeholder
  - Bit.ly (requires API key) - placeholder
- Server-side proxy endpoint `/api/urls/isgd` for is.gd integration
- Service selection persists via localStorage
- Statistics only shown for BMO internal service

**Background Remover:**
- Placeholder implementation with clear instructions
- Explains remove.bg API integration requirement
- Provides link to remove.bg for API key setup
- Ready for future API integration

**Technical Improvements:**
- Added @types/qrcode for TypeScript support
- Server-side proxy prevents CORS issues with external APIs
- localStorage persistence for user preferences
- All new features include Arabic/English translations

### October 23, 2025 - Major Web Utilities Expansion
- **New Category System**: Reorganized homepage into clear categories (Time, Convert, Media, Images, Dev, Utilities)
- **Advanced Search & Filter**: Added search bar with real-time filtering across all tools
- **New Time Tools**:
  - Timer with hour/minute/second inputs and notification sound
  - World Clock showing real-time in 6 major cities
  - Stopwatch with millisecond precision
- **New Image Tools**:
  - Image Converter: Convert between JPG/PNG/WebP formats with file size optimization
  - Image Resizer: Resize images with aspect ratio preservation
- **New Media Tools**:
  - QR Code Generator & Reader: Create and scan QR codes with multiple sizes
  - PDF Tools: Merge and split PDF files client-side using pdf-lib
- **New Developer Tools**:
  - URL Shortener: Complete backend implementation with storage, collision handling, and security validation
- **Accuracy Improvements**:
  - Hijri/Gregorian date conversion now uses moment-hijri library for Umm al-Qura accuracy
  - GPA calculator fixed to properly convert 0-100 grades to 0-5 grade point scale
- **Security Enhancements**:
  - URL Shortener validates and whitelists only HTTP/HTTPS protocols
  - Zod schema validation for all URL inputs
  - Collision-resistant short code generation with retry mechanism

### Technical Architecture Updates
- **Libraries Added**: moment-hijri, qrcode, jsqr, pdf-lib, browser-image-compression
- **Backend Enhancements**: URL shortener with in-memory storage, secure API routes
- **Client-Side Processing**: All image/PDF/QR operations run entirely in browser
- **Type Safety**: Complete TypeScript integration with Zod validation schemas
- **State Management**: TanStack Query for URL shortener statistics and mutations

### December 16, 2024 - Major Feature Enhancement
- **Enhanced Countdown Timer**: Added beautiful clock design with visual countdown display and pleasant bell sound notification when timer completes
- **New Calculator Tools Added**:
  - Unit Converter (length, weight, temperature)
  - Password Generator with strength indicator and security options
  - Color Picker with hex/RGB conversion
- **Multilingual Support**: Complete Arabic/English language toggle with comprehensive translations
- **Improved UI/UX**: Enhanced visual design with better animations, gradients, and responsive layouts
- **Sound Notifications**: Web Audio API implementation for countdown timer completion alerts
- **Language Context**: Added React Context for dynamic language switching with RTL/LTR support

## Changelog
- October 24, 2025: BMO Tools rebranding, Background Removal (remove.bg API), Designfy image enhancement, AI Image Generator (Pollinations AI)
- October 24, 2025: Enhanced random number generator with advanced options, TinyURL integration, malicious link checker, image cropper, image combiner
- October 23, 2025: BMO Tools rebranding, timer persistence, world clock improvements (11 cities, 12/24 toggle), scientific calculator, multi-service URL shortener, background remover placeholder
- October 23, 2025: Major web utilities expansion with 10+ new tools, category system, security fixes
- December 16, 2024: Enhanced countdown timer, added 4 new tools, implemented multilingual support
- June 16, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.