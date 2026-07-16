# ELIMU Content Strategy (Real Uganda Curriculum)

## Goal
Replace all demo/filler content with **authentic P4–P7 Uganda curriculum questions** sourced from:
- Past PLE papers
- District mock exams
- School tests & revision books
- Official UNEB materials
- Public educational PDFs and sites

## Core Principles

### 1. Question Volume Management
- **No endless sessions** — Each topic is broken into **short, completable sessions**.
- Recommended: **6–10 questions per session**.
- After finishing a session, the learner gets:
  - Summary (score, XP, accuracy)
  - Option to "Practice again" or "Next session"

### 2. Content Structure
We will organize content as:

```
Class (P4 / P5 / P6 / P7)
  └── Subject (Mathematics, Social Studies, Science, English, Religious Education)
        └── Topic (e.g., "Fractions", "Our Country Uganda")
              └── Sessions (Session 1, Session 2, Session 3...)
                    └── Questions (6–10 per session)
```

### 3. Question Types We Must Support
- Multiple Choice (objective)
- True/False
- Fill-in-the-blank / Short answer
- Ordering / Sequencing
- Matching
- Multi-select
- **Diagram / Image labeling** (future)
- **Name the part** (future)

### 4. Screening Rules
- Remove exact duplicate questions
- Keep **trick questions** with similar answers (they are valuable)
- Prioritize **Uganda-specific context** (chapati, matooke, Kampala, Lake Victoria, etc.)
- Maintain age-appropriate language

### 5. Spaced Repetition (Future)
We will implement Duolingo-style spaced repetition:
- Track accuracy per question
- Schedule weak questions for review
- Use `topicProgress` + new `reviewQueue` in store

---

## Current Status
- Demo content exists in `src/lib/data.ts`
- We are ready to start replacing it

## Next Steps (Proposed)
1. Decide starting class (recommend **P5** or **P7**)
2. Choose starting subject (recommend **Mathematics**)
3. Define session size (6–8 questions)
4. Start sourcing real questions (agent + user collaboration)
5. Build a content ingestion format

---

**Rule Reminder**: Every file change must be explicitly listed for the user to overwrite locally.
