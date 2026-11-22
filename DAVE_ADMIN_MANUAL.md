# Owner / Admin operating guide

Sign in at `/auth/login` with the Owner account configured in Supabase Auth. The seeded Owner profile must be linked to its Auth user UUID before the first sign-in. The Owner console is at `/admin`; ordinary member accounts cannot access its APIs.

## Members and plans

Use **Members** to review the member directory and account status. Use **Membership Plans** to review the current plan catalog. Member account creation is available through the public registration flow, which uses Supabase Auth and stores the member profile in the database.

## Attendance history

Open **Member Attendance** from the Owner console.

1. Choose a gym-local date to review daily attendance, or search by member name or member ID.
2. Use **Mark attendance** to record a visit for a member. Owner-entered rows are labeled as manual.
3. Select **Correct** to change the visit date/time; enter a reason so the correction is saved in the audit table.
4. Use **Export CSV** to download the currently filtered daily results.

Member check-ins are made from the signed-in Member Portal. A member can only check in for their own account. Duplicate entries for the same member and date are rejected by the database.

Attendance records have no automatic 30-day, monthly, or yearly cleanup. The database remains the system of record; arrange regular Supabase backups and retain them according to the gym's storage and legal requirements.

## Data retention

Removing a member through the existing owner flow soft-deletes the member and preserves attendance history. Legacy employee/trainer and staff-attendance tables remain in the database to avoid destroying records or breaking the public trainer relationship. Their staff workflows are not available in the website or mobile app.
