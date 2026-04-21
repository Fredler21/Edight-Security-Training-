# EdLight Security Training Platform

EdLight Security Training Platform is a premium internal cybersecurity training website for EdLight employees. It is built to improve security awareness across the organization through structured learning modules, interactive quizzes, progress tracking, and administration tools. The platform is designed to feel like a real SaaS product — polished, fast, and easy for non-technical employees to use, while giving administrators full visibility into participation and completion.

The entire system — frontend, backend, API routes, authentication, and data models — is written in TypeScript.

---

## Platform Roadmap

The product is built across four phases:

| Phase | Scope |
|---|---|
| **V1** | Public website, training modules, quiz system, AI-generated visuals — static, no auth |
| **V2** | Google login (Firebase Auth), employee dashboard, real progress tracking per user |
| **V3** | Admin dashboard, employee management table, Google Workspace directory sync |
| **V4** | Automated reminders, compliance reports, analytics, enterprise training management |

> **Current state: V1 is complete.** V2 and beyond are planned and documented in `PRD.md`.

---

## Website Structure

```
edlight-security-training/
│
├── Public Area (no login required)
│   ├── /                         → Homepage — hero, features, module preview, CTA
│   └── /login                    → Google login page (company domain only)
│
├── Employee Area (login required — V2+)
│   ├── /dashboard                → Welcome, progress overview, module cards
│   ├── /modules                  → All training modules with status and filters
│   ├── /modules/[slug]           → Individual module — lecture, quiz, takeaways
│   ├── /progress                 → Full completion breakdown, quiz results
│   └── /settings                 → Profile and preferences
│
└── Admin Area (V3 — elevated role required)
    ├── /admin                    → Overview — completion rate, org-wide metrics
    ├── /admin/employees          → Searchable employee table, synced from Workspace
    ├── /admin/employees/[id]     → Individual employee training record
    └── /admin/settings           → Platform config, role management, sync settings
```

---

## Training Modules (V1)

Five modules ship in V1. Each includes a full lecture, key takeaways, a real-life scenario, and an interactive quiz with scoring:

| # | Module | Topics Covered |
|---|---|---|
| 1 | Password Security | Strong passwords, password managers, MFA |
| 2 | Phishing Awareness | Identifying phishing emails, links, and spoofing |
| 3 | Safe Browsing | HTTPS, browser hygiene, public Wi-Fi risks |
| 4 | Company Access Policy | Least-privilege principle, data handling, permissions |
| 5 | Device and Network Security | Device locking, VPN, software updates |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 — App Router, TypeScript |
| Styling | Tailwind CSS with custom design tokens |
| Icons | Lucide React |
| Module Images | Gemini Imagen 4.0 — AI-generated, 16:9, one per module |
| Auth (V2) | Firebase Authentication — Google provider, `@edlight.org` domain only |
| Database (V2+) | Cloud Firestore |
| Workspace Sync (V3) | Google Workspace Directory API |
| Hosting | Vercel |

---

## Graphic System

The visual identity is built around three core color tokens:

| Token | Hex | Usage |
|---|---|---|
| **Navy** | `#0f1629` | Sidebar, dark backgrounds, primary headings |
| **Teal** | `#0d9488` | Brand accent — buttons, links, active states, highlights |
| **Charcoal** | `#334155` | Body text, secondary labels, icons |

**Module illustrations** are AI-generated using Gemini Imagen 4.0 at a 16:9 aspect ratio. Each image is unique to its training topic and is displayed as a full-width hero banner on the individual module page and as a thumbnail on module cards throughout the dashboard and listing views.

**Component design language:**
- Rounded cards with subtle shadows and hover lift effects
- Status badges — Not Started / In Progress / Completed — across all module surfaces
- Animated progress bars with percentage labels
- Sidebar navigation with active route highlighting
- Light theme by default (dark mode planned for V4)
- Fully responsive layout for desktop, tablet, and mobile

---

## User Roles

| Role | Access Level |
|---|---|
| **Employee** | Sign in, view and complete modules, track personal progress |
| **Admin** | All employee access + org-wide dashboard, employee management table |
| **Super Admin** | All admin access + platform configuration, role assignment, sync settings |

---

## Project Structure

```
src/
├── app/
│   ├── page.tsx                  → Homepage
│   ├── login/page.tsx            → Login
│   ├── not-found.tsx             → Custom 404
│   └── (dashboard)/
│       ├── layout.tsx            → Shared sidebar layout
│       ├── dashboard/page.tsx    → Employee dashboard
│       ├── modules/page.tsx      → Module listing
│       ├── modules/[slug]/page.tsx → Individual module
│       ├── progress/page.tsx     → Progress tracker
│       └── settings/page.tsx     → Settings
├── components/
│   ├── PublicNavbar.tsx
│   ├── PublicFooter.tsx
│   ├── DashboardSidebar.tsx
│   ├── ModuleCard.tsx            → Card with thumbnail image + status badge
│   ├── ModuleView.tsx            → Full module — lecture, quiz, takeaways
│   ├── QuizSection.tsx           → Interactive quiz with scoring
│   ├── ProgressBar.tsx
│   └── StatusBadge.tsx
├── data/
│   └── modules.ts                → All 5 module content + image paths
├── types/
│   └── index.ts                  → TypeScript interfaces for all data models
└── lib/
    └── cn.ts                     → Tailwind class merge utility

public/
└── images/modules/
    ├── password-security.png
    ├── phishing-awareness.png
    ├── safe-browsing.png
    ├── company-access-policy.png
    └── device-and-network-security.png
```

---

## Running Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Build

```bash
npm run build
```

Produces a fully static optimized build across all 14 routes with zero runtime server requirements (V1).
