# ELIMU Implementation Handoff

## What an incoming agent needs to know
This project is a mobile-first (but fully responsive) edutech web app for Ugandan primary pupils (P4–P7). The product brief, design system, architecture, roadmap, and deployment instructions are all in `/home/user/elimu/docs/`.

## Current status (as of 2026-07-16)
- Documentation scaffold created and decisions locked in.
- **Tech stack**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion.
- **Parent link**: 6-digit numeric code, shared via localStorage in prototype.
- Design files uploaded: all 7 HTML screens, `DESIGN-MANIFEST.json`, `DESIGN-HANDOFF.md`, `critique.json`, plus canonical `app.css` and `app.js`.
- **Production code built and refactored**:
  - `/` redirects to `/onboarding/` for first-time users and `/home/` for returning users.
  - App is fully responsive: mobile fills the screen; tablet/desktop shows a centered app container.
  - Phone status bar removed.
  - Learning flow is **question-first**: entering a topic starts with a quiz question; after answering, the user sees an explanation paragraph.
  - Home header includes a "Switch profile" button for testing different classes/roles.
- `npm run build` succeeds and outputs a static export to `/dist`.

## Files present
- `/home/user/elimu/docs/PROJECT-BRIEF.md` — full product brief and scope.
- `/home/user/elimu/docs/DESIGN-SYSTEM.md` — canonical tokens reconstructed from `assets/app.css`.
- `/home/user/elimu/docs/ARCHITECTURE.md` — tech stack, folder structure, state model.
- `/home/user/elimu/docs/ROADMAP.md` — 20% prototype → 100% product plan.
- `/home/user/elimu/docs/HANDOFF.md` — this file.
- `/home/user/elimu/docs/CHANGELOG.md` — change log.
- `/home/user/elimu/docs/DEPLOYMENT.md` — GitHub Desktop + Vercel walkthrough.
- `/home/user/elimu/assets/app.css` — canonical stylesheet from design export.
- `/home/user/elimu/assets/app.js` — canonical shared state helper from design export.
- `/home/user/elimu/src/app/` — Next.js pages.
- `/home/user/elimu/src/components/` — AppShell, TabBar, Hearts, EnergyBar, Streak, Celebration, EncouragementToast, SubjectIcons.
- `/home/user/elimu/src/lib/` — types, store, data.
- `/home/user/elimu/uploads/` — exported design files.
- `/home/user/elimu/dist/` — generated static build output.

## Blockers / next actions
1. Review the responsive, question-first build.
2. Deploy to Vercel via GitHub Desktop using `DEPLOYMENT.md`.
3. Replace filler content with real Ugandan P4–P7 curriculum.

## Design files expected per user
From the user’s message:
> “Primary entry: `index.html` … HTML screens detected: 7 … Stylesheets detected: 1 … Script/component files detected: 1 … Supporting assets detected: 1 … Entry points: `home.html`, `index.html`, `module.html`, `onboarding.html`, `parent.html`, `practice.html`, `subjects.html` … Styles: `css/app.css` … Scripts/components: `js/app.js` … Assets and supporting files: `critique.json`”

## If you pick this up later
1. Read `PROJECT-BRIEF.md` first.
2. Open `assets/app.css` for canonical tokens and `assets/app.js` for the original state shape.
3. Open all HTML screens to understand the visual intent.
4. Log every significant change in `CHANGELOG.md`.

## Contact / context source
- The user’s original request is quoted in `PROJECT-BRIEF.md`.
- User location: Kampala, Uganda.
- Deployment target: Vercel via GitHub Desktop.
