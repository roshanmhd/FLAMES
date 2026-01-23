# FLAMES Logging System

A logging system has been added to record every FLAMES calculation.

## Features
1. **Automatic Logging**: Every time someone calculates a result, it is saved.
2. **Admin Dashboard**: A hidden page to view all the logs.
3. **Privacy**: Protected by a password so only you can see it.

## How to Access

1. **URL**: Go to `/admin` (e.g., `http://localhost:3000/admin` or `your-website.com/admin`)
2. **Password**: `admin123`

## Data Storage
The logs are stored in `data/logs.json`.
- **Note**: If you deploy this to Vercel, the logs usually persist only for the duration of the server instance (they might disappear on new deployments). For permanent storage, a real database (like Supabase, Firebase, or MongoDB) would be needed later. For now, this file-based system works perfectly for testing and local use.

## Changing Password
To change the password, edit `src/app/admin/page.js`:
```javascript
// Find this line
if (password === 'admin123') {
// Change 'admin123' to your desired password
```

## 🚀 How to Deploy on Vercel
When you upload this to Vercel, the logging won't work immediately because Vercel doesn't know your Supabase password (Keys). You must tell Vercel what they are.

1.  Go to your **Project Settings** in Vercel.
2.  Click on **Environment Variables** (left sidebar).
3.  Add these two variables (copy them from your `.env.local` file):
    *   **Key**: `NEXT_PUBLIC_SUPABASE_URL`
        *   **Value**: `https://facgvaovpmgsazbmbgss.supabase.co`
    *   **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        *   **Value**: (Your long key starting with `sb_publishable...`)
4.  Click **Save**.
5.  **Redeploy** your app (Deployment -> Redeploy) for changes to take effect.

