# HR Survey System - Broker Service Level Assessment

A comprehensive web-based questionnaire system for company HR to evaluate broker service performance across 6 key categories. Built with Next.js 14 and Supabase.

## Features

- **Comprehensive Survey Form**: 6 categories with 22 questions total
  - Service Administration (15%)
  - Claims Administration (15%)
  - Customer Service (20%)
  - Presentation (10%)
  - Staff Communication Handbook (10%)
  - Renewal Review (30%)

- **Rating System**: 1-5 scale for individual questions, weighted scoring for overall satisfaction
- **Real-time Score Calculation**: Automatic calculation of total scores and percentages
- **Supabase Integration**: Secure cloud database for response storage
- **Admin Dashboard**: View all submitted responses with filtering and detailed breakdowns
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Deployment**: Ready for Vercel

## Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier works)

## Setup Instructions

### 1. Supabase Database Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor in your Supabase dashboard
3. Copy and paste the contents of `supabase_schema.sql` into the SQL editor
4. Run the SQL script to create the database table and policies

### 2. Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Get your Supabase credentials:
   - Go to Project Settings → API in your Supabase dashboard
   - Copy the `Project URL` and `anon public` key

3. Update `.env.local` with your credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

### 3. Install Dependencies

```bash
npm install
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

### Filling Out the Survey

1. Navigate to the home page (`/`)
2. Enter respondent information (company name, name, email)
3. Optionally select quarter and policy year
4. Rate each question on a 1-5 scale (1=Very Poor, 5=Excellent)
5. Add comments for each category
6. Review the score summary at the bottom
7. Click "Submit Survey" to save the response

### Viewing Responses (Admin)

1. Navigate to `/admin`
2. View all submitted responses in a table format
3. Filter responses by company name
4. Click "View Details" to see full breakdown of any response
5. See statistics including average score, number of companies, and monthly responses

## Project Structure

```
surveyhr/
├── app/
│   ├── page.tsx              # Main survey form page
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard
│   ├── layout.tsx            # Root layout
│   └── globals.css           # Global styles
├── components/
│   ├── SurveyForm.tsx        # Main survey form component
│   ├── CategorySection.tsx   # Category with questions component
│   └── RatingInput.tsx       # Rating input component
├── lib/
│   └── supabase.ts           # Supabase client configuration
├── types/
│   └── survey.ts             # TypeScript type definitions
├── supabase_schema.sql       # Database schema
├── 14-15.pdf                 # Original survey requirements
└── README.md                 # This file
```

## Database Schema

The `survey_responses` table stores:
- Company and respondent information
- Quarter and policy year (optional)
- Scores (JSONB): nested object of category → question → rating
- Comments (JSONB): category → comment text
- Calculated totals: total_score, max_possible_score, percentage_score
- Timestamp of submission

## Scoring System

- Each question has a maximum score (typically 5, or higher for "overall" questions)
- Categories are weighted differently (Service Admin: 15%, Customer Service: 20%, etc.)
- Overall satisfaction target: 80%
- Total maximum possible score: 100 points

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import the repository in Vercel
3. Add environment variables in Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy!

The app will be available at your Vercel URL.

## Security Notes

- Row Level Security (RLS) is enabled on the database
- Public insert policy allows anyone to submit surveys
- Public read policy allows viewing responses (modify as needed)
- Consider adding authentication for the admin dashboard in production
- Never commit `.env.local` to version control

## Customization

### Modify Survey Questions

Edit `types/survey.ts` to change categories, questions, or weights. The form will automatically update.

### Change Styling

Tailwind CSS classes can be modified in component files. Update `tailwind.config.ts` for theme customization.

### Add Authentication

Integrate Supabase Auth to protect the admin dashboard:
1. Enable authentication in Supabase
2. Add login/logout components
3. Update RLS policies to restrict admin access

## Troubleshooting

**Issue**: Form submission fails
- Check `.env.local` has correct Supabase credentials
- Verify database schema is created in Supabase
- Check browser console for error messages

**Issue**: Responses not showing in admin
- Verify RLS policies are set correctly
- Check Supabase table has data
- Refresh the admin page

**Issue**: Build errors
- Run `npm install` to ensure dependencies are installed
- Check TypeScript errors with `npm run lint`
- Verify all imports are correct

## Deployment

### Deploy to Render (Recommended)

This application is optimized for deployment on Render.

**Quick Start:**
1. Push code to GitHub: `BenefitsCare25/surveyhr`
2. Follow the deployment guide
3. Add environment variables in Render dashboard
4. Deploy and share your live URL!

**📚 Deployment Guides:**

| Guide | Purpose | Time |
|-------|---------|------|
| `DEPLOY_QUICK_START.md` | Fast deployment walkthrough | 10 min |
| `RENDER_DEPLOYMENT.md` | Comprehensive deployment guide | Full reference |
| `RENDER_SETUP_VISUAL_GUIDE.md` | Visual step-by-step with screenshots | Detailed |
| `ENVIRONMENT_VARIABLES.md` | Complete environment setup guide | Reference |

**Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NI...
NODE_VERSION=18.17.0
```

See `ENVIRONMENT_VARIABLES.md` for detailed instructions on finding these values.

**Other Deployment Options:**
- Vercel (requires minor configuration)
- Netlify (supports Next.js)
- Railway (similar to Render)
- AWS/GCP/Azure (advanced)

## Support

For issues or questions:
1. Check the Supabase logs in your dashboard
2. Review browser console for errors
3. Verify environment variables are set correctly
4. See deployment guides for troubleshooting

## License

ISC
