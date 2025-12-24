# Slow Morocco Website

A thoughtful travel website for Slow Morocco - designing intentional journeys through Morocco.

## Features

### Public Website
- Homepage with hero section and featured journeys
- Journeys listing page (pulls from Google Sheets)
- Plan Your Trip form (saves to Google Sheets)
- About, Contact, Guides, FAQ pages
- 4-level footer (Newsletter, Main Links, Legal, Copyright)

### Design System
- Lovable design system with cream/sand color palette
- Custom fonts: Libre Baskerville (serif), Cormorant Garamond (display), Inter (sans)
- Tailwind CSS with CSS variables
- Responsive design

### Google Sheets Integration
- Journeys data
- Form submissions (Quotes sheet)
- Automatic client ID generation (CLI-001, CLI-002, etc.)

## Setup

### 1. Environment Variables

Create a `.env.local` file:

```bash
# Google Sheets Configuration
GOOGLE_SHEET_ID=your_google_sheet_id
GOOGLE_SERVICE_ACCOUNT_BASE64=your_base64_encoded_service_account_json

# Email Configuration (optional - for form notifications)
RESEND_API_KEY=your_resend_api_key
CONTACT_EMAIL=your_email@example.com

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://slowmorocco.com
NEXT_PUBLIC_SITE_NAME=Slow Morocco
```

### 2. Google Sheets Setup

Your Google Sheet should have the following tabs:

**Journeys** tab with columns:
- id
- slug
- title
- duration
- route
- featuredImage
- summary
- status (Active/Inactive)

**Quotes** tab with columns:
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

### 3. Install & Run

```bash
npm install
npm run dev
```

Visit `http://localhost:3000`

## Deployment

### Deploy to Vercel

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Project Structure

```
app/
├── about/          # About page
├── contact/        # Contact page
├── faq/            # FAQ page
├── guides/         # Travel guides hub
├── journeys/       # Journeys listing
├── plan-your-trip/ # Journey request form
├── api/
│   ├── journeys/   # Get journeys from Sheets
│   └── plan-your-trip/ # Submit form to Sheets
├── layout.tsx      # Root layout
├── page.tsx        # Homepage
└── globals.css     # Global styles

components/
├── Header.tsx      # Site header with navigation
└── Footer.tsx      # 4-level footer (hardcoded)

lib/
└── sheets.ts       # Google Sheets utilities
```

## Key Features

### Plan Your Trip Form
- Journey selection (pulls from Sheets)
- Travel dates (month/year)
- Number of travelers
- Trip duration
- Language preference
- Budget range
- Special requests
- Contact information
- Auto-generates client ID (CLI-###)
- Saves to Google Sheets
- Optional email notification via Resend

### Footer Structure
1. **Newsletter** - Email signup with background image
2. **Main Links** - Contact info, journeys, resources, company
3. **Legal Links** - Terms, Privacy, Disclaimer, IP
4. **Copyright** - Simple copyright notice

## Notes

- This version has a **hardcoded footer** (pre-Nexus integration)
- All content pages are standard Next.js pages
- Footer and content are NOT pulling from external Nexus sheet
- To add Nexus integration later, you'll need to update the Footer component and create dynamic content pages

## License

Private - All rights reserved
