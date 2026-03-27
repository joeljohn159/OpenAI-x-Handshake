# CampusShare

![Challenge](https://img.shields.io/badge/OpenAI%20x%20Handshake-Codex%20Creator%20Challenge-2D6A4F?style=flat-square)

CampusShare is a full-stack, community-verified campus map for free food, pantry shelves, textbooks, clothing, and time-sensitive student resources. It is designed for the moments when support exists on campus but the signal never reaches students fast enough.

The product focuses on food insecurity and resource visibility. Roughly 37% of college students face food insecurity, average annual food costs can exceed $2,100, and thousands of free items or leftover meals go unclaimed every week because they are shared too late or through the wrong channels.

## Features

- Real-time campus map with custom SVG markers and clustering, seeded from UNT by default and able to generate nearby demo activity around the viewer.
- Community verification system with still-there and gone voting, trust indicators, and auto-removal after repeated gone reports.
- Quick 3-step posting flow with category selection, map-based location picking, duration-based expiry, and optional photo upload.
- Live feed with category, distance, freshness, and availability filters.
- Monthly leaderboard, trust scores, and badge-based gamification.
- Watch zone notifications using the browser Notification API and a service worker.
- PWA support with installable manifest and offline shell caching.
- Supabase-ready schema, policies, triggers, and a seed script for demo data.
- Polished landing page with editorial typography, motion, and startup-grade presentation.

## Tech Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Framer Motion
- Supabase Auth, Postgres, Storage, and Realtime
- React Leaflet with OpenStreetMap
- Vercel deployment target

## Project Structure

```text
app/
components/
lib/
public/
scripts/
supabase/
```

## Getting Started

1. Install dependencies:

```bash
pnpm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Add your Supabase values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

4. Start the app:

```bash
pnpm dev
```

5. Open `http://localhost:3000`

If Supabase keys are missing, the UI still runs in a polished demo mode with location-aware seed data and a UNT fallback.

## Supabase Setup

1. Create a new Supabase project.
2. Run the SQL in `supabase/schema.sql`.
3. Enable Google OAuth and/or email magic links under Authentication.
4. Create a public storage bucket named `resource-images`.
5. Enable Realtime for `resources` and `confirmations`.
6. Add the environment variables to `.env.local` and Vercel.

## Seed Demo Data

The seed script creates demo users and inserts realistic UNT resources.

```bash
pnpm seed
```

The script requires `SUPABASE_SERVICE_ROLE_KEY` because it creates demo auth users through the Admin API.

## Deployment

### Vercel

1. Push this repository to GitHub.
2. Import it into Vercel.
3. Add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and optionally `SUPABASE_SERVICE_ROLE_KEY`.
4. Deploy.

### Browser Notifications

Notifications are powered by the browser Notification API plus the app service worker. They work best when the app is installed or pinned on mobile.

## Screenshots

- Landing page screenshot: add after deployment
- Map view screenshot: add after deployment
- Post flow screenshot: add after deployment

## Why It Matters

CampusShare is not just a bulletin board. It combines live geospatial discovery, trust signals, lightweight reputation, and instant notifications to make campus resources actually reachable before they disappear.
