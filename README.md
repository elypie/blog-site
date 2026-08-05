# EL Journal — Dynamic Supabase Integration Guide

This repository powers **EL Journal**, a modern blog and portfolio website built with HTML, CSS, JavaScript, and dynamic **Supabase** database integration hosted on **Vercel**.

---

## 🚀 Quick Setup: Connecting your Blog to Supabase

Follow these simple steps to connect your website to Supabase so that all blog posts, categories, and image uploads are stored dynamically in the database without needing to edit code or push Git commits!

---

### Step 1: Create a Free Supabase Project
1. Go to [Supabase.com](https://supabase.com) and log in / create a free account.
2. Click **New Project**, choose a project name (e.g., `elys-blog`), set a secure database password, and choose your preferred region.
3. Once your project is created, click on **Project Settings** (gear icon at the bottom left) -> **API**.
4. Copy your **Project URL** and **`anon` `public` key**.

---

### Step 2: Execute the Database Schema SQL
1. In your Supabase Dashboard, click on the **SQL Editor** tab on the left sidebar.
2. Click **New Query**.
3. Open the [`supabase/schema.sql`](supabase/schema.sql) file from this repository, copy its entire contents, and paste it into the Supabase SQL Editor.
4. Click **Run**.

> This will automatically create all required tables (`posts`, `categories`, `profiles`), Row Level Security (RLS) policies, indexes, and initial category seed data.

---

### Step 3: Create your Admin Login in Supabase Auth
1. In your Supabase Dashboard, go to **Authentication** -> **Users**.
2. Click **Add User** -> **Create User**.
3. Enter your admin email (e.g., `ely.admin@elysblog.com` or your personal email) and a strong password.
4. Click **Create User**.

> You can now log into your admin portal at `/admin/login.html` using these credentials!

---

### Step 4: Configure Vercel Environment Variables
To securely connect your Vercel deployment to Supabase:

1. Open your Vercel Dashboard at [vercel.com](https://vercel.com).
2. Select your `blog-site` project.
3. Go to **Settings** -> **Environment Variables**.
4. Add the following two environment variables:

| Key | Value | Environment |
|---|---|---|
| `SUPABASE_URL` | `https://your-project.supabase.co` | Production, Preview, Development |
| `SUPABASE_ANON_KEY` | `your-long-anon-public-key` | Production, Preview, Development |

5. Click **Save** and trigger a **Redeploy** on Vercel.

---

## 🛠️ Features & Usage

### 📝 Publishing New Articles
- Navigate to your deployed site at `/admin/login.html`.
- Sign in with your Supabase credentials.
- Click **+ Create New Blog** in the CMS dashboard.
- Write your post using the built-in WYSIWYG editor (supports live preview, rich text, images, blockquotes, and code blocks).
- Click **Save & Publish**.
- **Result**: The new post is immediately stored in Supabase PostgreSQL and displayed live on your public homepage and blog list without editing HTML or pushing code!

---

## ⚙️ Architecture & Data Fallback
- **Public Fetching**: Queries published articles (`status = 'Published'`) from Supabase DB via `@supabase/supabase-js`.
- **Admin Dashboard**: Secure authentication via Supabase Auth + full CRUD table management for posts and categories.
- **Offline / Graceful Fallback**: If Supabase keys are not set yet, the application gracefully falls back to local data so the site never crashes.
