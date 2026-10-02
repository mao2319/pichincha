# Pichincha AI Deployment Guide

## Local Development Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Installation Steps

1. **Clone the repository**
```bash
git clone https://github.com/mao2319/pichincha.git
cd pichincha
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**

Create `.env.local` file in the project root:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://db.vhcapsgwemepzvlubtdy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZoY2Fwc2d3ZW1lcHp2bHVidGR5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA4NjIzMzMsImV4cCI6MjEwNjQzODMzM30.EU2dRNmVnKIhBOKHXzvb5kgWj40KEsIxJgeUQNZNx_Q
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_-lAysFMznyIXWWnTFYpsaQ_DzL37CHH

# Claude API Configuration
VITE_ANTHROPIC_API_KEY=sk-ant-your-api-key-here

# Application Configuration
VITE_APP_ENV=development
```

4. **Apply database migrations to Supabase**

```bash
# Using Supabase CLI (if installed)
supabase db push

# Or manually run SQL in Supabase dashboard:
# 1. Go to SQL Editor
# 2. Copy content from supabase/migrations/001_initial_schema.sql
# 3. Run the query
# 4. Repeat for supabase/migrations/002_rag_tables.sql
```

5. **Start development server**
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Vercel Deployment

### Option 1: Automatic Deployment from GitHub

1. **Push code to GitHub**
```bash
git push origin main
```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Select "Import Git Repository"
   - Choose your GitHub repository
   - Click "Import"

3. **Configure Environment Variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add the following variables:

```
VITE_SUPABASE_URL=https://db.vhcapsgwemepzvlubtdy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_ANTHROPIC_API_KEY=sk-ant-...
VITE_APP_ENV=production
```

4. **Configure Build Settings**
   - Framework Preset: Other
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm ci`

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your site will be available at the provided Vercel URL

### Option 2: Manual Deployment with Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy to Vercel
vercel

# Follow the prompts to configure your project
```

## Production Deployment Checklist

- [ ] All environment variables configured in Vercel
- [ ] Database migrations applied to Supabase
- [ ] pgvector extension enabled in Supabase
- [ ] CORS policies configured
- [ ] Rate limiting enabled
- [ ] Error logging configured (Sentry, LogRocket, etc.)
- [ ] Monitor uptime and performance
- [ ] Set up automatic backups

## Supabase Configuration

### Enable pgvector Extension

In Supabase dashboard:

1. Go to SQL Editor
2. Run the following command:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

3. Verify installation:

```sql
SELECT * FROM pg_extension WHERE extname = 'vector';
```

### Configure RLS Policies

Row-level security is already configured in migrations, but you can customize:

```sql
-- View current policies
SELECT * FROM pg_policies WHERE tablename = 'onboarding_requests';

-- Create custom policies per role if needed
ALTER POLICY "Allow select on onboarding_requests" ON public.onboarding_requests
USING (true);
```

### Enable Realtime

1. Go to Supabase project dashboard
2. Navigate to Database > Realtime
3. Select tables: `onboarding_requests`, `agent_traces`
4. Enable realtime

## Monitoring & Logging

### Supabase Monitoring

- Database performance: Project Settings > Database
- API usage: Project Settings > Billing
- Logs: Database > Query Performance

### Vercel Analytics

- Build performance: Deployments tab
- Runtime performance: Analytics tab
- Error tracking: Monitoring tab

## Troubleshooting

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Environment Variable Issues

- Ensure all variables are set in Vercel dashboard (not in .env)
- Check variable names match exactly (case-sensitive)
- Use `VITE_` prefix for frontend variables

### Database Connection Issues

- Verify Supabase URL is correct
- Check API keys are valid
- Ensure database tables exist (run migrations)
- Check RLS policies allow your role

### Supabase Connection Timeout

```env
# Increase connection pool timeout if needed
VITE_SUPABASE_TIMEOUT=30000
```

## Performance Optimization

### Frontend
- Enable output gzip compression: Done by default in Vercel
- Optimize images: Use next/image equivalent
- Code splitting: Vite does this automatically

### Database
- Add indices: Already created in migrations
- Enable query caching: Configured in `rag_cache` table
- Use connection pooling: Supabase handles automatically

### API
- Rate limiting: Configure in Supabase
- CDN caching: Vercel handles automatically
- Compression: Enabled by default

## Rollback Procedure

```bash
# If deployment has issues, rollback in Vercel:
# 1. Go to Deployments tab
# 2. Find the previous working deployment
# 3. Click the three dots menu
# 4. Select "Promote to Production"

# Or via Vercel CLI:
vercel rollback
```

## Continuous Integration

GitHub Actions workflow example (`.github/workflows/deploy.yml`):

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run build
      - run: npm run lint
```

## Support & Documentation

- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Claude API Docs**: https://docs.anthropic.com
- **Vite Docs**: https://vitejs.dev

## Additional Resources

- [GitHub Repository](https://github.com/mao2319/pichincha)
- [Supabase Project](https://supabase.com/dashboard/project/vhcapsgwemepzvlubtdy)
- [Project README](./README.md)
