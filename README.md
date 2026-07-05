# VyomaStack

AI-Powered Developer Platform — "The GitHub of Developer Tools"

## Getting started (run locally)

This scaffold was hand-generated (no network access in the generating sandbox),
so before running it you need to install dependencies:

```bash
cd website
npm install
```

Then add shadcn/ui (interactive, needs to be run locally):

```bash
npx shadcn@latest init
```

Run the dev server:

```bash
npm run dev
```

Visit http://localhost:3000

## Folder structure

```
website/
├── src/
│   ├── app/          # Next.js App Router pages
│   ├── components/   # Reusable UI components
│   ├── layouts/       # Page layout wrappers
│   ├── tools/         # Individual tool implementations
│   ├── blogs/         # Blog content/components
│   ├── lib/           # Utilities (cn, helpers)
│   ├── hooks/         # Custom React hooks
│   ├── types/         # Shared TypeScript types
│   └── styles/        # Global CSS
└── public/            # Static assets
```

## Roadmap

- Sprint 1: Foundation & landing page ✅ (this scaffold)
- Sprint 2: First 10 tools (SQL Formatter, JSON Formatter, XML Formatter, UUID Generator, JWT Decoder, Base64 Encoder, URL Encoder, Hash Generator, Regex Tester, Cron Generator)
- Sprint 3: SEO & blog
- Sprint 4: AI-powered tools (Explain SQL, Optimize SQL, etc.)
- Sprint 5: Monetization (Ads, API, Premium)
