# PocketSEND - SEN Staff Preparation Platform

## Overview

PocketSEND is a B2B2C SaaS platform designed to help education recruitment agencies prepare Teaching Assistants for Special Educational Needs (SEN) placements through AI-powered micro-learning delivered via WhatsApp. The platform serves as a multi-tenant system where agencies can manage candidates while candidates receive personalized preparation content through intelligent micro-learning modules.

## Recent Changes (August 2024)

**Phase 1 Complete - Authentication & Database Foundation:**
- ✅ Successfully migrated from Express+Vite to Next.js 14 App Router architecture
- ✅ Implemented complete Supabase authentication system (agency + candidate flows)
- ✅ Designed comprehensive database schema with multi-tenant RLS policies
- ✅ Built magic link authentication system for passwordless candidate access
- ✅ Created professional UI components with teal branding using Shadcn/ui
- ✅ Implemented protected routing with middleware-based authentication
- ✅ Added comprehensive error handling and toast notifications
- ✅ **Fixed complete database integration** - All RLS policies working with admin client bypass (August 14, 2025)
- ✅ **Verified end-to-end flows** - Agency signup and candidate magic links fully functional
- ✅ **Added systematic testing** - Health check API confirms database connectivity and table access

**Phase 2 Complete - Landing Page Design System (August 15, 2025):**
- ✅ **Complete redesign with PocketSEND logo integration** - New smartphone with plant logo prominently displayed
- ✅ **Implemented conversion-focused messaging** - "Become SEN confident" headline with AI roleplay emphasis
- ✅ **Created comprehensive design system** - CSS variables, animations, and mobile-responsive layout
- ✅ **Built value proposition cards** - Three key benefits with animated icons and hover effects
- ✅ **Added fixed header navigation** - Professional header with logo and agency login access
- ✅ **Applied modern visual hierarchy** - Innovation badge, compelling CTAs, and trust indicators
- ✅ **Integrated floating background animations** - Subtle decorative elements for visual interest

**Current Status:** Complete production-ready landing page with compelling messaging and professional design, ready for Phase 3 development

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The application uses a hybrid architecture combining:

- **Next.js 14 App Router**: Modern React framework with file-based routing and server-side rendering capabilities
- **TypeScript**: Type-safe development with comprehensive type definitions
- **Tailwind CSS**: Utility-first CSS framework for responsive design
- **Shadcn/ui Components**: Accessible, customizable UI component library built on Radix UI primitives
- **React Query (TanStack Query)**: Server state management for data fetching and caching

The frontend follows a component-based architecture with separation between client and server components. Route protection is implemented through middleware and layout wrappers to ensure proper authentication flows.

### Backend Architecture

The system implements a dual backend approach:

- **Next.js API Routes**: Handle authentication callbacks, magic link generation, and internal API endpoints
- **Express.js Server**: Serves as the main application server with Vite integration for development
- **Middleware Layer**: Custom middleware for session management, authentication, and request routing

The backend uses a modular structure with separate route handling, storage abstraction, and development tooling integration.

### Authentication System

Authentication is handled through Supabase with multiple user flows:

- **Agency Users**: Traditional email/password authentication with role-based access control
- **Candidates**: Magic link authentication delivered via WhatsApp for passwordless access
- **Session Management**: Server-side session handling with automatic token refresh
- **Route Protection**: Middleware-based protection for authenticated routes with role-specific access

### Database Design

The application uses PostgreSQL with Drizzle ORM for type-safe database operations:

- **Multi-tenant Architecture**: Agency-based data isolation with proper foreign key relationships
- **User Management**: Flexible user roles (admin, consultant, team_lead) with agency association
- **Schema Management**: Migration-based schema evolution with version control

### Styling and UI Framework

The design system is built on:

- **CSS Variables**: Dynamic theming with custom color palette focused on teal branding
- **Component Composition**: Reusable UI components with variant-based styling
- **Responsive Design**: Mobile-first approach with breakpoint-based layouts
- **Accessibility**: ARIA-compliant components with keyboard navigation support

### Development Environment

The project is optimized for Replit deployment with:

- **Hot Module Replacement**: Fast development feedback with Vite integration
- **TypeScript Configuration**: Comprehensive type checking with path mapping
- **Build Optimization**: Production-ready builds with code splitting and asset optimization

## External Dependencies

### Authentication & Database
- **Supabase**: Authentication provider, PostgreSQL database hosting, and real-time capabilities
- **@supabase/ssr**: Server-side rendering support for authentication
- **Neon Database**: Alternative PostgreSQL provider configured through Drizzle

### Frontend Libraries
- **React 18**: Core UI framework with hooks and concurrent features
- **Next.js 14**: Full-stack React framework with App Router
- **Radix UI**: Headless UI components for accessibility and customization
- **TanStack Query**: Server state management and data synchronization

### Development Tools
- **Drizzle ORM**: Type-safe database queries and schema management
- **TypeScript**: Static type checking and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework with JIT compilation
- **Vite**: Build tool and development server with HMR

### Future Integrations (Planned)
- **Twilio**: WhatsApp messaging integration for magic links and micro-learning delivery
- **OpenAI**: AI-powered content generation for personalized learning modules
- **Stripe**: Subscription management and payment processing