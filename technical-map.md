# Repository Technical Map

Repository snapshot: 2026-10-27. This map describes the checked-in JurisJobs implementation. It does not assert that external services are deployed or healthy. See [user-roles-and-functionalities.md](user-roles-and-functionalities.md) for the role inventory.

## Structure

**Observed facts**

| Area | Current responsibility | Evidence |
| --- | --- | --- |
| Root | One private `jurisjobs` npm package; no workspace manifest or nested package manifest found | `package.json`, `package-lock.json`, root file inventory |
| `src/app` | Next.js App Router: public and auth route groups, protected `/dashboard`, application and docs API routes, newsletter action, metadata, sitemap, robots | `src/app/**`, `middleware.ts` |
| `src/components`, `src/theme`, `src/contexts` | MUI/Emotion UI, shared and feature components, theme, toast and favourites providers | `src/app/layout.tsx`, `src/components/**` |
| `src/services`, `src/hooks`, `src/lib`, `src/store` | Typed Supabase data access; client hooks; client/server/static Supabase factories, role/SEO/notification helpers; Redux Toolkit with an RTK Query employer dashboard endpoint | Representative files in each directory |
| `src/types`, `src/config` | Generated database TypeScript/Zod types and application settings | `src/types/database*.ts`, `src/config/app.settings.json`, `package.json` scripts |
| `supabase` | SQL migrations, seed, local CLI config, Deno Edge Functions and shared notification templates | `supabase/config.toml`, `supabase/migrations/**`, `supabase/functions/**` |
| `scripts`, `e2e`, `src/__tests__` | Environment/codegen/deployment scripts, Puppeteer smoke/full suites, Vitest unit/component tests | `package.json`, test files |
| `docs`, `AGENTS.md`, `src/AGENTS.md`, `src/PATTERNS.md`, `user-roles-and-functionalities.md` | Environment, contributor, and role guidance. Product name is JurisJobs | Named files |

Git is the version-control system. The npm package name stays `jurisjobs`; the product name is JurisJobs.

## Stack

**Observed facts.** TypeScript strict mode. `package.json` `engines` accepts Node `^22.22.2 || ^24.15.0 || >=26.0.0`. The app pins Next.js `16.4.3`, React and React DOM `19.2.8`, and `eslint-config-next` `16.4.3`. The UI uses MUI 7, Emotion, Tailwind CSS 4, Framer Motion, TipTap, Recharts, and `react-markdown`. Forms use React Hook Form, Zod 4, and `@hookform/resolvers`. Supabase provides auth, Postgres, storage, Realtime, and Edge Functions. Resend is used by Edge Function email flows. Vitest 4, jsdom, Testing Library, and Puppeteer are the test stacks. Evidence: `package.json`, `src/app/globals.css`, `src/app/layout.tsx`, `src/store/jobBoardApi.ts`, `supabase/functions`.

## Package & Dependency Model

**Observed facts.** npm is indicated by `package-lock.json` and CI's `npm ci`. The root package is private, has no library entry point, and has no workspaces. `overrides` force the vendored `braces` package and `@vercel/cli-config`'s `zod` onto the app's Zod. Supabase Edge Functions are source in this repository. `tsconfig.json` maps `@/*` to `./src/*` and excludes `supabase/functions` from the Next.js TypeScript program. `vitest.config.ts` duplicates the alias for tests.

**Inference.** This is one deployable Next.js application plus a separately deployed Supabase backend, not an npm workspace monorepo. The package graph is centralized in the root lockfile.

## Architecture

### Current feature map — observed

| Feature | Web entry points | Data/backend ownership |
| --- | --- | --- |
| Marketing and discovery | `/`, `/how-it-works`, `/brand`, `/jobs`, `/jobs/[slug]`, `/societate/[slug]`, `/users/[slug]`, `/policy` | `src/components/layout`, `marketing`, `jobs`, `companies`, `profile`; jobs/companies/profiles/stats/FAQ services; public Supabase reads |
| Blog and newsletter | `/blog`, `/blog/[slug]`, `/blog/rss.xml`, home newsletter section | Blog/newsletter services, `src/app/newsletter/actions.ts`, admin blog actions, `newsletter-notify` Edge Function |
| Identity and onboarding | `/login`, `/register`, `/verify-email`, `/auth/callback`, `/oauth/consent`, `/anunt`, `/claim` | `useAuth`, Supabase Auth, public posting wizard, claim server action and claim RPC; middleware refresh/redirect |
| Personal dashboard/profile | `/dashboard`, `/dashboard/profile` | Dashboard aggregates, profile/education/experience/skills services, avatar/CV storage, notification preferences, match display |
| Applying and tracking | Job detail `ApplyButton`, `POST /api/jobs/apply-internal-form`, `/dashboard/applications` | Applications/forms services, internal or external application path, withdrawal/archive, application notification Edge Functions |
| Companies and hiring | `/dashboard/company`, `/dashboard/jobs`, `/dashboard/jobs/[id]/candidates`, `/dashboard/candidates` | Company/job/benefit/application/skill services, custom form attachment, hiring status changes and candidate export |
| Custom application forms | `/dashboard/forms`, `/dashboard/forms/[id]/responses` | Form builder/response UI, forms service and application response tables |
| Alerts, favourites, archive | `/dashboard/alerts`, `/dashboard/alerts/new`, `/dashboard/favourites`, `/dashboard/archive` | Alerts/favourites services, Vercel `favourites` flag, archived entity services |
| Notifications and automation | Navbar notification bell, profile settings, releases; Edge Functions under `supabase/functions` | `src/lib/notifications/{types,dispatch}.ts`, Realtime feed, central `notifications` dispatcher, browser/email/SMS senders, application/follower/alert/match/expiry/digest/nudge/release cron functions |
| Administration | `/dashboard/admin/users`, `skills`, `faq`, `unclaimed`, `releases`; `/dashboard/blog`; `/dashboard/edge-functions` | Admin RPCs, FAQ/blog/unclaimed/release services and actions, Edge Function test UI |
| Messages | `/dashboard/messages` | A placeholder page; `features.messages` is false in settings |

The configured static flags in `src/config/app.settings.json` are `forms`, `alerts`, `notifications`, `archiveJobs`, `edgeFunctions`, `blog`, and `matchmaking` enabled; `messages`, `smsNotifications`, and email opt-out disabled. Favourites use `src/flags.ts` and Vercel Flags; the local fallback is off without `FLAGS`. The settings name is `JurisJobs`, locale `ro`, currency `RON`.

The 17 checked-in deployable Edge Function entry points (`supabase/functions/<slug>/index.ts`) cover: `notifications`, `send-email`, `send-browser`, `send-sms`; `job-application`, `application-withdrawn`, `application-rejected`; `company-followers-notify`, `alerts-job-match`, `newsletter-notify`; `jobs-lifecycle`, `notifications-daily-digest`, `notifications-job-expiry-tomorrow`, `notifications-matchmaking`, `notifications-profile-nudge`, `notifications-release-detect`, and `unclaimed-companies-nudge`. `_shared/templates/index.ts` is shared code, not an endpoint. Function existence does not establish deployment status.

### Boundaries and recurring patterns — observed

- App Router pages and layouts are mostly server components; interactive `*Client.tsx` files and shared components call hooks. Root layout composes favourites, MUI theme, Redux, toast, navbar, main, and footer providers.
- Supabase browser, cookie-backed server, and anon/static clients are defined separately in `src/lib/supabase/{client,server,static}.ts`; `middleware.ts` refreshes sessions and redirects unauthenticated `/dashboard` visitors. `src/lib/server-guards.ts` supplies employer/admin page guards. Role capability also depends on company membership and RLS, not just the global profile role.
- Services normally take `SupabaseClient<Database>` from callers and return typed records. ESLint restricts `.from()` outside services with an explicit allowlist. Existing dashboard/root pages still have grandfathered direct queries (`src/app/dashboard/page.tsx` is an example); `src/PATTERNS.md` calls this transitional.
- Forms are grouped in `src/components/forms`; Zod schemas are in `forms/validations`, with React Hook Form and `zodResolver`. Dashboard edit/create screens commonly use `EditSideDrawer`, `useToast`, and `ResponsiveDashboardTable`. Some legacy screens differ; inspect local examples before editing.
- `src/store/jobBoardApi.ts` currently defines one Supabase-backed RTK Query endpoint (`employerJobsDashboard`); many other dashboard clients load through services plus hooks/effects. `useNotifications` is for the persisted feed; `useToast` is for transient action feedback.
- New typed notifications dispatch through `src/lib/notifications/dispatch.ts` to the Supabase `notifications` Edge Function. Function-side templates/types live in `_shared`; privileged operations use RLS or `SECURITY DEFINER` RPCs. No Next.js service-role client is present.
- `src/lib/seo.ts`, `src/lib/page-title.ts`, `sitemap.ts`, and `robots.ts` control SEO/metadata. `next.config.ts` redirects `/companies/:slug` to `/societate/:slug` and permits the configured Supabase image host plus any HTTPS image host.

**Inference.** The intended dependency direction for new data work is route/component → service → Supabase client, with database privilege enforced by RLS/RPC; the current code has documented legacy exceptions.

## Configuration & Environment

**Observed facts.** `.env.local.example` lists shared local variables; `.env.test.example` and `.env.prod.example` list branch-specific Supabase settings; `scripts/sync-branch-environment.js` composes ignored `.env` from them. `scripts/lib/environment-targets.js` maps `test` to Vercel Preview with a `[TEST]` title prefix, and `main` to Production. Both currently resolve to Supabase project `uccivcdtfpevtykirkuw`; `SUPABASE_ENV` and `SUPABASE_PROJECT_REF` can override selection. `npm run vercel:env` pulls Development flag values and rewrites local env files. The checked-in examples were inspected by variable name only.

| Variable or group | Source and observed use | Requirement status from source |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Branch env / Vercel; browser, server, static, middleware clients | Required for real runtime auth/data; browser/static factories have build placeholders, server/middleware use non-null assertions |
| `NEXT_PUBLIC_SITE_URL` | Local/Vercel and Edge secrets; canonical URLs, metadata, callbacks, email links | Documented local requirement; some metadata code falls back to localhost |
| `NEXT_PUBLIC_TITLE_PREFIX` | Test/Preview metadata prefix | Optional on production; test branch sets `[TEST]` |
| `FLAGS`, `FLAGS_SECRET` | Vercel scopes; favourites evaluation and Toolbar | Optional locally; without `FLAGS`, favourites resolve false |
| `NEXT_PUBLIC_VAPID_PUBLIC_KEY` | Web Push browser subscription | Optional until browser push is configured |
| `SUPABASE_ACCESS_TOKEN`, `SUPABASE_DB_PASSWORD`, `SUPABASE_PROJECT_ID` | CLI/codegen/deployment/migration scripts; project ID composed from target | Needed for those workflows, not a web-app service-role secret |
| `RESEND_API_KEY`, `RESEND_FROM`, `SUPABASE_SERVICE_ROLE_KEY`, `CRON_SECRET`, `VAPID_PRIVATE_KEY`, `VAPID_SUBJECT` | Supabase Edge secrets | Required for the corresponding mail, privileged dispatch, cron, or push operations; never put the service-role key in Next.js |
| `E2E_BASE_URL`, `E2E_TEST_EMAIL`, `E2E_TEST_PASSWORD`, `VERCEL_AUTOMATION_BYPASS_SECRET` | CI E2E runner | URL needed for deployed target; credentials/bypass depend on suite/deployment |

`NEXT_PUBLIC_` denotes browser-exposed configuration. The listed secrets are names only; no values are reproduced here. `supabase/config.toml` configures local Postgres 17, API, Auth, Storage, Realtime, and selected Edge Function JWT settings. Runtime validation of all environment variables was not found as a centralized schema.

## Validation

**Observed commands:** `npm run dev`, `npm run build`, `npm run start`, `npm run lint` (zero warnings), `npm test` (Vitest run), `npm run test:watch`, `npm run test:smoke -- --url=<URL>`, `npm run test:e2e -- --url=<URL>`, and `npm run codegen`. `tsconfig.json` uses `noEmit`. The production build type-checks the Next.js app. Vitest covers `src/**/*.{test,spec}.{ts,tsx}` plus script tests in jsdom. Puppeteer suites live under `e2e/tests`.

## CI/CD

**Observed facts.** `.github/workflows/e2e.yml` runs on pushes to `main` and PRs targeting `test`: Node 22, `npm ci`, Puppeteer Chrome installation, wait for a Vercel deployment, smoke and full suites, then upload XML/screenshots and publish test reports. The workflow does not separately declare lint/unit/type-check steps. `package.json`'s `prepare` configures `.githooks`; pre-commit composes env, regenerates/stages database types, pulls Vercel Development flags, builds, deploys changed Edge Functions, and pushes staged migrations. `post-checkout` and `post-merge` also run environment/codegen steps. Deployment scripts target the branch-selected Supabase project. These hooks and scripts are mutating/external and must not be used for reconnaissance.

## Relevant Files

Start with `AGENTS.md`, `src/AGENTS.md`, `src/PATTERNS.md`, `package.json`, `docs/ENVIRONMENTS.md`, `src/config/app.settings.json`, `src/lib/roles.ts`, `src/lib/server-guards.ts`, `src/components/dashboard/DashboardNav.tsx`, the target `src/app` route and corresponding `src/services/*.service.ts`, `src/types/database.ts`, relevant SQL migration/RLS policy, and the closest test. For a new form also inspect `src/components/forms/validations`; for a notification inspect both `src/lib/notifications` and `supabase/functions/_shared`.

## Constraints & Risks

**Observed facts**

- TEST and PROD both resolve to Supabase project `uccivcdtfpevtykirkuw` (`scripts/lib/environment-targets.js` and `docs/ENVIRONMENTS.md`). Vercel Preview and Production remain separate scopes. Remote health was not rechecked in this documentation pass.
- Every Edge Function entry in `supabase/config.toml` sets `verify_jwt = false`. Each function validates its own JWT, service-role bearer, or `CRON_SECRET`.
- Role navigation is a visibility hint. Server page guards cover selected employer and admin pages. RLS and service checks still govern writes. Company membership labels are distinct from profile `user_role`.
- The `messages` route is placeholder content while `features.messages` is off. `next.config.ts` accepts any HTTPS image hostname, which is broader than a single Supabase storage host.
- Job postings have no role-based count limit at launch. `MAX_ACTIVE_COMPANIES.employer` remains `1` in `src/lib/roles.ts`.
- Some dashboard screens still call Supabase directly. New data access belongs in `src/services/`. The ESLint `.from()` boundary documents the allowlist.

## Unknowns / Escalations

- **Unknown:** live database schema versus this checkout, deployed Edge Function versions, Vercel flag values, secrets, and cron health.
- **Unknown:** whether company-count quotas are enforced by RLS in addition to the UI.
- **Unknown:** current lint status of files this documentation pass did not change. `npm run build` has succeeded on Next.js 16.4.3 in this checkout.

## Modification Readiness

**READY for planning a specific change.** Entry points, conventions, environment constraints, and validation commands are mapped. Before implementation, inspect that feature's RLS and migrations.
