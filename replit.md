# QuickDeliver - Delivery Management Platform

## Overview

QuickDeliver is a full-stack delivery management application built with a modern tech stack featuring React frontend, Express.js backend, PostgreSQL database, and Drizzle ORM. The application facilitates package delivery services by connecting customers with delivery partners through a mobile-responsive web interface.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom design tokens and mobile-first responsive design
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API with JSON responses
- **Error Handling**: Centralized error middleware with structured error responses
- **Development**: Hot reload with tsx for TypeScript execution

### Database Architecture
- **Database**: PostgreSQL 16
- **ORM**: Drizzle ORM with type-safe queries
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Neon Database serverless driver for cloud-native PostgreSQL

## Key Components

### Data Models
- **Users**: Customer and delivery partner accounts with authentication
- **Orders**: Complete delivery lifecycle management with status tracking
- **Delivery Partners**: Profile management with availability and location tracking

### Core Features
1. **Order Management**: Create, track, and manage delivery orders
2. **User Authentication**: Login/registration system for customers and partners
3. **Real-time Tracking**: Order status updates and location tracking
4. **Mobile-First Design**: Responsive UI optimized for mobile devices
5. **Partner Management**: Delivery partner profiles with vehicle information

### UI Components
- **Mobile Container**: Fixed-width responsive container mimicking mobile app experience
- **Bottom Navigation**: Native mobile app-style navigation
- **Status Bar**: iOS-style status bar simulation
- **Form Components**: Comprehensive form handling with validation
- **Toast Notifications**: User feedback system

## Data Flow

1. **Order Creation**: Customer submits delivery request through booking form
2. **Partner Assignment**: System finds available delivery partners based on location
3. **Status Updates**: Real-time order status tracking from pending to delivered
4. **Notifications**: Users receive updates through toast notifications
5. **History**: Complete order history and tracking information storage

## External Dependencies

### Core Dependencies
- **Database**: @neondatabase/serverless for PostgreSQL connection
- **ORM**: drizzle-orm and drizzle-zod for database operations
- **UI Components**: Complete Radix UI component library
- **Validation**: Zod for runtime type validation
- **Forms**: React Hook Form with Hookform resolvers
- **Query Management**: TanStack React Query for server state

### Development Tools
- **Build**: Vite with React plugin and Replit-specific plugins
- **TypeScript**: Full TypeScript support with strict configuration
- **Styling**: Tailwind CSS with PostCSS processing
- **Linting**: ESBuild for production bundling

## Deployment Strategy

### Development Environment
- **Platform**: Replit with Node.js 20 runtime
- **Database**: PostgreSQL 16 module integration
- **Hot Reload**: Vite development server with HMR
- **Port Configuration**: Backend on port 5000, frontend proxied

### Production Deployment
- **Build Process**: Two-stage build (Vite for frontend, ESBuild for backend)
- **Static Assets**: Frontend built to dist/public directory
- **Server Bundle**: Backend bundled as ESM module
- **Autoscale**: Replit autoscale deployment target

### Environment Configuration
- **Database URL**: Environment variable for PostgreSQL connection
- **Session Management**: PostgreSQL session store integration
- **Asset Serving**: Static file serving in production mode

## Changelog

```
Changelog:
- June 19, 2025. Initial setup
- June 19, 2025. Made Account tab fully functional with:
  * Real user profile data from backend API
  * Live account statistics (orders, spending, ratings)
  * Profile editing with form validation and backend integration
  * Settings management with notifications, privacy, and app preferences
  * Support section integrated within Account navigation
  * Bottom navigation updated to focus on core features (Home/Track/Account)
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```