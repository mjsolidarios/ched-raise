# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
CHED RAISE 2025 is a conference registration website built with React + TypeScript + Vite. The site features a dark glassmorphic design and includes Firebase authentication and Firestore for managing event registrations.

**Key Tech Stack:**
- React 19 with TypeScript (strict mode)
- Vite for build tooling
- Tailwind CSS v3 with custom design system
- Shadcn UI components (Radix UI primitives)
- Firebase v12 (Auth + Firestore)
- React Router v7 for navigation
- Framer Motion for animations

## Development Commands

### Running the Application
```bash
# Start dev server (typically runs on http://localhost:5173)
npm run dev

# Build for production (outputs to dist/)
npm run build

# Preview production build locally
npm run preview
```

### Type Checking
```bash
# TypeScript compilation check (tsc with noEmit)
npm run build
```

Note: This project does not have separate lint or test commands configured. The build command includes TypeScript checking.

## Architecture

### Routing Structure
The app uses React Router with the following routes:
- `/` - Landing page with Hero, About, Objectives, Program, Partners sections
- `/login` - Authentication (email/password and Google OAuth)
- `/dashboard` - Protected user dashboard for registration management
- `/admin` - Admin portal for viewing/managing all registrations

### Authentication Flow
1. Firebase Auth handles user authentication
2. `ProtectedRoute` component wraps protected pages and redirects unauthenticated users to `/login`
3. Google OAuth and email/password authentication are both supported
4. Auth state is managed via Firebase `onAuthStateChanged` observer

### Data Model (Firestore)
**Collection: `registrations`**
- Fields: `fullName`, `email`, `contactNumber`, `company`, `uid` (auth user ID), `status` (pending|confirmed|rejected), `createdAt`
- Security: Users can create/read/update their own registrations (matched by `uid`). Admin users (defined in firestore.rules by email) have full access.
- Admin email(s) defined in: `firestore.rules` (currently: mjsolidarios@wvsu.edu.ph)

### File Structure
```
src/
├── components/       # Reusable UI components (Hero, About, Navbar, Footer, etc.)
│   └── ui/          # Shadcn UI primitives (Button, Card, Input, etc.)
├── pages/           # Route-level page components
│   ├── LandingPage.tsx      # Main public page
│   ├── LoginPage.tsx        # Auth page
│   ├── UserDashboard.tsx    # User registration status/form
│   ├── AdminPage.tsx        # Admin dashboard
│   ├── RegistrationPage.tsx # Public registration (unused in routes?)
│   └── StatusPage.tsx       # Registration status checker (unused in routes?)
├── lib/
│   ├── firebase.ts  # Firebase config and exports (auth, db)
│   └── utils.ts     # cn() utility for className merging
├── hooks/
│   └── use-scroll-spy.ts    # Custom scroll detection hook
├── App.tsx          # Router setup and layout wrapper
├── main.tsx         # React app entry point
└── index.css        # Global styles and design tokens
```

### Design System
The project uses a custom dark theme with:
- **Primary color:** Deep indigo/navy (#08349f) - used for CTAs and branding
- **Secondary color:** Vibrant teal/emerald green
- **Glassmorphism:** `.glass` and `.glass-card` utility classes for frosted glass effects
- **Fonts:** Inter (body) and Outfit (headings)
- **CSS Variables:** HSL-based color tokens defined in `index.css`
- **Path alias:** `@/` maps to `./src/` (configured in vite.config.ts and tsconfig.json)

### Component Patterns
- Shadcn UI components follow the Radix UI pattern with variants from `class-variance-authority`
- `cn()` utility (from `@/lib/utils`) merges Tailwind classes safely using `clsx` and `tailwind-merge`
- Framer Motion variants used for staggered animations (see AdminPage and UserDashboard)
- All components use TypeScript with explicit typing

## Environment Setup

### Required Environment Variables
Create a `.env.local` file with Firebase config:
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```

**IMPORTANT:** Never commit `.env.local` to version control. It's already in `.gitignore`.

## Firebase Deployment Notes
- Firestore security rules are defined in `firestore.rules`
- To add more admin users, update the email array in the `isAdmin()` function in `firestore.rules`
- Deploy Firestore rules using Firebase CLI: `firebase deploy --only firestore:rules`

## Code Conventions
- TypeScript strict mode is enabled (including `noUnusedLocals` and `noUnusedParameters`)
- React components use function declaration syntax: `const Component = () => {}`
- Imports use the `@/` alias for src directory references
- Form state managed with controlled components using `useState`
- Async operations wrapped in try-catch with loading states
- Firebase queries use real-time listeners (`onSnapshot`) where appropriate

## Common Patterns

### Adding a New Page
1. Create component in `src/pages/YourPage.tsx`
2. Add route in `src/App.tsx` within `<Routes>`
3. If protected, wrap with `<ProtectedRoute>` component
4. Update Navbar links if needed in `src/components/Navbar.tsx`

### Adding Shadcn Components
Components are pre-configured via `components.json`. To add new ones:
```bash
npx shadcn@latest add [component-name]
```

### Firestore Queries
- Use `collection(db, 'collectionName')` to reference collections
- User-specific queries: `where('uid', '==', user.uid)`
- Real-time updates: `onSnapshot(query, callback)`
- Remember to return cleanup functions from `useEffect` to unsubscribe

## Design Notes
- The site heavily uses backdrop blur and transparency effects for glassmorphism
- Color scheme emphasizes deep blues (#08349f primary) with teal accents
- Animations are subtle with Framer Motion stagger effects
- Mobile-responsive with hamburger menu in Navbar (Sheet component)
- Status badges use semantic colors: amber (pending), emerald (confirmed), red (rejected)
