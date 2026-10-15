# TravelMate AI - Frontend Application

Modern React 18 single-page application built with Vite for the AI-Powered Personalized Travel Planner.

## Tech Stack
- **Framework**: React 18 with Vite
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios with centralized request/response interceptors
- **Icons**: Lucide React
- **Design System**: Vanilla CSS design tokens with responsive layout, mobile menus, and print-friendly styles.

## Available Pages
- **Landing Page (`/`)**: Hero banner, value proposition, feature overview, interactive sample itinerary preview, call to actions.
- **Registration Page (`/register`)**: Client-side validation, password visibility toggle, backend integration.
- **Login Page (`/login`)**: Client-side validation, password visibility toggle, quick demo credentials filler.
- **Dashboard (`/dashboard`)**: Welcome header, stats summary, quick trip cards, trip management.
- **Create Trip (`/create-trip`)**: Multi-step trip preference form, interactive interest chips, budget allocation toggle (Total vs Per-person), real-time validation, and AI generation loading indicator.
- **Itinerary View (`/itinerary/:id`)**: Chronological day-wise schedule, categorized activity badges, detailed budget analytics, AI modification modal, regenerate action, and print/export stylesheet.
- **My Trips (`/trips`)**: Search by destination, filter by travel style, trip deletion and view actions.
- **Profile (`/profile`)**: Update profile info, secure password change.
- **Shared Trip (`/shared/:token`)**: Public read-only itinerary view accessible without authentication.

## Development Setup
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start development server:
   ```bash
   npm run dev
   ```
3. Build for production:
   ```bash
   npm run build
   ```
