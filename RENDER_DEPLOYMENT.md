# Deploy to Render Guide

This guide will walk you through deploying your HR Survey application to Render.

## Prerequisites

Before you begin, make sure you have:
- ✅ Code pushed to GitHub repository `BenefitsCare25/surveyhr`
- ✅ Supabase project created with database table set up
- ✅ Supabase URL and Anon Key from your project settings

---

## Part 1: Push Code to GitHub

### Step 1: Initialize Git Repository

```bash
# Navigate to your project directory (if not already there)
cd C:\Users\huien\surveyhr

# Initialize git
git init

# Add all files to staging
git add .

# Create initial commit
git commit -m "Initial commit: HR Survey application with all features"
```

### Step 2: Connect to GitHub Repository

```bash
# Add GitHub remote repository
git remote add origin https://github.com/BenefitsCare25/surveyhr.git

# Check remote is added correctly
git remote -v

# Push to GitHub
git push -u origin main
```

**Note**: If you get an error about branch name, try:
```bash
git branch -M main
git push -u origin main
```

**Authentication**: You may need to authenticate with GitHub. Use:
- Personal Access Token (recommended)
- GitHub CLI (`gh auth login`)

---

## Part 2: Deploy to Render

### Step 1: Create Render Account

1. Go to [https://render.com](https://render.com)
2. Click "Get Started" or "Sign Up"
3. Sign up with GitHub (recommended for easier deployment)
4. Authorize Render to access your GitHub account

### Step 2: Create New Web Service

1. From Render Dashboard, click **"New +"** button
2. Select **"Web Service"**
3. Connect your GitHub account if not already connected
4. Find and select your repository: **`BenefitsCare25/surveyhr`**
5. Click **"Connect"**

### Step 3: Configure Web Service Settings

Fill in the following settings:

| Setting | Value |
|---------|-------|
| **Name** | `surveyhr` (or any name you prefer) |
| **Region** | Choose closest to your users (e.g., Singapore, Oregon) |
| **Branch** | `main` |
| **Root Directory** | Leave empty (or `.` if required) |
| **Runtime** | `Node` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |
| **Instance Type** | `Free` (or paid plan if needed) |

### Step 4: Add Environment Variables ⚡ CRITICAL STEP

**This is the most important step!** Your app won't work without these variables.

Scroll down to the **Environment Variables** section on the Render setup page.

#### Add Each Variable Individually:

Click **"Add Environment Variable"** button for each of the following:

##### ✅ Required Environment Variables

| Key | Value | Example |
|-----|-------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase Project URL | `https://abcdefghijk.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase Anonymous Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NODE_VERSION` | Node.js version | `18.17.0` |

##### 📋 How to Add Environment Variables in Render:

**Method 1: Add One by One (Recommended)**

1. In the **Environment** section, click **"Add Environment Variable"**
2. Enter **Key**: `NEXT_PUBLIC_SUPABASE_URL`
3. Enter **Value**: `https://your-project-id.supabase.co`
4. Click **"Add Environment Variable"** again
5. Enter **Key**: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Enter **Value**: Your anon key (long string starting with `eyJ...`)
7. Click **"Add Environment Variable"** again
8. Enter **Key**: `NODE_VERSION`
9. Enter **Value**: `18.17.0`

**Method 2: Use Secret Files (Alternative)**

If you prefer to use .env file format:
1. Click **"Add from .env"** button
2. Paste this template and fill in your values:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NODE_VERSION=18.17.0
```
3. Click **"Add Variables"**

---

#### 🔍 Where to Find Your Supabase Credentials

**Step-by-Step:**

1. **Open Supabase Dashboard**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Log in to your account

2. **Select Your Project**
   - Click on your HR Survey project
   - If you haven't created one, create a new project first

3. **Navigate to API Settings**
   - Click the **Settings** icon (⚙️) in the left sidebar
   - Click **API** in the settings menu

4. **Copy Project URL**
   - Find the **Project URL** section
   - Copy the URL (format: `https://xxxxx.supabase.co`)
   - Paste this as `NEXT_PUBLIC_SUPABASE_URL` in Render

5. **Copy Anon Key**
   - Scroll down to **Project API keys** section
   - Find **anon public** key (NOT the service_role key!)
   - Click the copy icon or select and copy the entire key
   - Paste this as `NEXT_PUBLIC_SUPABASE_ANON_KEY` in Render

**⚠️ Important Security Notes:**
- ✅ Use **anon public** key (safe for client-side)
- ❌ Never use **service_role** key (server-side only, full access)
- ✅ The `anon` key is safe to use in browser/frontend code
- ✅ RLS (Row Level Security) policies protect your data

---

#### 🖼️ Visual Guide - Render Environment Variables

Your Render environment variables section should look like this:

```
Environment Variables (3)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Key                              Value
─────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL         https://abcdefg.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY    eyJhbGciOiJIUzI1NiIsInR... (long key)
NODE_VERSION                     18.17.0

[Add Environment Variable]
```

---

#### ✅ Verification Checklist

Before clicking "Create Web Service", verify:

- [ ] `NEXT_PUBLIC_SUPABASE_URL` starts with `https://` and ends with `.supabase.co`
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` is a long string starting with `eyJ`
- [ ] `NODE_VERSION` is set to `18.17.0` or higher
- [ ] No extra spaces before or after values
- [ ] All three variables are added
- [ ] Variable names are exactly as shown (case-sensitive)

### Step 5: Deploy

1. Click **"Create Web Service"** button
2. Render will automatically:
   - Clone your repository
   - Install dependencies
   - Build your Next.js application
   - Deploy to a live URL

**Deployment takes 3-5 minutes**. You'll see build logs in real-time.

### Step 6: Access Your Application

Once deployment succeeds:

1. Your app will be live at: `https://surveyhr.onrender.com` (or similar)
2. Click the URL to open your survey application
3. Test by submitting a survey response
4. Check admin dashboard at: `https://surveyhr.onrender.com/admin`

---

## Important Notes

### Free Tier Limitations

Render's free tier has some limitations:
- **Spin down after inactivity**: App sleeps after 15 minutes of no traffic
- **Cold starts**: First request after sleep takes 30-60 seconds to wake up
- **750 hours/month**: Sufficient for testing and low-traffic usage

**Solution for production**: Upgrade to paid plan ($7/month) for always-on service.

### Custom Domain (Optional)

To use your own domain:
1. Go to your Render service → **Settings**
2. Scroll to **Custom Domains**
3. Click **"Add Custom Domain"**
4. Follow DNS configuration instructions
5. SSL certificate is automatically provisioned

---

## Troubleshooting

### Build Fails

**Error**: `Module not found` or dependency errors
**Solution**:
```bash
# Ensure package.json has all dependencies
npm install
npm run build  # Test locally first
```

### Environment Variables Not Working

**Error**: `Cannot read SUPABASE_URL`
**Solution**:
- Double-check variable names (must be exact, including `NEXT_PUBLIC_` prefix)
- Ensure no extra spaces in values
- Click "Save Changes" after adding variables
- Trigger manual redeploy

### App Not Loading

**Error**: 404 or blank page
**Solution**:
- Check build logs for errors
- Ensure `npm start` command is correct
- Verify Next.js build completed successfully

### Database Connection Failed

**Error**: Supabase connection timeout
**Solution**:
- Verify Supabase project is active
- Check environment variables are correct
- Ensure Supabase RLS policies allow public access (if needed)

---

## Post-Deployment Checklist

After successful deployment:

- [ ] Test survey form submission
- [ ] Verify data appears in Supabase database
- [ ] Check admin dashboard displays responses
- [ ] Test on mobile devices (responsive design)
- [ ] Share URL with stakeholders: `https://your-app.onrender.com`
- [ ] Set up monitoring (Render provides basic metrics)
- [ ] Configure alerts for downtime (optional, paid feature)

---

## Continuous Deployment

Render automatically redeploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update survey form styling"
git push origin main

# Render automatically detects push and redeploys
# No manual action needed!
```

---

## Monitoring & Logs

### View Application Logs

1. Go to Render Dashboard → Your service
2. Click **"Logs"** tab
3. View real-time application logs
4. Filter by time period or search for errors

### Check Metrics

1. Click **"Metrics"** tab
2. View:
   - Request count
   - Response times
   - Memory usage
   - CPU usage

---

## Upgrade Options

### Performance Improvements

| Plan | Price | Benefits |
|------|-------|----------|
| **Free** | $0 | 750 hrs/month, spins down after inactivity |
| **Starter** | $7/mo | Always on, 400 hrs runtime |
| **Standard** | $25/mo | More resources, faster performance |

### When to Upgrade

Upgrade if you need:
- No cold starts (always-on)
- More concurrent users (>10)
- Faster response times
- Production-level reliability

---

## Support

### Render Documentation
- [Next.js Deployment Guide](https://render.com/docs/deploy-nextjs-app)
- [Environment Variables](https://render.com/docs/environment-variables)
- [Custom Domains](https://render.com/docs/custom-domains)

### Project Support
- **Build Issues**: Check `package.json` and build logs
- **Database Issues**: Verify Supabase configuration
- **Performance**: Consider upgrading Render plan

---

## Summary

You now have a fully deployed HR Survey application!

**Your URLs:**
- Survey Form: `https://surveyhr.onrender.com/`
- Admin Dashboard: `https://surveyhr.onrender.com/admin`

**Next Steps:**
1. Share survey URL with HR teams
2. Monitor submissions in admin dashboard
3. Download/export data as needed
4. Consider upgrading for production use

---

**Questions?** Check Render's documentation or review build logs for specific errors.
