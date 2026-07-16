# ELIMU Deployment Guide

## Target platform
Vercel, deployed from a GitHub repository managed with GitHub Desktop. We will use Next.js static export (`output: 'export'`) so Vercel hosts pre-rendered HTML.

## Why Vercel for this project
- First-class Next.js support.
- Automatic deploys on every push.
- Clean preview URLs for branches.
- Handles static export routing without extra `vercel.json` rewrites in most cases.

## Step-by-step setup

### 1. Initialize local Git repo
1. Open GitHub Desktop.
2. File → Add local repository → Choose `/home/user/elimu`.
3. If it is not a repo yet, click “create a repository”.
4. Repository name: `elimu-uganda-primary`.
5. Default branch: `main`.

### 2. Required repo files (Next.js)
Make sure the repository root contains at least:
```
elimu/
├── next.config.js
├── package.json
├── tailwind.config.ts
├── tsconfig.json
├── public/
└── src/
    ├── app/
    │   ├── layout.tsx
    │   ├── page.tsx
    │   ├── globals.css
    │   ├── onboarding/page.tsx
    │   ├── home/page.tsx
    │   ├── subjects/page.tsx
    │   ├── module/page.tsx
    │   ├── practice/page.tsx
    │   └── parent/page.tsx
    ├── components/
    ├── lib/
    └── hooks/
```

### 3. `next.config.js` (prevents export issues)
```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  distDir: 'dist',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
};

module.exports = nextConfig;
```
`trailingSlash: true` makes every route a folder with an `index.html`, which plays nicely with static hosts.

### 4. `package.json`
```json
{
  "name": "elimu-uganda-primary",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  },
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "react-dom": "^18.3.0",
    "framer-motion": "^11.0.0",
    "lucide-react": "^0.400.0"
  },
  "devDependencies": {
    "@types/node": "^20.0.0",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.5.0"
  }
}
```

### 5. Install dependencies
In the project root run:
```bash
npm install
```

### 6. Push to GitHub
1. In GitHub Desktop, write a summary like “Initial ELIMU Next.js scaffold”.
2. Commit to `main`.
3. Publish repository to GitHub (private recommended while in development).

### 7. Connect Vercel
1. Go to [vercel.com](https://vercel.com) and sign in with the same GitHub account.
2. Click “Add New Project”.
3. Import `elimu-uganda-primary`.
4. Framework Preset: **Next.js**.
5. Root Directory: `./`.
6. Build Command: `npm run build`.
7. Output Directory: `dist`.
8. Click Deploy.

### 8. Verify
- Visit the deployed URL.
- Click each route: `/`, `/onboarding/`, `/home/`, `/subjects/`, `/module/`, `/practice/`, `/parent/`.
- Confirm no 404s.
- Confirm styles and animations load.

### 9. Environment variables (for later backend phase)
When we add a real backend, add these in Vercel dashboard → Project Settings → Environment Variables:
```
NEXT_PUBLIC_API_BASE_URL=https://api.elimu.example.com
NEXT_PUBLIC_APP_NAME=ELIMU
```
For the static 20% prototype, no environment variables are required.

## Common 404 / deploy causes and fixes
| Cause | Fix |
|-------|-----|
| Visiting `/home/` gives 404 | Ensure `output: 'export'` and `trailingSlash: true` |
| Client-side navigation broken on static export | Use Next.js `<Link>`; avoid `useSearchParams` without suspense boundary |
| `Image` component fails | Set `images.unoptimized: true` |
| Tailwind not applied | Confirm `globals.css` imports tailwind directives and `tailwind.config.ts` covers `src/**/*` |

## Branch workflow
- `main` — production.
- `feature/screen-name` — new screens.
- Each push to a branch creates a Vercel preview URL automatically.

## Domain (future)
Once ready, add a custom domain in Vercel Project Settings → Domains.
