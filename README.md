# Smart Bookmark App

A simple bookmark manager built with **Next.js App Router**, **Supabase**, and **Google OAuth**, deployed on **Vercel**.

## 🚀 Live Demo
👉 https://smart-bookmark-app1-weld.vercel.app

## 📦 GitHub Repository
👉 https://github.com/satyam779/Smart-Bookmark-App

---

## 🛠 Tech Stack

- **Next.js** (App Router)
- **Supabase**
  - Authentication (Google OAuth)
  - Database (PostgreSQL)
  - Realtime
- **Tailwind CSS** (basic styling)
- **Vercel** (deployment)

---

## ✨ Features

- Google OAuth login only (no email/password)
- Add bookmarks (Title + URL)
- Bookmarks are private to each user
- Realtime updates across multiple tabs
- Delete your own bookmarks
- Fully deployed on Vercel with a live URL

---

## 🔐 Authentication

- Users sign in using **Google OAuth**
- First-time Google login automatically creates a user (sign-up)
- Returning users are logged in automatically
- Auth is handled entirely by Supabase

---

## 🔄 Realtime Updates

- The app uses **Supabase Realtime** (`postgres_changes`)
- If you open the app in **two tabs**:
  - Adding a bookmark in one tab
  - Instantly updates the other tab
- No page refresh required

---

## 🔒 Data Privacy & Security

- Each bookmark is linked to a `user_id`
- **Row Level Security (RLS)** is enabled in Supabase
- Users can only:
  - View their own bookmarks
  - Insert their own bookmarks
  - Delete their own bookmarks
- User A can never see User B’s data

---

## 🧩 Problems I Faced & How I Solved Them

### 1. Google OAuth `redirect_uri_mismatch`
**Problem:**  
Google login failed with `redirect_uri_mismatch` errors.

**Solution:**  
- Added correct redirect URLs in **Google Cloud Console**
- Registered both:
  - Supabase OAuth callback URL
  - Vercel production callback URL
- Ensured Supabase Auth URL configuration matched the Vercel domain

---

### 2. App worked locally but redirected to another app on Vercel
**Problem:**  
After logging in on Vercel, the app redirected to a different interface instead of my bookmark UI.

**Solution:**  
- Fixed incorrect **Site URL** in Supabase Auth settings
- Removed old Vercel domains from:
  - Supabase redirect URLs
  - Google OAuth redirect URIs
- Ensured `redirectTo` uses `location.origin` instead of hardcoded URLs

---


### 3. Realtime updates not appearing immediately
**Problem:**  
Bookmarks only appeared after refreshing the page.

**Solution:**  
- Enabled **Realtime replication** for the `bookmarks` table in Supabase
- Added a realtime subscription using `postgres_changes`
- Automatically refetched bookmarks on insert/delete events

---


## ▶️ How to Run Locally

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
