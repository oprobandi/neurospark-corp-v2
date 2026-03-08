# Neurospark Corporation — Landing Page

Nairobi-built. World-ready. A conversion-focused landing page for Neurospark Corporation.

## Tech Stack
- **React 18** + **Vite 5**
- **Tailwind CSS 3**
- **Lucide React** icons

## Local Development

```bash
npm install  # also installs Husky pre-commit hook
npm run dev
```

## Deploy to Vercel

### Option A — Vercel CLI (fastest)
```bash
npm install  # also installs Husky pre-commit hook -g vercel
npm install  # also installs Husky pre-commit hook
vercel
```
Follow the prompts. Vercel auto-detects Vite. Done.

### Option B — Vercel Dashboard (drag & drop)
1. Run `npm install  # also installs Husky pre-commit hook && npm run build` locally
2. Go to [vercel.com/new](https://vercel.com/new)
3. Drag and drop the `dist/` folder
4. Done — live in seconds

### Option C — GitHub Integration
1. Push this folder to a GitHub repo
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import the repo
4. Vercel auto-detects Vite settings:
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install  # also installs Husky pre-commit hook`
5. Click Deploy

## Project Structure

```
neurospark-corporation/
├── public/
│   └── logo.jpg              # Favicon + OG image
├── src/
│   ├── assets/
│   │   └── logo.jpg          # Logo used in navbar & footer
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Wordmark.jsx  # Logo + name lockup
│   │   │   ├── Buttons.jsx   # BtnGold, BtnGhost
│   │   │   └── Eyebrow.jsx   # Section eyebrow labels
│   │   ├── Navbar.jsx
│   │   ├── Hero.jsx
│   │   ├── StatsStrip.jsx
│   │   ├── Chapter.jsx       # Problem/Solution sections
│   │   ├── BrandMoment.jsx
│   │   ├── Testimonials.jsx
│   │   ├── FinalCTA.jsx
│   │   ├── Footer.jsx
│   │   └── WhatsAppWidget.jsx
│   ├── hooks/
│   │   └── useInView.js      # Scroll-triggered animations
│   ├── constants.js          # Colors + Unsplash image URLs
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css             # Tailwind + custom animations
├── index.html
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── vercel.json
└── package.json
```

## WhatsApp
The floating widget and contact form both link to **+254 799 644 100**.
To change the number, update `VITE_WHATSAPP_NUMBER` in your `.env.local` file.

## Contact Form
The contact form POSTs to [Formspree](https://formspree.io).
Set `FORMSPREE_ID` in `src/pages/ContactPage.jsx` to your Formspree form ID.
Form submissions are delivered to **pnyangwara@gmail.com**.
