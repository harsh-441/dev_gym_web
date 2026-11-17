# PARSHURAM FITNESS GYM — DEPLOYMENT & PRODUCTION RELEASE GUIDE

**Ecosystem Architecture**:
- **Website & Central Admin**: Next.js App Router (Hosted on Vercel)
- **Database & Storage**: Supabase Managed PostgreSQL with RLS
- **Member Mobile Application**: React Native Expo (EAS Build for Android & iOS)
- **Employee Mobile Application**: React Native Expo (EAS Build for Android & iOS)

---

## 1. Supabase Database & Auth Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Open `supabase/migrations/20261117000001_initial_schema.sql` and execute the script.
   - This creates all 28 normalized tables with foreign keys, indexes, and Row Level Security (RLS) policies.
4. Open `supabase/seed/seed.sql` and run it to populate Dave's owner profile, trainers, initial exercise library, and Indian nutrition plans.
5. In **Project Settings -> API**, copy:
   - `Project URL` -> `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key -> `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key -> `SUPABASE_SERVICE_ROLE_KEY`

---

## 2. Deploying the Website & Admin to Vercel

1. Push your repository to GitHub / GitLab.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repository.
3. Configure project settings:
   - **Root Directory**: `apps/web`
   - **Framework Preset**: Next.js
   - **Build Command**: `next build`
   - **Output Directory**: `.next`
4. Add the Environment Variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `OPENAI_API_KEY` (Optional)
5. Click **Deploy**. Vercel will build and assign your production domain.

---

## 3. Building the Member Mobile Application (Android & iOS)

1. Navigate to `apps/member-app`.
2. Install EAS CLI globally if not already installed:
   ```bash
   npm install -g eas-cli
   ```
3. Authenticate with your Expo account:
   ```bash
   eas login
   ```
4. Configure EAS build profiles:
   ```bash
   eas build:configure
   ```
5. **Build Android Release (`.apk` or `.aab`)**:
   ```bash
   # Standalone test APK:
   eas build --platform android --profile preview
   
   # Production Google Play Store AAB:
   eas build --platform android --profile production
   ```
6. **Build iOS Release (`.ipa`)**:
   ```bash
   eas build --platform ios --profile production
   ```

---

## 4. Building the Employee Mobile Application (Android & iOS)

1. Navigate to `apps/employee-app`.
2. Log into EAS and configure:
   ```bash
   eas build:configure
   ```
3. **Build Android Release**:
   ```bash
   eas build --platform android --profile production
   ```
4. **Build iOS Release**:
   ```bash
   eas build --platform ios --profile production
   ```

---

## 5. Third-Party Infrastructure Cost Summary for Dave

To keep operational expenses minimal, all core platform features (attendance, leave applications, workouts, diets) are free for users. Third-party infrastructure costs should be budgeted as follows:

| Service | Provider | Free Tier Availability | Estimated Cost on Growth |
| :--- | :--- | :--- | :--- |
| **Website & API Hosting** | Vercel | Free Hobby Tier available for initial launch | \$20/month on Pro plan |
| **PostgreSQL Database & Auth** | Supabase | Free Tier (500MB DB, 50k monthly active users) | \$25/month for Pro |
| **AI Meal & Workout Synthesis** | OpenAI (GPT-4o-mini) | Server includes fallback generator if \$0 balance | ~\$2 to \$5 / 1,000 generated plans |
| **Apple Developer Program** | Apple | No free tier (Required to publish on App Store) | \$99 / year |
| **Google Play Console** | Google | No free tier (Required to publish on Play Store) | \$25 one-time fee |
| **Custom Domain Registration** | Cloudflare / Namecheap | ~\$10 to \$15 / year | ~\$12 / year |

> **Policy**: Always obtain Dave's explicit authorization before upgrading to paid tiers or publishing to production stores.
