# Changelog

## 2026-07-19 — Multi-Module Curriculum Architecture (`Subject -> Topic -> Module -> Question`)

### Multi-Module Hierarchy & Accordion Navigation (`types.ts`, `data.ts`, `subjects/page.tsx`, `module/page.tsx`)
- **Data Model Migration (`src/lib/types.ts`)** — Upgraded `Topic` and `TopicData` to support sequential **Modules (`ModuleData[]`)**, enabling topics to contain dozens or hundreds of questions broken down into bite-sized, non-burnout drills (`12–15 questions per module`).
- **Unified Canonical Topic: *Our Country Uganda* (`src/lib/data.ts`)** — Consolidated pseudo-session topics into one master NCDC topic (`p7-sst-uganda`) broken into 3 discrete sequential modules:
  - **Module 1 (`p7-uganda-m1`)**: Location, Position & Physical Features (`12 Questions`) ⭐ Mastered (`92% accuracy`)
  - **Module 2 (`p7-uganda-m2`)**: Economy, Minerals & Tourism (`12 Questions`) 🚀 In Progress (`78% accuracy`)
  - **Module 3 (`p7-uganda-m3`)**: People, Culture, Towns & Early History (`15 Questions`) Ready (`Locked / Ready`)
- **Duolingo-Style Expandable Accordion (`src/app/subjects/page.tsx`)** — Tapping any multi-module topic card smoothly glides down the sequential **Modules Ladder**. Pupils see their exact progress across modules (`Mastered ⭐`, `In Progress 🔥`, `Ready to Start`) and can launch directly into specific modules (`Review →`, `Resume →`, `Start →`).
- **Sequential Module Advancement (`src/app/module/page.tsx`)** — Updated quiz drill route to accept `moduleId` parameter (`/module/?topic=p7-sst-uganda&moduleId=p7-uganda-m2`). Upon mastering a module, the celebration screen dynamically provides a **`Next: [Module Name] →`** button (`e.g., Next: Economy, Minerals & Tourism`) that immediately loads the next learning phase of the topic without returning to the main menu.
- **Content Mastery Roadmap Created (`docs/curriculum/CONTENT-MASTERY-ROADMAP.md`)** — Documented the exhaustive multi-module scaling strategy across all 4 classes (`P4–P7`) and 4 core subjects (`Math, SST, Science, English`) mapping out exact module breakdowns for hundreds of guaranteed mastery questions.

---

## 2026-07-19 — Sourced & Embedded Canonical 4-Class / 4-Subject NCDC & UNEB PLE Curriculum Bank

### Canonical NCDC & UNEB PLE Question Bank Documents (`docs/curriculum/`)
- **Systematic Class-by-Class Sourcing & Screening** — Created comprehensive markdown question banks for Primary 4, Primary 5, Primary 6, and Primary 7 aligned strictly to the Uganda National Curriculum Development Centre (NCDC) and Primary Leaving Examination (UNEB PLE) syllabus.
- **Strictly Ugandan Context (No Western/Generic Filler)** — Screened out generic Western items and established authentic local context across all 4 subjects:
  - **Mathematics (`math`)**: Whole numbers, place values, UGX profit/loss (`Owino Market`), simple interest ($I = \frac{P \times R \times T}{100}$), set theory ($A \cap B$), LCM/HCF, Roman numerals, and fractions.
  - **Social Studies (`sst`)**: Ugandan Local Council system (`LC1 Village Chairperson to LC5 District Chairperson`), physical features (`Mount Rwenzori horst vs Mount Elgon volcano`), Uganda regions, East African Community (`8 partner states, Arusha HQ`), pre-colonial kingdoms (`Bunyoro-Kitara`), and 39 canonical questions of `Our Country Uganda`.
  - **Integrated Science (`sci`)**: Tropical vectors and health (`Female Anopheles mosquito / Malaria`, `Tsetse fly / Sleeping sickness`, `Housefly / Cholera`), human skeletal/circulatory/excretory systems (`Heart chambers`, `Kidneys / osmoregulation`), seed germination (`Moisture, warmth, oxygen`), and renewable energy (`Hydroelectric dams on River Nile`).
  - **English Language (`eng`)**: P4–P7 irregular plurals (`Child/Children`), proper vs common nouns (`Kampala, Uganda`), direct & reported speech backshifting (`now -> then`, `am reading -> was reading`), formal letter salutations (`Dear Sir/Madam, Yours faithfully`), and prepositions.
- **Canonical Files Created**:
  - `docs/curriculum/P4-NCDC-QUESTION-BANK.md`
  - `docs/curriculum/P5-NCDC-QUESTION-BANK.md`
  - `docs/curriculum/P6-NCDC-QUESTION-BANK.md`
  - `docs/curriculum/P7-NCDC-UNEB-PLE-QUESTION-BANK.md`

### Embedded Interactive Curriculum Drills (`src/lib/data.ts`)
- **Interactive `TOPICS` Expansion** — Embedded the screened canonical questions directly into the application data store (`src/lib/data.ts`) so pupils and parents can immediately drill any of the 16 subject-class portals (`P4–P7` across `Math, SST, Science, English`).
- **Dynamic Subject & Topic Resolvers (`getSubjects`, `getTopic`, `getTopicsForClass`)** — Updated helper functions to accurately filter and return the live interactive topics along with their subtopic counts, completion states (`⭐ Mastered`), and accuracy metrics (`100% / 85%`).

---

## 2026-07-19 — Responsive Header Overlap, Non-Blocking Celebrations, Workspace & Documentation Rules

### Responsive Header Overlap Resolution (`HeaderStats.tsx`)
- **Stacked Two-Row Mobile Header (`flex-col sm:flex-row`)** — Re-structured flex hierarchy so Row 1 (`flex items-center justify-between w-full`) isolates `Avatar + Pupil Name` on the left and `Streak + Hearts` (`shrink-0`) on the right. Row 2 (`pt-1 border-t border-slate-100 sm:border-0 sm:pt-0`) houses the **Class Pill (`Primary 5 · Switch Class ▾`)** on its own dedicated line underneath. The streak pill (`🔥 3 days`) never collides or sits on top of the class selector on tall or narrow devices (`320px–400px+`).

### Non-Blocking Celebration & Toast Animations (`Celebration.tsx`, `EncouragementToast.tsx`)
- **Instant Exit on Question Advancement** — Added explicit `if (!show) setVisible(false)` logic inside `Celebration.tsx` (`useEffect`) and set container wrappers to `pointer-events-none`.
- **Question Reset Assurance (`module/page.tsx`, `practice/page.tsx`)** — Updated `nextQuestion()` handlers across topic drills (`/module`) and rapid reviews (`/practice`) to explicitly reset `setCelebrate(false)` and `setEncourage(0)` right before loading index `i + 1`. Confetti animations and toasts never persist across questions or block user clicks.

### Workspace & Handoff Rule Enforced (`HANDOFF.md`)
- **Single Workspace Folder Integrity** — Removed stray external directories (`/home/user/docs`, `/home/user/tailwind.config.ts`), ensuring `/home/user/elimu/` is the sole canonical directory containing all code, assets, and documentation.
- **Mandatory Modified File Summary Rule** — Added explicit rule in `HANDOFF.md` requiring every turn/update to conclude with a summary list of exact modified paths for frictionless copy-pasting to production.

---

## 2026-07-19 — Full UI/UX & Gamification Overhaul + 4-Class / 4-Subject NCDC Architecture Prep

### Comprehensive Design Psychology & Gamified Interface Overhaul
- **Editorial & Gamification Visual Tokens (`globals.css`)** — Rebuilt CSS foundation with crisp high-contrast typography (`DM Sans` + `Newsreader`), distinct 4-subject color identities, and tactile Duolingo-style 3D buttons (`border-b-4`, active press-down transitions).
- **Responsive Layout (`AppShell`, `TabBar`, `PhoneShell`)** — Fixed desktop/tablet centered container alignment (`max-w-[460px]`, `border-radius: 36px`) so the navigation bar docks perfectly inside the phone stage without overlapping wide monitors (`fixed sm:absolute bottom-0`).
- **Gamified Sticky Top Bar (`HeaderStats.tsx`)** — Created a unified top bar for all screens featuring:
  - Dynamic **Primary Class Switcher Modal** (`P4`, `P5`, `P6`, `P7`) with instant curriculum preview.
  - ❤️ **Hearts counter (`Hearts.tsx`)** with shake animation (`animate-shake`) triggered on incorrect answers.
  - 🔥 **Streak counter (`Streak.tsx`)** with animated flame effect.
- **Fixed Bottom Feedback Sheet (`feedback-sheet`)** — Replaced inline DOM shifts on `/module` and `/practice` with a fixed bottom feedback drawer that slides up upon answering:
  - **Correct State (`ok`)**: Emerald theme, explanation/deep dive, and auto-focused **`Continue →`** (`Enter` shortcut).
  - **Incorrect State (`bad`)**: Rose theme, clear explanation of errors + deep dive, and **`Got it →`**.
- **Interactive Question Mechanics (`src/components/question-types/*`)**:
  - `MultipleChoice` / `TrueFalse` — Tactile 3D cards with letter badges (`A`, `B`, `C`, `D`) and animated check/cross feedback.
  - `MultiSelect` — Clear multi-option selection with checkmarks and missed-item alerts.
  - `Ordering` — Numbered sequence cards (`#1`, `#2`, `#3`) with smooth layout animations (`framer-motion layout`) and tactile Up/Down chevrons.
  - `Matching` — Bi-directional visual matching board with color-coded pair tags (`Blue`, `Purple`, `Amber`, `Rose`, `Teal`) and one-tap unmatch/reset capability.
  - `ShortAnswer` — High-visibility input with instant hint banner (`HelpCircle`) and submit button.

### Multi-Class & 4-Subject Curriculum Architecture Expansion
- **Expanded Types & Data Model (`types.ts`, `data.ts`)** — Upgraded system from 1 class / 2 subjects (`SST`, `Math`) to the full **4 Primary Classes (`p4`, `p5`, `p6`, `p7`)** and **4 Core NCDC Subjects (`math`, `sst`, `sci`, `eng`)**:
  1. **Mathematics (`math`)** — Indigo/Sapphire theme (`SUBJECT_THEMES.math`)
  2. **Social Studies (`sst`)** — Amber/Orange theme (`SUBJECT_THEMES.sst`)
  3. **Integrated Science (`sci`)** — Emerald/Teal theme (`SUBJECT_THEMES.sci`)
  4. **English Language (`eng`)** — Rose/Pink theme (`SUBJECT_THEMES.eng`)
- **Preserved & Expanded Curriculum Content** — Preserved all 39 canonical P7 Social Studies questions (`p7-uganda-session-1`, `2`, `3`) and introduced interactive starter topics across `P4–P7` (including playable `p5-math-fractions`, `p5-sci-humanbody`, `p5-eng-tenses`).
- **Parent Portal (`/parent/`)** — Upgraded with 4-subject progress trackers, 7-day study activity chart (`BarChart2`), and interactive **"Send Live Encouragement"** (`🙌 High Five`, `🔥 Keep the Streak`, `🌟 Super Scholar`) that triggers in-app cheers.

---

## 2026-07-16 — Gamification & Engagement Polish

### New Features
- **Hearts & Energy indicators** on topic rows in `/subjects` (Duolingo-style visual feedback)
- **Energy consumption system** — Every quiz attempt now costs 8 energy (via `consumeEnergy()`)
- **Enhanced sound library** (`src/lib/sounds.ts`):
  - `playHeartLossSound()` — low dramatic tone when losing a heart
  - `playStreakSound()` — celebratory rising arpeggio
  - `playLevelUpSound()` — satisfying progression tone
  - `playButtonClick()` — subtle UI feedback
- **Wrong answer flow** now plays both `playWrongSound()` + `playHeartLossSound()`

### Improvements
- Integrated sounds into both `/module` and `/practice`
- Energy system added to store with `consumeEnergy()`
- Topic rows now show ❤️ 3/5 + ⚡ 80 indicators

### Files Modified
- `src/lib/sounds.ts`
- `src/lib/store.ts`
- `src/app/subjects/page.tsx`
- `src/app/module/page.tsx`
- `src/app/practice/page.tsx`

---

## 2026-07-16 — Polish & Real Content Prep

### Changes
- **Persistent bottom navbar** — Now fixed at bottom with proper role-based tabs (learners see Home/Subjects/Practice, parents see Home/Parent)
- **Role-aware navigation** — Kids no longer see Parent tab; parents no longer see Subjects/Practice
- **Demo banner** — Added persistent "🚧 DEMO MODE — Sample content only" banner at the top of the app
- **Satisfying sounds** — Added Duolingo-style audio feedback (`/src/lib/sounds.ts`):
  - Correct answer: pleasant rising tone
  - Wrong answer: low sawtooth tone
  - Encouragement toast now triggers sound
- **Encouragement toast fix** — Improved timing and animation to prevent persistence across questions
- **Cleaned workspace** — Removed `assets/` folder (design exports no longer needed)
- **TabBar** — Converted to fixed position + role filtering
- **AppShell** — Now accepts `role` prop and passes it to TabBar

### Next steps
Ready to start replacing filler curriculum with real Ugandan P4–P7 content.
