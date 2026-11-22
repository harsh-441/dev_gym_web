// Automated Test Suite for Parshuram Fitness Gym Ecosystem
// Verifies shared Owner/Member workflows, member attendance guards, and the AI planner.

const test = require('node:test');
const assert = require('node:assert/strict');

// Import built shared modules
const {
  api,
  validateMemberRegistration,
  validateAIPlannerInput,
  generatePersonalizedFitnessPlan,
  BRAND,
  DEFAULT_APP_SETTINGS
} = require('../packages/shared/dist/index.js');

test('PARSHURAM GYM - 1. Brand Identity & Constants', () => {
  assert.ok(BRAND.name.includes('PARSHURAM FITNESS'));
  assert.ok(BRAND.owner.length > 0);
  assert.equal(BRAND.tagline, 'INSPIRED BY DIVINITY. BUILT THROUGH DISCIPLINE.');
  assert.ok(BRAND.colors.athleticRed);
  assert.ok(BRAND.colors.black);
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

test('PARSHURAM GYM - 3. Legacy staff accounts are inactive and roles are removed', () => {
  const legacyStaff = api.store.profiles.filter((profile) =>
    ['devvats@parshuramfitnessclub.com', 'vikram@parshuramgym.com', 'priya@parshuramgym.com', 'amit@parshuramgym.com'].includes(profile.email)
  );
  assert.equal(legacyStaff.length, 4);
  assert.ok(legacyStaff.every((profile) => profile.role === 'member' && !profile.is_active));
});

test('PARSHURAM GYM - 6. AI Fitness & Nutrition Planner Science Calculation', () => {
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

test('PARSHURAM GYM - 5. Demo dashboard contains no fabricated attendance', async () => {
  const metrics = await api.getAdminDashboardMetrics();
  assert.ok(metrics.totalMembers >= 2);
  assert.equal(metrics.todayMemberAttendance, 0);
  assert.ok(Array.isArray(metrics.recentEnquiries));
  assert.ok(metrics.settings.gym_name.includes('PARSHURAM'));
});
