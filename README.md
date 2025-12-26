# CHED RAISE 2026

Official website for the **CHED RAISE 2026: Responding through AI for Societal Empowerment** conference.

## Live Demo

- **Production:** [https://ched-raise.wvsu.edu.ph](https://ched-raise.wvsu.edu.ph)
- **Staging:** [https://ched-raise-staging.vercel.app](https://ched-raise-staging.vercel.app)

## Overview

This project is a modern, responsive platform built to facilitate the CHED RAISE 2026 conference. It serves as the central hub for event information, attendee registration, and interactive engagement. The application features a premium dark, glassmorphic design and integrates AI capabilities to enhance user experience.

## Key Features

### Core Experience
- **Modern Aesthetic:** Immersive dark mode design with glassmorphism, glowing gradients, and animated grid patterns.
- **Responsive Design:** Fully optimized for desktop, tablet, and mobile devices.
- **Interactive Agenda:** detailed, tabbed program schedule for different participant tracks (Students, Teachers, Admins).

### Smart Integrations
- **AI Chatbot:** Built with **Google Gemini API**, the "RAISE Assistant" provides instant answers to attendee inquiries about the venue, schedule, and logistics.
- **Registration System:** Seamless online registration flow powered by **Firebase Firestore**.
- **Automated Emailing:** Custom PHP backend (`src/api/email`) integrated with **Resend** to deliver transactional emails (e.g., Registration Confirmations with Ticket Codes).

### Event Management
- **Attendance Tracking:** Admin tools for verifying attendees via unique Ticket Codes/RAISE IDs.
- **Real-time Status:** Participants can check their registration status instantly.

## Tech Stack

### Frontend
- **Framework:** React + Vite
- **Language:** TypeScript
- **Styling:** Tailwind CSS (v3)
- **UI Library:** Shadcn UI
- **Animations:** Framer Motion
- **Icons:** Lucide React

### Backend & Services
- **Database:** Firebase Firestore
- **AI Engine:** Google Gemini API
- **Email Service:** PHP (Composer) + Resend API

## Project Structure

- `src/components`: UI components including the AI Chatbot, Registration forms, and section layouts.
- `src/pages`: Main route views (Landing, Registration, Attendance, etc.).
- `src/api`: PHP backend scripts for email services.
- `src/lib`: Utility functions and Firebase/Gemini configurations.
- `public`: Static assets (images, logos, partner branding).

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm
- PHP & Composer (for local email API development)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```bash
   cd ched-raise
   ```
3. Install frontend dependencies:
   ```bash
   npm install
   ```
4. (Optional) Install backend dependencies for email features:
   ```bash
   cd src/api/email
   composer install
   ```

### Development

Start the development server:
```bash
npm run dev
```

### Build

Build for production:
```bash
npm run build
```

## License
[License Name]