-- PARSHURAM FITNESS GYM - PRODUCTION POSTGRESQL SCHEMA & RLS POLICIES
-- Owner: Dave
-- Architecture: Single Shared Database for Website, Member App, Employee App, and Central Admin

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. PROFILES TABLE (Linked to auth.users in Supabase)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID UNIQUE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'admin', 'trainer', 'employee', 'member')),
    avatar_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    emergency_contact TEXT,
    blood_group TEXT,
    fitness_goal TEXT CHECK (fitness_goal IN ('muscle_gain', 'fat_loss', 'weight_gain', 'strength', 'endurance', 'general_fitness')),
    height_cm NUMERIC(5, 2),
    weight_kg NUMERIC(5, 2),
    join_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    department TEXT NOT NULL,
    designation TEXT NOT NULL,
    salary_type TEXT NOT NULL DEFAULT 'monthly' CHECK (salary_type IN ('monthly', 'hourly', 'per_session')),
    joining_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. TRAINERS TABLE
CREATE TABLE IF NOT EXISTS public.trainers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    specializations TEXT[] NOT NULL DEFAULT '{}',
    certifications TEXT[] NOT NULL DEFAULT '{}',
    experience_years INTEGER NOT NULL DEFAULT 0,
    bio TEXT NOT NULL,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.0,
    photo_url TEXT
);

-- 5. MEMBERSHIP PLANS
CREATE TABLE IF NOT EXISTS public.membership_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    duration_months INTEGER NOT NULL CHECK (duration_months > 0),
    price NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    features TEXT[] NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. MEMBERSHIPS
CREATE TABLE IF NOT EXISTS public.memberships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES public.membership_plans(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'expired', 'cancelled')),
    auto_renew BOOLEAN NOT NULL DEFAULT false,
    amount_paid NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    payment_method TEXT NOT NULL DEFAULT 'cash',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 7. ATTENDANCE QR SESSIONS (Rotating token for entry)
CREATE TABLE IF NOT EXISTS public.attendance_qr_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    token TEXT UNIQUE NOT NULL,
    qr_type TEXT NOT NULL DEFAULT 'universal' CHECK (qr_type IN ('member', 'staff', 'universal')),
    created_by UUID REFERENCES public.profiles(id),
    valid_duration_seconds INTEGER NOT NULL DEFAULT 60,
    expires_at TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. MEMBER ATTENDANCE (Strict Free Access, Separate from staff)
CREATE TABLE IF NOT EXISTS public.member_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    check_out_time TIMESTAMPTZ,
    check_in_method TEXT NOT NULL DEFAULT 'qr' CHECK (check_in_method IN ('qr', 'manual')),
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present')),
    qr_session_id UUID REFERENCES public.attendance_qr_sessions(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. STAFF ATTENDANCE (Shift tracking, separate from members)
CREATE TABLE IF NOT EXISTS public.staff_attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    check_in_time TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    check_out_time TIMESTAMPTZ,
    check_in_method TEXT NOT NULL DEFAULT 'qr' CHECK (check_in_method IN ('qr', 'manual')),
    status TEXT NOT NULL DEFAULT 'present' CHECK (status IN ('present', 'late', 'half_day')),
    shift_hours NUMERIC(4, 2),
    qr_session_id UUID REFERENCES public.attendance_qr_sessions(id),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. ATTENDANCE CORRECTIONS (Audit Log for manual overrides by Dave)
CREATE TABLE IF NOT EXISTS public.attendance_corrections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_attendance_id UUID NOT NULL,
    attendance_type TEXT NOT NULL CHECK (attendance_type IN ('member', 'staff')),
    corrected_by UUID NOT NULL REFERENCES public.profiles(id),
    reason TEXT NOT NULL,
    original_check_in TIMESTAMPTZ NOT NULL,
    new_check_in TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 11. LEAVE TYPES
CREATE TABLE IF NOT EXISTS public.leave_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    max_days_per_year INTEGER NOT NULL DEFAULT 12,
    is_paid BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. LEAVE APPLICATIONS
CREATE TABLE IF NOT EXISTS public.leave_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    leave_type_id UUID NOT NULL REFERENCES public.leave_types(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled')),
    admin_note TEXT,
    reviewed_by UUID REFERENCES public.profiles(id),
    reviewed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 13. WORK SCHEDULES
CREATE TABLE IF NOT EXISTS public.work_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    shift_start TIME NOT NULL,
    shift_end TIME NOT NULL,
    is_off BOOLEAN NOT NULL DEFAULT false
);

-- 14. EXERCISES LIBRARY
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'abs', 'cardio', 'full_body')),
    target_muscles TEXT[] NOT NULL DEFAULT '{}',
    equipment TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
    sets TEXT NOT NULL DEFAULT '3',
    reps TEXT NOT NULL DEFAULT '10-12',
    instructions TEXT[] NOT NULL DEFAULT '{}',
    common_mistakes TEXT[] NOT NULL DEFAULT '{}',
    safety_notes TEXT[] NOT NULL DEFAULT '{}',
    demonstration_image_url TEXT,
    video_url TEXT,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 15. WORKOUT PROGRAMS & WORKOUT EXERCISES
CREATE TABLE IF NOT EXISTS public.workout_programs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    level TEXT NOT NULL CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    duration_weeks INTEGER NOT NULL,
    goal TEXT NOT NULL,
    cover_image TEXT,
    days_per_week INTEGER NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.workout_exercises (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workout_program_id UUID NOT NULL REFERENCES public.workout_programs(id) ON DELETE CASCADE,
    exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    order_index INTEGER NOT NULL,
    sets INTEGER NOT NULL DEFAULT 3,
    reps TEXT NOT NULL DEFAULT '10-12',
    rest_seconds INTEGER NOT NULL DEFAULT 60
);

-- 16. DIET PLANS & MEAL ENTRIES
CREATE TABLE IF NOT EXISTS public.diet_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    target_goal TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein_g INTEGER NOT NULL,
    carbs_g INTEGER NOT NULL,
    fat_g INTEGER NOT NULL,
    is_veg BOOLEAN NOT NULL DEFAULT false,
    is_indian BOOLEAN NOT NULL DEFAULT true,
    cost_tier TEXT NOT NULL DEFAULT 'moderate' CHECK (cost_tier IN ('budget', 'moderate', 'premium')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.meal_entries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    diet_plan_id UUID NOT NULL REFERENCES public.diet_plans(id) ON DELETE CASCADE,
    meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    food_item TEXT NOT NULL,
    quantity TEXT NOT NULL,
    calories INTEGER NOT NULL,
    protein_g INTEGER NOT NULL,
    carbs_g INTEGER NOT NULL,
    fat_g INTEGER NOT NULL
);

-- 17. PROGRESS RECORDS
CREATE TABLE IF NOT EXISTS public.progress_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES public.members(id) ON DELETE CASCADE,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    weight_kg NUMERIC(5, 2) NOT NULL,
    chest_cm NUMERIC(5, 2),
    waist_cm NUMERIC(5, 2),
    hips_cm NUMERIC(5, 2),
    biceps_cm NUMERIC(5, 2),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 18. YOUTUBE VIDEOS
CREATE TABLE IF NOT EXISTS public.youtube_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    youtube_id TEXT NOT NULL,
    youtube_url TEXT NOT NULL,
    category TEXT NOT NULL,
    description TEXT NOT NULL,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 19. ANNOUNCEMENTS & NOTIFICATIONS
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    target_audience TEXT NOT NULL CHECK (target_audience IN ('all', 'members', 'employees')),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'high', 'urgent')),
    published_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    expires_at TIMESTAMPTZ,
    author_id UUID REFERENCES public.profiles(id)
);

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    channel TEXT NOT NULL DEFAULT 'in_app' CHECK (channel IN ('in_app', 'email', 'push')),
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 20. ENQUIRIES (Lead Capture)
CREATE TABLE IF NOT EXISTS public.enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_plan TEXT,
    message TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'converted', 'closed')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 21. TESTIMONIALS & TRANSFORMATIONS
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_name TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    story TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT true,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

CREATE TABLE IF NOT EXISTS public.gallery_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    category TEXT NOT NULL,
    before_image_url TEXT NOT NULL,
    after_image_url TEXT NOT NULL,
    duration_months INTEGER NOT NULL,
    description TEXT NOT NULL
);

-- 22. AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor_id UUID REFERENCES public.profiles(id),
    actor_name TEXT NOT NULL,
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id TEXT NOT NULL,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 23. SYSTEM APP SETTINGS
CREATE TABLE IF NOT EXISTS public.app_settings (
    key TEXT PRIMARY KEY,
    value JSONB NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR FREQUENTLY QUERIED COLUMNS
CREATE INDEX IF NOT EXISTS idx_member_attendance_member_date ON public.member_attendance(member_id, check_in_time);
CREATE INDEX IF NOT EXISTS idx_staff_attendance_emp_date ON public.staff_attendance(employee_id, check_in_time);
CREATE INDEX IF NOT EXISTS idx_leave_app_employee ON public.leave_applications(employee_id, status);
CREATE INDEX IF NOT EXISTS idx_exercises_category ON public.exercises(category);
CREATE INDEX IF NOT EXISTS idx_diet_plans_goal ON public.diet_plans(target_goal);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff_attendance ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.progress_records ENABLE ROW LEVEL SECURITY;

-- Dave (Super Admin) has full access
CREATE POLICY "Super admin full profile access" ON public.profiles FOR ALL USING (
    (SELECT role FROM public.profiles WHERE user_id = auth.uid()) = 'super_admin'
);

-- Members can view/edit only their own profile & attendance & progress
CREATE POLICY "Members view own profile" ON public.profiles FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Members view own attendance" ON public.member_attendance FOR SELECT USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Members view own progress" ON public.progress_records FOR ALL USING (
    member_id IN (SELECT id FROM public.members WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);

-- Employees can view only their own attendance and leave records
CREATE POLICY "Staff view own attendance" ON public.staff_attendance FOR SELECT USING (
    employee_id IN (SELECT id FROM public.employees WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
CREATE POLICY "Staff manage own leaves" ON public.leave_applications FOR ALL USING (
    employee_id IN (SELECT id FROM public.employees WHERE profile_id IN (SELECT id FROM public.profiles WHERE user_id = auth.uid()))
);
