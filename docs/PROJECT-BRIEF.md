# ELIMU — Uganda Primary P4–P7 Edutech Platform

## In one sentence
A mobile-first, quiz-first learning app for Ugandan primary pupils (P4–P7) that feels as engaging as Duolingo, with parent visibility into progress, struggle areas, and study habits.

## Target users
1. **Learners** — P4–P7 pupils who do not enjoy traditional studying.
2. **Parents / guardians** — want to link to the child’s account and see clean, actionable stats.

## Core product thesis
Kids resist “study time.” They accept “quick questions + instant feedback + rewards.” ELIMU wraps the national primary curriculum into short quizzes, each answered with immediate explanation, encouragement, and gamified accountability (hearts, streaks, energy, celebrations).

## Scope the user explicitly asked for (the “20%”)
The user stated: *“take this as 20 percent of what it has to be and we work together to make the full 100.”*

### Included in this 20%
- [x] Quiz/question-first UX with short-answer / multiple-choice questions.
- [x] Instant feedback after each answer: a small paragraph explaining *why* the answer is right/wrong.
- [x] Duolingo-level engagement: in-between encouragement (“You’re doing great!”), animations, hearts/energy bars, accountability mechanics.
- [x] Homepage progress animations showing previous and upcoming completions.
- [x] Parent can link to student account and view stats/progress.
- [x] Parent dashboard shows: where the kid is struggling, how they’re doing, how long they study.
- [x] Each subject in a class contains topics; topics contain topic-specific questions.
- [x] An overall “Practice” mode outside topics.
- [x] Design direction from exported handoff preserved as visual contract.
- [x] Mobile-first responsive build.
- [x] Filler content + synthetic progress so the app is usable immediately.
- [x] Deployment-ready for Vercel via GitHub Desktop.
- [x] Environment/variables setup to avoid 404s and runtime errors.

### Explicitly deferred to later “100%” conversations
- [ ] Real Ugandan curriculum content import / authoring workflow.
- [ ] Real authentication backend (OAuth, phone OTP, school IDs).
- [ ] Real student-parent linkage (invite codes, verified pairing).
- [ ] Real-time sync / cloud database.
- [ ] Audio, video, or rich media lessons.
- [ ] Payment/subscription flows.
- [ ] Teacher/school dashboard.
- [ ] Offline-native packaging (PWA download yes; app-store native no).

## Key flows
1. **Onboarding** → pick class (P4–P7), pick role (learner / parent), optionally link parent via 6-digit code.
2. **Home** → continue where you left off, streak card, hearts/energy, subjects shortcut.
3. **Subjects** → Mathematics, Social Studies, etc. → topics list → topic quiz.
4. **Practice** → mixed questions across subjects/topics.
5. **Learning module** → readable micro-lesson + check question at bottom.
6. **Parent dashboard** → linked child’s progress, struggle areas, study time.

## Parent-student linkage (prototype)
- The student’s app displays a 6-digit numeric code (e.g., `739104`).
- The parent enters that same code during onboarding or in parent settings.
- Both devices store the pairing in `localStorage` so the parent dashboard can render the child’s progress.
- In the backend phase this will be replaced by authenticated invite/pairing.

## Brand identity
- Name: **Elimu** (Swahili for “education”)
- Tagline territory: “Learn simply. Keep going.”
- Visual feel: calm, premium, content-first, age-appropriate but not childish.
- Primary accent: deep forest green `#0D7A54`.
- Background: very light mint/sage wash `#E7EFEC`.
- Surfaces: warm white cards `#FAFBFA`.
- Typography: Newsreader display, DM Sans UI, IBM Plex Mono numerics (per critique notes).

## Non-functional requirements
- Mobile-first; scales from 360×800 up to 1920×1080.
- No horizontal overflow at any target viewport.
- Works on Vercel static hosting first; dynamic backend added later.
- All interactive states visible (hover, focus, active, disabled, loading).
- Accessible headings, labels, and keyboard navigation.

## Source of truth
- This file plus `DESIGN-SYSTEM.md`, `ARCHITECTURE.md`, `ROADMAP.md`, `HANDOFF.md`, and `CHANGELOG.md`.
- The exported HTML screens and `DESIGN-MANIFEST.json` are the visual contract. `css/app.css` and `js/app.js` were referenced but not uploaded; styles and behavior were reconstructed from the HTML files.

## Date created
2026-07-16
