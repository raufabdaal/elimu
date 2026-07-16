# ELIMU Design System

## Status
**Reconstructed from exported HTML files + critique notes.**
The manifest referenced `css/app.css` and `js/app.js`, but those files were not included in the upload. Tokens below were reverse-engineered from the inline classes/styles in the HTML screens and the critique notes (Newsreader display, DM Sans UI, IBM Plex Mono numerics, premium green paper + dot grid).

## Color tokens
| Token | Hex | Usage |
|-------|-----|-------|
| `--color-bg` | `#E7EFEC` | Page background wash |
| `--color-surface` | `#FAFBFA` | Cards, sheets, modals |
| `--color-surface-elevated` | `#FFFFFF` | Elevated cards on hover/focus |
| `--color-text-primary` | `#0F1A17` | Headlines, primary text |
| `--color-text-secondary` | `#5A6B66` | Body copy, descriptions |
| `--color-text-muted` | `#8A9A95` | Placeholders, captions |
| `--color-accent` | `#0D7A54` | Primary actions, links, badges |
| `--color-accent-hover` | `#096145` | Accent hover |
| `--color-accent-subtle` | `#D6E8E2` | Accent backgrounds, highlights |
| `--color-success` | `#2AA876` | Correct answers, gains |
| `--color-error` | `#E04F4F` | Wrong answers, lost hearts |
| `--color-warning` | `#F2B53D` | Streaks, energy warnings |
| `--color-border` | `#DCE7E3` | Dividers, card borders |

## Typography
- **Display serif**: "Playfair Display" or similar high-contrast serif for H1/H2.
- **Body sans**: "Inter", "SF Pro Text", or system-ui for body and UI.
- **Scale (mobile-first, fluid)**:
  - H1: `clamp(2.25rem, 6vw, 4rem)` / 1.1 line-height / 700 weight
  - H2: `clamp(1.5rem, 4vw, 2.5rem)` / 1.2 / 600
  - H3: `clamp(1.125rem, 3vw, 1.5rem)` / 1.3 / 600
  - Body: `clamp(0.9375rem, 2.2vw, 1.0625rem)` / 1.6 / 400
  - Caption/Label: `0.75rem` / 1.4 / 600 / uppercase / tracking-wide

## Spacing tokens
| Token | Value |
|-------|-------|
| `--space-1` | 0.25rem (4px) |
| `--space-2` | 0.5rem (8px) |
| `--space-3` | 0.75rem (12px) |
| `--space-4` | 1rem (16px) |
| `--space-5` | 1.25rem (20px) |
| `--space-6` | 1.5rem (24px) |
| `--space-8` | 2rem (32px) |
| `--space-10` | 2.5rem (40px) |
| `--space-12` | 3rem (48px) |

## Border radius
| Token | Value |
|-------|-------|
| `--radius-sm` | 0.5rem (8px) |
| `--radius-md` | 1rem (16px) |
| `--radius-lg` | 1.5rem (24px) |
| `--radius-xl` | 2rem (32px) |
| `--radius-full` | 9999px |

## Shadows
- `--shadow-sm`: `0 1px 2px rgba(15, 26, 23, 0.04)`
- `--shadow-md`: `0 4px 12px rgba(15, 26, 23, 0.08)`
- `--shadow-lg`: `0 12px 32px rgba(15, 26, 23, 0.12)`

## Motion
- `--duration-fast`: 150ms
- `--duration-base`: 250ms
- `--duration-slow`: 400ms
- `--ease-out`: `cubic-bezier(0.16, 1, 0.3, 1)`
- `--ease-spring`: `cubic-bezier(0.34, 1.56, 0.64, 1)`

## Components
### Overview card (from image)
- White surface, rounded-xl, subtle border.
- Numbered green label top-left (`01`, `02`, …).
- Serif title.
- Muted sans description.
- Green “Open →” text link bottom-left.
- Hover: subtle lift + shadow increase.

### Quiz card (to be built)
- Full-width or near-full-width card.
- Progress bar at top.
- Question text in serif/bold.
- Answer options as large tappable rows.
- Feedback sheet slides up from bottom after answer.
- Celebration overlay for streaks/perfect answers.

### Gamification atoms
- **Hearts**: filled/outline heart icons, 5 max, refill timer or practice-to-earn.
- **Energy bar**: segmented horizontal bar.
- **Streak flame**: flame icon + day count.
- **Encouragement toast**: short message + small animation (bounce star, confetti burst).

## Responsive contract
Validate across: 360×800, 390×844, 430×932, 600×960, 820×1180, 1024×768, 1366×768, 1440×900, 1920×1080.

## Notes for future agents
- The exported `css/app.css` may override exact hex values. When uploaded, replace inferred tokens with the canonical CSS custom properties found there.
- Keep this file synchronized with any code changes.
