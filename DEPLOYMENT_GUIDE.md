# Deployment guide

## Supabase

1. Apply the SQL files under `supabase/migrations` in ascending filename order. The attendance-history migration is additive. It retains existing rows and intentionally fails if pre-existing duplicate member/date records need owner review.
2. Take a Supabase backup before applying schema changes. The migration does not drop tables or attendance rows; keep the backup as the rollback point. Reverting the migration after new attendance has been written would require a reviewed data-preserving rollback.
3. Apply `supabase/seed/seed.sql` only to a new project.
4. Create the Owner identity in Supabase Auth and link its Auth UUID to the matching `profiles.user_id` using a trusted SQL editor. The application does not bootstrap an Owner from an email address.
5. Enable email confirmation if desired. New member registrations then need confirmation before login.

## Web deployment

Configure these server environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only)
- `AUTH_TOKEN_SECRET` (long, random secret)

Do not expose the service role key through a `NEXT_PUBLIC_` variable. Deploy the Next.js app with `npm run build:web` and `npm run start:web` (or the platform's Next.js integration). The UI requires a valid signed-in Owner or Member account.

## Backups and retention

Attendance is stored in Postgres `public.member_attendance`, with a unique member/date index and a date/member search index. The app has no age-based deletion task. Configure Supabase backups/PITR appropriate to the database plan and verify restore procedures outside the app; storage limits depend on the deployed Supabase plan.

The repository has no production Supabase credentials, so live migration, auth, and deployment checks must be performed in the target project.
