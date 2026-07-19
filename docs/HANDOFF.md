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
    - `/home/user/elimu/docs/curriculum/P7-MATH-COMPLETE-QUESTION-BANK.md` *(Canonical P7 Mathematics: 9 Topics, 27 Modules, 329 Progressive Questions)*
    - `/home/user/elimu/docs/curriculum/P7-SST-COMPLETE-QUESTION-BANK.md` *(Canonical P7 Social Studies: 7 Topics, 21 Modules, 262 Progressive Questions)*
    - `/home/user/elimu/docs/curriculum/P7-SCI-COMPLETE-QUESTION-BANK.md` *(Canonical P7 Integrated Science: 8 Topics, 27 Modules, 332 Progressive Questions)*
    - `/home/user/elimu/docs/curriculum/P7-ENG-COMPLETE-QUESTION-BANK.md` *(Canonical P7 English Language: 4 Topics, 16 Modules, 195 Progressive Questions)*
- **Embedded Interactive Content & Multi-Module Hierarchy (`src/lib/data.ts`)**:
  - Embedded the canonical screened questions into `TOPICS` in `src/lib/data.ts`.
  - Authored and embedded the **Complete 100% Primary 7 English Language (`p7-eng`) Multi-Module Syllabus (`4 Topics, 16 Modules, 195 Progressive Questions`)** covering every single NCDC & UNEB PLE category:
    1. `p7-eng-grammar-vocab` (*Punctuation, Vocabulary, Spelling & Affixes*): 4 Modules (`49 questions`)
    2. `p7-eng-grammar-structures` (*Comprehensive English Grammar & Sentence Structures*): 5 Modules (`61 questions`)
    3. `p7-eng-comprehension` (*Reading Comprehension & Critical Analysis*): 3 Modules (`37 questions`)
    4. `p7-eng-composition` (*PLE Composition, Formal Letter Writing & Functional Writing*): 4 Modules (`48 questions`)
  - Authored and embedded the **Complete 100% Primary 7 Integrated Science (`p7-sci`) Multi-Module Syllabus (`8 Topics, 27 Modules, 332 Progressive Questions`)** covering every single NCDC & UNEB PLE category:
    1. `p7-sci-muscular-skeletal` (*The Human Muscular & Skeletal System*): 3 Modules (`37 questions`)
    2. `p7-sci-electricity` (*Electricity & Magnetism*): 3 Modules (`37 questions`)
    3. `p7-sci-light-sound` (*Sound, Light & Optical Instruments*): 4 Modules (`49 questions`)
    4. `p7-sci-excretory` (*The Human Excretory System & Skin Hygiene*): 3 Modules (`37 questions`)
    5. `p7-sci-circulatory` (*The Human Circulatory System*): 3 Modules (`38 questions`)
    6. `p7-sci-health-vectors` (*Tropical Health, Diseases & Vectors*): 4 Modules (`49 questions`)
    7. `p7-sci-ecosystem` (*Interdependence of Things & Ecosystems*): 3 Modules (`36 questions`)
    8. `p7-sci-agriculture` (*Agriculture, Farm Management & Apiculture*): 4 Modules (`49 questions`)
  - Authored and embedded the **Complete 100% Primary 7 Social Studies (`p7-sst`) Multi-Module Syllabus (`7 Topics, 21 Modules, 262 Progressive Questions`)** covering every single NCDC & UNEB PLE thematic unit:
    1. `p7-sst-uganda` (*Our Country Uganda: Physical Features, Governance & Economy*): 3 Modules (`39 questions`)
    2. `p7-sst-africa-physical` (*Africa: Physical Features, Climate & Natural Vegetation*): 3 Modules (`37 questions`)
    3. `p7-sst-africa-people` (*The People & History of Africa: Migrations, Explorers & Colonization*): 4 Modules (`49 questions`)
    4. `p7-sst-world` (*Economic Development & International Organizations: EAC, AU & UN*): 3 Modules (`37 questions`)
    5. `p7-sst-cases` (*African Economic Case Studies: Libya, Ghana, Nigeria, South Africa, DRC & Egypt*): 3 Modules (`36 questions`)
    6. `p7-sst-cre` (*PLE Christian Religious Education — CRE Section*): 3 Modules (`38 questions`)
    7. `p7-sst-ire` (*PLE Islamic Religious Education — IRE Section*): 2 Modules (`26 questions`)
  - Authored and embedded the **Complete 100% Primary 7 Mathematics (`p7-math`) Multi-Module Syllabus (`9 Topics, 27 Modules, 329 Progressive Questions`)** covering every single NCDC & UNEB PLE category:
    1. `p7-math-sets` (*Set Theory & Venn Diagrams*): 3 Modules (`36 questions`)
    2. `p7-math-numbers` (*Number Patterns, Sequences & Prime Factorization*): 3 Modules (`37 questions`)
    3. `p7-math-fractions` (*Fractions, Decimals & Percentages*): 3 Modules (`37 questions`)
    4. `p7-math-integers` (*Integers & Number Lines*): 2 Modules (`24 questions`)
    5. `p7-math-algebra` (*Algebra & Linear Equations*): 3 Modules (`38 questions`)
    6. `p7-math-geometry` (*Advanced Geometry & Mensuration*): 4 Modules (`48 questions`)
    7. `p7-math-data` (*Graphs, Data Handling & Statistics*): 3 Modules (`37 questions`)
    8. `p7-math-business` (*Business Mathematics*): 4 Modules (`48 questions`)
    9. `p7-math-time` (*Distance, Speed, Time & Rates*): 2 Modules (`24 questions`)
  - Added playable interactive drills across all classes (`P4–P7`) covering all 4 core subjects (`Math, SST, Science, English`).
- **Responsive Layout & Non-Blocking Celebrations**:
  - `HeaderStats.tsx` uses a stacked 2-row layout (`flex-col sm:flex-row`) for mobile viewports (`320px–400px+`), keeping `Streak (3 days)` completely separated from the Class switcher so they never overlap.
  - `Celebration.tsx` and `EncouragementToast.tsx` have `if (!show) setVisible(false)` instant unmounts and `pointer-events-none` on containers. Confetti animations never block clicks on subsequent questions across any topic (`P4–P7`).
  - `subjects/page.tsx` features a Duolingo-style accordion module ladder (`Start →`, `Resume →`, `Review →`), and `module/page.tsx` seamlessly advances to the next sequential module upon completion (`Next: [Module Name] →`).
- **Production Verification & Workspace Cleanliness**:
  - `npm run build` and `npx tsc --noEmit` pass with zero TypeScript errors or linter warnings and generate the complete static export across all 11 routes in `/dist`.
  - All temporary builder `.py` and `.txt` scripts have been removed, enforcing our single workspace folder (`/home/user/elimu/`) rule.

## Next actions
With the **entire Primary 7 (`P7`) NCDC & UNEB PLE Curriculum 100% complete across all 4 Core Subjects (`28 Topics, 91 Modules, 1,118 Progressive Questions Total`)**, the exact same sequential multi-module scaling strategy (`12–15 questions per module`) can now be applied across **Primary 6 (`P6`)**, **Primary 5 (`P5`)**, and **Primary 4 (`P4`)** portals. Always append items first to `docs/curriculum/`, screen for strictly Ugandan context (`no Western/generic filler`), insert cleanly into `TOPICS` using exact brace-boundary logic (`count == 0`), verify with `npm run build`, and provide the mandatory exact modified file summary list upon completion.
