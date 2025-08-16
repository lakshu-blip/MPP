# Master Placement Platform (MPP)

## Overview

A comprehensive coding interview preparation platform designed to optimize placement readiness through structured problem-solving, spaced repetition, and progress tracking. The system manages 350+ curated coding problems with intelligent scheduling across a 60-day preparation timeline, incorporating mistake tracking, flashcards, and competitive programming integration.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety and component-based architecture
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui design system for consistent, accessible components
- **Styling**: Tailwind CSS with custom dark theme variables and utility-first approach
- **State Management**: TanStack Query for server state management and caching
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework for RESTful API endpoints
- **Language**: TypeScript for end-to-end type safety
- **Database Layer**: Drizzle ORM for type-safe database operations and schema management
- **API Design**: RESTful endpoints organized by resource (problems, progress, schedule, mistakes)
- **Middleware**: Custom logging, error handling, and request/response transformation

### Data Storage Solutions
- **Primary Database**: PostgreSQL for relational data storage
- **Connection**: Neon serverless PostgreSQL with connection pooling
- **Schema Management**: Drizzle Kit for migrations and schema evolution
- **Data Models**: Comprehensive schema covering users, problems, progress tracking, schedules, daily tasks, flashcards, and mistake analytics

### Core Features Architecture
- **Problem Management**: Categorized storage with difficulty levels, topic tags, company relevance, and solution tracking
- **Progress Tracking**: Individual problem attempts, success rates, completion status, and performance analytics
- **Spaced Repetition**: Algorithm-driven scheduling for optimal retention using intervals (1, 3, 5, 7, 14, 30 days)
- **Mistake Analytics**: Pattern recognition and automatic re-scheduling of problematic areas
- **Dashboard System**: Real-time statistics, progress visualization, and actionable daily tasks

### Authentication & Authorization
- **Current State**: Placeholder user system with hardcoded user ID
- **Planned**: Session-based authentication with secure user management
- **Data Security**: Environment-based configuration for sensitive credentials

## External Dependencies

### Database Services
- **Neon Database**: Serverless PostgreSQL hosting with WebSocket support for real-time connections
- **Connection Management**: `@neondatabase/serverless` with WebSocket constructor for optimal performance

### UI Framework Dependencies
- **Radix UI**: Complete suite of accessible, unstyled UI primitives including dialogs, dropdowns, navigation, and form components
- **Tailwind CSS**: Utility-first CSS framework with PostCSS processing and custom design tokens
- **Lucide React**: Feather-based icon library for consistent iconography
- **Class Variance Authority**: Type-safe variant management for component styling

### Development Tools
- **TanStack Query**: Server state management with caching, background updates, and optimistic updates
- **React Hook Form**: Form state management with validation support
- **Zod**: Runtime type validation and schema validation for API endpoints
- **Date-fns**: Date manipulation and formatting utilities

### Build & Development
- **Vite**: Development server and build tool with React plugin support
- **ESBuild**: Fast TypeScript compilation and bundling for production
- **TypeScript**: Static type checking across frontend, backend, and shared schemas
- **Drizzle Kit**: Database schema management and migration tools

### Third-party Integrations
- **Replit Platform**: Development environment integration with runtime error overlay and cartographer plugins
- **Font Loading**: Google Fonts integration for typography (Inter, JetBrains Mono, DM Sans, Fira Code)
- **Development Banner**: Replit-specific development mode indicators