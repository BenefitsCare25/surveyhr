# Deployment Checklist ✓

Simple checklist to deploy your HR Survey app to Render. Check off items as you complete them.

---

## Pre-Deployment Setup

### Supabase Credentials Ready
- [ ] Go to https://app.supabase.com
- [ ] Open your HR Survey project
- [ ] Navigate to Settings → API
- [ ] Copy **Project URL** and save it
- [ ] Copy **anon public** key and save it
- [ ] Verify database table `survey_responses` exists

**Saved Credentials:**
```
NEXT_PUBLIC_SUPABASE_URL: _______________________________

NEXT_PUBLIC_SUPABASE_ANON_KEY: _______________________________
(First 20 chars: eyJhbGciOiJIUzI1NiIs...)
```

---

## Part 1: Push to GitHub

### Initialize Git Repository
- [ ] Open terminal/command prompt
- [ ] Navigate to: `cd C:\Users\huien\surveyhr`
- [ ] Run: `git init`
- [ ] Run: `git add .`
- [ ] Run: `git commit -m "Initial commit: HR Survey application"`

### Connect to GitHub
- [ ] Run: `git remote add origin https://github.com/BenefitsCare25/surveyhr.git`
- [ ] Run: `git branch -M main`
- [ ] Run: `git push -u origin main`
- [ ] Verify push succeeded (no errors)
- [ ] Visit GitHub: https://github.com/BenefitsCare25/surveyhr
- [ ] Confirm code is visible in repository

**Git Authentication:**
- [ ] If prompted, use Personal Access Token or GitHub CLI
- [ ] Save credentials for future pushes

---

## Part 2: Deploy to Render

### Create Render Account
- [ ] Go to https://render.com
- [ ] Click "Sign Up"
- [ ] Choose "Sign up with GitHub" (recommended)
- [ ] Authorize Render to access your GitHub account
- [ ] Grant access to BenefitsCare25 organization

### Create Web Service
- [ ] From Render Dashboard, click "New +" button
- [ ] Select "Web Service"
- [ ] Find and select repository: `BenefitsCare25/surveyhr`
- [ ] Click "Connect"

### Configure Service Settings
- [ ] **Name:** Enter `surveyhr`
- [ ] **Region:** Select closest region (e.g., Singapore)
- [ ] **Branch:** Select `main`
- [ ] **Root Directory:** Leave empty
- [ ] **Runtime:** Select `Node`
- [ ] **Build Command:** Enter `npm install && npm run build`
- [ ] **Start Command:** Enter `npm start`

### Add Environment Variables (CRITICAL!)

**Variable 1:**
- [ ] Click "Add Environment Variable"
- [ ] Key: `NEXT_PUBLIC_SUPABASE_URL`
- [ ] Value: Paste your Supabase Project URL
- [ ] Click "Add"

**Variable 2:**
- [ ] Click "Add Environment Variable"
- [ ] Key: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- [ ] Value: Paste your Supabase anon public key
- [ ] Click "Add"

**Variable 3:**
- [ ] Click "Add Environment Variable"
- [ ] Key: `NODE_VERSION`
- [ ] Value: `18.17.0`
- [ ] Click "Add"

**Verify All Variables:**
- [ ] Total of 3 environment variables added
- [ ] No typos in variable names (case-sensitive!)
- [ ] No extra spaces in values
- [ ] All values are complete (not truncated)

### Select Instance Type
- [ ] Choose "Free" ($0/month) for testing
- [ ] OR choose "Starter" ($7/month) for production

### Deploy!
- [ ] Review all settings one final time
- [ ] Click "Create Web Service" button
- [ ] Wait for deployment to start

---

## Part 3: Monitor Deployment

### Watch Build Progress
- [ ] See "Cloning repository..." message
- [ ] See "Installing dependencies..." (1-2 minutes)
- [ ] See "Building application..." (1-2 minutes)
- [ ] See "Deploy succeeded" message ✓

**Expected Time:** 3-5 minutes total

### If Build Fails:
- [ ] Check environment variables are correct
- [ ] Verify no typos in variable names
- [ ] Check build logs for specific error
- [ ] Fix issue and click "Manual Deploy"

---

## Part 4: Test Your Application

### Access Live URL
- [ ] Copy your Render URL: `https://surveyhr.onrender.com`
- [ ] Click URL or paste in browser
- [ ] Verify survey form loads correctly

### Test Survey Submission
- [ ] Enter company name
- [ ] Enter your name
- [ ] Enter email address
- [ ] Select quarter (optional)
- [ ] Rate all questions (1-5)
- [ ] Add comments (optional)
- [ ] Verify score calculation shows
- [ ] Click "Submit Survey"
- [ ] See success message

### Test Admin Dashboard
- [ ] Go to: `https://surveyhr.onrender.com/admin`
- [ ] Verify admin page loads
- [ ] See your test submission in table
- [ ] Click "View Details"
- [ ] Confirm all data is correct

### Verify Supabase Database
- [ ] Go to Supabase Dashboard
- [ ] Table Editor → `survey_responses`
- [ ] See your test submission
- [ ] Verify all fields populated correctly

---

## Part 5: Post-Deployment

### Share with Stakeholders
- [ ] Copy survey URL: `https://surveyhr.onrender.com`
- [ ] Copy admin URL: `https://surveyhr.onrender.com/admin`
- [ ] Share with HR teams
- [ ] Provide instructions for filling survey

### Optional: Upgrade Plan
- [ ] If deploying to production, consider upgrading to Starter ($7/mo)
- [ ] Eliminates cold starts (15-min spin-down)
- [ ] Provides always-on availability

### Documentation
- [ ] Bookmark your Render dashboard
- [ ] Save Supabase credentials securely
- [ ] Keep deployment guides for reference

---

## Troubleshooting

### Issue: Git push failed
**Check:**
- [ ] GitHub authentication is set up
- [ ] Using Personal Access Token or GitHub CLI
- [ ] Repository exists: `BenefitsCare25/surveyhr`
- [ ] You have write access to repository

**Fix:** See `DEPLOY_QUICK_START.md` → Git Authentication

---

### Issue: Render build failed
**Check:**
- [ ] All 3 environment variables are added
- [ ] No typos in variable names
- [ ] Build command is: `npm install && npm run build`
- [ ] Start command is: `npm start`

**Fix:** See `RENDER_DEPLOYMENT.md` → Troubleshooting

---

### Issue: App shows blank page
**Check:**
- [ ] Environment variables are correct
- [ ] Supabase project is active
- [ ] Database table exists
- [ ] Build logs show "Compiled successfully"

**Fix:** See `ENVIRONMENT_VARIABLES.md` → Troubleshooting

---

### Issue: Cannot find Supabase credentials
**Check:**
- [ ] Logged into correct Supabase account
- [ ] Using correct project
- [ ] Looking at Settings → API page
- [ ] Copying "anon public" key (not service_role)

**Fix:** See `ENVIRONMENT_VARIABLES.md` → How to Find Credentials

---

## ✅ Deployment Complete!

When all checkboxes are checked:

- ✅ Code is pushed to GitHub
- ✅ Deployed successfully to Render
- ✅ Survey form is live and working
- ✅ Admin dashboard is accessible
- ✅ Database is storing submissions
- ✅ URLs are shared with stakeholders

**Your Live Application:**
- Survey: `https://surveyhr.onrender.com/`
- Admin: `https://surveyhr.onrender.com/admin`

---

## Next Steps

### Ongoing Management:
- [ ] Monitor submissions in admin dashboard
- [ ] Check Supabase for data integrity
- [ ] Respond to user feedback
- [ ] Update survey questions as needed (via git push)

### Future Enhancements:
- [ ] Add authentication to admin dashboard
- [ ] Set up email notifications
- [ ] Export data to Excel/PDF
- [ ] Create analytics dashboards
- [ ] Add quarterly comparison reports

---

## Quick Reference

**Deployment Guides:**
- Fast track: `DEPLOY_QUICK_START.md`
- Full guide: `RENDER_DEPLOYMENT.md`
- Visual guide: `RENDER_SETUP_VISUAL_GUIDE.md`
- Environment vars: `ENVIRONMENT_VARIABLES.md`

**External Links:**
- Render Dashboard: https://dashboard.render.com
- Supabase Dashboard: https://app.supabase.com
- GitHub Repo: https://github.com/BenefitsCare25/surveyhr

---

**Print this checklist and check off items as you complete them!**

Last updated: Ready for deployment ✓
