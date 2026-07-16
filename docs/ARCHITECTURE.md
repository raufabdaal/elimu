# ELIMU Architecture

## Decision log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-16 | Start with static HTML/CSS/JS prototype | Fastest path to a clickable, deployable Vercel app with filler content. Backend added later. |
| 2026-07-16 | Use localStorage for mock persistence | Lets learners/parents see progress, streaks, and linked accounts without a backend in the 20% phase. |
| 2026-07-16 | Multi-file HTML screens | Matches exported handoff (`index.html`, `home.html`, `module.html`, `onboarding.html`, `parent.html`, `practice.html`, `subjects.html`). |

## Tech stack (current)
- **Framework**: Next.js 14+ (App Router) with static export.
- **Language**: TypeScript.
- **Styling**: Tailwind CSS + CSS custom properties for design tokens.
- **State**: `localStorage` on client + React context for session state.
- **Icons**: Inline SVG or Lucide React (tree-shaken).
- **Animations**: Framer Motion for page transitions, gamification micro-interactions, and progress animations; CSS for simple hover/focus states.
- **Deployment**: Vercel via GitHub Desktop → GitHub → Vercel.

## Why Next.js for the 20% prototype
- Chosen by the user for scalability.
- Static export (`output: 'export'`) keeps Vercel hosting simple while allowing future API routes.
- File-based routing maps naturally to the exported screen list.
- Framer Motion gives Duolingo-level animation quality without heavy custom code.

## Folder structure (Next.js App Router)
```
elimu/
├── docs/                       # Living documentation
│   ├── PROJECT-BRIEF.md
│   ├── DESIGN-SYSTEM.md
│   ├── ARCHITECTURE.md
│   ├── ROADMAP.md
│   ├── HANDOFF.md
│   ├── CHANGELOG.md
│   └── DEPLOYMENT.md
├── public/                     # Static assets (favicon, og-image, exported images)
├── src/
│   ├── app/
│   │   ├── page.tsx            # Launcher / overview / entry (matches index.html)
│   │   ├── layout.tsx          # Root layout, fonts, providers
│   │   ├── globals.css         # Tailwind + design tokens
│   │   ├── onboarding/
│   │   │   └── page.tsx        # Pick class / role
│   │   ├── home/
│   │   │   └── page.tsx        # Learner home
│   │   ├── subjects/
│   │   │   └── page.tsx        # Subject list
│   │   ├── module/
│   │   │   └── page.tsx        # Learning module
│   │   ├── practice/
│   │   │   └── page.tsx        # Mixed practice quiz
│   │   └── parent/
│   │       └── page.tsx        # Parent dashboard
│   ├── components/             # Reusable React components
│   │   ├── ui/                 # Buttons, cards, inputs, icons
│   │   ├── quiz/               # Quiz card, options, feedback sheet
│   │   ├── gamification/       # Hearts, energy bar, streak, celebration
│   │   └── layout/             # Header, bottom nav, safe area
│   ├── lib/
│   │   ├── store.ts            # localStorage state manager
│   │   ├── data.ts             # Filler content
│   │   ├── quiz-engine.ts      # Quiz flow + scoring
│   │   ├── gamification.ts     # Encouragement + reward logic
│   │   └── parent-link.ts      # Parent-student linkage helpers
│   └── hooks/
│       ├── useLocalStorage.ts
│       └── useStudentProgress.ts
├── tailwind.config.ts
├── next.config.js              # output: 'export', distDir: 'dist'
├── tsconfig.json
├── package.json
└── vercel.json                 # Clean rewrites for static export
```

## State model (localStorage)
```json
{
  "profile": {
    "role": "learner|parent",
    "name": "Amina",
    "class": "P5",
    "linkedParentId": "parent_001",
    "linkedStudentId": "student_001"
  },
  "progress": {
    "hearts": 5,
    "streakDays": 4,
    "lastStudyDate": "2026-07-16",
    "energy": 100,
    "xp": 1240,
    "completedTopicIds": ["p5-math-fractions", "p5-sst-civics"]
  },
  "topicProgress": {
    "p5-math-fractions": {
      "accuracy": 0.82,
      "attempts": 12,
      "lastAttempt": "2026-07-16T10:30:00Z"
    }
  },
  "sessionStats": {
    "todayMinutes": 18,
    "weeklyMinutes": [20, 35, 15, 0, 18, 0, 0]
  }
}
```

## Data model (filler content)
```js
const curriculum = {
  class: "P5",
  subjects: [
    {
      id: "math",
      name: "Mathematics",
      icon: "🧮",
      color: "#0D7A54",
      topics: [
        {
          id: "p5-math-fractions",
          name: "Fractions",
          questions: [
            {
              id: "q1",
              type: "multiple_choice",
              question: "What is 1/2 + 1/4?",
              options: ["1/6", "2/6", "3/4", "1"],
              correct: 2,
              explanation: "Convert to quarters: 1/2 = 2/4. Then 2/4 + 1/4 = 3/4."
            }
          ]
        }
      ]
    }
  ]
};
```

## Routing (Next.js App Router)
Each exported screen becomes its own route. With `output: 'export'`, Next.js generates static HTML for each route.

| Route | File | Purpose |
|-------|------|---------|
| `/` | `src/app/page.tsx` | Launcher / marketing overview |
| `/onboarding` | `src/app/onboarding/page.tsx` | Pick class / role / parent code |
| `/home` | `src/app/home/page.tsx` | Learner home |
| `/subjects` | `src/app/subjects/page.tsx` | Subject list |
| `/module` | `src/app/module/page.tsx` | Learning module |
| `/practice` | `src/app/practice/page.tsx` | Mixed practice quiz |
| `/parent` | `src/app/parent/page.tsx` | Parent dashboard |

## Linkage model
- Each student gets a short 6-digit numeric `linkCode` (e.g., `739104`).
- Parent enters the code in onboarding or parent settings.
- Both accounts store each other’s IDs; parent reads student’s progress from shared localStorage keys.
- In a real backend, this becomes an authenticated pairing request.

## Performance notes
- Load only the JS needed per screen (code-split by HTML file).
- Prefer CSS animations for micro-interactions (hearts, bars) to avoid main-thread jank.
- Use `requestAnimationFrame` for confetti/celebration bursts.

## Accessibility
- All icons have aria-labels.
- Color is never the sole indicator of state.
- Focus rings visible on keyboard navigation.
- Reduced-motion media query respected.
