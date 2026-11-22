# Parshuram Fitness Club

Gym management monorepo for the public website, Owner/Admin console, Member portal, and member mobile app.

## Architecture

- `apps/web`: Next.js 14 App Router, React, Tailwind CSS, and server-side REST access to Supabase.
- `apps/member-app`: React Native / Expo member companion app.
- `apps/mobile-app`: unified Owner and Member demo app; staff and trainer access is disabled.
- `packages/shared`: TypeScript models, public gym content, and legacy demo data helpers.
- `supabase`: PostgreSQL schema, row-level security, seeds, and incremental migrations.

The web login uses Supabase Auth. The web API validates a signed application session and uses the server-only Supabase service role for database queries. Member APIs resolve the member from the authenticated profile; they do not trust a member ID from the browser.

## Portals

- Owner/Admin: `/admin`
- Member: `/portal/member`
- Login: `/auth/login`
- Member registration: `/auth/register`

There is no staff login or portal. Public coach listings remain because the existing trainer and employee tables back coach profiles; those related records are retained as legacy/public content. Staff attendance and leave tables are retained in the database for historical preservation and are no longer exposed by application routes.

## Local setup

1. Install dependencies with `npm install`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, and a unique `AUTH_TOKEN_SECRET`.
3. Run the migrations in `supabase/migrations` in filename order, then apply `supabase/seed/seed.sql` if setting up a new database.
4. Create the Owner in Supabase Auth. Link the Auth user to the seeded Owner profile by setting `profiles.user_id` to the Auth user UUID for `dave@parshuramgym.com` (or your designated Owner account). Do this through a trusted SQL console; do not expose the service role key in the browser.
5. Start the web app with `npm run dev:web` and open `http://localhost:3000`.

Set `AUTH_TOKEN_SECRET` to a long random value. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Supabase Auth email confirmation follows the project's Auth settings; when confirmation is enabled, new members must confirm their email before signing in.

## Attendance

- Members check in from their signed-in portal. The server chooses the member from the authenticated profile and records the gym-local attendance date and check-in timestamp.
- Owners can enter attendance for any active member, filter daily records by date/member, export the current result to CSV, and correct a record with a reason.
- A database unique index enforces one record per member per gym-local date. Owner corrections are written to `attendance_corrections` in the same database transaction as the update.
- Attendance stays in `member_attendance` until an Owner explicitly removes it from the database. The application does not apply an automatic age-based deletion policy.
- Apply the additive migration `20261119000002_member_attendance_history.sql`. It preserves existing attendance rows and stops with a clear constraint error if duplicate member/day rows need review; it does not discard those records.

## Verification

- `npm test` runs the shared workflow suite.
- `npm run build:web` builds the production website.

The repository does not include production Supabase credentials. Live authentication, database migrations, and end-to-end portal checks must be run against the configured Supabase project.
