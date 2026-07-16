# Elimu

Mobile-first (but fully responsive) quiz learning for Ugandan primary pupils (P4–P7). Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

First visit goes to `/onboarding/`. After that, `/` redirects to `/home/`.

## Build for production

```bash
npm run build
```

This generates a static export in `/dist`, ready for Vercel.

## Routes

- `/` — smart entry (redirects based on onboarding state)
- `/onboarding/` — role, class, name, parent code link
- `/home/` — learner home with continue card, subjects, streak, hearts, energy, switch-profile button
- `/subjects/` — subjects and topics
- `/module/?topic=fractions` — question-first topic quiz with explanations
- `/practice/` — mixed quiz with hearts, feedback, encouragement
- `/parent/` — parent dashboard with stats and activity

## Demo parent link

Use code **739104** on the parent onboarding step to simulate linking to the demo student account.

## Learning flow

Elimu is built around **question-first learning**:

1. Pick a topic.
2. Answer the question (multiple choice or fill-in).
3. Read the short explanation that tells you why the answer is right or wrong.
4. Move to the next question.

## Deployment

See `docs/DEPLOYMENT.md` for the full GitHub Desktop → Vercel walkthrough.

## Documentation

All product context is in `docs/`:

- `PROJECT-BRIEF.md` — product thesis and scope
- `DESIGN-SYSTEM.md` — tokens and visual system
- `ARCHITECTURE.md` — stack, folders, data model
- `ROADMAP.md` — current phase and future plans
- `HANDOFF.md` — status for the next agent
- `CHANGELOG.md` — change log
- `DEPLOYMENT.md` — deployment instructions
