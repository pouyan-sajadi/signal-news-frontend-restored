# Signal News App - Comprehensive Documentation

## Table of Contents
1. [Project Overview](#project-overview)
2. [Architecture](#architecture)
3. [Frontend Structure](#frontend-structure)
4. [Component Documentation](#component-documentation)
5. [API Layer](#api-layer)
6. [State Management](#state-management)
7. [Routing](#routing)
8. [Styling and UI](#styling-and-ui)
9. [Development Workflow](#development-workflow)
10. [Troubleshooting](#troubleshooting)

## Project Overview

Signal News App is a real-time AI-powered news aggregation and synthesis platform that transforms user queries into comprehensive, personalized news reports. The application consists of two main parts:

- **Frontend**: React-based client application built with Vite
- **Backend**: FastAPI server

### Key Features
- Real-time report generation with progress tracking
- Customizable report preferences (focus, depth, tone)
- Daily news dashboard
- Trending topics suggestions
- Report history and sharing
- Responsive design with dark/light theme support

## Architecture

### Technology Stack

#### Frontend
- **React 18**: Core UI library
- **TypeScript**: Type safety and better development experience
- **Vite**: Fast build tool and development server
- **React Router DOM**: Client-side routing
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: Modern UI component library
- **Lucide React**: Icon library
- **Axios**: HTTP client for API requests

#### Backend
- **Express.js**: Web application framework
- **MongoDB**: NoSQL database
- **Mongoose**: MongoDB object modeling

### Project Structure

The `client/src` directory is organized as follows:

```
client/src/
├── api/            # API client modules for backend communication
├── components/     # Reusable UI components (including Shadcn/ui components in `ui/` subdirectory)
├── hooks/          # Custom React hooks for encapsulating logic
├── lib/            # Utility functions and helpers
├── pages/          # Top-level page components representing different views/pages
├── types/          # TypeScript type definitions for data structures
├── App.css         # Global CSS for the application
├── App.tsx         # Main application component
├── index.css       # Entry point for global styles
└── main.tsx        # Application entry point (React DOM rendering)
```

### Entry Point (`client/src/main.tsx`)
The application entry point that renders the root App component:
- Sets up React StrictMode
- Mounts the application to the DOM
- Imports global CSS styles

### App Component (`client/src/App.tsx`)
The main application component that provides:
- **Theme Provider**: Manages light/dark theme switching
- **Router Setup**: Configures client-side routing
- **Global Components**: Toast notifications
- **Route Definitions**: Maps URLs to page components

### Layout System (`client/src/components/Layout.tsx`)
Provides the overall application structure:
- **Header**: Fixed navigation bar with logo and controls
- **Main Content**: Dynamic content area using React Router's Outlet
- **Footer**: Fixed footer with attribution
- **Background**: Gradient background with responsive design

## Component Documentation

### Core Components

#### 1. Header Component (`client/src/components/Header.tsx`)
**Purpose**: Top navigation bar with branding and controls

**Features**:
- Logo with click-to-home functionality
- History and Settings buttons (placeholder functionality)
- Theme toggle switch
- Responsive design

**Props**: None (uses React Router's useNavigate hook)

#### 2. Footer Component (`client/src/components/Footer.tsx`)
**Purpose**: Bottom footer with attribution

**Features**:
- Fixed positioning
- Backdrop blur effect
- External link to Pythagora

### Home Page Components

#### 1. HeroSection (`client/src/components/home/HeroSection.tsx`)
**Purpose**: Landing page hero with value proposition

**Features**:
- Gradient text title
- Feature highlights with icons
- Responsive typography

#### 2. TopicInput (`client/src/components/home/TopicInput.tsx`)
**Purpose**: Main input form for topic entry and report generation

**Props**:
- `value`: Current topic input
- `onChange`: Topic change handler
- `onGenerate`: Report generation trigger
- `disabled`: Loading state
- `preferences`: Report customization options
- `onPreferencesChange`: Preferences update handler

**Features**:
- Large search input with focus states
- Integrated preferences panel
- Form validation
- Generate button with loading states

#### 3. PreferencesPanel (`client/src/components/home/PreferencesPanel.tsx`)
**Purpose**: Collapsible panel for report customization

**Props**:
- `preferences`: Current preference values
- `onChange`: Preference update handler

**Features**:
- **Focus Selection**: Dropdown for report perspective
- **Depth Slider**: 1-5 scale for report detail level
- **Tone Selection**: Writing style options
- Tooltips for user guidance
- Responsive grid layout

#### 4. QuickTopics (`client/src/components/home/QuickTopics.tsx`)
**Purpose**: Displays trending topics as clickable cards

**Props**:
- `onTopicSelect`: Handler for topic selection

**Features**:
- Grid layout of topic cards
- Icon mapping for visual appeal
- Loading states with skeleton UI
- Error handling with fallback data

#### 5. DailyNewsDashboard (`client/src/components/home/DailyNewsDashboard.tsx`)
**Purpose**: Shows current news headlines

**Features**:
- Scrollable news list
- Category badges with color coding
- Time-ago formatting
- External link buttons
- Loading and error states

### Report Page Components

#### 1. ReportContent (`client/src/components/report/ReportContent.tsx`)
**Purpose**: Displays formatted report content

**Props**:
- `content`: Markdown-formatted report text

**Features**:
- Markdown-to-JSX conversion
- Reading progress tracking
- Text-to-speech toggle (placeholder)
- Scrollable content area

#### 2. NerdStats (`client/src/components/report/NerdStats.tsx`)
**Purpose**: Expandable statistics panel

**Props**:
- `stats`: Processing metrics
- `sources`: Source information

**Features**:
- Collapsible interface
- Metric cards with icons
- Search query badges
- Source list with external links

#### 3. RelatedTopics (`client/src/components/report/RelatedTopics.tsx`)
**Purpose**: Suggests related topics for exploration

**Props**:
- `topics`: Array of related topic strings
- `onTopicSelect`: Topic selection handler

**Features**:
- Grid layout of topic buttons
- Hover effects
- Navigation integration

### UI Components (`client/src/components/ui/`)

The `ui` folder contains Shadcn/ui components that provide:
- Consistent design system
- Accessibility features
- Theme support
- TypeScript definitions

**Key Components**:
- `Button`: Various button styles and sizes
- `Card`: Container component with consistent styling
- `Input`: Form input with validation states
- `Select`: Dropdown selection component
- `Slider`: Range input component
- `Progress`: Progress bar component
- `Badge`: Small status/category indicators
- `Dialog`: Modal dialogs
- `Toast`: Notification system

## API Layer

### API Configuration (`client/src/api/api.ts`)
**Purpose**: Centralized HTTP client configuration

**Features**:
- Axios instance setup
- JSON parsing with BigInt support
- Error handling
- Request/response interceptors

### Report API (`client/src/api/reports.ts`)
**Purpose**: Handles communication with the FastAPI backend for report generation and provides mocked data for other report-related functionalities.

**Functions**:

1.  **generateReport(data)**
    *   **Purpose**: Initiates the news report generation process on the FastAPI backend.
    *   **Mechanism**:
        *   Sends an HTTP POST request to `/process_news` to start the job and obtain a `job_id`.
        *   Establishes a WebSocket connection to `/ws/status/{job_id}` to receive real-time status updates and the final report.
    *   **Returns**: `Promise<FinalReportData>` (resolves with the final report data once the WebSocket stream completes).

2.  **getReport(id)**
    *   **Purpose**: (Currently not implemented for FastAPI backend) This function is a placeholder. The final report is streamed via WebSocket in `generateReport`. If reports are to be persisted and retrieved later, a corresponding backend endpoint and implementation would be required.
    *   **Returns**: Throws an error indicating it's not implemented.

3.  **getReportHistory()**
    *   **Purpose**: (Currently mocked) Retrieves a list of historical reports.
    *   **Mock**: Returns a hardcoded array of sample report history data after a delay.
    *   **Note**: This function would require a backend endpoint for actual implementation.

4.  **deleteReport(id)**
    *   **Purpose**: (Currently mocked) Deletes a specific report.
    *   **Mock**: Returns a success message after a delay.
    *   **Note**: This function would require a backend endpoint for actual implementation.

5.  **getTrendingTopics()**
    *   **Purpose**: (Currently mocked) Fetches a list of trending news topics.
    *   **Mock**: Returns a hardcoded array of sample trending topics after a delay.
    *   **Note**: This function would require a backend endpoint for actual implementation.

6.  **getDailyNews()**
    *   **Purpose**: (Currently mocked) Fetches daily news articles.
    *   **Mock**: Returns a hardcoded array of sample daily news items after a delay.
    *   **Note**: This function would require a backend endpoint for actual implementation.

### News API (`client/src/api/news.ts`)
**Purpose**: This file currently contains duplicate mocked functions for `getDailyNews` and `getTrendingTopics` that are also present in `reports.ts`.

**Note**: It is recommended to consolidate these functions into a single API file (e.g., `reports.ts` or a new `data.ts` if more general data fetching is introduced) to avoid redundancy and improve maintainability. The functions in this file are currently identical to their counterparts in `reports.ts` and serve as mocks.

## State Management

### Local State Management
The application uses React's built-in state management:

#### HomePage State (`client/src/pages/HomePage.tsx`)
- `topic`: Current topic input
- `preferences`: Report customization options
- `isGenerating`: Loading state for report generation
- `processingStep`: Current processing step
- `progress`: Generation progress percentage
- `currentStepIndex`: Active step in processing

#### ReportPage State (`client/src/pages/ReportPage.tsx`)
- `report`: Loaded report data
- `loading`: Loading state
- `showStats`: Statistics panel visibility

### Theme Management
Uses `next-themes` for theme switching:
- Stored in localStorage
- Supports system preference detection
- Provides theme context throughout app

### Toast Notifications
Custom hook for user feedback:
- Success/error messages
- Configurable duration
- Accessible design

## Routing


Debugging Steps:

Check Tailwind CSS classes
Verify component imports
Check theme provider setup
Inspect responsive breakpoints
4. Routing Problems
Issue: Navigation not working

Debugging Steps:

Verify route definitions in App.tsx
Check useNavigate usage
Ensure Router wrapper is present
Check for conflicting routes
Performance Optimization
Bundle Size
Use dynamic imports for large components
Implement code splitting at route level
Optimize image assets
Runtime Performance
Implement React.memo for expensive components
Use useCallback for event handlers
Optimize re-renders with proper dependency arrays
Loading States
Implement skeleton screens
Use progressive loading
Cache API responses where appropriate
Debugging Tools
Browser DevTools
React Developer Tools extension
Network tab for API monitoring
Console for error tracking
Vite DevTools
Hot module replacement
Build analysis
Source maps for debugging
Future Enhancements
Planned Features
Real Backend Integration: Replace mock APIs with actual endpoints
User Authentication: Login/signup functionality
Report Persistence: Save and manage user reports
Advanced Filtering: More sophisticated topic filtering
Export Options: PDF, Word, and other format exports
Collaboration: Share and collaborate on reports
Analytics: Usage tracking and insights
Technical Improvements
State Management: Consider Redux or Zustand for complex state
Testing: Add unit and integration tests
Performance: Implement virtual scrolling for large lists
Accessibility: Enhanced screen reader support
PWA: Progressive Web App capabilities
Internationalization: Multi-language support
Code Quality
Type Safety: Stricter TypeScript configuration
Error Boundaries: Better error handling
Logging: Structured logging system
Documentation: JSDoc comments for all functions
Code Coverage: Comprehensive test coverage
