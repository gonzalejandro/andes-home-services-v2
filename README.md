# Andes Stump Grinding — Astro Site

Multi-page marketing site for [andeshomeservices.com](https://www.andeshomeservices.com), migrated from the Jekyll one-pager. Built with **Astro + Tailwind + React islands**, deployed on **Vercel** with serverless API routes for Jobber and Google Places.

## Rollout plan

| Phase | Status | What |
|-------|--------|------|
| **Week 1** | Done | Multi-page site, content migration, contact form UI |
| **Week 2** | Ready to wire | `/api/contact` → Jobber GraphQL (`clientCreate` + `requestCreate`) |
| **Week 3** | Ready to wire | `/api/reviews` → Google Places API (cached 24h) |

## Quick start

```bash
cd ~/Projects/andes-home-services-web
npm install
cp .env.example .env
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Pages

- `/` — Home
- `/about` — About + safety / MISS DIG
- `/services` — Services index
- `/services/stump-grinding` — Service detail
- `/service-areas` — Counties index
- `/service-areas/macomb-county` (and wayne, oakland)
- `/gallery` — Project photos
- `/reviews` — Google reviews (Week 3)
- `/faq` — FAQ
- `/contact` — Contact form

## Week 2 — Jobber GraphQL setup

### 1. Create a Jobber app

1. Go to [Jobber Developer Center](https://developer.getjobber.com/)
2. Create an app and note **Client ID** + **Client Secret**
3. Complete OAuth once to obtain a **refresh token** (store it securely — this is your long-lived credential)

OAuth token endpoint:

```
POST https://api.getjobber.com/api/oauth/token
```

The app uses `grant_type=refresh_token` server-side to obtain short-lived access tokens. See `src/lib/jobber.ts`.

### 2. Set environment variables

```env
JOBBER_CLIENT_ID=your_client_id
JOBBER_CLIENT_SECRET=your_client_secret
JOBBER_REFRESH_TOKEN=your_refresh_token
JOBBER_GRAPHQL_VERSION=2025-01-20
```

Check the latest GraphQL version in the [Jobber API docs](https://developer.getjobber.com/docs/using_jobbers_api/api_queries_and_mutations/).

### 3. Required OAuth scopes

Your app needs permission to create clients and requests. Verify scopes in the Developer Center match:

- `clients` (read/write)
- `requests` (read/write)

### 4. What the contact API does

`POST /api/contact` accepts:

```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@example.com",
  "phone": "2485550100",
  "address": "123 Main St",
  "city": "Shelby Township",
  "state": "MI",
  "postalCode": "48316",
  "message": "Two stumps in backyard, side gate access."
}
```

Flow:

1. `clientCreate` mutation → new Jobber client
2. `requestCreate` mutation → quote request linked to that client

Honeypot field `website` silently accepts bots.

### 5. Deploy env vars on Vercel

```bash
vercel env add JOBBER_CLIENT_ID
vercel env add JOBBER_CLIENT_SECRET
vercel env add JOBBER_REFRESH_TOKEN
vercel env add JOBBER_GRAPHQL_VERSION
```

## Week 3 — Google reviews setup

### 1. Google Cloud

1. Create a project in [Google Cloud Console](https://console.cloud.google.com/)
2. Enable **Places API (New)**
3. Create an API key restricted to your domain + the Places API

### 2. Find your Place ID

Search your business on Google Maps → share link, or use the [Place ID finder](https://developers.google.com/maps/documentation/javascript/examples/places-placeid-finder).

### 3. Environment variables

```env
GOOGLE_PLACES_API_KEY=your_api_key
GOOGLE_PLACE_ID=ChIJ...
```

`GET /api/reviews` returns cached review data (24h in-memory cache on the serverless instance). The reviews page fetches from this endpoint client-side.

**Note:** Google Places returns up to 5 reviews per location. Author attribution is required per Google's terms — the UI includes it.

## Deploy

```bash
npm run build
vercel
```

Or connect the GitHub repo to Vercel for automatic deploys.

## Project structure

```
src/
  components/     # Astro + React UI
  config/         # Site metadata
  data/           # Content (FAQ, services, areas, gallery)
  layouts/        # BaseLayout, PageLayout
  lib/
    jobber.ts     # Jobber OAuth + GraphQL client
    google-places.ts
  pages/
    api/          # Serverless endpoints
    ...
```

## Replacing the old Jekyll site

The original one-pager lives at `~/Projects/andes-home-services`. When ready:

1. Point DNS / GitHub Pages to Vercel (or deploy target)
2. Update `CNAME` if needed
3. Retire the Jekyll repo or archive it

## Commands

| Command | Action |
|---------|--------|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run check` | TypeScript + Astro check |
