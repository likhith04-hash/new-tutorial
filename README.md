# Nourish AI

An AI-ready nutrition tracking platform built with Next.js. The included dashboard is an interactive product prototype with food logging and hydration tracking; the Prisma schema establishes a normalized, scalable data core.

## Run locally

```bash
npm.cmd install
npm.cmd run dev
```

Open `http://localhost:3000`.

## Architecture

- **Web:** Next.js App Router + TypeScript. Keep interactive widgets as client components and load user data in server components.
- **API:** Add authenticated route handlers under `app/api/v1`. Validate input with Zod and authorize every handler, not solely middleware.
- **Data:** PostgreSQL + Prisma. Food is canonical; immutable `MealEntry` macro snapshots preserve historical accuracy when food records change.
- **Scale:** Use Redis for food-search and provider-response caching; emit meal/water events to a queue for report aggregation and notifications.

## Environment

Create `.env` with `DATABASE_URL`, auth provider keys, `OPENAI_API_KEY`, `USDA_API_KEY`, `EDAMAM_APP_ID`, `EDAMAM_APP_KEY`, `OPENWEATHER_API_KEY`, Redis URL, and object-storage credentials. Do not expose provider secrets to the browser.

## Data model

`User → Profile`, `User → Meal → MealEntry → Food`, plus time-series `WaterIntake`, `WeightEntry`, and date-effective `Goal` records. These relationships are indexed for per-user chronological queries; migrations should add daily aggregate/materialized views for analytics at high volume.
