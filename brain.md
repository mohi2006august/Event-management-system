# Project Brain: Event Management System

This document serves as a high-level summary and record of what has been built in the Event Management System so far.

## 🏗 Architecture & Stack
- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS + Lucide React (Icons)
- **Database:** Firebase / Firestore
- **Authentication:** Firebase Auth (Currently mocked via Session cookies in `src/lib/auth.ts`)
- **Validation:** Zod (for API and Server Action payloads)

## 🗄 Data Models (`src/types/index.ts`)
- **Event:** `id`, `title`, `slug`, `description`, `startsAt`, `registrationDeadline`, `capacity`, `registeredCount`, `createdBy`.
- **Registration:** `id`, `eventId`, `userId`, `registeredAt`, `ticketCode`, `status` (registered/attended/cancelled), `attendedAt`, `emailStatus`.
- **Member:** `uid`, `email`, `displayName`, `role` (user/admin).

## 🚀 Features Implemented

### 1. Admin: Event Management (`/admin/events`)
- **List View:** Displays all events with their registration counts vs capacity.
- **Create / Edit Forms:** Reusable `EventForm` component using Server Actions (`createEventAction`, `updateEventAction`).
- **Safe Deletion:** Client component `DeleteEventButton` handles confirmation dialogues before triggering the `deleteEventAction`.
- **Security:** Protected by `requireAdmin()` middleware.

### 2. User: Event Browsing
- **List Page (`/events`):** Displays upcoming events.
- **Detail Page (`/events/[slug]`):** Shows event details, deadline, and capacity information.

### 3. User: Registration Flow
- **API Route (`/api/registration`):** 
  - Validates user session.
  - Uses Firestore transactions to safely increment `registeredCount` without race conditions.
  - Generates a **secure cryptographic ticket code** using HMAC-SHA256 (`src/lib/qr/ticket.ts`) to prevent QR code forgery.
  - Includes a stubbed email hook (`src/lib/email.ts`) designed to dispatch tickets.
- **Client Component (`RegistrationButton`):**
  - Handles UX for "Sign in to register", "Registration Full", and "Deadline Passed".
  - Prevents double-clicks with loading states.
  - Supports a "Resend Ticket" feature if the initial email dispatch failed.

### 4. Admin: QR Check-in Scanner (`/admin/checkin`)
- **Scanner UI:** `html5-qrcode` integration for live camera scanning via `ScannerClient.tsx`.
- **API Route (`/api/checkin`):** 
  - Cryptographically verifies the scanned `ticketCode`.
  - Uses an idempotent Firestore transaction to mark the user as attended.
  - Returns specific states (`success`, `duplicate`, `invalid`, `wrong_event`) so the scanner UI can show exact visual feedback (Green for success, Amber for duplicate, Red for errors).

## 🔧 Current Development State
- The system logic and UI are fully functional.
- **Authentication is currently mocked** in `src/lib/auth.ts` (`mock-admin-456`) to allow testing the UI without needing to hook up the Google OAuth provider on the client yet.

## 📝 Next Steps (Whenever you are ready)
1. **Real Authentication:** Implement Firebase Auth (Google Sign-in) on the client, and set a secure HttpOnly cookie so `getSession()` works with real users.
2. **Email Integration:** Hook up a real provider (like Resend or SendGrid) inside `src/lib/email.ts` to actually send the QR codes to registrants.
3. **Storage / Images (Optional):** Add Firebase Storage if you want to upload cover images for events.
