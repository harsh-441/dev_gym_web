-- Add durable daily attendance metadata without deleting or rewriting existing rows.
-- Existing check-in timestamps are retained; date is derived once using the gym's
-- configured local timezone (Asia/Kolkata) and may be corrected by an owner.
ALTER TABLE public.member_attendance
  ADD COLUMN IF NOT EXISTS attendance_date DATE,
  ADD COLUMN IF NOT EXISTS record_source TEXT NOT NULL DEFAULT 'member',
  ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES public.profiles(id),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now());

UPDATE public.member_attendance
SET attendance_date = (check_in_time AT TIME ZONE 'Asia/Kolkata')::date
WHERE attendance_date IS NULL;

UPDATE public.member_attendance
SET record_source = 'owner'
WHERE check_in_method = 'manual' AND record_source = 'member';

ALTER TABLE public.member_attendance
  ALTER COLUMN attendance_date SET NOT NULL;

ALTER TABLE public.member_attendance
  DROP CONSTRAINT IF EXISTS member_attendance_check_in_method_check;
ALTER TABLE public.member_attendance
  ADD CONSTRAINT member_attendance_check_in_method_check
  CHECK (check_in_method IN ('qr', 'manual', 'portal'));

ALTER TABLE public.member_attendance
  ADD CONSTRAINT member_attendance_record_source_check
  CHECK (record_source IN ('member', 'owner'));

ALTER TABLE public.member_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.attendance_corrections ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'member_attendance'
      AND policyname = 'Owners view all member attendance'
  ) THEN
    CREATE POLICY "Owners view all member attendance" ON public.member_attendance
      FOR SELECT USING (public.current_app_role() IN ('super_admin', 'admin'));
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'attendance_corrections'
      AND policyname = 'Owners manage member attendance corrections'
  ) THEN
    CREATE POLICY "Owners manage member attendance corrections" ON public.attendance_corrections
      FOR ALL USING (public.current_app_role() IN ('super_admin', 'admin'))
      WITH CHECK (public.current_app_role() IN ('super_admin', 'admin'));
  END IF;
END;
$$;

-- Creating this index fails safely if pre-existing duplicate daily records need
-- owner review. No attendance row is silently removed by this migration.
CREATE UNIQUE INDEX IF NOT EXISTS idx_member_attendance_one_per_day
  ON public.member_attendance(member_id, attendance_date);
CREATE INDEX IF NOT EXISTS idx_member_attendance_date_member
  ON public.member_attendance(attendance_date DESC, member_id);

CREATE OR REPLACE FUNCTION public.correct_member_attendance(
  target_id UUID,
  corrected_date DATE,
  corrected_time TIMESTAMPTZ,
  owner_id UUID,
  correction_reason TEXT
)
RETURNS public.member_attendance
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  prior public.member_attendance;
  corrected public.member_attendance;
BEGIN
  IF length(trim(correction_reason)) < 3 OR length(correction_reason) > 500 THEN
    RAISE EXCEPTION 'Correction reason must be 3 to 500 characters.';
  END IF;

  SELECT * INTO prior FROM public.member_attendance WHERE id = target_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Attendance record not found.'; END IF;
  IF EXISTS (
    SELECT 1 FROM public.member_attendance
    WHERE member_id = prior.member_id AND attendance_date = corrected_date AND id <> target_id
  ) THEN RAISE EXCEPTION 'Attendance already exists for this member and date.'; END IF;

  INSERT INTO public.attendance_corrections
    (target_attendance_id, attendance_type, corrected_by, reason, original_check_in, new_check_in)
  VALUES (target_id, 'member', owner_id, trim(correction_reason), prior.check_in_time, corrected_time);

  UPDATE public.member_attendance
  SET attendance_date = corrected_date, check_in_time = corrected_time,
      updated_by = owner_id, updated_at = timezone('utc'::text, now())
  WHERE id = target_id
  RETURNING * INTO corrected;
  RETURN corrected;
END;
$$;

REVOKE ALL ON FUNCTION public.correct_member_attendance(UUID, DATE, TIMESTAMPTZ, UUID, TEXT) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.correct_member_attendance(UUID, DATE, TIMESTAMPTZ, UUID, TEXT) TO service_role;
