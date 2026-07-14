# TradeSea

A private, offline-safe trading journal optimised for desktop and iPhone.

## Features

- Apple-inspired light and dark UI
- Desktop sidebar and iPhone bottom navigation
- Screenshot uploads from desktop, Photos, Camera or Files
- Date presets and custom date-range performance filters
- Dashboard, journal, analytics and AI coach views
- IndexedDB persistence so saved trades remain available through connection loss
- Offline app shell via service worker
- Delete previous journal entries
- Export and restore JSON backups
- Automatic R-multiple and P&L calculation
- Optional OpenAI screenshot-analysis API route

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Vercel

The included `vercel.json` uses the public npm registry and a production Next.js build.

## Optional AI scanning

Copy `.env.example` to `.env.local` and add your OpenAI API key. The manual journal works without it.

## Data storage

TradeSea stores data in the browser's IndexedDB on each device. This protects entries during internet outages and hosting connection loss. Use Settings → Export backup to move or protect data. Cross-device live sync requires adding a cloud database such as Supabase later.
