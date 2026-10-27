# JurisJobs — Platformă de carieră juridică

Job board for the Romanian legal market. The in-app name comes from `name` in `src/config/app.settings.json` (**JurisJobs**). Built with **Next.js 16** (App Router; most routes render on demand, with a few prerendered pages such as the sitemap, robots file, and some public detail pages) and **Supabase** (Auth, PostgreSQL, Storage, Realtime, Edge Functions).

---

## Tech stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 · React 19 · TypeScript (strict) |
| UI | MUI v7 + Emotion (`sx` prop, `@emotion/styled`) |
| Global CSS | Tailwind CSS v4 |
| Forms | react-hook-form v7 + Zod + `@hookform/resolvers` |
| Rich text | TipTap |
| Auth & data | Supabase (`@supabase/supabase-js`, `@supabase/ssr`) |
| Email | Resend (Supabase **Edge Functions** — `send-email`, `notifications`, `job-application`, … — see **`AGENTS.md`**) |
| Charts | Recharts |
| Motion | Framer Motion |
| Markdown | react-markdown |
| Tests | Vitest + jsdom + Testing Library |
| Lint | ESLint 9 flat config · `eslint-config-next` (core-web-vitals + typescript) |

---

## Feature flags

**Static product gates** — `src/config/app.settings.json` → `features`. Checked in today: `forms`, `alerts`, `notifications`, `archiveJobs`, `edgeFunctions`, `blog`, and `matchmaking` are on (`matchmaking.minOverlap` is 2). `messages`, `smsNotifications`, and `allowEmailNotificationOptOut` are off. Use **`src/lib/feature-flags.ts`** (`isFeatureEnabled`, `assertFeatureEnabled`); middleware repeats the blog guard.

**Runtime experimentation** — Job and company **favourites** use the Flags SDK (`src/flags.ts`, `favouritesFlag`) with `FLAGS` / `FLAGS_SECRET` from Vercel. Without `FLAGS`, favourites stay off and `/dashboard/favourites` is not available.

The same JSON file holds the product name (`name`: JurisJobs) and market defaults (`config`: locale `ro`, currency `RON`, salary bounds). UI copy stays Romanian.

---

## Getting started

### Prerequisites

- Node.js 22.22.2 (use `nvm use`; see `.nvmrc`). Node 24.15+ and 26+ also satisfy the dependency engine ranges.
- npm
- Supabase project (cloud or local CLI)

### 1 — Install dependencies

```bash
git clone <repo-url>
cd jurisjobs
nvm install
nvm use
npm install
```

ESLint is pinned to v9 because the React, import, and accessibility plugins used
by the current Next.js lint preset declare peer ranges through ESLint 9. Keep
ESLint 9 until those plugins publish compatible peer ranges for a newer major.

### 2 — Configure environment variables

Use **layered env files** (all gitignored). Copy the three templates, fill in values, then compose:

```bash
cp .env.local.example .env.local
cp .env.test.example   .env.test
cp .env.prod.example   .env.prod
npm run env:sync    # writes .env for Next.js + scripts (branch-aware)
```

See [`docs/ENVIRONMENTS.md`](docs/ENVIRONMENTS.md) for the full checklist of what to fill in per file.

1. **`.env.local`** — `SUPABASE_ACCESS_TOKEN`, Development `FLAGS` / `FLAGS_SECRET` (via `npm run vercel:env`), `NEXT_PUBLIC_SITE_URL=http://localhost:3000`

2. **`.env.test`** — TEST Supabase URL, anon key, DB password, `NEXT_PUBLIC_TITLE_PREFIX=[TEST]`

3. **`.env.prod`** — PROD Supabase URL, anon key, DB password (no title prefix)

4. If the project is linked to Vercel (`npx vercel link`):

   ```bash
   npm run vercel:env
   ```

   Pulls Development-scoped flags into `.env.local`, then re-composes `.env`.

`dotenv` in **scripts** and **E2E** loads the composed **`.env`**.

> **Security note:** `SUPABASE_SERVICE_ROLE_KEY` is **not** used by the Next.js app. It lives exclusively in Supabase Edge Function secrets. Never add it to `.env` or Vercel environment variables for the web app.

### 3 — Apply database migrations

```bash
supabase db push
```

Or paste the files in `supabase/migrations/` into the Supabase Dashboard SQL Editor in chronological order.

After schema changes, refresh TypeScript + Zod mirrors (also runs on **`git pull`** / **`git commit`** via hooks unless `SKIP_CODEGEN=1`):

```bash
npm run codegen
```

Uses `supabase gen types --linked` when the directory is linked, or set **`SUPABASE_PROJECT_ID`** in `.env` (see `.env.example`). If remote generation skips, `database.ts` is left as-is and **supazod** still updates **`src/types/database.zod.ts`**.

### 4 — Start the dev server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Project structure

```
src/
├── app/
│   ├── (public)/             # Home, jobs, companies, profiles, blog, policy, brand, /anunt, /claim
│   ├── (auth)/               # login, register, verify-email, OAuth consent, auth callback
│   ├── dashboard/            # Session-protected shell (middleware)
│   ├── api/                  # apply-internal-form, OpenAPI docs
│   ├── newsletter/           # Newsletter server action
│   ├── layout.tsx            # Theme, Redux, toast, favourites, analytics, navbar, footer
│   ├── page.tsx              # Homepage
│   └── …                     # sitemap, robots, error boundaries
├── components/               # Feature UI — see src/AGENTS.md
├── hooks/
├── contexts/                 # ToastContext
├── lib/                      # Supabase factories, roles, SEO, feature flags, notifications
├── services/                 # *.service.ts — home for .from / .rpc / storage
├── store/                    # Redux Toolkit + RTK Query
├── theme/
├── types/                    # database.ts + generated database.zod.ts
├── config/
│   └── app.settings.json     # Name, locale, salary bounds, feature flags
├── AGENTS.md
└── PATTERNS.md

supabase/
├── migrations/
├── functions/                # 17 Edge Functions + _shared templates
└── openapi.json              # Served at /api/docs
```

**Implementor docs:** **`src/AGENTS.md`** (rules) · **`src/PATTERNS.md`** (examples + reference file paths per pattern).

---

## Database schema

Key tables (see Supabase Dashboard → Table Editor for the full schema):

| Table | Purpose |
|-------|---------|
| `profiles` | Account extending `auth.users`, including global `user_role` |
| `companies` / `company_users` | Company profile and membership (`owner`, `admin`, `member`) |
| `company_claim_tokens` / `company_claim_nudge_log` | Unclaimed-company claim codes and nudge history |
| `job_listings` / `job_benefits` | Postings, including full-text search |
| `applications` | Candidate applications and status |
| `forms` / `form_fields` / `form_responses` / `form_response_values` | Custom application forms and answers |
| `favorites` / `company_favourites` | Saved jobs and saved companies |
| `alerts` | Saved job searches |
| `notifications` / `push_subscriptions` | In-app feed and Web Push endpoints |
| `profile_experience` / `profile_education` / `profile_skills` / `skills` | CV sections and the shared skill catalog |
| `blog_posts` / `newsletter_subscribers` / `faq` | Blog, newsletter, and public FAQ |
| `matches` | Matchmaking overlaps between profiles and companies |
| `app_release_announcements` / `app_state` | Release notes and the last announced version |
| `conversations` / `messages` / `conversation_participants` | Messaging tables. The product flag `features.messages` is off and `/dashboard/messages` is a placeholder |

Generated mirrors: `src/types/database.ts` and `src/types/database.zod.ts`.

### RPC functions (SECURITY DEFINER)

| Function | Purpose |
|----------|---------|
| `application_notification_recipient(p_job_id)` | Poster contact for a job the caller applied to |
| `job_poster_recipient` | Poster contact used by notification functions |
| `is_company_member(p_company_id, p_min_role?)` | Company membership check used by RLS |
| `company_has_no_owner(p_company_id)` | Guard used while creating a company |
| `claim_company` / `verify_claim_code` / `issue_company_claim_token` | Unclaimed-company claim flow |
| `admin_list_users` / `admin_set_user_role` / `admin_set_skill_approval` | Admin user directory, role changes, and skill approval |
| `increment_company_visits` / `increment_company_engages` | Company page counters |
| `recompute_profile_completeness` | Profile completeness used by the nudge cron |

---

## Authentication

- **Email/password** — sign-up, login, and password recovery. Forgot-password lives at `/forgot-password`; the e-mail link returns through `/auth/callback` and lands on `/reset-password`, where the new password is saved. Confirmation and recovery links keep a safe in-app `redirect`. Login and registration send people back to that path, including company claim.
- **Passkeys (WebAuthn)** — hosted Auth has passkeys enabled. The login page offers “Conectează-te cu o cheie de acces” on browsers that support WebAuthn. Signed-in users with a confirmed email add, rename, and delete passkeys from **Dashboard → Profil**. The browser client opts in via `auth.experimental.passkey`. Local `supabase/config.toml` uses relying party id `localhost` only; the hosted relying party must stay the production domain (changing it invalidates existing passkeys, and localhost or a Vercel preview cannot share it).
- **Email verification** — users land on `/dashboard` immediately after registration; an `EmailVerificationBanner` (in the dashboard layout) prompts them to verify and offers a one-click resend via `useAuth().resendVerification()`.
- **Social OAuth** — `SocialButtons` component; callback at `/auth/callback`.
- **Middleware-enforced routes** — `/dashboard/*` requires a valid session; `/login` and `/register` redirect authenticated users to `/dashboard`.

---

## Email notifications

Transactional email is delivered through **[Resend](https://resend.com)** from **Supabase Edge Functions** (`supabase/functions/` — shared HTML in `_shared/templates/`). Callers use **`supabase.functions.invoke(...)`** with the **user JWT** (or cron secrets for scheduled jobs). **`SUPABASE_SERVICE_ROLE_KEY`** and **`RESEND_*`** live **only** in Supabase Edge secrets — never in the Next.js env.

**Examples:**

| Flow | Typical caller |
|------|----------------|
| Job application emails | `job-application` Edge Function after apply · `POST /api/jobs/apply-internal-form` may invoke it |
| Typed user notifications | `notifications` Edge Function — prefer **`dispatchNotification`** from `src/lib/notifications/dispatch.ts` |
| Profile / company transactional | `send-email` Edge Function (`profile_updated`, `company_created`, …) |

Privileged reads (e.g. resolving the poster's contact for mail) use **`SECURITY DEFINER`** RPCs such as **`application_notification_recipient`** — not a service-role client in Next.js.

Full inventory and payloads: **`AGENTS.md`** → *Transactional email* and *Edge Functions inventory*.

---

## Public job-posting wizard (`/anunt`)

A four-step client-side wizard at `/anunt` for new employers who don't yet have a dashboard account:

| Step | Content |
|------|---------|
| 1 — Anunț | Job details (title, description, type, salary, benefits, application method) |
| 2 — Companie | Company details + logo upload |
| 3 — Cont | Login / register (skipped if already authenticated) |
| 4 — Confirmare | Preview with inline edit jump-backs, then publish |

On publish: company → logo upload → job → benefits → email notification → redirect to the live job page. A full-screen loading overlay with rotating legal-humour messages plays during creation.

---

## UI notifications

Canonical rules live in **`AGENTS.md`** → *UI notification patterns*. Quick snippets: **`src/PATTERNS.md`** → *Ephemeral feedback — `useToast`*.

There are **two distinct notification mechanisms**. Use the right one for the job.

### 1 — `useToast` — ephemeral feedback toasts (always use this)

`ToastProvider` is mounted once in the root layout (`src/app/layout.tsx`). It renders a single global `<Snackbar>`. Any component or custom hook anywhere in the tree can trigger a toast without rendering its own `<Snackbar>`.

```tsx
import { useToast } from "@/contexts/ToastContext";

export function MyComponent() {
  const { showToast } = useToast();

  const handleSave = async () => {
    await save();
    showToast("Salvat cu succes.");                    // success, 3500 ms
    showToast("Anunț arhivat.", "info");               // info, 3500 ms
    showToast("A apărut o eroare.", "error", 5000);    // error, 5 s
  };
}
```

**Signature:** `showToast(message: string, severity?: "success" | "error" | "warning" | "info", duration?: number)`

**Rules:**
- Default severity is `"success"`, default duration is `3500 ms`.
- Use `"info"` for neutral state-change feedback (archive, favourite toggle, filter applied).
- Use `"error"` with a longer duration (5000 ms) so the user has time to read it.
- Do **not** create component-local `useState` + `<Snackbar>` for transient feedback. The `EditSideDrawer` `message` prop is still valid for persistent in-drawer errors (e.g. validation failures that must stay visible while the form is open).

### 2 — `useNotifications` — persisted DB notification feed

`useNotifications` reads and subscribes to the `notifications` table in real time. It powers `JJNotificationBell` in the dashboard navbar. It is **not** for transient UI feedback.

```tsx
import { useNotifications } from "@/hooks/useNotifications";

const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
```

Only use this hook inside `JJNotificationBell` or a dedicated notification-feed component.

### What was removed

`src/hooks/useNotification.ts` (singular) was a local-state alternative to `useToast` that was created during the initial cleanup pass but was never wired to any component. It has been **deleted** to eliminate the ambiguity. `useToast` is the single source of truth for ephemeral UI feedback.

---

## UI conventions

### Dashboard — side drawer pattern

Several dashboard create/edit flows use `EditSideDrawer` (`src/components/layout/EditSideDrawer.tsx`). Company, job, profile, and application-form editing follow that pattern. `/dashboard/jobs/new` and `/dashboard/jobs/[id]/edit` only redirect to `/dashboard/jobs`.

These flows are full pages instead of a drawer: `/dashboard/alerts/new`, `/dashboard/blog/new`, `/dashboard/blog/[id]/edit`, and `/dashboard/admin/unclaimed/new`.

```tsx
import { EditSideDrawer } from "@/components/layout/EditSideDrawer";

<EditSideDrawer
  open={drawerOpen}
  onClose={closeDrawer}
  title="Editează compania"
  message={message}
  onMessageClose={() => setMessage(null)}
>
  <AddEditCompany ... />
</EditSideDrawer>
```

Used in: `dashboard/company`, `dashboard/jobs`, `dashboard/profile`, `dashboard/forms`.

### Wizard / public forms — full-page steps

The `/anunt` wizard and any future public multi-step flows use a full-page `Stepper` (MUI) + `Paper` card layout, not the side drawer.

---

## Accessibility

All pages and components target **WCAG 2.2 Level AAA**. See `AGENTS.md` for the full checklist. Key rules:

- Text contrast ≥ **7 : 1**.
- Every icon-only button has `aria-label`.
- Forms: visible `<label>` per field, errors linked via `aria-describedby`.
- Framer Motion animations respect `prefers-reduced-motion`.
- One `<h1>` per page; no skipped heading levels.
- All interactive elements reachable and operable by keyboard alone.

---

## Responsive design

Four breakpoints are used throughout (MUI defaults):

| Tier | Range | Target |
|------|-------|--------|
| Mobile | `xs` 0–599 px | Phones |
| Tablet | `sm` 600–899 px | Small tablets, landscape phones |
| Desktop | `md` 900–1199 px | Laptops |
| Large desktop | `lg` 1200 px + | Wide monitors |

All components must render without horizontal scroll at 360 px and be tested at all four tiers before merging.

---

## Scripts

```bash
npm run dev                   # Next.js dev server (http://localhost:3000)
npm run build                 # Production build
npm run codegen               # database.ts (CLI) + database.zod.ts (supazod)
npm run lint                  # ESLint
npm test                      # Vitest (single run)
npm run test:watch            # Vitest watch mode
npm run test:smoke -- --url=<URL>   # Smoke: public pages HTTP 200 + content
npm run test:e2e -- --url=<URL>     # Full e2e suites against URL (see e2e/README.md)
npm run supabase:deploy:all   # Deploy all Edge Functions
npm run env:sync              # Sync .env to current git branch (TEST vs PROD Supabase)
npm run vercel:env            # Pull Development FLAGS into .env (then run env:sync)
```

---

## Deployment

### Branch environments (TEST vs PROD)

Git branches map to Vercel scopes, Supabase projects, and title prefixes:

| Branch | Vercel | URL | Supabase |
|--------|--------|-----|----------|
| `test` | Preview | `https://jobboard-sand.vercel.app/` | `uccivcdtfpevtykirkuw` |
| `main` | Production | Production domain | `uccivcdtfpevtykirkuw` |

Local development uses **Development** Vercel Flags (`npm run vercel:env`) and branch-aware Supabase credentials (`npm run env:sync`).

**Full reference:** [`docs/ENVIRONMENTS.md`](docs/ENVIRONMENTS.md)

### Vercel (recommended)

```bash
npx vercel
```

Set environment variables in the Vercel dashboard (web app):

| Variable | Notes |
|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public |
| `NEXT_PUBLIC_SITE_URL` | Canonical origin for metadata and auth redirects |
| `FLAGS` / `FLAGS_SECRET` | Optional — Vercel Flags / Toolbar (Development scope via `npm run vercel:env`; Preview/Production on Vercel dashboard) |
| `NEXT_PUBLIC_TITLE_PREFIX` | Preview only — set to `[TEST]` for sandbox deployments |
| `SUPABASE_TEST_*` / `SUPABASE_MAIN_*` | Local `.env.test` / `.env.prod` — see `docs/ENVIRONMENTS.md` |

**Do not add `SUPABASE_SERVICE_ROLE_KEY`, `RESEND_API_KEY`, or `RESEND_FROM` to Vercel** for this project — they belong in **Supabase Edge Function secrets** (see **`AGENTS.md`** environment table).

#### Web Analytics

The Next.js root layout loads Vercel Web Analytics for public, authentication, and dashboard pages, including client-side navigation. In the Vercel project dashboard, enable **Analytics** for Preview and Production deployments. Analytics retains page paths but strips query parameters and fragments to avoid sending auth codes, redirect values, or other query data.

### Edge Functions

```bash
npm run supabase:deploy:all
```

Set these secrets in the Supabase Dashboard → Edge Functions → Secrets:

| Secret | Used by |
|--------|---------|
| `SUPABASE_SERVICE_ROLE_KEY` | All notification Edge Functions (`notifications`, `job-application`, etc.) |
| `CRON_SECRET` | Scheduled functions (`jobs-lifecycle`, digests, nudges, matchmaking, release detect, unclaimed-company nudge) |
| `RESEND_API_KEY` | `send-email`, `notifications`, `newsletter-notify` |
| `RESEND_FROM` | Verified sender, for example `JurisJobs <noreply@yourdomain.com>` |
| `NEXT_PUBLIC_SITE_URL` | Edge Functions that build email links |
| `VAPID_PRIVATE_KEY` / `VAPID_SUBJECT` | `send-browser` |

---

## Language

Toată interfața utilizatorului este în **limba română**. Textele vizibile (etichete, validări Zod, mesaje de eroare, butoane, placeholder-uri) sunt definite direct în cod în română. Nu există un sistem i18n — dacă în viitor se dorește suport multi-limbă se recomandă `next-intl`.

Fișiere cheie pentru copy-ul de interfață:

| Fișier | Conținut |
|--------|----------|
| `src/lib/utils.ts` | Etichete contract, experiență, formatare dată/salariu |
| `src/components/layout/` | Navbar, Footer, HeroSection, WhySection |
| `src/components/marketing/` | Homepage sections, including pricing and FAQ |
| `src/components/jobs/` | Filtre, liste, detalii, formular aplicare |
| `src/components/blog/` and `src/components/newsletter/` | Blog and newsletter signup |
| `src/components/auth/` | LoginForm, RegisterForm, SocialButtons |
| `src/app/(public)/anunt/AnuntWizard.tsx` | Wizard publicare anunț |
| `src/app/dashboard/` | Tabloul de bord (segment protejat de middleware) |

---

## License

Private — SOLON Agency
