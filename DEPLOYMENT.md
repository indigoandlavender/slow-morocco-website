# Slow Morocco - Deployment Guide

## What's Included

This is the complete **pre-Nexus** version of Slow Morocco with:

✅ **Plan Your Trip** form (saves to Google Sheets)
✅ All public pages (Home, About, Contact, Journeys, Guides, FAQ)
✅ 4-level Footer (hardcoded, not dynamic from Nexus)
✅ Google Sheets integration for journeys and form submissions
✅ Lovable design system (cream/sand colors)
✅ Fully responsive
✅ Ready to deploy

## Quick Start

### 1. Upload to GitHub

```bash
# Extract the zip file
unzip slow-morocco-pre-nexus.zip
cd slow-morocco-complete

# Initialize git
git init
git add .
git commit -m "Initial commit - Pre-Nexus version"

# Connect to your GitHub repo
git remote add origin https://github.com/YOUR_USERNAME/slow-morocco.git
git branch -M main
git push -u origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "New Project"
3. Import your GitHub repository
4. Add environment variables (see below)
5. Click "Deploy"

### 3. Environment Variables

Add these in Vercel Dashboard → Settings → Environment Variables:

```
GOOGLE_SHEET_ID=your_sheet_id_here
GOOGLE_SERVICE_ACCOUNT_BASE64=your_base64_key_here
RESEND_API_KEY=your_resend_key_here (optional)
CONTACT_EMAIL=hello@slowmorocco.com (optional)
NEXT_PUBLIC_SITE_URL=https://slowmorocco.com
NEXT_PUBLIC_SITE_NAME=Slow Morocco
```

**Important:** The `RESEND_API_KEY` is optional. If you don't add it, form submissions will still save to Google Sheets, you just won't get email notifications.

### 4. Google Sheets Setup

Your Google Sheet needs these tabs:

**Journeys** (with columns):
- id
- slug
- title
- duration
- route
- featuredImage
- summary
- status

**Quotes** (with columns):
- id
- submittedDate
- firstName
- lastName
- email
- phone
- journey
- month
- year
- travelers
- days
- language
- budget
- requests
- hearAboutUs
- status

## What Works

✅ Homepage with featured journeys
✅ Journeys listing (pulls from Google Sheets)
✅ Plan Your Trip form → saves to Quotes sheet
✅ All static pages (About, Contact, Guides, FAQ)
✅ 4-level footer with newsletter signup
✅ Responsive design
✅ SEO-friendly structure

## What's NOT Included (Pre-Nexus)

❌ Dynamic footer from Nexus sheet
❌ Dynamic content pages from Nexus sheet
❌ Admin tools (quote builder, dashboard, etc.)

**This is the stable, working version before Nexus integration.**

## Testing After Deployment

1. Visit your site
2. Navigate to `/plan-your-trip`
3. Fill out the form
4. Check your Google Sheet → should see new row in Quotes tab
5. Check email (if Resend configured)

## Troubleshooting

**Form not submitting?**
- Check Google Sheets API credentials
- Verify GOOGLE_SERVICE_ACCOUNT_BASE64 is set correctly
- Check Vercel logs for errors

**Journeys not showing?**
- Make sure Journeys tab has `status` column set to "Active"
- Check that GOOGLE_SHEET_ID is correct
- Verify service account has access to the sheet

**Styling looks off?**
- Check that globals.css is properly imported
- Verify tailwind.config.ts is in root directory
- Clear browser cache and hard reload

## Next Steps

Once this is deployed and working:
1. Test all pages
2. Test form submission
3. Verify Google Sheets integration
4. Then (optionally) add Nexus integration for dynamic content

## Support

If something isn't working, check:
1. Vercel deployment logs
2. Browser console for errors
3. Google Sheets API quota/permissions

Good luck with deployment! 🚀
