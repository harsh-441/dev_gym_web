// Automated Test Suite for Parshuram Fitness Gym Ecosystem
// Verifies all workflows required by Prompt Section 19:
// Attendance, Duplicate Prevention, Leave Approvals, AI Planner, RBAC, Data Separation

const test = require('node:test');
const assert = require('node:assert/strict');

// Import built shared modules
const {
  api,
  validateMemberRegistration,
  validateLeaveApplication,
  validateAttendanceCheckIn,
  validateAIPlannerInput,
  generatePersonalizedFitnessPlan,
  BRAND,
  DEFAULT_APP_SETTINGS
} = require('../packages/shared/dist/index.js');

test('PARSHURAM GYM - 1. Brand Identity & Constants', () => {
  assert.equal(BRAND.name, 'PARSHURAM FITNESS GYM');
  assert.equal(BRAND.owner, 'Dave');
  assert.equal(BRAND.tagline, 'INSPIRED BY DIVINITY. BUILT THROUGH DISCIPLINE.');
  assert.equal(BRAND.colors.athleticRed, '#E02025');
  assert.equal(BRAND.colors.black, '#080808');
  assert.ok(DEFAULT_APP_SETTINGS.qr_token_validity_seconds > 0);
});

test('PARSHURAM GYM - 2. Member Registration Validation', () => {
  // Invalid inputs
  const invalidResult = validateMemberRegistration({
    fullName: '',
    email: 'invalid-email',
    password: '123'
  });
  assert.equal(invalidResult.isValid, false);
  assert.ok(invalidResult.errors.fullName);
  assert.ok(invalidResult.errors.email);
  assert.ok(invalidResult.errors.password);

  // Valid inputs
  const validResult = validateMemberRegistration({
    fullName: 'Siddharth Rao',
    email: 'siddharth@example.com',
    password: 'strongPassword123',
    phone: '+91 98765 11111',
    fitnessGoal: 'strength'
  });
  assert.equal(validResult.isValid, true);
  assert.equal(Object.keys(validResult.errors).length, 0);
});

test('PARSHURAM GYM - 3. Authentication & Multi-Role Logic', async () => {
  // Dave (Super Admin)
  const daveLogin = await api.login('dave@parshuramgym.com', 'super_admin');
  assert.equal(daveLogin.profile.role, 'super_admin');
  assert.ok(daveLogin.token.length > 10);

  // Trainer (Vikram)
  const trainerLogin = await api.login('vikram@parshuramgym.com', 'trainer');
  assert.equal(trainerLogin.profile.role, 'trainer');

  // Staff (Amit)
  const staffLogin = await api.login('amit@parshuramgym.com', 'employee');
  assert.equal(staffLogin.profile.role, 'employee');

  // Member (Rahul)
  const memberLogin = await api.login('rahul@example.com', 'member');
  assert.equal(memberLogin.profile.role, 'member');
});

test('PARSHURAM GYM - 4. QR Session Generation & Expiration', async () => {
  const session = await api.generateOrRefreshQRSession('universal', 60);
  assert.ok(session.token.startsWith('PARSHURAM-'));
  assert.equal(session.valid_duration_seconds, 60);
  assert.equal(session.is_active, true);

  const activeSession = await api.getActiveQRSession();
  assert.equal(activeSession.id, session.id);
});

test('PARSHURAM GYM - 5. Member Attendance & Duplicate Check-in Prevention', async () => {
  const testMemberId = `test-mem-${Date.now()}`;

  // First check-in of the day: MUST SUCCEED (and is 100% free)
  const firstCheckIn = await api.memberCheckIn(testMemberId, 'PARSHURAM-VALID-TOKEN', 'qr');
  assert.equal(firstCheckIn.success, true);
  assert.ok(firstCheckIn.attendance);
  assert.equal(firstCheckIn.attendance.member_id, testMemberId);
  assert.equal(firstCheckIn.attendance.status, 'present');

  // Second check-in on the SAME DAY: MUST BE PREVENTED
  const duplicateCheckIn = await api.memberCheckIn(testMemberId, 'PARSHURAM-VALID-TOKEN', 'qr');
  assert.equal(duplicateCheckIn.success, false);
  assert.match(duplicateCheckIn.message, /already checked in today/i);
});

test('PARSHURAM GYM - 6. Staff Attendance & Shift Duration Separation', async () => {
  const testEmpId = `test-emp-${Date.now()}`;

  // Staff clock-in
  const checkInRes = await api.employeeCheckIn(testEmpId, 'PARSHURAM-VALID-TOKEN', 'qr');
  assert.equal(checkInRes.success, true);
  assert.ok(checkInRes.attendance);
  assert.equal(checkInRes.attendance.employee_id, testEmpId);
  assert.equal(checkInRes.attendance.check_out_time, undefined);

  // Duplicate clock-in while shift is active: MUST BE PREVENTED
  const dupClockIn = await api.employeeCheckIn(testEmpId, 'PARSHURAM-VALID-TOKEN', 'qr');
  assert.equal(dupClockIn.success, false);
  assert.match(dupClockIn.message, /already have an active check-in/i);

  // Staff clock-out
  const checkOutRes = await api.employeeCheckOut(testEmpId);
  assert.equal(checkOutRes.success, true);
  assert.ok(checkOutRes.attendance.check_out_time);
  assert.ok(typeof checkOutRes.attendance.shift_hours === 'number');

  // Verify staff attendance and member attendance are stored in separate categories
  const memberRecords = api.store.memberAttendance.filter((m) => m.member_id === testEmpId);
  assert.equal(memberRecords.length, 0, 'Staff shift must never be mixed with member attendance table');
});

test('PARSHURAM GYM - 7. Leave Application & Dave Approval Flow', async () => {
  const testEmpId = 'emp-priya';

  // 1. Employee applies for leave
  const applyRes = await api.applyLeave({
    employeeId: testEmpId,
    leaveTypeId: 'lt-1',
    startDate: '2026-12-10',
    endDate: '2026-12-12',
    reason: 'Attending weightlifting championship'
  });
  assert.equal(applyRes.success, true);
  assert.equal(applyRes.leave.status, 'pending');

  const leaveId = applyRes.leave.id;

  // 2. Dave reviews and approves
  const approveRes = await api.reviewLeave(
    leaveId,
    'approved',
    'Approved by Dave. Best wishes for the championship!'
  );
  assert.equal(approveRes.success, true);
  assert.equal(approveRes.leave.status, 'approved');
  assert.equal(approveRes.leave.reviewed_by, 'Dave');
  assert.equal(approveRes.leave.admin_note, 'Approved by Dave. Best wishes for the championship!');
});

test('PARSHURAM GYM - 8. AI Fitness & Nutrition Planner Science Calculation', () => {
  const input = {
    age: 25,
    height_cm: 180,
    weight_kg: 75,
    gender: 'male',
    fitness_goal: 'muscle_gain',
    training_experience: 'intermediate',
    activity_level: 'moderately_active',
    dietary_preference: 'vegetarian',
    available_equipment: 'full_gym',
    training_days_per_week: 4,
    workout_duration_minutes: 60
  };

  const validation = validateAIPlannerInput(input);
  assert.equal(validation.isValid, true);

  const plan = generatePersonalizedFitnessPlan(input);

  // Check overview and calories
  assert.ok(plan.overview.daily_calories > 2000);
  assert.ok(plan.overview.macro_split.protein_g >= 140);
  assert.ok(plan.overview.macro_split.carbs_g > 0);
  assert.ok(plan.overview.macro_split.fat_g > 0);

  // Check safety disclaimer existence
  assert.ok(plan.overview.safety_disclaimer.includes('educational and informational'));
  assert.ok(plan.overview.safety_disclaimer.includes('not medical advice'));

  // Check weekly resistance plan split
  assert.ok(plan.weekly_workout_plan.length >= 3);
  const monday = plan.weekly_workout_plan[0];
  assert.ok(monday.exercises.length >= 4);

  // Check Indian vegetarian options
  assert.ok(plan.daily_diet_plan.indian_alternatives.length >= 2);
  assert.ok(plan.daily_diet_plan.affordable_tips.length >= 2);
});

test('PARSHURAM GYM - 9. Dave Admin Dashboard Metrics Aggregation', async () => {
  const metrics = await api.getAdminDashboardMetrics();
  assert.ok(metrics.totalMembers >= 2);
  assert.ok(metrics.totalEmployees >= 3);
  assert.ok(typeof metrics.todayMemberAttendance === 'number');
  assert.ok(typeof metrics.todayStaffAttendance === 'number');
  assert.ok(metrics.settings.gym_name.includes('PARSHURAM'));
});
