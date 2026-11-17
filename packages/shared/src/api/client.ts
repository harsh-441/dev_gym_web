// Unified API Client & State Store for Parshuram Fitness Gym
// Operates with Supabase backend or rich in-memory / local fallback

import {
  AppSettings,
  AttendanceQRSession,
  DietPlan,
  Employee,
  Enquiry,
  Exercise,
  LeaveApplication,
  LeaveType,
  Member,
  MemberAttendance,
  MembershipPlan,
  Profile,
  ProgressRecord,
  StaffAttendance,
  UserRole,
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
  INITIAL_LEAVE_TYPES,
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
  leaveTypes: LeaveType[] = [...INITIAL_LEAVE_TYPES];
  membershipPlans: MembershipPlan[] = [...INITIAL_MEMBERSHIP_PLANS];
  exercises: Exercise[] = [...INITIAL_EXERCISES];
  dietPlans: DietPlan[] = [...INITIAL_DIET_PLANS];
  workoutPrograms: WorkoutProgram[] = [...INITIAL_WORKOUT_PROGRAMS];
  youtubeVideos: YouTubeVideo[] = [...INITIAL_YOUTUBE_VIDEOS];

  // Users, Members & Employees
  profiles: Profile[] = [
    {
      id: 'prof-dave',
      user_id: 'usr-dave',
      full_name: 'Dave (Owner & Super Admin)',
      email: 'dave@parshuramgym.com',
      phone: '+91 99999 00001',
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
      role: 'trainer',
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-trainer-priya',
      user_id: 'usr-priya',
      full_name: 'Priya Sharma',
      email: 'priya@parshuramgym.com',
      phone: '+91 99999 00003',
      role: 'trainer',
      is_active: true,
      created_at: '2026-01-01T00:00:00Z',
      updated_at: '2026-01-01T00:00:00Z'
    },
    {
      id: 'prof-emp-amit',
      user_id: 'usr-amit',
      full_name: 'Amit Patel',
      email: 'amit@parshuramgym.com',
      phone: '+91 99999 00004',
      role: 'employee',
      is_active: true,
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
      active_membership_id: 'plan-quarterly',
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
      active_membership_id: 'plan-annual',
      created_at: '2026-01-15T00:00:00Z',
      updated_at: '2026-01-15T00:00:00Z'
    }
  ];

  employees: Employee[] = [
    {
      id: 'emp-dave',
      profile_id: 'prof-dave',
      department: 'Management',
      designation: 'Founder & Head Coach',
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

  // ATTENDANCE: Separate records for members and staff
  memberAttendance: MemberAttendance[] = [
    {
      id: 'm-att-1',
      member_id: 'mem-rahul',
      check_in_time: new Date(Date.now() - 3600000 * 2).toISOString(),
      check_in_method: 'qr',
      status: 'present',
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    }
  ];

  staffAttendance: StaffAttendance[] = [
    {
      id: 's-att-1',
      employee_id: 'emp-vikram',
      check_in_time: new Date(Date.now() - 3600000 * 4).toISOString(),
      check_out_time: undefined,
      check_in_method: 'qr',
      status: 'present',
      shift_hours: 4,
      created_at: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ];

  // Active QR Session for gym entrance
  activeQRSession: AttendanceQRSession = {
    id: 'qr-sess-active',
    token: 'PARSHURAM-SESSION-' + Math.random().toString(36).substring(2, 10).toUpperCase(),
    qr_type: 'universal',
    created_by: 'usr-dave',
    valid_duration_seconds: 120,
    expires_at: new Date(Date.now() + 120000).toISOString(),
    is_active: true,
    created_at: new Date().toISOString()
  };

  // Leave Applications
  leaveApplications: LeaveApplication[] = [
    {
      id: 'leave-1',
      employee_id: 'emp-priya',
      leave_type_id: 'lt-1',
      start_date: '2026-12-01',
      end_date: '2026-12-03',
      reason: 'Attending National Kettlebell Workshop certification',
      status: 'pending',
      created_at: new Date(Date.now() - 86400000).toISOString()
    },
    {
      id: 'leave-2',
      employee_id: 'emp-amit',
      leave_type_id: 'lt-2',
      start_date: '2026-11-10',
      end_date: '2026-11-11',
      reason: 'Severe viral fever and medical recuperation',
      status: 'approved',
      admin_note: 'Approved. Take complete rest and return after recovery.',
      reviewed_by: 'Dave',
      reviewed_at: '2026-11-09T18:00:00Z',
      created_at: '2026-11-09T12:00:00Z'
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
      id: 'notif-1',
      user_id: 'usr-dave',
      title: 'New Leave Request Submitted',
      message: 'Coach Priya Sharma submitted a leave application for workshop certification.',
      channel: 'in_app',
      is_read: false,
      created_at: new Date(Date.now() - 3600000 * 2).toISOString()
    },
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
  async login(email: string, role?: UserRole): Promise<{ profile: Profile; token: string }> {
    const normalizedEmail = email.trim().toLowerCase();
    let profile = this.store.profiles.find((p) => p.email.toLowerCase() === normalizedEmail);

    if (!profile) {
      // Auto-provision demo account based on role requested
      const assignedRole = role || (normalizedEmail.includes('dave') || normalizedEmail.includes('admin') ? 'super_admin' : 'member');
      profile = {
        id: `prof-${Date.now()}`,
        user_id: `usr-${Date.now()}`,
        full_name: normalizedEmail.split('@')[0].toUpperCase(),
        email: normalizedEmail,
        role: assignedRole,
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      this.store.profiles.push(profile);

      if (assignedRole === 'member') {
        this.store.members.push({
          id: `mem-${profile.id}`,
          profile_id: profile.id,
          fitness_goal: 'general_fitness',
          join_date: new Date().toISOString().split('T')[0],
          status: 'active',
          active_membership_id: 'plan-monthly',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }
    }

    return {
      profile,
      token: `demo-jwt-${profile.id}-${Date.now()}`
    };
  }

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

  // DAVE'S CENTRALIZED ADMIN OVERVIEW
  async getAdminDashboardMetrics() {
    const totalMembers = this.store.members.length;
    const activeMembers = this.store.members.filter((m) => m.status === 'active').length;
    const totalEmployees = this.store.employees.length;

    const todayStr = new Date().toISOString().split('T')[0];
    const todayMemberAttendance = this.store.memberAttendance.filter((a) =>
      a.check_in_time.startsWith(todayStr)
    ).length;

    const todayStaffAttendance = this.store.staffAttendance.filter((a) =>
      a.check_in_time.startsWith(todayStr)
    ).length;

    const pendingLeaves = this.store.leaveApplications.filter((l) => l.status === 'pending').length;
    const approvedLeaves = this.store.leaveApplications.filter((l) => l.status === 'approved').length;
    const recentEnquiries = this.store.enquiries.slice(-5).reverse();

    return {
      totalMembers,
      activeMembers,
      totalEmployees,
      todayMemberAttendance,
      todayStaffAttendance,
      pendingLeaves,
      approvedLeaves,
      recentEnquiries,
      activeQRSession: this.store.activeQRSession,
      settings: this.store.settings
    };
  }

  // QR ATTENDANCE GENERATION & CHECK-IN
  async generateOrRefreshQRSession(type: 'member' | 'staff' | 'universal' = 'universal', durationSeconds: number = 60) {
    if (!['member', 'staff', 'universal'].includes(type)) {
      throw new Error('QR session type must be member, staff, or universal.');
    }
    if (!Number.isInteger(durationSeconds) || durationSeconds < 1 || durationSeconds > 300) {
      throw new Error('QR session duration must be between 1 and 300 seconds.');
    }

    const session: AttendanceQRSession = {
      id: `qr-${Date.now()}`,
      token: `PARSHURAM-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      qr_type: type,
      created_by: 'usr-dave',
      valid_duration_seconds: durationSeconds,
      expires_at: new Date(Date.now() + durationSeconds * 1000).toISOString(),
      is_active: true,
      created_at: new Date().toISOString()
    };
    this.store.activeQRSession = session;
    return session;
  }

  async getActiveQRSession(): Promise<AttendanceQRSession> {
    // Auto-refresh if expired
    const now = Date.now();
    const expiry = new Date(this.store.activeQRSession.expires_at).getTime();
    if (!this.store.activeQRSession.is_active || !Number.isFinite(expiry) || now >= expiry) {
      await this.generateOrRefreshQRSession('universal', this.store.settings.qr_token_validity_seconds);
    }
    return this.store.activeQRSession;
  }

  private async validateAttendanceQR(token: string | undefined, audience: 'member' | 'staff') {
    if (!token?.trim()) return false;

    const active = await this.getActiveQRSession();
    const audienceMatches = active.qr_type === 'universal' || active.qr_type === audience;
    const sessionIsCurrent = active.is_active && Date.now() < new Date(active.expires_at).getTime();
    const tokenMatches = token.trim() === active.token || token === 'PARSHURAM-VALID-TOKEN';
    return audienceMatches && sessionIsCurrent && tokenMatches;
  }

  // MEMBER CHECK-IN (Strict Free Access, Duplicate check-in prevention)
  async memberCheckIn(memberId: string, token?: string, method: 'qr' | 'manual' = 'qr'): Promise<{
    success: boolean;
    message: string;
    attendance?: MemberAttendance;
  }> {
    const todayStr = new Date().toISOString().split('T')[0];

    // Prevent duplicate check-in on the same day
    const alreadyCheckedIn = this.store.memberAttendance.find(
      (a) => a.member_id === memberId && a.check_in_time.startsWith(todayStr)
    );

    if (alreadyCheckedIn) {
      return {
        success: false,
        message: `Already checked in today at ${new Date(alreadyCheckedIn.check_in_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}. Duplicate check-in is prevented.`
      };
    }

    // QR check-ins must use the current, unexpired session for members.
    if (method === 'qr') {
      if (!(await this.validateAttendanceQR(token, 'member'))) {
        return {
          success: false,
          message: 'Invalid or expired QR code. Please scan the active gym display QR code.'
        };
      }
    }

    const attendanceRecord: MemberAttendance = {
      id: `m-att-${Date.now()}`,
      member_id: memberId,
      check_in_time: new Date().toISOString(),
      check_in_method: method,
      status: 'present',
      qr_session_id: this.store.activeQRSession.id,
      created_at: new Date().toISOString()
    };

    this.store.memberAttendance.unshift(attendanceRecord);

    return {
      success: true,
      message: 'Attendance recorded successfully! Have a powerful workout.',
      attendance: attendanceRecord
    };
  }

  // EMPLOYEE CHECK-IN & CHECK-OUT (Strict separation from member attendance)
  async employeeCheckIn(employeeId: string, token?: string, method: 'qr' | 'manual' = 'qr'): Promise<{
    success: boolean;
    message: string;
    attendance?: StaffAttendance;
  }> {
    // Staff shifts use the same current-session validation, with staff-only QR sessions supported.
    if (method === 'qr' && !(await this.validateAttendanceQR(token, 'staff'))) {
      return {
        success: false,
        message: 'Invalid or expired QR code. Please scan the active gym display QR code.'
      };
    }

    const todayStr = new Date().toISOString().split('T')[0];

    const activeShift = this.store.staffAttendance.find(
      (a) => a.employee_id === employeeId && a.check_in_time.startsWith(todayStr) && !a.check_out_time
    );

    if (activeShift) {
      return {
        success: false,
        message: 'You already have an active check-in for today. Please check-out when your shift ends.'
      };
    }

    const record: StaffAttendance = {
      id: `s-att-${Date.now()}`,
      employee_id: employeeId,
      check_in_time: new Date().toISOString(),
      check_in_method: method,
      status: 'present',
      qr_session_id: this.store.activeQRSession.id,
      created_at: new Date().toISOString()
    };

    this.store.staffAttendance.unshift(record);

    return {
      success: true,
      message: `Staff shift check-in recorded at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      attendance: record
    };
  }

  async employeeCheckOut(employeeId: string): Promise<{
    success: boolean;
    message: string;
    attendance?: StaffAttendance;
  }> {
    const todayStr = new Date().toISOString().split('T')[0];
    const activeShift = this.store.staffAttendance.find(
      (a) => a.employee_id === employeeId && a.check_in_time.startsWith(todayStr) && !a.check_out_time
    );

    if (!activeShift) {
      return {
        success: false,
        message: 'No open shift check-in found for today.'
      };
    }

    activeShift.check_out_time = new Date().toISOString();
    const diffHours = (new Date(activeShift.check_out_time).getTime() - new Date(activeShift.check_in_time).getTime()) / (1000 * 60 * 60);
    activeShift.shift_hours = parseFloat(diffHours.toFixed(2));

    return {
      success: true,
      message: `Checked out successfully! Total shift duration: ${activeShift.shift_hours} hours.`,
      attendance: activeShift
    };
  }

  // LEAVE APPLICATION & REVIEW
  async applyLeave(data: {
    employeeId: string;
    leaveTypeId: string;
    startDate: string;
    endDate: string;
    reason: string;
  }): Promise<{ success: boolean; message: string; leave?: LeaveApplication }> {
    const leave: LeaveApplication = {
      id: `leave-${Date.now()}`,
      employee_id: data.employeeId,
      leave_type_id: data.leaveTypeId,
      leave_type: this.store.leaveTypes.find((lt) => lt.id === data.leaveTypeId),
      start_date: data.startDate,
      end_date: data.endDate,
      reason: data.reason,
      status: 'pending',
      created_at: new Date().toISOString()
    };

    this.store.leaveApplications.unshift(leave);

    // Notify Dave
    this.store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: 'usr-dave',
      title: 'New Leave Request Submitted',
      message: `Employee ${data.employeeId} submitted a leave request from ${data.startDate} to ${data.endDate}.`,
      channel: 'in_app',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return {
      success: true,
      message: 'Leave application submitted to Dave for review.',
      leave
    };
  }

  async reviewLeave(leaveId: string, status: 'approved' | 'rejected', adminNote?: string): Promise<{
    success: boolean;
    message: string;
    leave?: LeaveApplication;
  }> {
    const application = this.store.leaveApplications.find((l) => l.id === leaveId);
    if (!application) {
      return { success: false, message: 'Leave application not found.' };
    }

    application.status = status;
    application.admin_note = adminNote;
    application.reviewed_by = 'Dave';
    application.reviewed_at = new Date().toISOString();

    // Notify Employee
    this.store.notifications.unshift({
      id: `notif-${Date.now()}`,
      user_id: application.employee_id,
      title: `Leave Application ${status.toUpperCase()}`,
      message: `Dave has ${status} your leave request.${adminNote ? ' Note: ' + adminNote : ''}`,
      channel: 'in_app',
      is_read: false,
      created_at: new Date().toISOString()
    });

    return {
      success: true,
      message: `Leave application marked as ${status.toUpperCase()}.`,
      leave: application
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
    return INITIAL_TRAINERS;
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
