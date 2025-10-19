# 📁 Complete File Structure

Visual guide to understand where everything is located.

## 🌳 Project Tree

```
xie-student-council/
│
├── 📄 DOCUMENTATION (Start Here!)
│   ├── START_HERE.md              ← Main entry point
│   ├── QUICK_START.md             ← 15-minute setup guide
│   ├── SETUP_GUIDE.md             ← Detailed setup instructions
│   ├── README.md                  ← Complete documentation
│   ├── FEATURES.md                ← All features explained
│   ├── DEPLOYMENT.md              ← Production deployment
│   ├── PROJECT_SUMMARY.md         ← Project overview
│   ├── CHECKLIST.md               ← Testing checklist
│   └── FILE_STRUCTURE.md          ← This file
│
├── 🗄️ DATABASE
│   └── supabase-schema.sql        ← Complete database schema
│
├── ⚙️ CONFIGURATION FILES
│   ├── .env.example               ← Environment variables template
│   ├── .gitignore                 ← Git ignore rules
│   ├── package.json               ← Dependencies and scripts
│   ├── tsconfig.json              ← TypeScript configuration
│   ├── tailwind.config.ts         ← Tailwind CSS configuration
│   ├── postcss.config.js          ← PostCSS configuration
│   ├── next.config.js             ← Next.js configuration
│   └── middleware.ts              ← Clerk authentication middleware
│
├── 📱 APPLICATION CODE
│   │
│   ├── app/                       ← Next.js App Router (Pages)
│   │   │
│   │   ├── 🏠 PUBLIC PAGES
│   │   ├── page.tsx               ← Home page
│   │   ├── layout.tsx             ← Root layout (navbar, footer)
│   │   ├── globals.css            ← Global styles
│   │   │
│   │   ├── events/                ← Events section
│   │   │   ├── page.tsx           ← Events list page
│   │   │   └── [id]/
│   │   │       └── page.tsx       ← Event detail page
│   │   │
│   │   ├── standings/             ← Medal tally
│   │   │   └── page.tsx           ← Standings page
│   │   │
│   │   ├── gallery/               ← Photo gallery
│   │   │   └── page.tsx           ← Gallery page
│   │   │
│   │   ├── drafts/                ← Official notices
│   │   │   ├── page.tsx           ← Drafts list page
│   │   │   └── [id]/
│   │   │       └── page.tsx       ← Draft detail page
│   │   │
│   │   ├── 🔐 AUTHENTICATION
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx       ← Sign in page
│   │   │
│   │   ├── sign-up/
│   │   │   └── [[...sign-up]]/
│   │   │       └── page.tsx       ← Sign up page
│   │   │
│   │   ├── 👑 ADMIN PAGES (Protected)
│   │   ├── admin/
│   │   │   ├── page.tsx           ← Admin dashboard
│   │   │   │
│   │   │   ├── fests/
│   │   │   │   └── page.tsx       ← Fest management
│   │   │   │
│   │   │   ├── events/
│   │   │   │   └── page.tsx       ← Event management
│   │   │   │
│   │   │   ├── winners/
│   │   │   │   └── page.tsx       ← Winner management
│   │   │   │
│   │   │   ├── gallery/
│   │   │   │   └── page.tsx       ← Gallery management
│   │   │   │
│   │   │   ├── drafts/
│   │   │   │   └── page.tsx       ← Draft management
│   │   │   │
│   │   │   └── emails/
│   │   │       └── page.tsx       ← Email management
│   │   │
│   │   └── 🔌 API ROUTES
│   │       └── api/
│   │           └── send-email/
│   │               └── route.ts   ← Email sending API
│   │
│   ├── components/                ← React Components
│   │   │
│   │   ├── navbar.tsx             ← Navigation bar
│   │   │
│   │   └── ui/                    ← UI Components (shadcn/ui)
│   │       ├── button.tsx         ← Button component
│   │       ├── card.tsx           ← Card component
│   │       ├── input.tsx          ← Input component
│   │       ├── label.tsx          ← Label component
│   │       ├── badge.tsx          ← Badge component
│   │       ├── tabs.tsx           ← Tabs component
│   │       ├── dialog.tsx         ← Dialog/Modal component
│   │       ├── select.tsx         ← Select dropdown component
│   │       └── textarea.tsx       ← Textarea component
│   │
│   └── lib/                       ← Utility Functions
│       ├── utils.ts               ← Helper functions
│       ├── supabase.ts            ← Supabase client & types
│       └── email.ts               ← Email utilities
│
└── 📦 GENERATED (Don't Edit)
    ├── node_modules/              ← Installed dependencies
    ├── .next/                     ← Next.js build output
    └── .env.local                 ← Your environment variables (not in git)
```

## 📂 Folder Purposes

### `/app` - Application Pages
All your pages and routes. Next.js uses file-based routing.

**Public Pages** (Anyone can view)
- `/` → `app/page.tsx` (Home)
- `/events` → `app/events/page.tsx` (Events list)
- `/events/[id]` → `app/events/[id]/page.tsx` (Event details)
- `/standings` → `app/standings/page.tsx` (Medal tally)
- `/gallery` → `app/gallery/page.tsx` (Photo gallery)
- `/drafts` → `app/drafts/page.tsx` (Notices list)
- `/drafts/[id]` → `app/drafts/[id]/page.tsx` (Notice details)

**Auth Pages** (Clerk handles these)
- `/sign-in` → Sign in page
- `/sign-up` → Sign up page

**Admin Pages** (Protected - Admins only)
- `/admin` → Admin dashboard
- `/admin/fests` → Manage fests
- `/admin/events` → Manage events
- `/admin/winners` → Manage winners
- `/admin/gallery` → Manage photos
- `/admin/drafts` → Manage notices
- `/admin/emails` → Send emails

**API Routes** (Backend endpoints)
- `/api/send-email` → Email sending endpoint

### `/components` - Reusable Components
React components used across the app.

- `navbar.tsx` - Navigation bar (used in layout)
- `/ui` - UI components from shadcn/ui

### `/lib` - Utility Functions
Helper functions and configurations.

- `utils.ts` - General utilities (date formatting, etc.)
- `supabase.ts` - Database client and TypeScript types
- `email.ts` - Email sending functions

## 📄 Important Files

### Configuration Files

**`.env.local`** (You create this)
- Your secret keys and credentials
- NOT committed to git
- Copy from `.env.example`

**`package.json`**
- Lists all dependencies
- Defines npm scripts
- Project metadata

**`tsconfig.json`**
- TypeScript compiler settings
- Path aliases (@/...)

**`tailwind.config.ts`**
- Tailwind CSS configuration
- Custom colors and themes

**`next.config.js`**
- Next.js configuration
- Image domains

**`middleware.ts`**
- Clerk authentication
- Route protection

### Database

**`supabase-schema.sql`**
- Complete database schema
- Run this in Supabase SQL Editor
- Creates all tables and relationships

### Documentation

**`START_HERE.md`**
- Main entry point
- Navigation guide

**`QUICK_START.md`**
- 15-minute setup guide
- Best for beginners

**`SETUP_GUIDE.md`**
- Detailed setup instructions
- Step-by-step with explanations

**`README.md`**
- Complete technical documentation
- API references
- Troubleshooting

**`FEATURES.md`**
- All features explained
- User and admin features

**`DEPLOYMENT.md`**
- Production deployment guide
- Vercel and Netlify instructions

**`PROJECT_SUMMARY.md`**
- High-level overview
- What's included

**`CHECKLIST.md`**
- Complete testing checklist
- Verify everything works

## 🎨 File Naming Conventions

### Pages
- `page.tsx` - The actual page component
- `layout.tsx` - Layout wrapper
- `[id]` - Dynamic route parameter

### Components
- `PascalCase` for component files
- `kebab-case` for utility files
- `.tsx` for React components
- `.ts` for utilities

### Folders
- `lowercase` for route folders
- `PascalCase` for component folders

## 🔍 Finding Specific Code

### Want to edit...

**Home page content?**
→ `app/page.tsx`

**Navigation bar?**
→ `components/navbar.tsx`

**Colors and styling?**
→ `app/globals.css` and `tailwind.config.ts`

**Database queries?**
→ Look in page files (e.g., `app/events/page.tsx`)

**Admin fest management?**
→ `app/admin/fests/page.tsx`

**Email templates?**
→ `app/api/send-email/route.ts`

**Button styling?**
→ `components/ui/button.tsx`

**Database types?**
→ `lib/supabase.ts`

## 📝 File Relationships

### How Pages Connect

```
Home (page.tsx)
  ├─→ Events (events/page.tsx)
  │     └─→ Event Detail (events/[id]/page.tsx)
  │
  ├─→ Standings (standings/page.tsx)
  │
  ├─→ Gallery (gallery/page.tsx)
  │
  └─→ Drafts (drafts/page.tsx)
        └─→ Draft Detail (drafts/[id]/page.tsx)

Admin Dashboard (admin/page.tsx)
  ├─→ Fest Management (admin/fests/page.tsx)
  ├─→ Event Management (admin/events/page.tsx)
  ├─→ Winner Management (admin/winners/page.tsx)
  ├─→ Gallery Management (admin/gallery/page.tsx)
  ├─→ Draft Management (admin/drafts/page.tsx)
  └─→ Email Management (admin/emails/page.tsx)
```

### Component Usage

```
layout.tsx
  └─→ navbar.tsx
        └─→ button.tsx (from ui/)

page.tsx (any page)
  ├─→ card.tsx (from ui/)
  ├─→ button.tsx (from ui/)
  ├─→ badge.tsx (from ui/)
  └─→ dialog.tsx (from ui/)
```

### Data Flow

```
Page Component
  └─→ Supabase Query (lib/supabase.ts)
        └─→ Database (Supabase)

Admin Action
  └─→ Form Submit
        └─→ Supabase Insert/Update/Delete
              └─→ Database
                    └─→ Page Revalidates
                          └─→ Updated Data Shown
```

## 🚫 Don't Edit These

- `node_modules/` - Managed by npm
- `.next/` - Build output, regenerated
- `package-lock.json` - Managed by npm

## ✏️ Safe to Edit

- All files in `app/` - Your pages
- All files in `components/` - Your components
- `app/globals.css` - Styling
- `tailwind.config.ts` - Theme colors
- Documentation files

## 📦 After Installation

```
xie-student-council/
├── ... (all files above)
├── node_modules/        ← Created by npm install
├── .next/               ← Created by npm run dev
└── .env.local           ← You create this
```

## 🎯 Quick Reference

**Need to change colors?**
→ `app/globals.css`

**Need to add a page?**
→ Create folder in `app/`

**Need to add a component?**
→ Create file in `components/`

**Need to change database?**
→ Edit `supabase-schema.sql` and re-run

**Need to add environment variable?**
→ Add to `.env.local`

---

**Now you know where everything is!** 🎉

Next: Go to [QUICK_START.md](QUICK_START.md) to set up the project!
