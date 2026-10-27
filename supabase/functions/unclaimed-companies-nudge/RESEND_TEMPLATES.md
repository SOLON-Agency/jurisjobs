# Unclaimed-company email copy

JurisJobs product name: `src/config/app.settings.json`.

These HTML samples are reference copy. They are **not** published Resend dashboard templates in the current sender.

| Email | What the code does today |
|---|---|
| Welcome, when an admin creates an unclaimed company | `src/app/dashboard/admin/unclaimed/new/actions.ts` posts `resend_template.id = "unclaimed-company-welcome"` to `notifications`. That function’s legacy path sends `body` HTML only and does not read `resend_template`, so this welcome HTML is not the message that goes out. |
| Nudge, Monday–Saturday at 06:00 UTC | `unclaimed-companies-nudge` builds HTML with `buildEmail` and posts `to_email`, `subject`, and `body` to `notifications`. |

Secrets the nudge path needs: `RESEND_API_KEY`, `RESEND_FROM`, `NEXT_PUBLIC_SITE_URL`, `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`. Cron SQL is in `supabase/migrations/20260514180001_unclaimed_companies_cron.sql`.

The samples below keep the variable names `{{companyName}}`, `{{claimUrl}}`, `{{code}}`, and `{{siteUrl}}`.

---

## Template variables

### `unclaimed-company-welcome`

| Variable | Type | Example |
|---|---|---|
| `{{companyName}}` | string | `Ionescu & Asociații SRL` |
| `{{claimUrl}}` | string | `https://legaljobs.ro/claim?token=...` |
| `{{code}}` | string | `483021` |
| `{{siteUrl}}` | string | `https://legaljobs.ro` |

### `unclaimed-company-nudge`

| Variable | Type | Example |
|---|---|---|
| `{{companyName}}` | string | `Ionescu & Asociații SRL` |
| `{{applicationsLast7d}}` | number | `7` |
| `{{totalApplications}}` | number | `23` |
| `{{daysSincePosted}}` | number | `14` |
| `{{claimUrl}}` | string | `https://legaljobs.ro/claim?token=...` |
| `{{code}}` | string | `483021` |
| `{{siteUrl}}` | string | `https://legaljobs.ro` |
| `{{dayOfWeek}}` | string | `"1"` (Monday) |

---

## Email copy

Reference samples only. The nudge sender does not interpolate these `{{…}}` placeholders; it fills `buildEmail` in `index.ts`. The welcome sender does not send this HTML.

---

### Template: `unclaimed-company-welcome`

**Subject** (forwarded from the server action):
```
{{companyName}}, candidați te caută chiar acum — preia controlul, e gratuit
```

**HTML body:**

```html
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr><td style="background:#03170c;padding:28px 40px;">
          <a href="{{siteUrl}}" style="color:#ffffff;font-size:22px;font-weight:700;text-decoration:none;">JurisJobs</a>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 16px;font-size:24px;color:#03170c;line-height:1.3;">
            Bună ziua,<br/>
            Candidați caută <strong>{{companyName}}</strong> — chiar acum.
          </h1>
          <p style="margin:0 0 20px;color:#444;font-size:16px;line-height:1.6;">
            Am creat un profil pentru <strong>{{companyName}}</strong> pe JurisJobs și am publicat un
            anunț în numele vostru, gratuit. Profilul este deja vizibil publicului și primește vizite.
          </p>
          <p style="margin:0 0 28px;color:#444;font-size:16px;line-height:1.6;">
            Revendicarea durează <strong>~60 de secunde</strong>. Nu este nevoie de card.
            Odată revendicat, vei gestiona direct candidaturile, anunțurile și datele companiei.
          </p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:#03170c;border-radius:8px;padding:14px 32px;">
              <a href="{{claimUrl}}" style="color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                Revendică {{companyName}} →
              </a>
            </td></tr>
          </table>

          <!-- Code block -->
          <p style="margin:0 0 8px;color:#666;font-size:14px;">
            Sau accesează <a href="{{siteUrl}}/claim" style="color:#03170c;">{{siteUrl}}/claim</a>
            și introdu codul:
          </p>
          <div style="background:#f4f4f5;border-radius:8px;padding:20px;text-align:center;margin-bottom:32px;">
            <span style="font-size:40px;font-weight:800;letter-spacing:8px;color:#03170c;font-family:monospace;">{{code}}</span>
          </div>

          <p style="margin:0 0 8px;color:#888;font-size:13px;line-height:1.5;">
            Codul expiră în 7 zile. Vei primi mementouri zilnice (luni–sâmbătă) până la revendicare.
            Dacă nu dorești să revendici profilul, poți ignora aceste emailuri — nu vom mai trimite după 30 de zile.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f4f4f5;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
            © JurisJobs · <a href="{{siteUrl}}" style="color:#aaa;">{{siteUrl}}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```

---

### Template: `unclaimed-company-nudge`

**Subject** (resolved day-by-day in the edge function and forwarded as `subject`):

| Day | Subject line |
|-----|--------------|
| Luni | `Săptămână nouă, {{applicationsLast7d}} candidați te-au căutat — profilul tău e încă nerevendicat` |
| Marți | `{{companyName}}: candidați eligibili așteaptă un răspuns de {{daysSincePosted}} zile` |
| Miercuri | `Ești la 30 de secunde de a activa contul {{companyName}} — gratuit, fără card` |
| Joi | `Concurenții tăi au răspuns deja celor mai buni candidați. Tu?` |
| Vineri | `Înainte de weekend: nu pierde candidatul care a aplicat ieri la {{companyName}}` |
| Sâmbătă | `Ultimul memento al săptămânii — codul tău {{code}} expiră dacă nu acționezi` |

**HTML body:**

```html
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="margin:0;padding:0;background:#f4f4f5;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f5;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;max-width:600px;">

        <!-- Header -->
        <tr><td style="background:#03170c;padding:28px 40px;">
          <a href="{{siteUrl}}" style="color:#ffffff;font-size:22px;font-weight:700;text-decoration:none;">JurisJobs</a>
        </td></tr>

        <!-- Urgency bar -->
        <tr><td style="background:#b91c1c;padding:10px 40px;">
          <p style="margin:0;color:#ffffff;font-size:13px;font-weight:600;">
            ⚠ Compania {{companyName}} nu a fost revendicată. Candidații nu știu cine să contacteze.
          </p>
        </td></tr>

        <!-- Body -->
        <tr><td style="padding:40px;">
          <h1 style="margin:0 0 16px;font-size:22px;color:#03170c;line-height:1.3;">
            Profilul <strong>{{companyName}}</strong> are activitate.
          </h1>

          <!-- Stats table -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 28px;background:#f9fafb;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="padding:16px 20px;border-right:1px solid #e5e7eb;text-align:center;">
                <div style="font-size:32px;font-weight:800;color:#03170c;">{{applicationsLast7d}}</div>
                <div style="font-size:12px;color:#666;">candidaturi în ultimele 7 zile</div>
              </td>
              <td style="padding:16px 20px;text-align:center;">
                <div style="font-size:32px;font-weight:800;color:#03170c;">{{totalApplications}}</div>
                <div style="font-size:12px;color:#666;">candidaturi totale</div>
              </td>
            </tr>
          </table>

          <p style="margin:0 0 20px;color:#444;font-size:16px;line-height:1.6;">
            Fiecare candidat care aplică și nu primește răspuns alege un competitor.
            Revendicarea contului durează <strong>~60 de secunde</strong> și este complet gratuită.
          </p>

          <!-- CTA -->
          <table cellpadding="0" cellspacing="0" style="margin-bottom:32px;">
            <tr><td style="background:#03170c;border-radius:8px;padding:14px 32px;">
              <a href="{{claimUrl}}" style="color:#ffffff;font-size:16px;font-weight:600;text-decoration:none;">
                Revendică {{companyName}} acum →
              </a>
            </td></tr>
          </table>

          <!-- Code block -->
          <p style="margin:0 0 8px;color:#666;font-size:14px;">
            Sau accesează <a href="{{siteUrl}}/claim" style="color:#03170c;">{{siteUrl}}/claim</a>
            și introdu codul:
          </p>
          <div style="background:#f4f4f5;border-radius:8px;padding:20px;text-align:center;margin-bottom:32px;">
            <span style="font-size:40px;font-weight:800;letter-spacing:8px;color:#03170c;font-family:monospace;">{{code}}</span>
          </div>

          <p style="margin:0;color:#888;font-size:13px;line-height:1.5;">
            Procesul durează ~60 de secunde, contul este gratuit, fără card.
            Dacă nu dorești să revendici profilul, poți ignora aceste emailuri — trimiterea se oprește automat la revendicare sau după 30 de zile.
            Ai întrebări? Scrie-ne la
            <a href="mailto:contact@legaljobs.ro" style="color:#03170c;">contact@legaljobs.ro</a>.
          </p>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#f4f4f5;padding:20px 40px;border-top:1px solid #e5e7eb;">
          <p style="margin:0;color:#aaa;font-size:12px;text-align:center;">
            © JurisJobs · <a href="{{siteUrl}}" style="color:#aaa;">{{siteUrl}}</a>
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
```

---

## Setup

1. Set Supabase secrets: `RESEND_API_KEY`, `RESEND_FROM` (for example `JurisJobs <noreply@yourdomain.com>`), `NEXT_PUBLIC_SITE_URL`, `CRON_SECRET`, `SUPABASE_SERVICE_ROLE_KEY`.
2. Set the database settings the cron migration reads:
   ```sql
   ALTER DATABASE postgres SET "app.cron_secret" = '<same CRON_SECRET>';
   ALTER DATABASE postgres SET "app.supabase_url" = 'https://<project-ref>.supabase.co';
   ```
3. Deploy Edge Functions with `npm run supabase:deploy:all`.
4. Apply migrations with `npm run supabase:migrate` (or `supabase db push`).
