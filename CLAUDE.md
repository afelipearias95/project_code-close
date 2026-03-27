# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # Start dev server (port 8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run lint         # ESLint
npm run test         # Run unit tests (Vitest, single run)
npm run test:watch   # Run unit tests in watch mode
npx playwright test  # Run E2E tests
```

## Architecture

This is a client-side SPA (no backend, no database) built with React 18 + TypeScript + Vite. All data lives in browser memory per session.

**Core data flow:**
1. User uploads CSV/XLSX campaign data (via `XLSX` library) or loads generated demo data (`src/lib/sampleData.ts`)
2. `src/lib/dataProcessing.ts` filters records and computes KPIs (open rate, click rate, purchase rate, etc.)
3. The main dashboard (`src/pages/Index.tsx`) holds all state and passes computed data to display components
4. User can trigger Claude AI analysis — the browser calls `https://api.anthropic.com/v1/messages` directly with a user-supplied API key (never stored server-side)

**Claude integration:**
- Model: `claude-sonnet-4-20250514`, max 2000 tokens
- API key is entered by the user in the UI; stored only in component state
- Responses are strongly typed via `AIAnalysisResult` in `src/types/dashboard.ts`
- Output includes: audience segmentation, optimized subject lines, A/B test variants, quality scores, insights

**Key types** (`src/types/dashboard.ts`):
- `CampaignRecord` — one row of campaign data (email, delivery/engagement metrics, demographics, channel)
- `KPIData` — computed metrics passed to chart/card components
- `AIAnalysisResult` — parsed Claude API response shape

**Component organization:**
- `src/components/dashboard/` — 8 feature components (FilterBar, KPICards, ChartsRow, AIAnalysisCard, ABTestCard, SegmentationResults, NavBar, Footer)
- `src/components/ui/` — shadcn/ui primitives (do not edit directly)
- `src/pages/Index.tsx` — orchestrator; owns filter state, processed data, and Claude response state

**UI language:** All user-facing text and Claude prompts are in Spanish.

**Styling:** Tailwind CSS with CSS variables for theming (see `tailwind.config.ts`). Dark mode is class-based.

**Built with Lovable** — the `lovable-tagger` Vite plugin annotates components for the Lovable visual editor. Do not remove it.
