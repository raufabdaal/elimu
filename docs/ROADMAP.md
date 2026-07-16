# ELIMU Roadmap

## Phase 0 — Handoff ingestion (now)
- [x] Capture product brief and user intent.
- [x] Create documentation scaffold.
- [ ] Upload exported design files (`*.html`, `css/app.css`, `js/app.js`, `DESIGN-MANIFEST.json`).
- [ ] Extract canonical tokens from `css/app.css` and update `DESIGN-SYSTEM.md`.
- [ ] Confirm tech stack and file boundaries.

## Phase 1 — The 20% clickable prototype
Goal: a usable, deployable app with filler content and synthetic progress.

### 1.1 Foundation
- [x] Initialize Next.js 14 project with TypeScript + Tailwind CSS.
- [x] Configure `next.config.js` with `output: 'export'`, `distDir: 'dist'`, `trailingSlash: true`, and `images.unoptimized: true`.
- [x] Set up design tokens in `globals.css` and `tailwind.config.ts`.
- [x] Add Framer Motion + Lucide React.
- [x] Implement root layout with fonts, metadata, and safe-area padding for mobile.

:### 1.2 Screens
- [x] `/` — launcher matching overview image.
- [x] `/onboarding/` — class P4–P7 picker, role picker, parent code input.
- [x] `/home/` — welcome, continue card, streak, hearts, subject shortcuts, progress animation.
- [x] `/subjects/` — subject grid, topic list per subject.
- [x] `/module/` — readable lesson + check question.
- [x] `/practice/` — mixed quiz with hearts, feedback sheet, encouragement.
- [x] `/parent/` — dashboard with child stats, struggle areas, study time.

### 1.3 Quiz engine
- [x] Multiple-choice renderer.
- [x] Short-answer renderer (text input + check).
- [x] Instant feedback paragraph after each answer.
- [x] Heart loss on wrong answer; energy system.
- [x] Streak counter and celebration triggers.
- [x] End-of-session summary (XP, accuracy, time).

### 1.4 Gamification
- [x] Hearts UI (5 max).
- [x] Energy bar UI.
- [x] Streak flame + day count.
- [x] Encouragement messages between questions.
- [x] Entry animation for correct answers (star burst/bounce).
- [x] Progress path/home animations.

### 1.5 Parent linkage
- [x] Generate/display 6-digit student link code.
- [x] Parent enters 6-digit code to link.
- [x] Parent dashboard reads student progress from shared localStorage.

### 1.6 Data
- [x] Filler question bank for P4–P7 Math + SST.
- [x] Synthetic progress so the app looks alive on first open.
- [x] localStorage persistence.

### 1.7 Deployment
- [ ] GitHub Desktop repo setup.
- [ ] Push to GitHub.
- [ ] Connect to Vercel.
- [ ] Verify routes, no 404s.

## Phase 2 — Polish & curriculum
- [ ] Replace filler content with real Ugandan P4–P7 curriculum items.
- [ ] Add more subjects (Science, English, R.E., etc.).
- [ ] Expand question types (ordering, matching, image labeling).
- [ ] Audio pronunciation for language content.
- [ ] Lesson media (images, diagrams).

## Phase 3 — Backend & real accounts
- [ ] User accounts + auth (phone/email OTP).
- [ ] Real parent-student pairing.
- [ ] Cloud database for progress sync across devices.
- [ ] Push notifications for streak reminders.

## Phase 4 — Scale
- [ ] Teacher/school dashboard.
- [ ] Classrooms and assignments.
- [ ] Analytics for educators.
- [ ] Subscription/payment flows.

## Current phase
**Phase 1 complete → Phase 1.7 deployment**
