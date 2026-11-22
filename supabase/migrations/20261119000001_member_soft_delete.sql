-- Preserve membership, attendance, and progress history when an owner removes a member.
ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

CREATE INDEX IF NOT EXISTS idx_members_visible
  ON public.members(status, created_at)
  WHERE deleted_at IS NULL;

-- The application API uses the service role and enforces signed-in roles itself.
-- These policies also scope direct authenticated Supabase access correctly.
CREATE OR REPLACE FUNCTION public.current_app_role()
RETURNS TEXT
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
  SELECT role FROM public.profiles WHERE user_id = auth.uid() LIMIT 1
$$;

REVOKE ALL ON FUNCTION public.current_app_role() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.current_app_role() TO authenticated;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'leave_applications'
      AND policyname = 'Owners view all leave applications'
  ) THEN
    CREATE POLICY "Owners view all leave applications"
      ON public.leave_applications FOR SELECT USING (
        public.current_app_role() IN ('super_admin', 'admin')
      );
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'leave_applications'
      AND policyname = 'Owners review leave applications'
  ) THEN
    CREATE POLICY "Owners review leave applications"
      ON public.leave_applications FOR UPDATE
      USING (public.current_app_role() IN ('super_admin', 'admin'))
      WITH CHECK (public.current_app_role() IN ('super_admin', 'admin'));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'leave_applications'
      AND policyname = 'Staff submit own leave applications'
  ) THEN
    CREATE POLICY "Staff submit own leave applications"
      ON public.leave_applications FOR INSERT WITH CHECK (
        employee_id IN (
          SELECT id FROM public.employees
          WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid())
        )
      );
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.soft_delete_member(target_member_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  target_profile_id UUID;
BEGIN
  SELECT profile_id INTO target_profile_id
  FROM public.members
  WHERE id = target_member_id AND deleted_at IS NULL
  FOR UPDATE;

  IF target_profile_id IS NULL THEN
    RETURN FALSE;
  END IF;

  UPDATE public.members
  SET deleted_at = timezone('utc'::text, now()),
      status = 'inactive',
      updated_at = timezone('utc'::text, now())
  WHERE id = target_member_id;

  UPDATE public.profiles
  SET is_active = FALSE,
      updated_at = timezone('utc'::text, now())
  WHERE id = target_profile_id;

  RETURN TRUE;
END;
$$;

REVOKE ALL ON FUNCTION public.soft_delete_member(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.soft_delete_member(UUID) TO service_role;
