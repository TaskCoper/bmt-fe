# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Frontend-only Next.js 16 (App Router) / React 19 / TypeScript app for a construction-intelligence SaaS. There is **no backend in this repo** — the app talks **only** to an external .NET REST API via a single Axios instance. Package manager is **pnpm**.

## Commands

```bash
pnpm dev            # start dev server (localhost:3000)
pnpm build          # production build
pnpm lint           # eslint . — enforces import/architecture rules (see below)
pnpm typecheck      # tsc --noEmit (strict: noUncheckedIndexedAccess, no unused locals)
pnpm format         # prettier --write src
pnpm format:check   # prettier --check src
```

Quality gate to run before considering work done (CI mirrors this):

```bash
pnpm typecheck && pnpm lint && pnpm format:check
```

There is no test runner configured yet. `services/` (pure domain logic) is the intended unit-test target if one is added.

## Running without the backend

Copy `.env.example` → `.env.local`. Env vars are **validated by Zod at module load** (`src/shared/config/env.ts`) and the app throws on startup if they're invalid. Two dev-only flags swap real API calls for in-browser mocks:

- `NEXT_PUBLIC_USE_MOCK_AUTH=true` — login/roles work with no API. Email containing `admin` → admin role. (`features/auth/api/auth.mock.ts`)
- `NEXT_PUBLIC_USE_MOCK_API=true` — feature pages render sample data with no API.

Feature API modules select the mock vs. real implementation at import time based on these flags (see `auth.api.ts` for the pattern).

## Architecture — the rules that matter

Three layers with a strict one-directional dependency rule (**enforced by ESLint `no-restricted-imports`**):

```
app/ (routes)  →  features/ (business)  →  shared/ (reusable infra & UI)
```

- A layer may only import the layers to its right.
- **No cross-feature imports.** `features/a` must never import from `features/b`. Shared logic is lifted into `shared/`.
- **Import only through barrels** (`index.ts`). `import { LoginForm } from '@/features/auth'` ✅ — never reach into `@/features/auth/components/login-form` ❌. Path alias is `@/*` → `src/*`.

**Feature anatomy** (`features/project` is the canonical template): each feature is a vertical slice with `api/` (`*.api.ts` thin fns + `*.keys.ts` query-key factory), `components/`, `hooks/` (TanStack Query + custom), `schemas/` (Zod), `services/` (pure, no React/HTTP), `store/` (feature-scoped Zustand), `types/`, `constants/`, and a single `index.ts` public surface.

**State**: server state → TanStack Query (each feature owns a hierarchical key factory for safe invalidation); client/UI state → feature-scoped Zustand. The only cross-cutting store is auth (`shared/auth`).

**Data/auth flow**: one Axios instance in `shared/lib/api` (`httpClient` + typed `http` helpers). Auth is **cookie-based (httpOnly), set by the backend** — no token is stored client-side. The auth store (`shared/auth/auth.store.ts`) persists only the non-sensitive user profile. The response interceptor does a **single-flight refresh-token retry on 401**; on refresh failure it clears client auth via the `auth-bridge` (which decouples the HTTP layer from the store). Errors are normalized to `ApiError`.

**Routing & auth gate**: `src/proxy.ts` is the Next.js 16 proxy (the renamed `middleware` convention). It runs next-intl locale routing **and** the primary auth route guard — it redirects based on the presence of the backend-set auth cookie (`PROTECTED_ROUTE_PREFIXES` / `GUEST_ONLY_ROUTES` in `shared/constants/routes.ts`), with no token verification. The client guards in `shared/auth` (`ProtectedRoute`/`GuestRoute`/`RoleGuard`, roles `guest`/`user`/`admin`) handle client navigations and are **UX only** — real authorization is always enforced by the backend.

## Conventions

- **Never hardcode UI text.** All strings live in `messages/vi.json` + `messages/en.json` — add to **both**. i18n is next-intl, locales `vi` (default) / `en`, routes are locale-prefixed (`/vi`, `/en`) via `src/proxy.ts`. Use the locale-aware `Link`/`useRouter` from `@/i18n/navigation`; server pages call `setRequestLocale(locale)`.
- **Forms**: React Hook Form + `zodResolver` + shadcn `Form`. Schemas are built by factories that take resolved localized messages (see `createLoginSchema`) so validation copy is never hardcoded.
- **Styling**: Tailwind v4 with semantic design tokens only (`bg-primary`, `text-muted-foreground`) — never raw hex. Tokens are OKLCH CSS variables in `src/app/globals.css` exposed via `@theme inline`. Every reusable variant uses CVA.
- **shadcn/ui**: `pnpm dlx shadcn@latest add <component>` installs into `src/shared/components/ui` (configured in `components.json`, style "new-york"). Re-export from the `ui/index.ts` barrel afterward. **Extend** primitives with new CVA variants — never replace or hand-roll a primitive shadcn already provides.

## Naming

Files: components/hooks kebab-case (`login-form.tsx`, `use-projects.ts`); stores `*.store.ts`; api/keys `*.api.ts`/`*.keys.ts`; schemas `*.schema.ts`. Components PascalCase, hooks `useX`, Zustand stores `useXStore`, query-key factories `xKeys`, constants UPPER_SNAKE_CASE, translation keys `namespace.dot.case`.

See `docs/ARCHITECTURE.md` for the full contract and `README.md` for the design-system token reference.
