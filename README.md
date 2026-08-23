# Nourish AI

Nourish AI is a privacy-conscious nutrition companion built with Next.js. It includes a public landing experience, onboarding, a local-first nutrition dashboard, meal diary, goals, progress tracking, and OpenAI-backed coaching/structured meal analysis when configured.

## Run locally

```bash
npm.cmd install
npm.cmd run dev
```

Open `https://nourish-ai-six.vercel.app`.

## AI configuration

Copy `.env.example` to `.env.local` and set `OPENAI_API_KEY` on the server. The app deliberately shows an unavailable state when no key is configured; it does not impersonate AI with canned responses. `OPENAI_MODEL` is optional and defaults to `gpt-4o-mini`.

## Architecture

- **Web:** Next.js App Router + TypeScript. Current client state persists to browser storage for the local-first experience.
- **AI API:** `app/api/coach` supplies contextual nutrition coaching. `app/api/meal-analysis` returns validated structured estimates for natural-language meals. API keys are server-only.
- **Data:** PostgreSQL + Prisma schema is included for the production data model. Food is canonical; immutable `MealEntry` macro snapshots preserve historical accuracy when food records change.
- **Scale:** Use Redis for food-search and provider-response caching; emit meal/water events to a queue for report aggregation and notifications.

## Environment

Create `.env` with `DATABASE_URL`, auth provider keys, `OPENAI_API_KEY`, `USDA_API_KEY`, `EDAMAM_APP_ID`, `EDAMAM_APP_KEY`, `OPENWEATHER_API_KEY`, Redis URL, and object-storage credentials. Do not expose provider secrets to the browser.

## Data model

`User → Profile`, `User → Meal → MealEntry → Food`, plus time-series `WaterIntake`, `WeightEntry`, and date-effective `Goal` records. These relationships are indexed for per-user chronological queries; migrations should add daily aggregate/materialized views for analytics at high volume.
