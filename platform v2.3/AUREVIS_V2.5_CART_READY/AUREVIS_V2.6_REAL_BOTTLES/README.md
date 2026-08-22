# AUREVIS Platform

Professional React + Vite foundation for AUREVIS HoReCa.

## Local development

```bash
npm install
cp .env.example .env
npm run dev
```

## Netlify

- Build command: `npm run build`
- Publish directory: `dist`
- Functions directory: `netlify/functions`

Add these environment variables in Netlify:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Never commit real secrets.

## First GitHub upload

Open the repository, choose **Add file → Upload files**, unzip this package, and upload all files and folders from inside `aurevis-platform-react`.


## V2.2 — Supabase live catalog

1. Run `supabase/AUREVIS_V2_2_SUPABASE_CATALOG.sql` in Supabase SQL Editor.
2. Add Netlify variables:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
3. Upload this project to GitHub.
4. Netlify deploys automatically.

The catalog falls back safely to local demo products when Supabase is unavailable.

## V2.3 — Account, HoReCa and Admin

1. Run `supabase/AUREVIS_V2_3_AUTH_ACCOUNT_ADMIN.sql` in Supabase SQL Editor.
2. In Supabase → Authentication → Providers → Email, enable Email signups.
3. Register the real owner account once from `/account`.
4. Promote only that account in SQL Editor:

```sql
update public.profiles
set role = 'admin'
where email = 'YOUR_REAL_ADMIN_EMAIL';
```

The public navigation hides Admin. The protected dashboard is available only to
accounts with `profiles.role = 'admin'`; its separate login URL is `/admin/login`.
