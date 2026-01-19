# Roofing Marketplace

AI‑powered roofing marketplace that connects homeowners and contractors through:

- Multi‑photo roof analysis
- Satellite + photo fusion
- Automatic materials estimation
- Contractor bidding and leaderboard
- Admin controls and Stripe billing

Built on **Cloudflare Pages + Workers**, with **Workers KV**, **Stripe**, and **hybrid AI (Cloudflare Workers AI + OpenAI)**.

---

## Features

- **Authentication**
  - Email‑based login with one‑time codes
  - Session management via KV

- **Contractor Experience**
  - Profile management
  - Lead intake and bidding
  - AI insights panel with performance commentary
  - Billing via Stripe Checkout + Billing Portal

- **Homeowner / Intake Flow**
  - Upload up to 5 roof photos
  - AI analysis of roof type, pitch, and square footage
  - Satellite fusion for improved accuracy
  - Automatic materials list generation
  - Quote generation using contractor pricing

- **Admin**
  - Contractor approval / rejection
  - View all bids
  - Monitor marketplace performance

- **Billing**
  - Stripe Checkout for subscriptions
  - Stripe Billing Portal for self‑service management
  - Webhook sync to keep subscription status in KV

---

## Tech Stack

- **Frontend**
  - Single Page Application (SPA) using vanilla JS (`js/app.js`)
  - Modern UI with custom CSS (`css/styles.css`)

- **Backend**
  - Cloudflare Workers Functions (`/functions`)
  - Workers KV for:
    - Sessions
    - Contractors
    - Leads
    - Bids
    - Lead assignments

- **AI**
  - Cloudflare Workers AI for fast image classification
  - OpenAI GPT‑4o / GPT‑4o‑mini for:
    - Vision analysis of roof photos
    - Satellite + photo fusion
    - Contractor performance insights

- **Payments**
  - Stripe Checkout (subscriptions)
  - Stripe Billing Portal
  - Stripe Webhooks

---

## Key Functions

- **Auth**
  - `request-login-code.js`
  - `verify-login-code.js`
  - `me.js`

- **Contractor**
  - `save-contractor-profile.js`
  - `get-roofer-leads.js`
  - `submit-bid.js`
  - `contractor-ai-insights.js`

- **Lead & AI**
  - `analyze-multiple-roof-photos.js`
  - `ai-fusion.js`
  - `materials-list.js`
  - `assign-leads.js`
  - `generate-quotes.js`

- **Admin**
  - `admin-contractors.js`
  - `admin-bids.js`
  - `verify-contractor.js`

- **Billing**
  - `billing-info.js`
  - `create-checkout-session.js`
  - `create-billing-portal-session.js`
  - `stripe-webhook.js`

- **Leaderboard**
  - `contractor-leaderboard.js`

---

## Environment Variables

Configure these in your Cloudflare project:

- **KV Namespaces**
  - `SESSIONS`
  - `CONTRACTORS`
  - `LEADS`
  - `BIDS`
  - `LEAD_ASSIGNMENTS`

- **Stripe**
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PRICE_ID`
  - `STRIPE_WEBHOOK_SECRET`

- **AI**
  - `OPENAI_API_KEY`
  - `AI` (Cloudflare Workers AI binding)

- **Other**
  - `PUBLIC_URL` (e.g. `https://roofing-marketplace.pages.dev`)
  - `MAPBOX_TOKEN` (for satellite imagery in `ai-fusion.js`)

---

## Local Development

1. Install dependencies (if any) and Cloudflare tools:

   ```bash
   npm install
   npm install -g wrangler
