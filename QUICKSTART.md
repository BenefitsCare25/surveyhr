# Quick Start Guide

Follow these steps to get your HR Survey System up and running in 10 minutes.

## Step 1: Set Up Supabase (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up for a free account
2. Click "New Project"
3. Fill in project details:
   - Name: `hr-survey-system`
   - Database Password: (choose a strong password)
   - Region: (select closest to your users)
4. Wait for the project to be created (~2 minutes)

## Step 2: Create Database Table (2 minutes)

1. In your Supabase dashboard, click on "SQL Editor" in the left sidebar
2. Click "New Query"
3. Open the `supabase_schema.sql` file in your project
4. Copy all the SQL code and paste it into the Supabase SQL Editor
5. Click "Run" to execute the SQL
6. You should see: "Success. No rows returned"

## Step 3: Get API Credentials (1 minute)

1. In Supabase dashboard, go to Project Settings (gear icon)
2. Click on "API" in the settings menu
3. You'll see two important values:
   - **Project URL**: Something like `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key**: A long string starting with `eyJ...`
4. Keep this tab open, you'll need these values next

## Step 4: Configure Environment Variables (1 minute)

1. In your project folder, copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Open `.env.local` in a text editor

3. Replace the placeholder values with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

4. Save the file

## Step 5: Run the Application (1 minute)

1. Make sure you've installed dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser and go to [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Survey

1. Fill out the survey form with test data
2. Submit the form
3. Go to [http://localhost:3000/admin](http://localhost:3000/admin) to see your response
4. Verify the data is stored correctly

## ✅ You're Done!

Your HR Survey System is now running! Here's what you can do next:

### For Company HR Users:
- Share the main URL: `http://localhost:3000` (or your production URL)
- They can fill out and submit surveys
- No login required for survey submission

### For Admins:
- Visit `/admin` to view all responses
- Filter by company name
- View detailed breakdowns of each submission
- See statistics and analytics

## Deploying to Production (Optional)

To make this available online:

1. Push your code to GitHub
2. Sign up for [Vercel](https://vercel.com) (free)
3. Import your GitHub repository
4. Add environment variables in Vercel settings
5. Deploy!

Your survey will be live at: `https://your-project.vercel.app`

## Troubleshooting

**Survey won't submit:**
- Check `.env.local` has correct Supabase URL and key
- Verify SQL schema was executed successfully in Supabase
- Check browser console for error messages

**Can't see responses in admin:**
- Refresh the page
- Check Supabase Table Editor to verify data exists
- Verify RLS policies are enabled

**Build fails:**
- Run `npm install` again
- Delete `.next` folder and rebuild
- Check for TypeScript errors: `npm run lint`

## Need Help?

Refer to the full [README.md](./README.md) for detailed documentation.
