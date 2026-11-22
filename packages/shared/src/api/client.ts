// Unified API Client & State Store for Parshuram Fitness Gym
// Operates with Supabase backend or rich in-memory / local fallback

import {
  AppSettings,
  DietPlan,
  Employee,
  Enquiry,
  Exercise,
  Member,
  MembershipPlan,
  Profile,
  ProgressRecord,
  Trainer,
  WorkoutProgram,
  YouTubeVideo,
  NotificationItem,
  AIFitnessPlannerInput,
  AIFitnessPlannerResult
} from '../types';
import {
  BRAND,
  DEFAULT_APP_SETTINGS,
  INITIAL_DIET_PLANS,
  INITIAL_EXERCISES,
  INITIAL_MEMBERSHIP_PLANS,
  INITIAL_TRAINERS,
  INITIAL_WORKOUT_PROGRAMS,
  INITIAL_YOUTUBE_VIDEOS
} from '../constants';
import { generatePersonalizedFitnessPlan } from './aiGenerator';

// In-Memory Database Store for robust offline execution & instant dev demo
class GymDataStore {
  private static instance: GymDataStore;

  settings: AppSettings = { ...DEFAULT_APP_SETTINGS };
  membershipPlans: MembershipPlan[] = [...INITIAL_MEMBERSHIP_PLANS];
  exercises: Exercise[] = [...INITIAL_EXERCISES];
  dietPlans: DietPlan[] = [...INITIAL_DIET_PLANS];
  workoutPrograms: WorkoutProgram[] = [...INITIAL_WORKOUT_PROGRAMS];
  youtubeVideos: YouTubeVideo[] = [...INITIAL_YOUTUBE_VIDEOS];

  trainers: Trainer[] = [...INITIAL_TRAINERS];

  // Users, Members & Employees
  profiles: Profile[] = [
    {
      id: 'prof-kapil',
      user_id: 'usr-kapil',
      full_name: 'Kapil Dev (Owner & Coach)',
      email: 'vdev6514@gmail.com',
      phone: '9897191013',
      role: 'super_admin',
      is_active: true,
      created_at: '2016-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-coach-dev-vats',
      user_id: 'usr-dev-vats',
      full_name: 'Dev Vats (Coach)',
      email: 'devvats@parshuramfitnessclub.com',
      phone: '7983626564',
      role: 'member',
      is_active: false,
      created_at: '2016-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-dave',
      user_id: 'usr-dave',
      full_name: 'Kapil Dev (Admin Account)',
      email: 'dave@parshuramgym.com',
      phone: '9897191013',
      role: 'super_admin',
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-trainer-vikram',
      user_id: 'usr-vikram',
      full_name: 'Vikram Rathore',
      email: 'vikram@parshuramgym.com',
      phone: '+91 99999 00002',
      role: 'member',
      is_active: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-trainer-priya',
      user_id: 'usr-priya',
      full_name: 'Priya Sharma',
      email: 'priya@parshuramgym.com',
      phone: '+91 99999 00003',
      role: 'member',
      is_active: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-emp-amit',
      user_id: 'usr-amit',
      full_name: 'Amit Patel',
      email: 'amit@parshuramgym.com',
      phone: '+91 99999 00004',
      role: 'member',
      is_active: false,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-mem-rahul',
      user_id: 'usr-rahul',
      full_name: 'Rahul Varma',
      email: 'rahul@example.com',
      phone: '+91 98888 12345',
      role: 'member',
      is_active: true,
      created_at: '2026-01-10T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z'
    },
    {
      id: 'prof-mem-sneha',
      user_id: 'usr-sneha',
      full_name: 'Sneha Kapoor',
      email: 'sneha@example.com',
      phone: '+91 98888 67890',
      role: 'member',
      is_active: true,
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z'
    }
  ];

  members: Member[] = [
    {
      id: 'mem-rahul',
      profile_id: 'prof-mem-rahul',
      fitness_goal: 'muscle_gain',
      blood_group: 'B+',
      emergency_contact: '+91 98888 00000',
      height_cm: 178,
      weight_kg: 74,
      join_date: '2026-01-10',
      status: 'active',
      active_membership_id: 'plan-3months',
      created_at: '2026-01-10T00:00:00Z',
      updated_at: '2026-01-10T00:00:00Z'
    },
    {
      id: 'mem-sneha',
      profile_id: 'prof-mem-sneha',
      fitness_goal: 'fat_loss',
      blood_group: 'O+',
      emergency_contact: '+91 98888 11111',
      height_cm: 165,
      weight_kg: 62,
      join_date: '2026-01-15',
      status: 'active',
      active_membership_id: 'plan-yearly',
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z'
    }
  ];

  employees: Employee[] = [
    {
      id: 'emp-kapil',
      profile_id: 'prof-kapil',
      department: 'Management & Coaching',
      designation: 'Owner & Coach',
      salary_type: 'monthly',
      joining_date: '2016-01-01',
      status: 'active',
      created_at: '2016-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'emp-dev-vats',
      profile_id: 'prof-coach-dev-vats',
      department: 'Fitness & Martial Arts',
      designation: 'Coach',
      salary_type: 'monthly',
      joining_date: '2016-01-01',
      status: 'active',
      created_at: '2016-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'emp-dave',
      profile_id: 'prof-dave',
      department: 'Management',
      designation: 'Founder & Coach',
      salary_type: 'monthly',
      joining_date: '2025-01-01',
      status: 'active',
      created_at: '2025-01-01T00:00:00Z',
      updated_at: '2025-01-01T00:00:00Z'
    },
    {
      id: 'emp-vikram',
      profile_id: 'prof-trainer-vikram',
      department: 'Fitness Training',
      designation: 'Senior Strength Coach',
      salary_type: 'monthly',
      joining_date: '2025-03-01',
      status: 'active',
      created_at: '2025-03-01T00:00:00Z',
      updated_at: '2025-03-01T00:00:00Z'
    },
    {
      id: 'emp-priya',
      profile_id: 'prof-trainer-priya',
      department: 'Fitness Training',
      designation: 'Functional Movement Coach',
      salary_type: 'monthly',
      joining_date: '2025-04-01',
      status: 'active',
      created_at: '2025-04-01T00:00:00Z',
      updated_at: '2025-04-01T00:00:00Z'
    },
    {
      id: 'emp-amit',
      profile_id: 'prof-emp-amit',
      department: 'Operations',
      designation: 'Front Desk & Floor Supervisor',
      salary_type: 'monthly',
      joining_date: '2025-06-01',
      status: 'active',
      created_at: '2025-06-01T00:00:00Z',
      updated_at: '2025-06-01T00:00:00Z'
    }
  ];

  // Enquiries from public website
  enquiries: Enquiry[] = [
    {
      id: 'enq-1',
      full_name: 'Karan Mehra',
      email: 'karan.m@gmail.com',
      phone: '+91 97777 44444',
      preferred_plan: 'Quarterly Discipline Plan',
      message: 'Interested in personal training for powerlifting with Coach Vikram.',
      status: 'new',
      created_at: new Date(Date.now() - 43200000).toISOString()
    }
  ];

  // Progress records
  progressRecords: ProgressRecord[] = [
    {
      id: 'prog-rec-1',
      member_id: 'mem-rahul',
      date: '2026-01-10',
      weight_kg: 71.5,
      chest_cm: 98,
      waist_cm: 82,
      biceps_cm: 34,
      notes: 'Initial body assessment baseline.',
      created_at: '2026-01-10T00:00:00Z'
    },
    {
      id: 'prog-rec-2',
      member_id: 'mem-rahul',
      date: '2026-02-10',
      weight_kg: 74.0,
      chest_cm: 101,
      waist_cm: 81,
      biceps_cm: 35.5,
      notes: 'Gained 2.5kg lean mass. Strength increased on bench & squat.',
      created_at: '2026-02-10T00:00:00Z'
    }
  ];

  // In-app & system notifications
  notifications: NotificationItem[] = [
    {
      id: 'notif-2',
      user_id: 'usr-rahul',
      title: 'Workout Program Assigned',
      message: 'Coach Vikram Rathore assigned the 5-Day Powerbuilding Protocol to your profile.',
      channel: 'in_app',
      is_read: true,
      created_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  public static getInstance(): GymDataStore {
    if (!GymDataStore.instance) {
      GymDataStore.instance = new GymDataStore();
    }
    return GymDataStore.instance;
  }
}

export class GymApiClient {
  private store = GymDataStore.getInstance();

  // AUTHENTICATION
  async registerMember(data: {
    fullName: string;
    email: string;
    phone?: string;
    fitnessGoal?: any;
    heightCm?: number;
    weightKg?: number;
    emergencyContact?: string;
    bloodGroup?: string;
  }): Promise<{ profile: Profile; member: Member }> {
    const profile: Profile = {
      id: `prof-${Date.now()}`,
      user_id: `usr-${Date.now()}`,
      full_name: data.fullName,
      email: data.email.toLowerCase(),
      phone: data.phone,
      role: 'member',
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.store.profiles.push(profile);

    const member: Member = {
      id: `mem-${Date.now()}`,
      profile_id: profile.id,
      fitness_goal: data.fitnessGoal || 'general_fitness',
      height_cm: data.heightCm,
      weight_kg: data.weightKg,
      emergency_contact: data.emergencyContact,
      blood_group: data.bloodGroup,
      join_date: new Date().toISOString().split('T')[0],
      status: 'active',
      active_membership_id: 'plan-monthly',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    this.store.members.push(member);

    return { profile, member };
  }

  // KAPIL DEV'S CENTRALIZED ADMIN OVERVIEW
  async getAdminDashboardMetrics() {
    const totalMembers = this.store.members.length;
    const activeMembers = this.store.members.filter((m) => m.status === 'active').length;
    const recentEnquiries = this.store.enquiries.slice(-5).reverse();

    return {
      totalMembers,
      activeMembers,
      todayMemberAttendance: 0,
      recentEnquiries,
      settings: this.store.settings
    };
  }

  // NOTIFICATIONS
  async getUserNotifications(userId: string) {
    return this.store.notifications.filter((n) => n.user_id === userId);
  }

  async sendNotification(data: Omit<NotificationItem, 'id' | 'created_at' | 'is_read'>) {
    const notif: NotificationItem = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      ...data,
      is_read: false,
      created_at: new Date().toISOString()
    };
    this.store.notifications.unshift(notif);
    return notif;
  }

  async markNotificationAsRead(notificationId: string) {
    const notif = this.store.notifications.find((n) => n.id === notificationId);
    if (notif) notif.is_read = true;
    return notif;
  }

  // AI FITNESS PLANNER
  async generateFitnessPlan(input: AIFitnessPlannerInput): Promise<AIFitnessPlannerResult> {
    // Uses the deterministic multi-factor science algorithm with Indian nutrition defaults
    return generatePersonalizedFitnessPlan(input);
  }

  // CONTENT & ENTITY RETRIEVAL
  async getExercises(category?: string) {
    if (!category || category === 'all') return this.store.exercises;
    return this.store.exercises.filter((e) => e.category === category);
  }

  async getDietPlans(goal?: string) {
    if (!goal || goal === 'all') return this.store.dietPlans;
    return this.store.dietPlans.filter((d) => d.target_goal === goal);
  }

  async getYouTubeVideos() {
    return this.store.youtubeVideos;
  }

  async getMembershipPlans() {
    return this.store.membershipPlans;
  }

  async getTrainers() {
    return this.getPublicCoaches();
  }

  async getPublicCoaches() {
    // Only return coaches who are currently active and approved (not inactive or archived)
    const activeStaff = this.store.employees.filter((e) => e.status === 'active');
    
    return activeStaff.map((emp) => {
      const prof = this.store.profiles.find((p) => p.id === emp.profile_id);
      const existingTrainer = this.store.trainers.find((t) => t.employee_id === emp.id);
      
      const isKapil = emp.id === 'emp-kapil' || emp.id === 'emp-dave' || prof?.role === 'super_admin';
      const defaultPhoto = isKapil
        ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
        : 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80';

      return {
        id: existingTrainer?.id || `tr-${emp.id}`,
        employee_id: emp.id,
        employee: emp,
        specializations: existingTrainer?.specializations || [
          'Strength & Conditioning',
          'Biomechanical Progression',
          'Functional Movement'
        ],
        certifications: existingTrainer?.certifications || [
          'Certified Strength Specialist',
          'CPR & First Aid'
        ],
        experience_years: existingTrainer?.experience_years || 5,
        bio: existingTrainer?.bio || `${prof?.full_name || 'Coach'} is an elite trainer at Parshuram Fitness Club dedicated to disciplined athletic development.`,
        rating: existingTrainer?.rating || 4.9,
        photo_url: existingTrainer?.photo_url || prof?.avatar_url || defaultPhoto
      };
    });
  }

  async submitEnquiry(enquiry: Omit<Enquiry, 'id' | 'status' | 'created_at'>) {
    const record: Enquiry = {
      id: `enq-${Date.now()}`,
      ...enquiry,
      status: 'new',
      created_at: new Date().toISOString()
    };
    this.store.enquiries.unshift(record);
    return record;
  }

  async updateSettings(settings: Partial<AppSettings>) {
    this.store.settings = { ...this.store.settings, ...settings };
    return this.store.settings;
  }
}

export const api = new GymApiClient();
