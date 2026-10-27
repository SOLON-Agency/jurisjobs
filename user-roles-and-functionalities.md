# User Roles and Functionalities

Repository snapshot: 2026-10-27. This is an implementation inventory for JurisJobs, not a claim that every feature is enabled in a deployed environment. Global roles come from the `public.user_role` enum and `src/lib/roles.ts`. Feature switches are in `src/config/app.settings.json` and `src/flags.ts`.

Messages, SMS settings, and email opt-out are switched off, so they are not listed as working product features. Favourites exist only when the Vercel `favourites` flag is on.

Employer, premium employer, and admin keep the Utilizator account (profile, applications, alerts, notifications). Those lines are not repeated under each role.

## Observed role model

| Actor | Description | Access basis |
| --- | --- | --- |
| Visitor | No authenticated profile role | Public routes; auth and newsletter entry points |
| `user` — Utilizator | Default registered role; candidate account | Authenticated dashboard and self-owned records |
| `employer` — Angajator | Hiring account | `isAtLeastEmployer`; UI limit of 1 active company and 3 published jobs |
| `premium_employer` — Angajator Premium | Same hiring tools, higher limits | `isAtLeastEmployer`; company and job UI maxima are unlimited (`null`) |
| `admin` — Administrator | Platform operator; also passes employer checks | `requireAdminRole`; unlimited company and job UI limits |

`company_users` stores company-local labels `owner`, `admin`, and `member`. These are membership records, not extra global roles. The app does not give those three labels different actions. Any accepted member of a company can use that company’s hiring tools when their account role is employer or above. RLS still governs which company rows they can touch.

## Visitor

- Read the marketing home page, live counts, and calls to action.
- Read how-it-works, including candidate and employer steps.
- Expand published FAQ entries on the home page and on how-it-works.
- Read the privacy policy and the public brand page at `/brand`. The public footer does not currently link to `/brand`.
- Search published jobs by keyword. Filter by city, contract, experience, salary, remote, and benefits, then sort, change view, and paginate.
- Open a published job, its description, benefits, and similar jobs. Share the link, or copy the URL when the device cannot share.
- Open a company page, its description, approved skills, and open jobs, plus the company’s external website when one is listed.
- Open a profile the owner marked as public, and download a CV from that profile when one exists.
- Read published blog posts, filter by tag, load more, and follow `/blog/rss.xml` while blog is enabled.
- Subscribe to the newsletter with an email and no account.
- Fill the public job and company wizard at `/anunt`. Publishing waits for a confirmed account.
- Register with email and password, then confirm the email. Sign in with email and password. Resend the signup confirmation.
- Approve or deny an OAuth consent request after signing in.
- Open apply; the application is saved only after login.
- Choose “save this search”; the alert is created only after login.
- Enter a claim code at `/claim`; the company is claimed only after login.

## Utilizator (`user`)

- Open the candidate dashboard with progress, application stats, and charts.
- Update name, title, bio, location, experience level, and whether the profile is public.
- Set a profile photo. Upload a PDF CV and download it.
- Add, edit, reorder, and delete work experience and education.
- Add, reorder, and remove skills. A new name stays off the public profile until an admin approves it.
- Open their own public profile when it is set to public.
- Turn email and browser alerts on or off per type, and subscribe to browser push. Email cannot be turned off globally (`allowEmailNotificationOptOut` is false).
- Read in-app notices and mark one or all as read.
- Apply once through an external link, email, or the employer’s form.
- See own applications, status, and submitted answers.
- Withdraw an active application with a reason. The poster is notified.
- Archive an application. If it is still active, it is withdrawn first. Restore an archived application to the active list.
- Save a search and get notified when a matching job is published. Edit, pause, or archive own alerts, and restore archived ones.
- Save jobs and companies, and review them, when the favourites flag is on.
- Get an email and an in-app notice when approved skills overlap a company by at least two (`matchmaking.minOverlap`).
- Resend the confirmation email from the dashboard while the address is unverified.
- Sign out from the account menu.

`MAX_ACTIVE_JOBS` and `MAX_ACTIVE_COMPANIES` are `0` for this role, so employer navigation stays hidden.

## Angajator (`employer`)

Caps are enforced in the company and job screens: 1 active company and 3 published jobs. They are not enforced again when restoring from the archive or when publishing a draft from the list.

- See hiring stats, received applications, job status, and the employer checklist. Candidate home widgets are hidden.
- Create one active company, upload a logo, and become its owner.
- Update the company profile and logo, and open the public page. Followers are notified of profile updates.
- Add, remove, reorder, or propose competencies used for matchmaking.
- Archive a company and restore it later.
- Save a draft, publish now, or schedule publication, up to 3 published jobs.
- Update a job, its benefits, and whether candidates apply by link, email, or form.
- Publish a draft or set a live job back to draft. Followers and matching alerts are notified on publish.
- Copy a job into a new draft. Benefits and the linked form are not copied.
- Archive a job and restore it later. Permanently delete a job.
- Create, edit, publish, archive, restore, and delete custom application forms.
- Read, search, filter, export, and delete form submissions.
- See candidates for one job or across jobs, filter them, and open a CV from the per-job list.
- Mark an application reviewed, shortlisted, or rejected. Rejection notifies the candidate.
- Download a CSV of candidates for one job.
- Receive notices for new applications, withdrawals, company follows, and job events.

Marketing copy on the homepage and pricing section still says visitors can publish up to 5 jobs for free. The employer cap in `src/lib/roles.ts` is 3.

## Angajator Premium (`premium_employer`)

Same hiring and candidate tools as Angajator. No separate premium screen or payment flow exists.

- Create more than one active company.
- Publish more than three jobs at the same time.

## Administrator (`admin`)

Also has the full Utilizator account and the full hiring toolset, with the same unlimited company and job caps as premium. The home dashboard shows both candidate and employer blocks.

- List every account, including email, and search, filter, and sort them.
- Set any account, including their own, to user, employer, premium employer, or admin.
- Approve or reject skills so they can be picked and shown publicly.
- Create, edit, show, hide, and delete FAQ entries for the home page and how-it-works.
- Create, edit, publish, unpublish, archive, and delete blog posts, including drafts.
- Email active subscribers the first time a post is published (`newsletter-notify`).
- Create an unclaimed company and its first job, then copy a claim code and magic link.
- Delete an unclaimed company and its jobs.
- Edit the title and HTML of a release note before it is published.
- Publish a release note and notify every user.
- See every saved-search alert and who owns it. Changing someone else’s alert is not allowed.
- Send test job-application, notification, and email calls from `/dashboard/edge-functions`.

## Feature availability and automatic behavior

| Feature | Current checked-in state | Who sees or triggers it |
| --- | --- | --- |
| Forms, alerts, archive, blog, notifications, matchmaking, edge-function test UI | Enabled in `app.settings.json` | Relevant public or authenticated routes; blog admin is `admin` only |
| Messages | Disabled; `/dashboard/messages` is placeholder text | Navigation hidden |
| SMS notification settings | Disabled | Email and browser preference UI is available |
| Email notification opt-out | Disabled | Profile settings cannot turn email off globally |
| Favourites | Vercel flag, local default off without `FLAGS` | Registered users when the flag is on |
| Scheduled jobs | Cron SQL is checked in | System-triggered: job lifecycle, daily digest (05:00 UTC), profile nudge (05:05 UTC), job expiry (06:00 UTC), matchmaking (05:15 UTC), release detection (every 6 hours), unclaimed-company nudge (06:00 UTC, Monday–Saturday) |

Notification type keys live in `src/lib/notifications/types.ts`. Delivery depends on the Edge dispatcher, channel configuration, recipient preferences, and runtime secrets. The admin Edge Function page is a test console, not evidence of a successful live send.

## Inferences

- `premium_employer` is a quota tier of the employer experience. No checkout or payment flow is in this repository.
- `/anunt` is an acquisition path: job, company, and account steps, with the write happening after authentication.

## Unknowns for product research

- Whether live Supabase policies differ from checked-in migrations, and whether every UI quota is enforced in the database.
- Whether Vercel flags, notification channels, cron jobs, and Edge Functions are enabled in each deployment. TEST and PROD currently share Supabase project `uccivcdtfpevtykirkuw`.
- Whether pricing or real-time messaging exists outside this checkout. The messaging tables are present and the feature flag is off.
