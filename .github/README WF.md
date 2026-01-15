# Supabase Keep-Alive Setup

This directory contains the automated solution to prevent your Supabase project from pausing due to inactivity.

## How It Works

1. **API Endpoint** (`/api/keep-alive`): Makes a simple database query to Supabase
2. **GitHub Actions**: Automatically calls the endpoint every 3 days
3. **Monitoring**: Logs success/failure for tracking

## Setup Instructions

### 1. Deploy Your Website

First, deploy your Next.js app to a hosting platform:
- **Vercel** (Recommended): Automatic deployments from GitHub
- **Netlify**: Another great option with auto-deploy
- **Other**: Any platform that supports Next.js

### 2. Update GitHub Actions

Edit `.github/workflows/keep-supabase-active.yml`:

```yaml
# Replace this URL with your actual deployed URL
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://YOUR-DOMAIN/api/keep-alive)
```

For example:
- Vercel: `https://your-project.vercel.app/api/keep-alive`
- Netlify: `https://your-project.netlify.app/api/keep-alive`
- Custom domain: `https://ambooka.dev/api/keep-alive`

### 3. Enable GitHub Actions

1. Go to your GitHub repository
2. Click on **"Actions"** tab
3. If prompted, enable GitHub Actions for your repository
4. The workflow will run automatically every 3 days

### 4. Test the Setup

#### Option A: Manual Test via GitHub
1. Go to **Actions** tab in your repository
2. Click on **"Keep Supabase Active"** workflow
3. Click **"Run workflow"** button
4. Check the logs to confirm success

#### Option B: Test via Browser
Visit your keep-alive endpoint directly:
```
https://your-domain/api/keep-alive
```

You should see a JSON response:
```json
{
  "success": true,
  "message": "Supabase project is active",
  "timestamp": "2025-11-28T18:42:00.000Z",
  "dataExists": true
}
```

## Alternative: External Cron Services

If you prefer not to use GitHub Actions, you can use a free external cron service:

### Option 1: cron-job.org (Free)
1. Visit [cron-job.org](https://cron-job.org)
2. Create a free account
3. Add a new cron job:
   - **URL**: `https://your-domain/api/keep-alive`
   - **Schedule**: Every 3 days
   - **Method**: GET

### Option 2: EasyCron (Free tier available)
1. Visit [easycron.com](https://www.easycron.com)
2. Sign up for free account
3. Create cron job with your endpoint URL
4. Set to run every 72 hours

### Option 3: UptimeRobot (Monitoring + Keep-Alive)
1. Visit [uptimerobot.com](https://uptimerobot.com)
2. Create a free account
3. Add HTTP(s) monitor:
   - **URL**: `https://your-domain/api/keep-alive`
   - **Interval**: 5 days (maximum for free tier)
4. Bonus: You also get uptime monitoring!

## Monitoring

### Check GitHub Actions Logs
1. Go to **Actions** tab
2. Click on latest **"Keep Supabase Active"** run
3. View logs to see if ping was successful

### Check Supabase Dashboard
1. Log into [Supabase Dashboard](https://app.supabase.com)
2. Check your project status
3. Verify "Last Activity" timestamp updates regularly

## Schedule Details

- **Frequency**: Every 3 days (72 hours)
- **Why 3 days**: Supabase pauses after 7 days of inactivity, so 3 days provides a safe buffer
- **Time**: 00:00 UTC (can be adjusted in the workflow file)

## Customization

### Change Frequency

Edit `.github/workflows/keep-supabase-active.yml`:

```yaml
schedule:
  # Daily at midnight UTC
  - cron: '0 0 * * *'
  
  # Every 2 days
  - cron: '0 0 */2 * *'
  
  # Weekly on Mondays
  - cron: '0 0 * * 1'
```

### Change Database Table

Edit `src/app/api/keep-alive/route.ts`:

```typescript
// Change 'personal_info' to your preferred table
const { data, error } = await supabase
  .from('your_table_name')  // <-- Change this
  .select('id')
  .limit(1)
  .single()
```

## Troubleshooting

### Error: "Supabase credentials not configured"
- Check that `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set in your deployment environment variables

### Error: "Table 'personal_info' not found"
- Update the API route to use a table that exists in your database
- Or create a simple `keep_alive` table just for this purpose

### GitHub Actions not running
- Ensure Actions are enabled in your repository settings
- Check that the workflow file is in `.github/workflows/` directory
- Verify the cron syntax is correct

### Endpoint returns 404
- Ensure your app is deployed and running
- Check that the URL in GitHub Actions matches your deployed domain
- Verify the API route file is at `src/app/api/keep-alive/route.ts`

## Cost

This solution is **100% FREE**:
- ✅ GitHub Actions: 2,000 minutes/month on free tier (this uses ~1 minute/month)
- ✅ API calls: No cost for calling your own Next.js API
- ✅ Supabase: Keeps your free tier active

## Questions?

If you encounter issues, check:
1. GitHub Actions logs for error messages
2. Your deployed app's logs (Vercel/Netlify dashboard)
3. Supabase dashboard for connection issues
