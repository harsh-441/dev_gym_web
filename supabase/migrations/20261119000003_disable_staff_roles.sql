-- Retire staff/trainer portal roles while preserving their account identity and
-- prior state for audit/rollback. Employee/trainer rows remain for coach data.
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS legacy_role TEXT,
  ADD COLUMN IF NOT EXISTS legacy_was_active BOOLEAN;

UPDATE public.profiles
SET legacy_role = role,
    legacy_was_active = is_active,
    role = 'member',
    is_active = FALSE,
    updated_at = timezone('utc'::text, now())
WHERE role IN ('trainer', 'employee') AND legacy_role IS NULL;

ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_role_check CHECK (role IN ('super_admin', 'admin', 'member'));

DROP POLICY IF EXISTS "Staff view own attendance" ON public.staff_attendance;
DROP POLICY IF EXISTS "Staff manage own leaves" ON public.leave_applications;
DROP POLICY IF EXISTS "Staff submit own leave applications" ON public.leave_applications;

DROP POLICY IF EXISTS "Members view own profile" ON public.profiles;
CREATE POLICY "Members view own profile" ON public.profiles FOR SELECT
  USING (user_id = auth.uid() AND is_active = TRUE);

DROP POLICY IF EXISTS "Members view own attendance" ON public.member_attendance;
CREATE POLICY "Members view own attendance" ON public.member_attendance FOR SELECT USING (
  member_id IN (
    SELECT id FROM public.members
    WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND is_active = TRUE AND role = 'member')
  )
);

DROP POLICY IF EXISTS "Members view own progress" ON public.progress_records;
CREATE POLICY "Members view own progress" ON public.progress_records FOR ALL USING (
  member_id IN (
    SELECT id FROM public.members
    WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid() AND is_active = TRUE AND role = 'member')
  )
);
