# Smart Bookmark App

Live URL: https://smart-bookmark-app-six-rho.vercel.app  
GitHub Repo: https://github.com/satyam779/Smart-Bookmark-App  

## Tech Stack

- Next.js (App Router)
- Supabase (Auth, Database, Realtime)
- Tailwind CSS
- Vercel (Deployment)

---

## Features

- Google OAuth login (Supabase Auth)
- Add bookmarks (title + URL)
- Private bookmarks per user (Row Level Security)
- Real-time updates across tabs
- Delete bookmarks
- Deployed on Vercel

---

## Architecture

Frontend:
- Next.js App Router
- Supabase client SDK

Backend:
- Supabase Postgres
- Row Level Security (RLS)
- Supabase Realtime subscriptions

---

## Problems I Ran Into & How I Solved Them

### 1. redirect_uri_mismatch Error
Problem:
Google OAuth failed with redirect URI mismatch.

Solution:
I registered Supabase’s callback URL in Google Cloud Console:
https://PROJECT_ID.supabase.co/auth/v1/callback

---

### 2. Login Loop (Sign in → back to login)
Problem:
After successful login, the app returned to the login screen.

Cause:
Session was not being listened to properly.

Solution:
Implemented `onAuthStateChange()` to update user state when login completes.

---

### 3. Row Level Security Blocking Inserts
Problem:
Insert queries failed after enabling RLS.

Solution:
Created proper RLS policies for:
- SELECT
- INSERT
- DELETE

Using `auth.uid() = user_id`.

---

### 4. Realtime Not Updating
Problem:
Bookmarks did not update across tabs.

Solution:
Subscribed to Supabase `postgres_changes` channel filtered by `user_id`.

---

## Security

- All bookmarks are protected with Row Level Security.
- Users can only read/write their own data.
- No service role key exposed on frontend.
- Uses public anon key only.

---

## How to Run Locally

1. Clone repo
2. Add `.env.local` file:

