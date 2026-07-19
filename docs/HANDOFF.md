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
    - `/home/user/elimu/docs/curriculum/P7-MATH-COMPLETE-QUESTION-BANK.md` *(Canonical P7 Mathematics: 3 Topics, 11 Modules, 135 Progressive Questions)*
- **Embedded Interactive Content & Multi-Module Hierarchy (`src/lib/data.ts`)**:
  - Embedded the canonical screened questions into `TOPICS` in `src/lib/data.ts`.
  - Consolidated P7 Social Studies into `p7-sst-uganda` (*Our Country Uganda*) structured across 3 sequential modules (`p7-uganda-m1`, `m2`, `m3`).
  - Authored and embedded the complete **Primary 7 Mathematics (`p7-math`) Multi-Module Question Bank (`11 modules, 135 progressive questions`)**:
    - `p7-math-geometry` (*Advanced Geometry & Mensuration*): 4 Modules (`p7-geom-m1` to `m4`, 49 questions)
    - `p7-math-business` (*Business Mathematics*): 4 Modules (`p7-bus-m1` to `m4`, 49 questions)
    - `p7-math-sets` (*Set Theory & Venn Diagrams*): 3 Modules (`p7-sets-m1` to `m3`, 37 questions)
  - Added playable interactive drills across all classes (`P4–P7`) covering all 4 core subjects (`Math, SST, Science, English`).
- **Responsive Layout & Non-Blocking Celebrations**:
  - `HeaderStats.tsx` uses a stacked 2-row layout (`flex-col sm:flex-row`) for mobile viewports (`320px–400px+`), keeping `Streak (3 days)` completely separated from the Class switcher so they never overlap.
  - `Celebration.tsx` and `EncouragementToast.tsx` have `if (!show) setVisible(false)` instant unmounts and `pointer-events-none` on containers. Confetti animations never block clicks on subsequent questions across any topic (`P4–P7`).
  - `subjects/page.tsx` features a Duolingo-style accordion module ladder (`Start →`, `Resume →`, `Review →`), and `module/page.tsx` seamlessly advances to the next sequential module upon completion (`Next: [Module Name] →`).
- **Production Verification & Workspace Cleanliness**:
  - `npm run build` and `npx tsc --noEmit` pass with zero TypeScript errors or linter warnings and generate the complete static export across all 11 routes in `/dist`.
  - All temporary builder `.py` and `.txt` scripts have been removed, enforcing our single workspace folder (`/home/user/elimu/`) rule.

## Next actions
The canonical 4-class / 4-subject NCDC content and the complete P7 Mathematics 11-module curriculum have been screened and embedded into `src/lib/data.ts` and `docs/curriculum/`. Next phases can scale the multi-module hierarchy (`12–15 questions per module`) into `P6 Mathematics`, `P5 Mathematics`, and `P4 Mathematics`, or expand PLE past papers across `Integrated Science` and `English Language`. Always append items first to `docs/curriculum/`, screen for strictly Ugandan context (`no Western/generic filler`), insert cleanly into `TOPICS` using exact brace-boundary logic (`count == 0`), verify with `npm run build`, and provide the mandatory exact modified file summary list upon completion.
