# ELIMU Implementation Handoff

## 🤖 MANDATORY AGENT RULE: Exact Modified File Summary
**Every time an AI agent or developer modifies or creates files in this repository, they MUST provide a crystal-clear summary of the exact file paths modified right at the end of their response.**
This rule ensures the human lead can easily copy/overwrite those exact files (`e.g. src/lib/data.ts`, `docs/curriculum/P4-NCDC-QUESTION-BANK.md`) into their canonical main folder and push directly to production (Vercel) without any guessing.

---

## What an incoming agent needs to know
This project is a mobile-first (but fully responsive) edutech web app for Ugandan primary pupils (P4–P7). The product brief, design system, architecture, roadmap, and deployment instructions are all in `/home/user/elimu/docs/`.
**Workspace Integrity Rule:** All project files, components, and documentation reside inside `/home/user/elimu/`. Do not create outside directories (`/home/user/docs` or `/home/user/src` are strictly prohibited).

## Current status (as of 2026-07-19)
- **Canonical NCDC & UNEB Question Bank Documents Created (`docs/curriculum/`)**:
  - Sourced, screened, and formatted strictly Ugandan primary curriculum questions across all **4 Classes (`P4`, `P5`, `P6`, `P7`)** and all **4 Core Subjects (`Mathematics`, `Social Studies`, `Integrated Science`, `English Language`)**.
  - All Western or generic references (`dollars, apples, subways, generic history`) have been strictly screened out and replaced with authentic Ugandan/East African context (`UGX`, `Matooke`, `Local Council LC1-LC5 system`, `Mount Rwenzori vs Mount Elgon`, `Tropical vectors like Female Anopheles / Tsetse fly`, `Direct/Reported speech`, and `UNEB PLE format`).
  - Canonical Markdown banks:
    - `/home/user/elimu/docs/curriculum/P4-NCDC-QUESTION-BANK.md`
    - `/home/user/elimu/docs/curriculum/P5-NCDC-QUESTION-BANK.md`
    - `/home/user/elimu/docs/curriculum/P6-NCDC-QUESTION-BANK.md`
    - `/home/user/elimu/docs/curriculum/P7-NCDC-UNEB-PLE-QUESTION-BANK.md`
- **Embedded Interactive Content (`src/lib/data.ts`)**:
  - Embedded the canonical screened questions into `TOPICS` in `src/lib/data.ts`.
  - Preserved all 39 canonical P7 Social Studies questions (`p7-uganda-session-1`, `2`, `3`).
  - Added playable interactive drills across all classes:
    - **P4**: `p4-math-numbers`, `p4-sst-district`, `p4-sci-plants`, `p4-eng-nouns`
    - **P5**: `p5-math-fractions`, `p5-sst-regions`, `p5-sci-humanbody`, `p5-eng-tenses`
    - **P6**: `p6-math-percentages`, `p6-sst-eac`, `p6-sci-electricity`, `p6-eng-clauses`
    - **P7**: `p7-uganda-session-1`, `2`, `3`, `p7-math-business`, `p7-sci-energy`, `p7-eng-composition`
- **Responsive Layout & Non-Blocking Celebrations**:
  - `HeaderStats.tsx` uses a stacked 2-row layout (`flex-col sm:flex-row`) for mobile viewports (`320px–400px+`), keeping `Streak (3 days)` completely separated from the Class switcher so they never overlap.
  - `Celebration.tsx` and `EncouragementToast.tsx` have `if (!show) setVisible(false)` instant unmounts and `pointer-events-none` on containers. Confetti animations never block clicks on subsequent questions across any topic (`P4–P7`).
- **Production Verification**:
  - `npm run build` passes with zero TypeScript errors or linter warnings and generates the complete static export across all 11 routes in `/dist`.

## Next actions
The canonical 4-class / 4-subject NCDC content has been screened and embedded into `src/lib/data.ts` and `docs/curriculum/`. As additional PLE past papers and marking guides are gathered, append them first to the appropriate `docs/curriculum/PX-NCDC-QUESTION-BANK.md` document, screen for duplicates/alignment, and then insert them into `TOPICS` in `src/lib/data.ts`.
