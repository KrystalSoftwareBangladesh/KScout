# AGENTS.md

## Project Identity

- Canonical project name: `KScout`
- A previous repo/app name existed historically
- Purpose: a frontend tool that helps users discover places from the Google Places API based on a location, then identify potential clients for a user-provided niche
- Current owner context: user is working as the frontend expert

## Important Naming Note

An older project name may still appear in historical discussion, but active repo branding should use `KScout`.

Agents should treat `KScout` as the active product name unless the user asks to preserve or update the older branding.

## Current Stack

- Framework: Vue `3.4.38`
- Language: TypeScript
- Build tool: Vite `5`
- Router: Vue Router `4` with hash routing
- State management: Pinia `2.3.1`
- Styling: TailwindCSS `3.4.3` with PostCSS + Autoprefixer
- Global styling entrypoint: `src/assets/global.css`
- Tailwind config: `tailwind.config.js`
- Testing: Vitest is installed
- Backend plan from user context: FastAPI
- Database plan from user context: PostgreSQL

## Product Status

- Last completed area: dashboard design
- Not done yet: form validation
- Not done yet: API integration
- Known bugs from user context: none currently queued
- Today's broader goal from user context: design the remaining parts of the tool and integrate APIs
- Styling migration status: the previous component-scoped raw CSS has been replaced by a Tailwind-based styling layer

## Current Frontend Shape

Key source folders:

- `src/assets`
- `src/components/layout`
- `src/components/ui`
- `src/composables`
- `src/router`
- `src/stores`
- `src/views`

Current notable views/routes in the repo:

- `/#/` Dashboard
- `/#/search` Find Places
- `/#/results` Results table
- `/#/grid` Grid view
- `/#/raw` Raw data
- `/#/setup` Setup
- `/#/client-finder` Placeholder for the client-finding phase

## Engineering Rules

- Always use TypeScript
- Do not introduce `any`
- Prefer named exports
- Put API calls in `/lib/api.ts` only
- Prefer Tailwind utilities or Tailwind-based component layers over ad hoc scoped CSS

## Working Assumptions For Future Agents

- Do not assume the backend is finished
- Expect API integration work to be in progress or partially stubbed
- Preserve existing UI patterns unless the user asks for a redesign
- If historical references to an older project name appear again, treat them as legacy naming unless the user asks otherwise
- Use the Tailwind setup already in the repo instead of reintroducing new raw component-scoped styles unless there is a strong reason

## Local Development Notes

- Package manager: `pnpm`
- Common scripts:
  - `pnpm dev`
  - `pnpm build`
  - `pnpm test:unit`
  - `pnpm lint`
  - `pnpm format`

## Collaboration Notes

- Read this file before making project decisions
- When requirements conflict, follow the latest direct user instruction over this file
- If project context changes, update this file so future AI sessions inherit the latest state
