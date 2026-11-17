# PARSHURAM FITNESS GYM — DIGITAL ECOSYSTEM

> *"INSPIRED BY DIVINITY. BUILT THROUGH DISCIPLINE."*
> **Owner & Founder**: Dave | **Brand Aesthetic**: Premium Athletic Crimson, Obsidian, Charcoal & Metallic Silver with respectful Indian cultural motifs.

---

## 1. Overview & Architecture

**Parshuram Fitness Gym** is a complete, production-grade digital gym ecosystem designed for gym owner Dave, his trainers, staff, and members. The platform unifies the public website, a centralized admin dashboard, a member mobile application (Android & iOS), an employee/trainer mobile application (Android & iOS), and a unified backend database with authentication.

### Monorepo Structure

```
d:/Dev_gym/
├── apps/
│   ├── web/                     # Next.js 14 App Router, Tailwind CSS, Lucide icons
│   │   ├── src/app/             # Public landing, 13 content sections, Dave Admin, Member & Staff Portals, APIs
│   │   ├── src/components/      # UI widgets (Navbar, Footer, AnnouncementBar, etc.)
│   │   └── src/app/api/         # REST API endpoints (Attendance, Leaves, AI Planner, Enquiries)
│   ├── member-app/              # React Native + Expo (Android & iOS for Gym Members)
│   │   └── App.tsx              # QR check-in, Workout library, Diet plans, AI Planner, Weight tracker
│   └── employee-app/            # React Native + Expo (Android & iOS for Staff & Trainers)
│       └── App.tsx              # Shift Clock-in/out, Leave request & history, Shift schedule, Profile
├── packages/
│   └── shared/                  # Shared TypeScript package (@parshuram/shared)
│       ├── src/types/           # Database models, roles, attendance, leave, workout types
│       ├── src/constants/       # Brand tokens, initial gym config, exercise & Indian diet catalogs
│       ├── src/validation/      # Validators for registrations, leaves, attendance, AI inputs
│       └── src/api/             # Unified API client & in-memory deterministic fallback store
├── supabase/
│   ├── migrations/              # 28 normalized tables with foreign keys, indexes, and RLS policies
│   └── seed/                    # Initial seed data (Dave, trainers, exercises, Indian nutrition plans)
├── tests/                       # Automated Node.js test suite for critical workflows
├── DAVE_ADMIN_MANUAL.md         # Plain-English operating handbook for gym owner Dave
├── DEPLOYMENT_GUIDE.md          # Comprehensive deployment steps for Vercel, EAS, and Supabase
└── .env.example                 # Environment variables template
```

---

## 2. Core Functional Modules

1. **Public Website (`apps/web`)**:
   - Cinematic hero landing with tagline *"INSPIRED BY DIVINITY. BUILT THROUGH DISCIPLINE."*
   - About the Gym, Certified Trainers Showcase, Workout Programs.
   - Comprehensive Searchable Exercise Library (categorized by muscle groups, difficulty, equipment, safety tips).
   - Diet & Nutrition Guide with Indian vegetarian, non-veg, and budget-friendly options.
   - Interactive AI Fitness & Nutrition Planner (Mifflin-St Jeor sports science calculation with Indian culinary alternatives).
   - Curated YouTube Workout Video Hub with responsive embeds.
   - Member Transformation Gallery & Testimonials.
   - Transparent Membership Plans with contact inquiry integration.
   - Role-based Authentication with one-click demo credentials.

2. **Centralized Administration Dashboard for Dave (`/admin`)**:
   - **Overview**: Real-time member count, active employees, today's attendance, pending leaves, recent enquiries.
   - **Attendance & QR Front Desk**: Live auto-refreshing QR token (configurable validity) for turnstile tablet displays.
   - **Member Management**: Directory, membership status, progress logs, account deactivation.
   - **Employee & Trainer Management**: Staff directory, role assignment, work schedules.
   - **Leave Management**: Review pending staff leaves, one-click Approve / Reject with administrative notes.
   - **Content Management**: Manage exercises, diet plans, YouTube video links, announcements.
   - **Membership Plans**: Configure duration and pricing placeholders.
   - **Enquiries**: Track contact form leads, status updates, follow-up notes.
   - **System Settings**: Update gym phone, email, address, operating hours, QR token refresh rules.

3. **Member Mobile Application (`apps/member-app`)**:
   - Available simultaneously for Android and iOS via Expo.
   - **Free Attendance**: Scan front desk QR code to check in with server verification and duplicate check-in prevention.
   - Personalized workout routine and today's exercise split.
   - Personalized Indian diet plan with macronutrient breakdowns.
   - AI Fitness & Nutrition Planner directly in-app.
   - Body weight & measurement logging with visual progress history.

4. **Employee & Trainer Mobile Application (`apps/employee-app`)**:
   - Available simultaneously for Android and iOS via Expo.
   - **Shift Clock-In & Clock-Out**: QR scan attendance recording separate from member visits.
   - Shift duration calculation and late check-in detection.
   - Leave Application module: Submit leave category, date range, and reason.
   - Real-time leave status tracking (Pending, Approved, Rejected) with Dave's feedback notes.
   - Weekly work shifts and trainer schedule view.

5. **Strict Data Separation (Business Rule)**:
   - Member attendance and employee shifts are strictly segregated into independent data stores (`member_attendance` vs `staff_attendance`).
   - Attendance is **100% free** for all authorized members and staff with zero per-visit charges.

---

## 3. Getting Started & Local Development

### Prerequisites
- Node.js >= 18 (Tested on Node v26)
- npm >= 10

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Automated Verification Tests
```bash
npm test
```
All 9 core tests verify:
- Brand identity tokens & settings
- Member registration validation
- Multi-role authentication (Super Admin, Trainer, Employee, Member)
- Rotating QR code session generation & expiration
- Member attendance check-in & duplicate visit prevention
- Staff attendance shift clocking & work hour separation
- Employee leave submission & Dave approval workflow
- Deterministic AI fitness & nutrition calculation engine
- Dave Admin dashboard metrics aggregation

### 3. Run the Web Application & Admin Dashboard
```bash
npm run dev:web
```
Visit `http://localhost:3000` in your browser.
- **Landing Page**: `http://localhost:3000`
- **Login**: `http://localhost:3000/auth/login` (Includes one-click buttons for Dave, Vikram, Siddharth)
- **Dave's Admin Dashboard**: `http://localhost:3000/admin`
- **Member Web Portal**: `http://localhost:3000/portal/member`
- **Employee Web Portal**: `http://localhost:3000/portal/employee`

### 4. Build the Web Application for Production
```bash
npm run build:web
```

### 5. Run the Mobile Applications

**Member App:**
```bash
npm run dev:member
```
Press `a` to open in Android Emulator, `i` to open in iOS Simulator, or scan the QR code using Expo Go.

**Employee App:**
```bash
npm run dev:employee
```
Press `a` to open in Android Emulator, `i` to open in iOS Simulator, or scan the QR code using Expo Go.

---

## 4. Mobile Releases with EAS Build

### Build Android App (.apk / .aab)
```bash
cd apps/member-app   # or cd apps/employee-app
npx eas-cli build -p android --profile preview
```

### Build iOS App (.ipa)
```bash
cd apps/member-app   # or cd apps/employee-app
npx eas-cli build -p ios --profile preview
```

---

## 5. Supabase Database Setup

1. Create a Supabase project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor**.
3. Run `supabase/migrations/20261117000001_initial_schema.sql` to generate all 28 tables, triggers, and Row Level Security policies.
4. Run `supabase/seed/seed.sql` to populate initial profiles, trainers, exercises, and meal plans.
5. Copy your credentials into `.env.local` based on `.env.example`.

---

## 6. One-Click Credentials for Testing

| Role | Name | Email | Password |
|---|---|---|---|
| **Super Admin / Owner** | Dave | `dave@parshuramgym.com` | `admin123` |
| **Senior Trainer** | Vikram Rathore | `vikram@parshuramgym.com` | `trainer123` |
| **Employee / Staff** | Amit Patel | `amit@parshuramgym.com` | `staff123` |
| **Gym Member** | Siddharth Rao | `siddharth@example.com` | `member123` |

---

## 7. Deliverables & Documentation Index

- **Architecture Plan**: `C:\Users\harsh\.gemini\antigravity\brain\8562bd85-2177-4fcf-bd93-ad31a9c746bf\architecture_plan.md`
- **Owner & Admin Operating Manual**: [DAVE_ADMIN_MANUAL.md](file:///D:/Dev_gym/DAVE_ADMIN_MANUAL.md)
- **Production Deployment Guide**: [DEPLOYMENT_GUIDE.md](file:///D:/Dev_gym/DEPLOYMENT_GUIDE.md)
- **Environment Configuration**: [d:\Dev_gym\.env.example](file:///D:/Dev_gym/.env.example)
- **Database Schema**: [20261117000001_initial_schema.sql](file:///D:/Dev_gym/supabase/migrations/20261117000001_initial_schema.sql)
- **Database Seed Data**: [seed.sql](file:///D:/Dev_gym/supabase/seed/seed.sql)
- **Automated Test Suite**: [gym_workflows.test.js](file:///D:/Dev_gym/tests/gym_workflows.test.js)
