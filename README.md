# Human Design App

Comprehensive Human Design chart calculation and analysis platform.

## Stack

- **Frontend**: Next.js 16.1.1 (App Router)
- **Database**: Neon (Serverless Postgres)
- **ORM**: Drizzle
- **Auth**: Better Auth
- **AI Chat**: CopilotKit
- **AI Agent**: Pydantic AI (Python)
- **Deployment**: Vercel

## Project Structure

```
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/
│   │   │   ├── auth/          # Better Auth endpoints
│   │   │   ├── chart/         # Chart calculation API
│   │   │   ├── copilotkit/    # CopilotKit runtime
│   │   │   ├── transit/       # Transit calculations
│   │   │   ├── composite/     # Composite charts
│   │   │   └── reference/     # Reference data endpoints
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── components/
│   │   ├── ui/                # Shared UI components
│   │   ├── chart/             # Chart visualization
│   │   └── auth/              # Auth components
│   ├── db/
│   │   ├── index.ts           # Database client
│   │   └── schema.ts          # Drizzle schema
│   ├── lib/
│   │   ├── auth.ts            # Better Auth config
│   │   ├── auth-client.ts     # Client-side auth
│   │   ├── calculation/       # HD calculation engine
│   │   │   ├── chart.ts       # Main chart calculator
│   │   │   ├── ephemeris.ts   # Swiss Ephemeris wrapper
│   │   │   └── mandala.ts     # Gate mapping
│   │   └── reference/         # Static reference data
│   │       ├── channels.ts
│   │       └── crosses.ts
│   └── types/
│       └── index.ts           # TypeScript types
├── agent/                      # Pydantic AI agent (Python)
│   ├── main.py
│   └── requirements.txt
├── drizzle/                    # Database migrations
└── public/
```

## Setup

### 1. Clone and Install

```bash
git clone <repo>
cd intangible-me
npm install
```

### 2. Environment Variables

Copy `.env.example` to `.env.local` and fill in:

```bash
cp .env.example .env.local
```

Required variables:
- `DATABASE_URL` - Neon connection string
- `BETTER_AUTH_SECRET` - Random 32+ character string
- `BETTER_AUTH_URL` - Your app URL
- `OPENAI_API_KEY` - For CopilotKit

### 3. Database Setup

```bash
# Generate migrations
npm run db:generate

# Push schema to Neon
npm run db:push

# Or run migrations
npm run db:migrate
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. (Optional) Run Python Agent

```bash
cd agent
pip install -r requirements.txt
uvicorn main:app --reload
```

## API Endpoints

### Chart Calculation

```
POST /api/chart
{
  "datetime_utc": "1980-09-13T09:15:00Z",
  "lat": 34.0522,
  "lng": -118.2437
}
```

### Transit

```
POST /api/transit
{
  "datetime_utc": "2024-12-21T12:00:00Z"  // optional, defaults to now
}
```

### Reference Data

```
GET /api/reference/gates
GET /api/reference/gates/:id
GET /api/reference/channels
GET /api/reference/types
GET /api/reference/authorities
GET /api/reference/profiles
GET /api/reference/crosses
```

## Deployment

### Vercel

1. Connect GitHub repo to Vercel
2. Add environment variables
3. Deploy

Note: `swisseph` requires native compilation. For Vercel:
- Use `serverComponentsExternalPackages` in `next.config.mjs`
- May need to use Vercel Functions with Node.js runtime

### Python Agent (Separate Service)

Deploy to Railway, Render, or any Python-compatible platform:

```bash
cd agent
# Deploy with your preferred platform
```

## Swiss Ephemeris Note

The `swisseph` npm package wraps the Swiss Ephemeris C library. It works in:
- Local development
- Traditional Node.js servers
- Vercel Serverless Functions (with configuration)

It does NOT work in:
- Edge Runtime
- Cloudflare Workers
- Browser

## Future Enhancements

- [ ] Complete 192 incarnation crosses data
- [ ] Full gate interpretations (64 gates × 6 lines)
- [ ] Chart visualization component
- [ ] Transit overlay on natal chart
- [ ] Composite chart analysis
- [ ] Variables calculation (Phase 2)
- [ ] API rate limiting for external use
- [ ] Webhook for chart events

## License

MIT
