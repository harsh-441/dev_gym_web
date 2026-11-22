-- PARSHURAM FITNESS GYM - SEED DATA FOR DEVELOPMENT & INITIAL LAUNCH
-- Includes the Owner, public coach profiles, initial exercises, Indian meal plans, and membership plans

-- Profiles
INSERT INTO public.profiles (id, full_name, email, phone, role, is_active)
VALUES 
    ('d0000000-0000-0000-0000-000000000001', 'Dave (Owner & Founder)', 'dave@parshuramgym.com', '+91 99999 00001', 'super_admin', true),
    ('d0000000-0000-0000-0000-000000000002', 'Vikram Rathore', 'vikram@parshuramgym.com', '+91 99999 00002', 'member', false),
    ('d0000000-0000-0000-0000-000000000003', 'Priya Sharma', 'priya@parshuramgym.com', '+91 99999 00003', 'member', false),
    ('d0000000-0000-0000-0000-000000000004', 'Amit Patel', 'amit@parshuramgym.com', '+91 99999 00004', 'member', false)
ON CONFLICT (id) DO NOTHING;

-- Employees
INSERT INTO public.employees (id, profile_id, department, designation, salary_type, joining_date, status)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'd0000000-0000-0000-0000-000000000001', 'Management', 'Owner & Head Coach', 'monthly', '2025-01-01', 'active'),
    ('e0000000-0000-0000-0000-000000000002', 'd0000000-0000-0000-0000-000000000002', 'Fitness Training', 'Senior Powerlifting Coach', 'monthly', '2025-03-01', 'active'),
    ('e0000000-0000-0000-0000-000000000003', 'd0000000-0000-0000-0000-000000000003', 'Fitness Training', 'Functional & Mobility Coach', 'monthly', '2025-04-01', 'active'),
    ('e0000000-0000-0000-0000-000000000004', 'd0000000-0000-0000-0000-000000000004', 'Operations', 'Floor Supervisor', 'monthly', '2025-06-01', 'active')
ON CONFLICT (id) DO NOTHING;

-- Trainers
INSERT INTO public.trainers (id, employee_id, specializations, certifications, experience_years, bio, rating, photo_url)
VALUES
    ('t0000000-0000-0000-0000-000000000001', 'e0000000-0000-0000-0000-000000000001', '{"Master Strength", "Discipline Protocol"}', '{"CSCS Certified"}', 14, 'Dave leads Parshuram Gym with unwavering focus on divine discipline and physical mastery.', 5.0, 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'),
    ('t0000000-0000-0000-0000-000000000002', 'e0000000-0000-0000-0000-000000000002', '{"Powerlifting", "Spine Biomechanics"}', '{"IPF Certified"}', 9, 'Vikram guides members through elite barbell mechanics and injury prevention.', 4.9, 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80'),
    ('t0000000-0000-0000-0000-000000000003', 'e0000000-0000-0000-0000-000000000003', '{"Functional HIIT", "Mobility"}', '{"ACE Certified"}', 7, 'Priya specializes in athletic conditioning, agile mobility, and functional core power.', 4.95, 'https://images.unsplash.com/photo-1594381898411-846e7d193883?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- Membership Plans (Editable placeholders for Dave)
INSERT INTO public.membership_plans (id, name, description, duration_months, price, features, is_active)
VALUES
    ('b0000000-0000-0000-0000-000000000001', 'Monthly Warrior Plan', 'Full floor & cardio access for 1 month', 1, 1999.00, '{"Unlimited floor access", "Free attendance marking", "Locker room & shower", "Mobile app access"}', true),
    ('b0000000-0000-0000-0000-000000000002', 'Quarterly Discipline Plan', '3-month transformation commitment', 3, 4999.00, '{"All Warrior features", "AI fitness planner access", "Monthly body composition review", "1 Guest pass/mo"}', true),
    ('b0000000-0000-0000-0000-000000000003', 'Annual Divine Elite Plan', 'Full 12-month mastery package', 12, 14999.00, '{"All Discipline features", "Priority coach sessions", "Quarterly diet overhaul", "Free Gym Warrior Jersey", "Zero freeze fees"}', true)
ON CONFLICT (id) DO NOTHING;

-- Initial Exercises
INSERT INTO public.exercises (id, name, category, target_muscles, equipment, difficulty, sets, reps, instructions, common_mistakes, safety_notes, video_url)
VALUES
    ('e0000000-0000-0000-0000-000000000101', 'Barbell Bench Press', 'chest', '{"Pectoralis Major", "Anterior Deltoids", "Triceps"}', 'Olympic Barbell & Flat Bench', 'intermediate', '4', '8-10', '{"Lie flat on bench", "Grip slightly wider than shoulders", "Lower bar under control to mid-chest", "Press explosively back up"}', '{"Bouncing bar off chest", "Flaring elbows at 90 degrees"}', '{"Use safety pins or a spotter"}', 'https://www.youtube.com/watch?v=rT7DgCr-3pg'),
    ('e0000000-0000-0000-0000-000000000102', 'Barbell Back Squat', 'legs', '{"Quadriceps", "Gluteus Maximus", "Hamstrings"}', 'Squat Rack & Barbell', 'intermediate', '4', '6-8', '{"Rest bar on upper traps", "Feet shoulder-width", "Descend until hip crease breaks parallel", "Drive through mid-foot"}', '{"Knees collapsing inwards", "Rounding lower spine"}', '{"Set rack safety bars right below bottom depth"}', 'https://www.youtube.com/watch?v=ultWZbUMPL8'),
    ('e0000000-0000-0000-0000-000000000103', 'Conventional Deadlift', 'back', '{"Erector Spinae", "Lats", "Glutes", "Hamstrings"}', 'Olympic Barbell & Plates', 'advanced', '3', '5', '{"Stand mid-foot under bar", "Hinge hips back and grip bar", "Chest proud and lats locked", "Drive floor away"}', '{"Rounding lumbar spine", "Jerking bar off floor"}', '{"Maintain neutral spine throughout pull"}', 'https://www.youtube.com/watch?v=op9kVnSso6Q')
ON CONFLICT (id) DO NOTHING;
