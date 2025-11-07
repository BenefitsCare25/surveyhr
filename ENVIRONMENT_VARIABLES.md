# Environment Variables Setup Guide

Complete guide for setting up environment variables in Render for your HR Survey application.

---

## 📋 Required Environment Variables

Your application needs **3 environment variables** to function properly:

| Variable Name | Purpose | Required | Example Value |
|---------------|---------|----------|---------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ Yes | `https://abcdefghijk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | ✅ Yes | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NODE_VERSION` | Node.js runtime version | ✅ Yes | `18.17.0` |

---

## 🔍 How to Find Supabase Credentials

### Step 1: Access Supabase Dashboard

1. Go to [https://app.supabase.com](https://app.supabase.com)
2. Log in with your Supabase account
3. You'll see your project dashboard

### Step 2: Open Your Project

1. Click on your **HR Survey** project (or the project you created)
2. If you haven't created a project yet:
   - Click **"New Project"**
   - Enter project name: `HR Survey`
   - Choose a database password (save this!)
   - Select region closest to your users
   - Click **"Create new project"**
   - Wait 2 minutes for project setup

### Step 3: Navigate to API Settings

1. Look at the **left sidebar**
2. Click the **Settings** icon (⚙️ gear icon at the bottom)
3. In the settings menu, click **"API"**

### Step 4: Copy Project URL

1. You'll see a section called **Project URL**
2. The URL format is: `https://xxxxxxxxxxxxx.supabase.co`
3. Click the **copy icon** next to the URL, or
4. Select the entire URL and copy it (Ctrl+C / Cmd+C)
5. **Save this** - you'll need it for `NEXT_PUBLIC_SUPABASE_URL`

**Example:**
```
Project URL: https://abcdefghijk.supabase.co
```

### Step 5: Copy Anon Key

1. Scroll down to **Project API keys** section
2. You'll see two keys:
   - **anon public** ← Use this one ✅
   - **service_role** ← Don't use this ❌
3. Find the **anon public** key
4. Click the **copy icon** or select and copy the entire key
5. **Save this** - you'll need it for `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Example:**
```
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODc1MzYwMDAsImV4cCI6MjAwMzExMjAwMH0.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## ⚙️ How to Add Variables in Render

### Method 1: Add Individual Variables (Recommended)

During the Render web service setup:

1. Scroll down to the **Environment** section
2. You'll see an **"Add Environment Variable"** button

**Add Variable 1:**
```
Click "Add Environment Variable"
Key: NEXT_PUBLIC_SUPABASE_URL
Value: [Paste your Supabase Project URL here]
```

**Add Variable 2:**
```
Click "Add Environment Variable"
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: [Paste your Supabase anon public key here]
```

**Add Variable 3:**
```
Click "Add Environment Variable"
Key: NODE_VERSION
Value: 18.17.0
```

### Method 2: Bulk Add from .env Format

If Render provides "Add from .env" option:

1. Click **"Add from .env"** button
2. Paste this template with YOUR actual values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.your-actual-key-here
NODE_VERSION=18.17.0
```

3. Click **"Add Variables"**

---

## ✅ Verification Checklist

Before deploying, verify each variable:

### NEXT_PUBLIC_SUPABASE_URL
- [ ] Starts with `https://`
- [ ] Contains `.supabase.co` at the end
- [ ] No spaces before or after the URL
- [ ] Example: `https://abcdefghijk.supabase.co`

### NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Starts with `eyJ`
- [ ] Very long string (200+ characters)
- [ ] Contains dots (.) separating sections
- [ ] No spaces before or after the key
- [ ] This is the **anon public** key, NOT service_role

### NODE_VERSION
- [ ] Set to `18.17.0` or `18` or `20`
- [ ] No quotes around the version number
- [ ] Example: `18.17.0`

---

## 🔒 Security Best Practices

### ✅ DO:
- Use the **anon public** key (safe for client-side)
- Store variables in Render's environment (not in code)
- Enable Row Level Security (RLS) in Supabase
- Keep your `.env.local` file in `.gitignore`

### ❌ DON'T:
- Never use the **service_role** key in frontend
- Never commit `.env` or `.env.local` to git
- Never share your service_role key publicly
- Never hardcode credentials in source code

**Why `anon` key is safe:**
- It's designed for client-side (browser) use
- Has limited permissions controlled by RLS policies
- Cannot bypass database security rules
- Safe to expose in frontend code

---

## 🛠 Updating Environment Variables After Deployment

If you need to change environment variables after deploying:

1. Go to Render Dashboard
2. Click on your **surveyhr** web service
3. Go to **"Environment"** tab (left sidebar)
4. Click **"Add Environment Variable"** or edit existing ones
5. Make your changes
6. Click **"Save Changes"**
7. Render will automatically redeploy with new variables

---

## 🐛 Troubleshooting Environment Variables

### Error: "Supabase URL is required"

**Cause:** `NEXT_PUBLIC_SUPABASE_URL` is missing or incorrect

**Fix:**
1. Check variable name is exactly: `NEXT_PUBLIC_SUPABASE_URL`
2. Verify the URL starts with `https://`
3. Ensure no extra spaces
4. Redeploy after fixing

### Error: "Invalid API key"

**Cause:** `NEXT_PUBLIC_SUPABASE_ANON_KEY` is incorrect or missing

**Fix:**
1. Go back to Supabase → Settings → API
2. Copy the **anon public** key (not service_role!)
3. Ensure you copied the entire key
4. Update in Render and redeploy

### Error: Build fails with Node version error

**Cause:** `NODE_VERSION` is missing or incompatible

**Fix:**
1. Add `NODE_VERSION=18.17.0`
2. Alternative values: `18`, `18.17`, `20`
3. Redeploy

### App deploys but shows blank page

**Cause:** Environment variables not loaded properly

**Fix:**
1. Check all 3 variables are present in Render
2. Check for typos in variable names (case-sensitive!)
3. Check for extra spaces in values
4. Trigger manual redeploy

---

## 📊 Expected Environment Variables in Render

After setup, your Render environment should show:

```
Environment Variables (3)

┌─────────────────────────────────┬──────────────────────────────────────┐
│ Key                             │ Value                                │
├─────────────────────────────────┼──────────────────────────────────────┤
│ NEXT_PUBLIC_SUPABASE_URL        │ https://abcdefg.supabase.co          │
│ NEXT_PUBLIC_SUPABASE_ANON_KEY   │ eyJhbGciOiJIUzI1NiIsInR... (hidden)  │
│ NODE_VERSION                    │ 18.17.0                              │
└─────────────────────────────────┴──────────────────────────────────────┘
```

---

## 🎯 Quick Reference

Copy this checklist and fill in your values:

```
✅ NEXT_PUBLIC_SUPABASE_URL
   Value: ________________________________

✅ NEXT_PUBLIC_SUPABASE_ANON_KEY
   Value: ________________________________

✅ NODE_VERSION
   Value: 18.17.0
```

---

## 📚 Additional Resources

- **Supabase API Docs**: https://supabase.com/docs/guides/api
- **Render Environment Variables**: https://render.com/docs/environment-variables
- **Next.js Environment Variables**: https://nextjs.org/docs/basic-features/environment-variables

---

## ✉️ Need Help?

If you're stuck:
1. Double-check all variable names are spelled exactly as shown
2. Verify you copied the complete values (no truncation)
3. Check Render build logs for specific error messages
4. Verify your Supabase project is active and database table is created

---

**Ready to deploy?** Go back to `DEPLOY_QUICK_START.md` and continue with deployment!
