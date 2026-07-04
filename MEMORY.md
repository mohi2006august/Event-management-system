# Agent Memory Context

This file serves as a persistent memory bank for AI agents working on this project. It tracks important context, architectural decisions, and known quirks to ensure continuity across sessions.

## Current Project Status
- **Project**: Event Management System
- **Framework**: Next.js 16 (App Router), Tailwind CSS, TypeScript
- **Database**: Firebase (Firestore)
- **Core Loop**: Complete. Admins can create events, users can register and get a cryptographic QR ticket, and admins can scan the ticket to check them in.

## Important Quirks & Workarounds
- **Authentication Mock**: Client-side Firebase Auth is currently not implemented. Server-side `requireAdmin()` and `getSession()` are mocked in `src/lib/auth.ts` to always return an admin session (`uid: 'mock-admin-456'`). **Do not remove this until the real auth flow is built.**
- **Client vs Server Components**: Next.js App Router enforces strict boundaries. Do not pass `onClick` or other interactive handlers directly inside Server Components (e.g., `page.tsx`). They have been correctly extracted to Client Components (e.g., `src/components/events/DeleteEventButton.tsx`).
- **QR Scanner**: The `html5-qrcode` library is used in `ScannerClient.tsx`. It requires a DOM element on mount (hence `useEffect`), and camera access requires a secure context (HTTPS, `localhost`, or an `ngrok` tunnel for LAN testing).

## Unfinished Business / Next Tasks
1. Implement real Google Authentication via Firebase Client SDK.
2. Integrate a real Email Provider in `src/lib/email.ts` (currently just logs to console and returns success).
3. Handle Firestore security rules (if moving to production).
