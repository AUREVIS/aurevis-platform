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
