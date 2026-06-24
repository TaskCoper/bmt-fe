# BMT AI Construction — Frontend

A production-ready, enterprise-grade frontend foundation for a construction
intelligence SaaS. Built with the shadcn/ui ecosystem and a feature-based
architecture designed so new shadcn components, Blocks, Registry items, and
Studio layouts drop in without refactoring.

> The backend is fully separate. This app communicates **only** through the
> external .NET REST API.

## Tech stack

| Concern         | Choice                                                   |
| --------------- | -------------------------------------------------------- |
| Framework       | Next.js 15 (App Router) · React 19 · TypeScript (strict) |
| Styling         | Tailwind CSS v4 · shadcn/ui · Radix UI · CVA · tw-animate-css |
| Icons           | lucide-react                                             |
| Server state    | TanStack Query                                           |
| Client state    | Zustand (feature-scoped)                                 |
| Forms           | React Hook Form + Zod                                    |
| Networking      | Axios (single shared instance + interceptors)            |
| i18n            | next-intl (`vi` default, `en` fallback)                  |
| Notifications   | Sonner                                                   |
| Theme           | next-themes (light / dark / system)                      |

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in NEXT_PUBLIC_API_BASE_URL
pnpm dev
```

Scripts: `dev`, `build`, `start`, `lint`, `typecheck`, `format`.

## Project structure

```
src/
  app/
    [locale]/              # all routes are locale-prefixed (/vi, /en)
      (landing)/           # public marketing route group
      (auth)/              # guest-only route group (login, …)
      (dashboard)/         # protected route group (nested shell)
      layout.tsx           # root layout: <html>, fonts, providers, i18n
      error.tsx loading.tsx not-found.tsx
  features/                # feature-based architecture (see below)
    landing/ auth/ dashboard/ project/ estimate/ library/ chatbot/ cms/
    profile/ settings/
  shared/
    components/ui/         # shadcn/ui primitives (CLI target)
    components/common/     # composed app-level components
    hooks/ providers/ layouts/ config/ lib/ constants/ types/ utils/ auth/
  i18n/                    # next-intl routing, navigation, request config
  middleware.ts            # locale routing + auth route guards
messages/                  # vi.json, en.json (no hardcoded UI text)
```

See [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) for naming conventions,
coding standards, and the rules that keep this codebase scalable.

## Design system

Semantic design tokens live in `src/app/globals.css` as CSS variables
(OKLCH colors) and are exposed to Tailwind via `@theme inline`:

- **Colors** — `background`, `foreground`, `primary`, `secondary`, `accent`,
  `muted`, `border`, plus status roles `success`, `warning`, `destructive`.
- **Radius** — `sm` / `md` / `lg` / `xl`
- **Spacing** — `xs` / `sm` / `md` / `lg` / `xl` / `2xl`
- **Typography** — `text-display` / `text-heading` / `text-title` /
  `text-body` / `text-caption`
- **Shadow** — `sm` / `md` / `lg` / `xl`
- **Animation** — `duration-fast` / `normal` / `slow`

All three themes (light, dark, system) are supported out of the box.

## Adding shadcn components

```bash
pnpm dlx shadcn@latest add <component>
```

Components are configured (via `components.json`) to install into
`src/shared/components/ui`. After adding, re-export from
`src/shared/components/ui/index.ts`. Always **extend** shadcn primitives
(new CVA variants) rather than replacing them.
