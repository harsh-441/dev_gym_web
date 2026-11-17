// Parshuram Fitness Gym - Core Type Definitions

export type UserRole = 'super_admin' | 'admin' | 'trainer' | 'employee' | 'member';

export interface Profile {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar_url?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Member {
  id: string;
  profile_id: string;
  profile?: Profile;
  emergency_contact?: string;
  blood_group?: string;
  fitness_goal?: FitnessGoalType;
  height_cm?: number;
  weight_kg?: number;
  join_date: string;
  status: 'active' | 'inactive' | 'pending' | 'archived';
  active_membership_id?: string;
  created_at: string;
  updated_at: string;
}

export interface Employee {
  id: string;
  profile_id: string;
  profile?: Profile;
  department: string;
  designation: string;
  salary_type: 'monthly' | 'hourly' | 'per_session';
  joining_date: string;
  status: 'active' | 'inactive' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Trainer {
  id: string;
  employee_id: string;
  employee?: Employee;
  specializations: string[];
  certifications: string[];
  experience_years: number;
  bio: string;
  rating: number;
  photo_url?: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  duration_months: number;
  price: number; // Placeholder for Dave to edit
  features: string[];
  is_active: boolean;
  created_at: string;
}

export interface Membership {
  id: string;
  member_id: string;
  plan_id: string;
  plan?: MembershipPlan;
  start_date: string;
  end_date: string;
  status: 'active' | 'expired' | 'cancelled';
  auto_renew: boolean;
  amount_paid: number;
  payment_method: string;
  created_at: string;
}

// ATTENDANCE SEPARATION: Member attendance and staff attendance are separate!
export interface MemberAttendance {
  id: string;
  member_id: string;
  member?: Member;
  check_in_time: string;
  check_out_time?: string;
  check_in_method: 'qr' | 'manual';
  status: 'present';
  qr_session_id?: string;
  notes?: string;
  created_at: string;
}

export interface StaffAttendance {
  id: string;
  employee_id: string;
  employee?: Employee;
  check_in_time: string;
  check_out_time?: string;
  check_in_method: 'qr' | 'manual';
  status: 'present' | 'late' | 'half_day';
  qr_session_id?: string;
  shift_hours?: number;
  notes?: string;
  created_at: string;
}

export interface AttendanceQRSession {
  id: string;
  token: string;
  qr_type: 'member' | 'staff' | 'universal';
  created_by: string;
  valid_duration_seconds: number;
  expires_at: string;
  is_active: boolean;
  created_at: string;
}

export interface AttendanceCorrection {
  id: string;
  target_attendance_id: string;
  attendance_type: 'member' | 'staff';
  corrected_by: string;
  reason: string;
  original_check_in: string;
  new_check_in: string;
  created_at: string;
}

// LEAVE MANAGEMENT
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveType {
  id: string;
  name: string;
  description: string;
  max_days_per_year: number;
  is_paid: boolean;
  created_at: string;
}

export interface LeaveApplication {
  id: string;
  employee_id: string;
  employee?: Employee;
  leave_type_id: string;
  leave_type?: LeaveType;
  start_date: string;
  end_date: string;
  reason: string;
  status: LeaveStatus;
  admin_note?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
}

export interface LeaveBalance {
  id: string;
  employee_id: string;
  leave_type_id: string;
  year: number;
  total_allocated: number;
  used_days: number;
}

export interface WorkSchedule {
  id: string;
  employee_id: string;
  day_of_week: number; // 0 = Sunday, 1 = Monday, ...
  shift_start: string; // e.g., '06:00'
  shift_end: string;   // e.g., '14:00'
  is_off: boolean;
}

// EXERCISES & WORKOUTS
export type ExerciseCategory =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'abs'
  | 'cardio'
  | 'full_body';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Exercise {
  id: string;
  name: string;
  category: ExerciseCategory;
  target_muscles: string[];
  equipment: string;
  difficulty: DifficultyLevel;
  sets: string;
  reps: string;
  instructions: string[];
  common_mistakes: string[];
  safety_notes: string[];
  demonstration_image_url?: string;
  video_url?: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkoutProgram {
  id: string;
  title: string;
  description: string;
  level: DifficultyLevel;
  duration_weeks: number;
  goal: FitnessGoalType;
  cover_image: string;
  days_per_week: number;
  exercises?: WorkoutExerciseItem[];
  created_at: string;
}

export interface WorkoutExerciseItem {
  id: string;
  workout_program_id: string;
  exercise_id: string;
  exercise?: Exercise;
  day_number: number;
  order_index: number;
  sets: number;
  reps: string;
  rest_seconds: number;
}

// DIET & NUTRITION
export type NutritionCategory =
  | 'muscle_building'
  | 'fat_loss'
  | 'healthy_weight_gain'
  | 'vegetarian_diet'
  | 'non_vegetarian_diet'
  | 'indian_meal_plans'
  | 'protein_rich_foods'
  | 'affordable_nutrition';

export interface DietPlan {
  id: string;
  title: string;
  category: NutritionCategory;
  description: string;
  target_goal: FitnessGoalType;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  is_veg: boolean;
  is_indian: boolean;
  cost_tier: 'budget' | 'moderate' | 'premium';
  meals?: MealEntry[];
  created_at: string;
}

export interface MealEntry {
  id: string;
  diet_plan_id: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  food_item: string;
  quantity: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
}

// AI FITNESS PLANNER
export type FitnessGoalType =
  | 'muscle_gain'
  | 'fat_loss'
  | 'weight_gain'
  | 'strength'
  | 'endurance'
  | 'general_fitness';

export type ActivityLevel = 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active';

export interface AIFitnessPlannerInput {
  age: number;
  height_cm: number;
  weight_kg: number;
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say';
  fitness_goal: FitnessGoalType;
  training_experience: 'beginner' | 'intermediate' | 'advanced';
  activity_level: ActivityLevel;
  dietary_preference: 'vegetarian' | 'non_vegetarian' | 'vegan' | 'eggetarian';
  food_allergies?: string[];
  food_preferences?: string[];
  available_equipment: 'full_gym' | 'home_dumbbells' | 'bodyweight_only';
  training_days_per_week: number;
  workout_duration_minutes: number;
  injuries_or_limitations?: string;
  body_measurements?: {
    chest_cm?: number;
    waist_cm?: number;
    hips_cm?: number;
    biceps_cm?: number;
  };
}

export interface AIFitnessPlannerResult {
  overview: {
    bmi: number;
    daily_calories: number;
    macro_split: {
      protein_g: number;
      carbs_g: number;
      fat_g: number;
    };
    advice: string;
    safety_disclaimer: string;
  };
  weekly_workout_plan: Array<{
    day: string;
    focus: string;
    exercises: Array<{
      name: string;
      sets: number;
      reps: string;
      rest_seconds: number;
      notes: string;
    }>;
  }>;
  daily_diet_plan: {
    breakfast: { items: string[]; calories: number; protein_g: number };
    lunch: { items: string[]; calories: number; protein_g: number };
    snacks: { items: string[]; calories: number; protein_g: number };
    dinner: { items: string[]; calories: number; protein_g: number };
    indian_alternatives: string[];
    affordable_tips: string[];
  };
}

// PROGRESS TRACKING
export interface ProgressRecord {
  id: string;
  member_id: string;
  date: string;
  weight_kg: number;
  chest_cm?: number;
  waist_cm?: number;
  hips_cm?: number;
  biceps_cm?: number;
  notes?: string;
  created_at: string;
}

// YOUTUBE FITNESS VIDEOS
export interface YouTubeVideo {
  id: string;
  title: string;
  youtube_id: string;
  youtube_url: string;
  category: string;
  description: string;
  is_featured: boolean;
  order_index: number;
  created_at: string;
}

// ANNOUNCEMENTS & NOTIFICATIONS
export interface Announcement {
  id: string;
  title: string;
  content: string;
  target_audience: 'all' | 'members' | 'employees';
  priority: 'normal' | 'high' | 'urgent';
  published_at: string;
  expires_at?: string;
  author_id: string;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  channel: 'in_app' | 'email' | 'push';
  is_read: boolean;
  created_at: string;
}

// ENQUIRIES (Lead capture from website)
export interface Enquiry {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  preferred_plan?: string;
  message: string;
  status: 'new' | 'contacted' | 'converted' | 'closed';
  notes?: string;
  created_at: string;
}

// TESTIMONIALS & TRANSFORMATIONS
export interface Testimonial {
  id: string;
  member_name: string;
  rating: number;
  story: string;
  verified: boolean;
  is_published: boolean;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: string;
  before_image_url: string;
  after_image_url: string;
  duration_months: number;
  description: string;
}

// AUDIT LOG
export interface AuditLog {
  id: string;
  actor_id: string;
  actor_name: string;
  action: string;
  entity_type: string;
  entity_id: string;
  details?: Record<string, any>;
  created_at: string;
}

// SYSTEM SETTINGS (Managed by Dave)
export interface AppSettings {
  gym_name: string;
  tagline: string;
  owner_name: string;
  contact_phone: string;
  contact_email: string;
  address_line1: string;
  city: string;
  opening_hours_weekdays: string;
  opening_hours_weekends: string;
  qr_token_validity_seconds: number;
  enable_manual_checkin: boolean;
  late_threshold_minutes: number;
  announcement_banner?: string;
}
