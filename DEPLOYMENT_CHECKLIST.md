# Deployment Checklist ✅

## Step 1: Resolve Database Errors (LOCAL)

### Current Issue
Network errors show `net::ERR_NAME_NOT_RESOLVED` because **Supabase tables don't exist yet**.

### Fix: Apply Database Migrations

1. **Open Supabase SQL Editor**
   - URL: https://supabase.com/dashboard/project/vhcapsgwemepzvlubtdy/sql/new

2. **Copy the complete migration SQL** from `supabase/migrations/001_initial_schema.sql` + `002_rag_tables.sql`

3. **Run in SQL Editor** and verify success ✓

4. **Refresh browser** at http://localhost:5176

5. **Test form submission** - Should work without network errors

---

## Step 2: Verify All Systems (LOCAL)

- [ ] Form submits without `ERR_NAME_NOT_RESOLVED` errors
- [ ] Prospect data saves to database
- [ ] Agent traces appear in request panel
- [ ] Real-time WebSocket connections established
- [ ] No console errors
- [ ] UI responds to all interactions

**Check Browser Console**: Should show no red errors

---

## Step 3: Commit Changes (LOCAL)

```bash
cd C:\Projects\pichincha

# Create final commit
git add .
git commit -m "Final deployment: Database schema applied and verified

- All database tables created and tested
- Real-time subscriptions working
- API integration verified
- No network errors
- Production ready

Co-Authored-By: Claude Haiku 4.5 <noreply@anthropic.com>"
```

---

## Step 4: Push to GitHub

```bash
git push origin main
```

**Verify**: https://github.com/mao2319/pichincha/commits/main

---

## Step 5: Deploy to Vercel

### Option A: Automatic (Recommended)
1. Push to main (done in step 4)
2. Vercel automatically deploys
3. Monitor deployment at: https://vercel.com/mao2319

### Option B: Manual Deploy
```bash
# If using Vercel CLI
vercel deploy --prod
```

### Environment Variables in Vercel

Make sure these are set in Vercel dashboard:
```
VITE_SUPABASE_URL=https://db.vhcapsgwemepzvlubtdy.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
VITE_ANTHROPIC_API_KEY=apikey_01Xp7GJKu32b1ndTgysmivkL
VITE_APP_ENV=production
```

---

## Step 6: Verify Production Deployment

After Vercel deployment completes:

- [ ] Visit deployment URL
- [ ] Test onboarding form submission
- [ ] Verify data saves to Supabase
- [ ] Check browser console for errors
- [ ] Test all navigation sections

---

## Step 7: Post-Deployment Monitoring

### Add Error Tracking
```bash
npm install @sentry/react @sentry/tracing
```

**Initialize Sentry**:
```typescript
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://your-key@sentry.io/project-id",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Add Analytics
```bash
npm install posthog-js
```

**Track user actions**:
```typescript
import posthog from 'posthog-js';

posthog.capture('onboarding_started', {
  product: formData.product,
  timestamp: new Date().toISOString()
});
```

---

## Step 8: Performance Monitoring

### Enable Vercel Analytics
1. Go to project settings in Vercel
2. Enable "Web Analytics"
3. Monitor:
   - Page load time
   - CLS (Cumulative Layout Shift)
   - LCP (Largest Contentful Paint)
   - FID (First Input Delay)

---

## ✅ Final Pre-Launch Checklist

- [ ] Database migrations applied to Supabase
- [ ] All network errors resolved
- [ ] Form submissions working locally
- [ ] No console errors
- [ ] Code committed to GitHub
- [ ] Environment variables configured in Vercel
- [ ] Deployment successful
- [ ] Production URL accessible
- [ ] Form works on production
- [ ] Monitoring tools installed

---

## 🚀 Launch Command

When everything is verified:

```bash
# All done! Application is live!
echo "✅ Pichincha AI Platform is now LIVE!"
```

---

## 📞 Quick Reference

| Component | Status | URL |
|-----------|--------|-----|
| **Local Dev** | ✅ Running | http://localhost:5176 |
| **GitHub Repo** | ✅ Ready | https://github.com/mao2319/pichincha |
| **Supabase** | ⏳ Needs Migration | https://supabase.com/dashboard/project/vhcapsgwemepzvlubtdy |
| **Vercel Deploy** | ⏳ Ready | vercel.com |
| **Production** | ⏳ Pending | TBD after deploy |

---

**Status**: 🟡 **AWAITING DATABASE MIGRATION**  
**Next Action**: Apply SQL migrations to Supabase  
**After That**: Push, Deploy, Monitor ✨
