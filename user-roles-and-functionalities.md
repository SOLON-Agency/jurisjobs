# User Roles and Functionalities

Repository snapshot: 2026-10-13. This is an implementation inventory for product research, not a claim that every feature is enabled in a deployed environment. Global roles come from the `public.user_role` enum in `supabase/migrations/20260423200000_user_roles.sql` and `src/types/database.ts`; labels, inheritance helpers, and UI limits are in `src/lib/roles.ts`. Feature switches are in `src/config/app.settings.json` and `src/flags.ts`.

## Observed role model

| Actor | Description | Access basis |
| --- | --- | --- |
| Visitor | No authenticated profile role | Public routes; auth and newsletter entry points |
| `user` — Utilizator | Default registered role; candidate/personal account | Authenticated dashboard and self-owned records |
| `employer` — Angajator | Hiring account with company/job tools | `isAtLeastEmployer`; UI limit of 1 active company and 3 published jobs |
| `premium_employer` — Angajator Premium | Hiring account with the same visible toolset and higher limits | `isAtLeastEmployer`; `MAX_ACTIVE_COMPANIES` and `MAX_ACTIVE_JOBS` are unlimited (`null`) |
| `admin` — Administrator | Platform operator; also passes employer checks | `requireAdminRole`, `isAtLeastEmployer`; unlimited UI company/job limits |

`company_users` separately defines company-local membership roles `owner`, `admin`, and `member` (`src/types/database.ts`). These are **not** additional global account roles. A profile's role alone does not establish permission over a particular company; company membership and database RLS matter.

## Shared capabilities

**Visitor — observed:** Read the marketing home page, how-it-works, published job listings/details, public company and user profiles, policy, and published blog/RSS (when blog is enabled); filter/search jobs; register or log in via email/password or supported OAuth; request the public posting wizard at `/anunt`; start the `/claim` flow; submit the newsletter form. The wizard's account step and the claim action require authentication before their final write. Evidence: `src/app/(public)`, `src/components/jobs/JobList.tsx`, `src/components/auth`, `src/app/(public)/anunt/AnuntWizard.tsx`, `src/app/(public)/claim/actions.ts`.

**Every authenticated global role — observed:** Use `/dashboard`; edit their own profile, avatar, CV, experience, education, and skills; view public profiles; apply to eligible jobs via external URL/email or an internal form; track and withdraw/archive their own applications; set notification preferences (email/browser; SMS UI is disabled); read/mark persisted notifications; create/manage saved-search alerts while enabled; save favourite jobs/companies only when the Vercel `favourites` flag evaluates true; use archive for their own archived applications when applicable. Evidence: dashboard navigation, profile/applications/alerts/archive clients, `ApplyButton`, `src/services/{profiles,applications,alerts,favourites}.service.ts`, notification components and settings. These are account capabilities, subject to the relevant RLS policies and data preconditions.

## Capabilities by persisted role

| Role | Additional implemented functionality | Important conditions |
| --- | --- | --- |
| `user` | Candidate dashboard widgets, own applications, profile/CV/skills and alerts; archive navigation appears after an archived application exists | `MAX_ACTIVE_JOBS` and `MAX_ACTIVE_COMPANIES` are `0`; no employer navigation |
| `employer` | Create/edit/archive company profiles and logos, add company skills; create/edit/draft/schedule/publish/duplicate/archive/delete jobs and benefits; create/publish/edit/archive/delete custom application forms and inspect responses; view candidate lists per job or across jobs, filter/export, update application status; see employer dashboard widgets | UI checks cap active companies at 1 and published jobs at 3; company membership and RLS govern records; forms/alerts/archive/matchmaking depend on flags |
| `premium_employer` | Same inspected hiring workflow as `employer` | Company/job UI maxima are unlimited; no other premium-only screen or distinct premium feature gate was found in inspected routes/navigation |
| `admin` | All employer-gated dashboard pages plus user directory and role changes; approve/reject skills; create/edit/publish/delete FAQs; manage blog posts and newsletter notification; view/create unclaimed company records and issue claim links; edit/publish release announcements; use Edge Function test UI | Admin pages call `requireAdminRole`; admin RPCs in `20260423200000_user_roles.sql` check role; blog has a feature gate; ownership/RLS may still govern employer records |

Role evidence: `src/components/dashboard/DashboardNav.tsx`, `src/lib/server-guards.ts`, `src/app/dashboard/{company,jobs,forms,candidates,admin,blog,edge-functions}`, `src/app/dashboard/jobs/[id]/candidates/CandidatesClient.tsx`, `src/lib/roles.ts`. The candidate list can change an application's status, including rejection notification; per-job candidate view also offers CSV export. `src/app/dashboard/admin/releases/AdminReleasesClient.tsx` publishes a release and dispatches it to profile IDs.

## Feature availability and automatic behavior

| Feature | Current checked-in state | Who sees or triggers it |
| --- | --- | --- |
| Forms, alerts, archive, blog, notifications, matchmaking | Enabled in `app.settings.json` | Relevant authenticated/public routes and backend jobs; blog admin is `admin` only |
| Messages | Disabled; `/dashboard/messages` is placeholder text | Navigation hidden; do not treat as a working messaging product |
| SMS notification settings | Disabled | Browser/email preference UI is available; SMS setting hidden |
| Email notification opt-out | Disabled | Profile settings cannot offer full email opt-out |
| Favourites | Vercel flag, local default `false` without `FLAGS` | Registered users when flag is on; `/dashboard/favourites` 404s when off |
| Scheduled notifications and lifecycle | Edge Function source and cron SQL are checked in | System-triggered, not a human role: job lifecycle/expiry, daily digest, profile nudge, matching, release detection, unclaimed company nudge; deployment/cron health unverified |

Notification events include account/profile, company/job/form, application, alert, release, and matchmaking categories (`src/lib/notifications/types.ts`). Delivery depends on the Edge dispatcher, channel configuration, recipient preferences, and runtime secrets. Admin's Edge Function page is a test console, not evidence of a successful live send.

## Inferences

- `premium_employer` currently appears to be a quota tier of the employer experience: both share navigation and guards, while `src/lib/roles.ts` differentiates maxima. A commercial entitlement or payment flow was not found in the inspected repository.
- The public `/anunt` wizard is an acquisition path for prospective employers because it combines job, company, and account steps; the final allowed role transition and server-side quota checks need a focused review before changing that flow.

## Unknowns for product research

- Whether any live Supabase policies or triggers differ from checked-in migrations, and whether every UI quota is enforced in the database.
- Whether Vercel flags, notification channels, cron jobs, and Edge Functions are enabled and working in each deployment.
- Whether company-local `owner`/`admin`/`member` capabilities are consistently differentiated across every service and RLS policy. Review the target company's policies before defining new member permissions.
- Whether pricing, premium purchase/upgrade, or real-time messaging has an external implementation; this checkout does not establish one.
