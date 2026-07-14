# TradeSea

Private AI trading journal for desktop and iPhone with cloud sync, offline local storage, screenshot analysis, personal strategy coaching, custom dashboard tiles and deletion of synced trades.

## 1. Install

```bash
npm install
npm run dev
```

## 2. Create Supabase

1. Create a project at Supabase.
2. Open **SQL Editor**, paste all of `supabase-setup.sql`, and run it once.
3. In **Project Settings > API**, copy the Project URL and anon/public key.
4. In **Authentication > URL Configuration**, add your Vercel production URL as a redirect URL.
5. For the easiest private setup, you can disable email confirmation in **Authentication > Providers > Email**. Otherwise confirm the account from the email Supabase sends.

## 3. Environment variables

Create `.env.local` locally and add the same variables in **Vercel > Project > Settings > Environment Variables**:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
OPENAI_API_KEY=your_openai_api_key
OPENAI_VISION_MODEL=gpt-4.1-mini
```

Never put `OPENAI_API_KEY` in a variable beginning with `NEXT_PUBLIC_`.

## 4. Deploy

Push to GitHub. Vercel rebuilds automatically.

```text
Install Command: npm ci --no-audit --no-fund --registry=https://registry.npmjs.org
Build Command: npm run build
Node.js: 24.x
```

## 5. Use on both devices

Open **Settings** in TradeSea, create an account, then sign into the same account on your desktop and iPhone. Trades, screenshots, deletions and your written strategy sync through Supabase. IndexedDB remains as an offline cache.

## AI strategy coaching

In **Settings > My Trading Strategy**, describe:

- instruments and sessions
- exact entry model
- required confirmations
- invalidation rules
- minimum R:R
- daily risk/loss limits
- psychological rules
- situations where you must not trade

When you upload a screenshot, the server-side OpenAI route extracts visible trade information, compares it against your strategy and adds a mistake, improvement and review. All detected values remain editable before saving.
