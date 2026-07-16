# Changelog

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
