# Elimu

Mobile-first quiz learning for Ugandan primary pupils (P4–P7). Built with Next.js 14, TypeScript, Tailwind CSS, and Framer Motion.

## Quick start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build for production

```bash
npm run build
```

This generates a static export in `/dist`, ready for Vercel.

## Routes

- `/` — launcher / overview
- `/onboarding/` — role, class, name, parent code link
- `/home/` — learner home with continue card, subjects, streak
- `/subjects/` — subjects and topics
- `/module/` — readable lesson + check question
- `/practice/` — mixed quiz with hearts, feedback, encouragement
- `/parent/` — parent dashboard with stats and activity

## Demo parent link

Use code **739104** on the parent onboarding step to simulate linking to the demo student account.

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
