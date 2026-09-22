# PhishGuard

> A full-stack, explainable phishing-detection workspace built with Next.js,
> TypeScript, Prisma, and PostgreSQL.

PhishGuard is a production-ready phishing detection platform for suspicious URLs, emails, and messages. It combines transparent heuristic analysis with an investigation dashboard, local scan history, authentication, admin analytics, and optional external threat-intelligence integrations.

## Features

- URL checks for transport security, IP hosts, encoded domains, redirect patterns, excessive subdomains, suspicious terms, and URL length
- Email/message checks for urgency, credential requests, financial lures, generic greetings, and embedded links
- Explainable risk score, verdict, findings, and recommended actions
- Responsive dashboard, scanner, device-local history, admin analytics, settings, login, and registration
- PostgreSQL schema for users, scans, reports, and managed keywords
- Demo mode when no database is configured
- Vercel and Render deployment configuration

## Local setup

```bash
npm install
cp .env.example .env.local
npx prisma generate
npm run dev
```

Open `http://localhost:3000`. Without a database, use `demo@phishguard.dev` / `demo1234`, or `admin@phishguard.dev` / `admin1234`.

## Environment variables

Copy `.env.example` to `.env.local` for local development. Configure the same
variables in Vercel or Render for production.

| Variable | Required | Purpose |
| --- | --- | --- |
| `JWT_SECRET` | Production | Signs secure login sessions. Use a long random value. |
| `DATABASE_URL` | Persistent accounts | PostgreSQL connection string for users and scans. |
| `GOOGLE_SAFE_BROWSING_API_KEY` | Optional | Adds Google Safe Browsing reputation results. |
| `VIRUSTOTAL_API_KEY` | Optional | Adds VirusTotal vendor verdicts. |

The app remains usable without external API keys through its explainable local
heuristic engine. Without `DATABASE_URL`, it runs in non-persistent demo mode.

## PostgreSQL setup

1. Create a PostgreSQL database (Neon, Supabase, Render Postgres, or another provider).
2. Set `DATABASE_URL` and a long random `JWT_SECRET`.
3. Run `npx prisma db push` for a quick first deployment, or create and apply Prisma migrations for a managed production workflow.

## Deploy on Vercel

1. Fork or clone the repository and push it to GitHub.
2. In Vercel, choose **Add New > Project** and import the GitHub repository.
3. Keep the detected framework as **Next.js** and the root directory as `.`.
4. Add `JWT_SECRET`, `DATABASE_URL`, and any optional threat-intelligence keys.
5. Select **Deploy**. `vercel.json` generates Prisma Client before the build.

For schema setup, run this once against the production database:

```bash
DATABASE_URL="your-production-url" npx prisma db push
```

Future pushes to the production branch trigger Vercel deployments automatically.

## Deploy on Render

### Blueprint deployment

1. In Render, choose **New > Blueprint** and connect the GitHub repository.
2. Render reads `render.yaml` and creates the Node web service.
3. Provide `DATABASE_URL` when prompted. `JWT_SECRET` is generated automatically.
4. Add optional Google Safe Browsing and VirusTotal keys in the service environment.
5. Apply the Prisma schema once with `npx prisma db push`, then deploy.

### Manual web-service settings

| Setting | Value |
| --- | --- |
| Runtime | Node |
| Build command | `npm ci && npx prisma generate && npm run build` |
| Start command | `npm start` |
| Health path | `/` |

Render redeploys the service when new commits reach the connected branch.

## Push a fresh copy to GitHub

```bash
git init -b main
git add .
git commit -m "Launch PhishGuard"
git remote add origin https://github.com/YOUR_USERNAME/phishguard.git
git push -u origin main
```

Do not commit `.env`, `.env.local`, database passwords, JWT secrets, or API keys.

## Validation

```bash
npm ci
npx prisma generate
npm run build
```

A successful build validates TypeScript, server routes, static pages, and the
production Next.js bundle.

## Production notes

- Set a strong, unique `JWT_SECRET`; never commit `.env` files.
- Demo mode is intentionally non-persistent. Configure PostgreSQL for real users and shared scan history.
- Google Safe Browsing and VirusTotal checks run server-side only when their keys are configured; keys are never sent to the browser.
- Automated verdicts are advisory and should be combined with user judgment and security controls.

## Project structure

```text
app/          Next.js pages and API routes
components/   Shared UI and interactive modules
lib/          Analysis, authentication, and database helpers
prisma/       PostgreSQL data model
render.yaml   Render Blueprint configuration
vercel.json   Vercel build configuration
```

## License

MIT
