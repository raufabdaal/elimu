# ELIMU Implementation Handoff

## What an incoming agent needs to know
This project is a mobile-first edutech web app for Ugandan primary pupils (P4–P7). The product brief, design system, architecture, roadmap, and deployment instructions are all in `/elimu/docs/`.

## Current status (as of 2026-07-16)
- Documentation scaffold created and decisions locked in.
- **Tech stack**: Next.js 14 + TypeScript + Tailwind CSS + Framer Motion.
- **Parent link**: 6-digit numeric code, shared via localStorage in prototype.
- Design files uploaded: all 7 HTML screens, `DESIGN-MANIFEST.json`, `DESIGN-HANDOFF.md`, `critique.json`. Note: `css/app.css` and `js/app.js` were referenced in the manifest but not included in the upload; styles and behavior were reconstructed from inline classes/scripts in the HTML files.
- **Production code built**: all 7 routes are implemented and `npm run build` succeeds.

## Files present
- `/home/user/elimu/docs/PROJECT-BRIEF.md` — full product brief and scope.
- `/home/user/elimu/docs/DESIGN-SYSTEM.md` — working tokens (reconstructed from HTML + critique notes).
- `/home/user/elimu/docs/ARCHITECTURE.md` — tech stack, folder structure, state model.
- `/home/user/elimu/docs/ROADMAP.md` — 20% prototype → 100% product plan.
- `/home/user/elimu/docs/HANDOFF.md` — this file.
- `/home/user/elimu/docs/CHANGELOG.md` — change log.
- `/home/user/elimu/docs/DEPLOYMENT.md` — GitHub Desktop + Vercel walkthrough (Next.js edition).
- `/home/user/elimu/src/app/` — Next.js pages: `page.tsx`, `home/`, `subjects/`, `module/`, `practice/`, `parent/`, `onboarding/`, `layout.tsx`, `globals.css`.
- `/home/user/elimu/src/components/` — `PhoneShell`, `StatusBar`, `TabBar`, `Hearts`, `EnergyBar`, `Streak`, `Celebration`, `EncouragementToast`, `SubjectIcons`.
- `/home/user/elimu/src/lib/` — `types.ts`, `store.ts`, `data.ts`.
- `/home/user/elimu/uploads/` — exported design files and overview image.
- `/home/user/elimu/dist/` — generated static build output.

## Blockers / next actions
1. Review the built app visually and confirm the design direction.
2. Deploy to Vercel via GitHub Desktop using `DEPLOYMENT.md`.
3. Replace filler content with real Ugandan P4–P7 curriculum in a future phase.

## Design files expected per user
From the user’s message:
> “Primary entry: `index.html` … HTML screens detected: 7 … Stylesheets detected: 1 … Script/component files detected: 1 … Supporting assets detected: 1 … Entry points: `home.html`, `index.html`, `module.html`, `onboarding.html`, `parent.html`, `practice.html`, `subjects.html` … Styles: `css/app.css` … Scripts/components: `js/app.js` … Assets and supporting files: `critique.json`”

## If you pick this up after the user uploads files
1. Read `PROJECT-BRIEF.md` first.
2. Open uploaded `DESIGN-MANIFEST.json` and all HTML files to map screens.
3. Read `css/app.css` and update `DESIGN-SYSTEM.md` with exact tokens.
4. Build screens from largest layout regions down to controls, preserving exported geometry.
5. Follow the responsive contract in `DESIGN-SYSTEM.md`.
6. Do not merge app screens, landing pages, or OS widgets into one route unless the export explicitly did so.
7. Log every significant change in `CHANGELOG.md`.

## Contact / context source
- The user’s original request is quoted in `PROJECT-BRIEF.md`.
- User location: Kampala, Uganda.
- Deployment target: Vercel via GitHub Desktop.
