# Quick Deployment Guide - 10 Minutes

Fast track guide to deploy your HR Survey app to Render.

---

## Part 1: Push to GitHub (2 minutes)

### Option A: Using Git Bash or Terminal

```bash
# 1. Initialize git
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit: HR Survey application"

# 4. Add remote repository
git remote add origin https://github.com/BenefitsCare25/surveyhr.git

# 5. Push to GitHub
git branch -M main
git push -u origin main
```

### Option B: Using GitHub Desktop

1. Open GitHub Desktop
2. File → Add Local Repository → Choose `C:\Users\huien\surveyhr`
3. Click "Create Repository"
4. Click "Publish Repository"
5. Set repository name: `surveyhr`
6. Organization: `BenefitsCare25`
7. Click "Publish Repository"

---

## Part 2: Deploy to Render (5 minutes)

### 1. Create Render Account
- Go to https://render.com
- Sign up with GitHub
- Authorize Render

### 2. Create Web Service
- Click **"New +"** → **"Web Service"**
- Select repository: `BenefitsCare25/surveyhr`
- Click **"Connect"**

### 3. Configure Service

**Basic Settings:**
```
Name: surveyhr
Region: Singapore (or closest to you)
Branch: main
Build Command: npm install && npm run build
Start Command: npm start
```

**Environment Variables:** ⚡ CRITICAL - Add These in Render

Scroll down to "Environment Variables" section and click **"Add Environment Variable"** for each:

**Variable 1:**
```
Key: NEXT_PUBLIC_SUPABASE_URL
Value: https://your-project-id.supabase.co
```

**Variable 2:**
```
Key: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (your long key)
```

**Variable 3:**
```
Key: NODE_VERSION
Value: 18.17.0
```

**Total: 3 environment variables must be added!**

### 4. Deploy
- Click **"Create Web Service"**
- Wait 3-5 minutes for build to complete
- Click the URL to open your app!

---

## Where to Find Supabase Credentials

### Quick Steps:
1. Go to https://app.supabase.com
2. Open your project
3. Click **Settings** (⚙️) → **API**
4. Copy **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
5. Copy **anon public** key (NOT service_role) → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**📖 Detailed Guide:** See `ENVIRONMENT_VARIABLES.md` for complete step-by-step instructions with screenshots and troubleshooting.

---

## Your Live URLs

After deployment:
- **Survey Form**: `https://surveyhr.onrender.com`
- **Admin Dashboard**: `https://surveyhr.onrender.com/admin`

---

## Common Issues

### Git Authentication Required

If git asks for credentials:

**Option 1: Use Personal Access Token**
1. Go to GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Select scope: `repo`
4. Copy token
5. Use as password when git prompts

**Option 2: Use GitHub CLI**
```bash
gh auth login
```

### Build Failed on Render

Check these:
- ✅ Environment variables are correct (no typos)
- ✅ Supabase project is active
- ✅ Build command: `npm install && npm run build`
- ✅ Start command: `npm start`

### App Shows Error

- Go to Render → Logs tab
- Look for errors
- Verify environment variables match Supabase credentials

---

## Next Steps

After deployment:
1. ✅ Test survey submission
2. ✅ Check admin dashboard
3. ✅ Share URL with HR teams
4. ✅ Monitor responses in Supabase

---

**Need more details?** See `RENDER_DEPLOYMENT.md` for comprehensive guide.
