# Replit.md

## Overview

This is a modern full-stack web application built as a debutante celebration and RSVP system for Gwyneth. The application features an elegant, royal-themed design with interactive elements including a countdown timer, photo gallery, RSVP management, and guestbook functionality. It's built with React on the frontend, Express.js on the backend, and uses PostgreSQL with Drizzle ORM for data persistence.

## Recent Changes

**January 12, 2025**: "A Decade and Eight" transformation with new design theme
- Event renamed from "Debutante Ball" to "A Decade and Eight"
- Time changed from 5:30 PM to 10:00 PM on August 30, 2025
- Updated timeline to reflect new evening schedule (10:00 PM start)
- Replaced gift section text with custom poem about monetary gifts
- Implemented new soft color palette: #FDCFA0 #FAF096 #89A7C2 #F8C6CC #E78BA5 #D9C2EB
- Added color palette display to dress code section
- Moved RSVP section to appear after About Gwyneth section
- Added child-free ceremony note to RSVP form
- Updated debut prenup video to new YouTube link
- Simplified venue section to show only location details
- Updated CSS color system to use new "A Decade and Eight" theme
- Fixed guest management system database schema issues
- Added "18 Blue Bills" role option to admin dashboard

**January 12, 2025**: Complete transformation from wedding to debutante celebration
- Changed celebrant from Erica Santos to Gwyneth (Lea Gwyneth)
- Updated event details: August 30, 2025 at 5:30 PM
- Changed venue to THE BARN: Rustic Corner Bar & Grill
- Updated theme from garden/art to music and personal journey
- Replaced all photos with new debutante photoshoot images
- Updated dress code with formal attire requirements (no jeans policy)
- Changed background music to "Golden Hour" string orchestra cover
- Updated about section with Gwyneth's story and love for music
- Updated gift section with new QR code for digital payments
- Revised parents' message to reflect debutante milestone

**January 12, 2025**: Database isolation completed
- Created dedicated PostgreSQL database for this remixed project
- Established separate database tables (guests, plus_guests, guestbook_messages, admins)
- Ensured complete isolation from other projects on the account

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

The application follows a clean separation between frontend and backend with shared schema definitions:

- **Frontend**: React with TypeScript, styled with Tailwind CSS and Shadcn/ui components
- **Backend**: Express.js server with RESTful API endpoints
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Shared Types**: Common schema definitions used by both frontend and backend
- **Build System**: Vite for frontend bundling, ESBuild for backend compilation

## Key Components

### Frontend Architecture
- **Component-based React application** using functional components with hooks
- **Shadcn/ui component library** for consistent, accessible UI components
- **Framer Motion** for smooth animations and transitions
- **TanStack Query** for efficient server state management and caching
- **Wouter** for lightweight client-side routing
- **Three.js** for 3D background effects and visual enhancements
- **Tailwind CSS** with custom royal theme color palette

### Backend Architecture
- **Express.js REST API** with middleware for logging and error handling
- **Modular route handling** separated into dedicated route files
- **Storage abstraction layer** with interface-driven database operations
- **Drizzle ORM** for type-safe database queries and migrations
- **Neon serverless PostgreSQL** connection with WebSocket support

### Database Schema
- **Guests table**: Stores primary guest information, RSVP status, and allowed plus guests
- **Plus guests table**: Stores additional guests brought by primary invitees
- **Guestbook messages table**: Stores public messages with moderation capabilities
- **Admins table**: Stores administrator credentials for backend access

## Data Flow

1. **Guest Search**: Users search by first/last name to find their invitation
2. **RSVP Submission**: Guests can accept/decline and add plus guests within their limit
3. **Guestbook**: Public messages submitted for approval before display
4. **Admin Dashboard**: Comprehensive management interface for all data
5. **Real-time Updates**: Frontend automatically refreshes data using TanStack Query

## External Dependencies

### Frontend Dependencies
- **React ecosystem**: React, React DOM for UI framework
- **Styling**: Tailwind CSS, Radix UI primitives, Class Variance Authority
- **Animations**: Framer Motion for smooth transitions
- **3D Graphics**: Three.js for background effects
- **State Management**: TanStack Query for server state
- **Forms**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight routing

### Backend Dependencies
- **Core**: Express.js, TypeScript for server framework
- **Database**: Drizzle ORM, @neondatabase/serverless for PostgreSQL
- **Session Management**: connect-pg-simple for PostgreSQL session storage
- **Validation**: Zod for runtime type checking
- **Development**: tsx for TypeScript execution, nodemon equivalent

### Build Tools
- **Vite**: Frontend development server and build tool
- **ESBuild**: Backend compilation and bundling
- **TypeScript**: Type checking and compilation
- **PostCSS**: CSS processing with Tailwind

## Deployment Strategy

The application is designed for deployment on platforms like Replit, Vercel, or similar:

1. **Environment Variables**: 
   - `DATABASE_URL`: PostgreSQL connection string (required)
   - `NODE_ENV`: Environment setting (development/production)

2. **Build Process**:
   - Frontend: Vite builds static assets to `dist/public`
   - Backend: ESBuild compiles server code to `dist/index.js`
   - Database: Drizzle migrations applied via `db:push` command

3. **Production Setup**:
   - Static assets served by Express in production
   - PostgreSQL database (Neon serverless recommended)
   - Session storage using PostgreSQL
   - HTTPS recommended for production deployment

4. **Development Workflow**:
   - Hot module replacement via Vite development server
   - TypeScript compilation and type checking
   - Database schema changes via Drizzle Kit
   - Automatic server restart on file changes