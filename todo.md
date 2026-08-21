# Nourish — Project TODO

## Phase 1: Database Schema & Core Infrastructure
- [x] Design and implement database schema (profiles, goals, foods, foodLogs, weightEntries, chatHistory)
- [x] Set up database connection and migrations (MySQL + Drizzle)
- [x] Create database query helpers in server/db.ts
- [x] Seed sample food database (25+ foods)
- [ ] Set up tRPC procedures for core operations (chat.send needs Claude API integration)

## Phase 2: Authentication & Onboarding
- [x] Implement Manus OAuth login page
- [x] Build onboarding flow: collect age, weight, height, activity level, goal type
- [x] Calculate and set initial daily calorie/macro/hydration targets
- [ ] Add name field to onboarding (currently skipped)
- [ ] Allow users to override calculated targets before saving
- [x] Store onboarding data in database

## Phase 3: Dashboard
- [x] Display user greeting with name and current date
- [x] Build daily calorie target card with progress bar (consumed / target)
- [x] Build macro breakdown section (protein, carbs, fat) with progress bars
- [x] Build hydration tracker with +1 glass button
- [x] Display today's meals list with calories and protein
- [x] Build "Log food" button
- [ ] Create AI Insight card with data-derived insights (not static placeholders)
- [x] Build weekly calorie chart (last 7 days) with Recharts - bar chart
- [ ] Build weekly macro chart (last 7 days) with Recharts - line chart
- [x] Verify all values are bound to real data
- [ ] Test at mobile, tablet, and desktop widths

## Phase 4: Food Logging Flow
- [x] Create food database with 25+ sample foods
- [x] Build search UI with autocomplete
- [x] Implement quick-repeat feature for previously logged meals
- [x] Build manual entry option (name + calories + macros)
- [x] Add portion/serving size adjustment UI
- [x] Ensure entries immediately reflect in Dashboard and Food Diary (no page reload)
- [ ] Build mock photo estimation feature (canned/mock results)
- [x] Test end-to-end food logging flow

## Phase 5: Food Diary
- [x] Build date picker for viewing past days
- [x] Display meals grouped by meal type (breakfast, lunch, dinner, snacks)
- [x] Show daily totals (calories, protein, carbs, fat) at top
- [x] Add edit/delete actions for logged meals
- [ ] Verify data binding with real logged meals

## Phase 6: Goals Page
- [x] Build form to set/edit calorie target
- [x] Build form to set/edit macro targets (protein, carbs, fat)
- [x] Build form to set/edit hydration goal
- [x] Build form to set/edit weight goal
- [x] Add goal type selector (Lose / Maintain / Gain)
- [x] Ensure all units are correctly labeled (kcal, grams, ml)
- [ ] Test at multiple screen widths

## Phase 7: AI Coach Chat
- [x] Build chat interface UI with message history
- [x] Implement Claude API integration
- [x] Create data context: pass user's remaining calories/macros, recent meals, goals, trends
- [x] Build suggested prompts on chat load
- [x] Ensure responses are grounded in real user data (not generic advice)
- [x] Persist chat history to database
- [ ] Test with various user data scenarios (pending Anthropic credits)

## Phase 8: Progress Page
- [x] Build weight trend chart over time
- [x] Build weekly calorie trend chart
- [x] Build weekly macro trend chart
- [x] Implement streak tracking (e.g., 7-day logging streak)
- [x] Create achievement badges (Hydration Hero, Protein Power, etc.)
- [ ] Ensure badges are based on real logged data with locked/greyed states
- [ ] Test data binding and calculations

## Phase 9: Settings Page
- [x] Build profile info display (name, email)
- [x] Add unit preference selector (metric/imperial)
- [x] Display plan/account info (Free plan)
- [x] Add logout button

## Phase 10: Visual Polish & Testing
- [ ] Verify no absolute positioning overlap bugs
- [ ] Confirm all charts have real data (no empty shells)
- [ ] Test responsive layout at mobile, tablet, desktop
- [ ] Verify sufficient color contrast and focus states
- [ ] Check all units are correctly displayed throughout app
- [ ] Verify no placeholder data in production-facing views
- [x] Implement food logging modal/page
- [x] Add Claude API integration for AI Coach
- [x] Add name field to onboarding
- [ ] Add target override capability in onboarding
- [x] Persist hydration data to database
- [ ] Join food logs with food names
- [ ] Build real date picker for Food Diary
- [ ] Implement badge calculations from real data
- [x] Add quick-repeat feature for recently logged foods
- [ ] Refresh Food Diary data after logging
- [ ] Make food logging available from Food Diary page
- [ ] Run end-to-end validation for food logging flow
- [ ] Expand AI Coach prompt with recent meals and trends

## Phase 11: Deployment
- [ ] Deploy to Vercel
- [ ] Verify all features work end-to-end in production
- [ ] Test authentication flow
- [ ] Confirm database connections work
- [ ] Test Claude API integration

## Known Issues to Avoid (from previous build)
- [ ] Unit labeling: ensure calories show "1187 kcal" not "1187g kcal"
- [ ] Absolute positioning: reserve space in parent containers for floating elements
- [ ] Placeholder data: all dashboard values bound to real data, not zeros
- [ ] Empty charts: verify all charts have real data flowing in
- [ ] Generic AI insights: compute from real logged data, not static templates
