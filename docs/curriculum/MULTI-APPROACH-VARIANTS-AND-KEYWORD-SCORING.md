# Multi-Approach Phrasing Variants, Randomized Shuffling Engine & Non-AI Keyword Scoring Architecture

This document canonicalizes the three major architectural and pedagogical upgrades implemented across the **Elimu edtech platform** to enhance student familiarity, dynamic session variety, and intelligent written-answer scoring without relying on external AI APIs.

---

## 1. Multi-Approach Phrasing Variants (`variants.ts`)

### Why Phrasing Variants Matter
In standard UNEB PLE and NCDC primary examinations, students are rarely asked questions using only one rigid sentence structure. For example:
- **Approach 1 (Defining Variant)**: *"What is the definition of the Equator?"* -> Expected response: *"The 0 degree latitude line that divides the earth into Northern and Southern hemispheres."*
- **Approach 2 (Listing Variant)**: *"List any two districts in Uganda through which the imaginary line of the Equator passes."* -> Expected response: *"Mpigi and Kasese."*
- **Approach 3 (Identification Variant)**: *"Which landmark marks the exact point where the Equator crosses the Kampala-Masaka highway?"* -> Expected response: *"Kayabwe Equator Monument."*
- **Approach 4 (Reverse Application / Cause Variant)**: *"If a vessel travels upstream from the mouth of the River Nile all the way to Jinja, what specific geographical point of the river has the vessel reached?"* -> Expected response: *"The source."*

By embedding multi-approach structural variants (`Listing vs Defining`, `Direct Identification vs Reverse Deduction`, `Multi-Select Listing vs Short Answer Defining`, `Formula Application vs Word Problem Explanation`) across our 4 primary classes (`P7`, `P6`, `P5`, `P4`) and 4 core subjects (`Mathematics`, `Social Studies`, `Integrated Science`, `English Language`), pupils gain robust cognitive flexibility and familiarity with all possible phrasing angles of a concept.

### Embedded Variant Master Topics & Modules (`72 New Multi-Approach Questions`)
We have added 3 dedicated Cross-Curriculum Master Topics across 6 sequential Modules:
1. **`p7-sst-variants` (Multi-Approach Phrasing Variants: Listing vs Defining Drills - `sst` P7)** — 2 Modules (`24 progressive questions`) covering Equator geography (`Kayabwe, Mpigi, Kasese`), Population Density (`Wakiso, Mbale, Kabale`), Nationalism (`Musaazi, Obote, Kenyatta, Nyerere`), and River Nile hydrology (`Source vs Mouth, Nalubaale/Bujagali/Isimba dams`).
2. **`p7-sci-variants` (Multi-Approach Phrasing Variants: Structural & Application Drills - `sci` P7)** — 2 Modules (`24 progressive questions`) covering Photosynthesis (`Defining vs Listing the 4 factors: Sunlight, Carbon dioxide, Water, Chlorophyll`), Disease Vectors (`Anopheles, Housefly, Tsetse fly, Aedes and source reduction drainage`), Reflection of Light (`Law of reflection $i=r$, 4 plane mirror rules and lateral inversion of AMBULANCE`), and First Aid management (`15-minute cool running water burn protocol vs First Aid box items`).
3. **`p6-variants-mastery` (Multi-Approach Phrasing Variants: Cross-Subject Mastery Drills - `eng` P6)** — 2 Modules (`24 progressive questions`) covering Proper vs Improper Fractions and Mixed Numbers (`1 1/4`), Weather vs Climate (`30-35 year average vs Normal Lapse Rate on Mt. Rwenzori`), Balanced Diet & Deficiency Diseases (`Marasmus total starvation vs Kwashiorkor protein deficiency`), and English Conjunctions (`Both...and, Either...or, Neither...nor, and Unless sentence rephrasing`).

---

## 2. Randomized Shuffling Engine (`shuffleArray` in `src/lib/scoring.ts`)

### The Problem
Previously, whenever a learner launched a quick practice review session (`/practice`) or opened a subject module (`/module`), the question array was loaded statically in fixed index order (`q = questions[0]`). This caused students to encounter the exact same Question 1 (`e.g. P7 Math Sets Q1`) every time they opened the app.

### The Shuffling Solution
We created a clean, modern Fisher-Yates shuffle utility (`shuffleArray<T>`) inside `src/lib/scoring.ts` and integrated it directly into React state across both `/practice` and `/module`:
- **Initial Session Randomization**: When a user enters `/practice` or `/module`, `useState` and `useEffect` immediately pass the question pool through `shuffleArray(pool)`, starting the learner at a completely randomized point in the curriculum.
- **Manual Reshuffle Control (`🔀 Shuffle Button`)**: Both the Practice stage and Module stage feature a prominent **`🔀 Shuffle`** button next to the question progress counter (`e.g. 1/24`). Clicking it instantly reshuffles the remaining pool, giving students complete control over session freshness.
- **Post-Session Shuffled Restart**: When a practice session or module is completed (`finished === true`), clicking **`Practice Again (Shuffled) 🔀`** re-randomizes the question order and resets the index to 0 for a dynamic re-attempt.

---

## 3. Intelligent Non-AI Keyword Scoring Architecture (`checkAnswer` & `ShortAnswer.tsx`)

### Why Keyword Scoring is Essential for Written Answers
In open-ended short answer exercises (`ShortAnswerQuestion`), strict exact-string equality (`normalizeAnswer(value) === normalizeAnswer(answer)`) often unfairly penalizes a student who knows the correct concept but types a slightly different phrase or omits a common prefix. For example:
- If `question.answer` is `"Lake Victoria"`, a student typing `"Victoria"` or `"L. Victoria"` was marked $0\%$ correct.
- If `question.answer` is `"Germination"`, a student typing `"seed germination"` or `"sprouting or germination"` was marked wrong.
- If asked to list or define, written responses naturally vary in syntax.

### How Our Keyword & Substring Scoring Works (`src/lib/scoring.ts`)
Without needing expensive, latency-prone artificial intelligence APIs, we extended `ShortAnswerQuestion` and `BaseQuestion` (`src/lib/types.ts`) with an optional `keywords?: string[]` field, and enhanced `checkAnswer` with a three-tier scoring engine:
1. **Exact Normalized Match**: Checks `normalizeAnswer(userValue) === normalizeAnswer(question.answer)`. If true, returns `{ correct: true, partial: 1, keywordMatch: false }`.
2. **Explicit Keyword Matching**: If `question.keywords` (`string[]`) is explicitly provided on the question object (`e.g. ["0 degree", "equator", "divide"]`), `checkAnswer` checks whether the user's input string contains any strong keyword or matches the keyword terms. If matched, it returns `{ correct: true, partial: 1, keywordMatch: true, scoredKeywords: [...] }`.
3. **Automatic Derived Keyword Substring Matching**: If no explicit `keywords` array is present on older questions, `checkAnswer` intelligently derives core keywords from `question.answer` by stripping out stop words (`the`, `a`, `an`, `is`, `of`, `to`, `in`, `on`, `at`, `lake`, `river`, `mt`, `st`) and matching words of length $\ge 3$. If the user's input (`e.g. "victoria"`) matches the derived core word of `"Lake Victoria"`, or if direct mutual substring inclusion exists (`userClean.includes(ansClean) || ansClean.includes(userClean)`), it treats the answer as correct (`keywordMatch: true`).

### Rich Interactive Model Comparison Badge (`ShortAnswer.tsx`)
Whenever a student submits a written response and the input is locked (`disabled={locked}`), our updated `ShortAnswer` component surfaces a clean comparison card right below the input field:
- **Standard Model Answer**: Highlights the canonical expected string in bold emerald (`e.g. Lake Victoria`).
- **Scored Keywords**: Displays any explicit or derived keywords that evaluated the match (`e.g. Scored Keywords: victoria`).
- **Positive Keyword Feedback (`handleCheck`)**: If scored via `keywordMatch`, the tactile feedback sheet celebrates the student:
  `"✨ Keyword Match! Standard model answer: "Lake Victoria". You wrote: "Victoria". Explanation: ..."`

This guarantees fair, encouraging, and educationally transparent scoring across all 4,435+ questions on the platform!
