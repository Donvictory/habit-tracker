# Habit Tracker

Welcome to **Habit Tracker**, a premium, offline-first application designed to help you master your daily routines with ease. Built with a focus on visual excellence and snappy performance, Habit Tracker offers a beautiful way to track your growth without the complexity of cloud syncing or third-party data tracking.

## Project Overview

Habit Tracker is a modern Progressive Web App (PWA) built using **Next.js 15** and **Tailwind CSS**. It features a glassmorphism-inspired design system with smooth transitions, responsive layouts, and a "Premium" feel.

**Core Features:**

- **Visual Dashboard**: A clean overview of your daily habits and progress.
- **Streak Tracking**: Motivational streak counters calculated in real-time.
- **Offline-First**: Fully functional without an internet connection.
- **Local Privacy**: All data stays on your device—no external databases required.
- **Rich PWA Install**: Full support for "Add to Home Screen" with high-quality branding and screenshots.

## Getting Started

### **Setup Instructions**

1.  **Clone the Repository**:
    bash
    git clone <repository-url>
    cd habit-tracker
2.  **Install Dependencies**:
    bash
    npm install

### **Run Instructions**

1.  **Development Mode**:
    Start the local dev server at `http://localhost:3000`:
    bash
    npm run dev
2.  **Production Build**:
    Test the optimized production bundle:
    bash
    npm run build
    npm run start

## Testing

Maintained a robust testing suite covering unit logic, component integration, and end-to-end user journeys.

### **Run Instructions**

- **Unit & Integration Tests** (Vitest):
  bash
  npm test
  **End-to-End Tests** (Playwright):
  bash
  npx playwright test

### **Test File Mapping**

`tests/e2e/app.spec.ts`  
E2E  
**Full User Journey**: Verification of Auth flow, habit creation, streak updates, persistence across reloads, and offline accessibility.
`tests/integration/auth-flow.test.tsx`  
Integration
**Authentication Logic**: Validates user registration, login redirection, and session lifecycle.  
`tests/integration/habit-form.test.tsx`
Integration
**UI Interactions**: Tests the Create/Edit/Delete modals, form validation, and real-time dashboard updates.  
`tests/unit/habits.test.ts`
Unit
**Domain Logic**: Verifies the immutable state updates when toggling habit completions.  
`tests/unit/streaks.test.ts`
Unit
**Mathematics**: Validates the streak calculation algorithm, including edge cases like missed days and leap years.  
`tests/unit/validators.test.ts`
Unit
**Security**: Ensures habit names and descriptions meet length and formatting standards.  
`tests/unit/slug.test.ts`
Unit
**Utilities**: Verifies URL-friendly ID generation from habit names.

## Local Persistence Structure

HabitFlow uses the browser's `localStorage` for all data storage. This ensures zero latency and total user privacy.

- **`habit-tracker-users`**: Stores an array of user objects containing email and password (plain-text for demonstration purposes).
- **`habit-tracker-session`**: Stores the currently active session object (userId and email).
- **`habit-tracker-habits`**: The main data store. Contains an array of habit objects:
  - `id`: UUID
  - `userId`: Owner reference
  - `name`: Habit title
  - `completions`: Array of ISO date strings (`YYYY-MM-DD`)

## PWA Implementation

The app is fully optimized as a Progressive Web App to provide a native-like experience on Mobile and Desktop.

- **Service Worker (`sw.js`)**: Implements a "Stale-While-Revalidate" caching strategy. It pre-caches essential routes (`/`, `/dashboard`, `/login`) and static assets (icons, screenshots) to ensure the app loads instantly even offline.
- **Manifest (`manifest.json`)**: Configured for "Rich Install" UI.
  - **Icon Synchronization**: High-resolution icons (`1024x1024`) are correctly mapped to ensure the browser prompts for installation without validation errors.
  - **Form Factors**: Separate screenshots are provided for `wide` (desktop) and `narrow` (mobile) layouts to show users what they are installing.
- **Smooth Splash**: A custom `SplashScreen` component is used during redirects and session verification to maintain a premium feel during background processing.

## Trade-offs & Limitations

- **No Cross-Device Sync**: Because data is stored in `localStorage`, your habits are local to the device where they were created.
- **Browser-Specific Storage**: Clearing your browser's "Site Data" or "Storage" will result in data loss.
- **Storage Limits**: `localStorage` has a typical limit of 5-10MB, which is ample for years of habit data but limits the storage of large binary files.
- **SSR vs. CSR**: The initial redirect logic happens on the client to access `localStorage`, which results in a brief splash screen visible during the first mount.
