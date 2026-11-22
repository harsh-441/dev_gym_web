// Brand Constants, Seed Catalogs & Initial Values for Parshuram Fitness Club

import {
  AppSettings,
  DietPlan,
  Exercise,
  MembershipPlan,
  Trainer,
  WorkoutProgram,
  YouTubeVideo
} from '../types';

export const BRAND = {
  name: 'PARSHURAM FITNESS CLUB',
  established: 2016,
  tagline: 'INSPIRED BY DIVINITY. BUILT THROUGH DISCIPLINE.',
  owner: 'Kapil Dev',
  contactPersons: ['Kapil Dev', 'Dev Vats'],
  email: 'vdev6514@gmail.com',
  phonePrimary: '9897191013',
  phoneSecondary: '7983626564',
  whatsappPrimary: '9897191013',
  whatsappSecondary: '7983626564',
  address: 'Ram Katori Wali Gali, Near Meerut City Public School, Meerut, Uttar Pradesh, India',
  landmark: 'Near Meerut City Public School',
  city: 'Meerut, Uttar Pradesh, India',
  googleMapsSearchUrl: 'https://www.google.com/maps/search/?api=1&query=Parshuram+Fitness+Club%2C+Ram+Katori+Wali+Gali%2C+Meerut',
  instagram: 'https://instagram.com/parshuram_fitness_club',
  openingHours: {
    weekdays: 'Morning: 5:30 AM – 10:00 AM | Evening: 5:00 PM – 10:00 PM',
    sunday: 'CLOSED',
    holidayNotice: 'Holiday information: The gym informs members one day before a holiday.'
  },
  colors: {
    black: '#050B17',
    charcoal: '#0A1128',
    card: '#101B37',
    athleticRed: '#D4AF37',
    accentRed: '#E5C158',
    metallicSilver: '#CBD5E1',
    white: '#FFFFFF',
    textMuted: '#94A3B8'
  }
};

export const DEFAULT_APP_SETTINGS: AppSettings = {
  gym_name: 'PARSHURAM FITNESS CLUB',
  tagline: 'INSPIRED BY DIVINITY. BUILT THROUGH DISCIPLINE.',
  owner_name: 'Kapil Dev',
  contact_phone: '9897191013, 7983626564',
  contact_email: 'vdev6514@gmail.com',
  address_line1: 'Ram Katori Wali Gali, Near Meerut City Public School',
  city: 'Meerut, Uttar Pradesh, India',
  opening_hours_weekdays: 'Morning: 5:30 AM – 10:00 AM | Evening: 5:00 PM – 10:00 PM',
  opening_hours_weekends: 'Sunday: CLOSED',
  late_threshold_minutes: 15,
  announcement_banner: 'Welcome to Parshuram Fitness Club, Meerut! Morning: 5:30 AM – 10:00 AM | Evening: 5:00 PM – 10:00 PM'
};

export const INITIAL_MEMBERSHIP_PLANS: MembershipPlan[] = [
  {
    id: 'plan-monthly',
    name: 'Monthly Membership',
    description: 'Full gym floor, strength and cardio access on a flexible monthly basis',
    duration_months: 1,
    price: 500,
    features: [
      'Unlimited gym floor access',
      'Free daily attendance tracking',
      'Cardio & weight training equipment',
      'CrossFit & functional movement floor',
      'Karate training guidance included',
      'Mobile app dashboard access'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-3months',
    name: '3 Months Membership',
    description: '3-month commitment for dedicated body conditioning and transformation',
    duration_months: 3,
    price: 1300,
    features: [
      'All Monthly Membership benefits',
      'Discounted quarterly rate (Save ₹200)',
      'Free workout & nutrition guidance',
      'Special Offer: Eligible for Gym Bag promotion',
      'Karate discipline & self-defense sessions'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-6months',
    name: '6 Months Membership',
    description: 'Half-year training package designed for serious athletes and continuous progress',
    duration_months: 6,
    price: 2500,
    features: [
      'All 3-Month Membership benefits',
      'Extended discount rate (Save ₹500)',
      'Special Offer: Parshuram Fitness Gym Bag included',
      'Continuous coach guidance & form checks',
      'Complete strength, functional & cardio access'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-yearly',
    name: 'Yearly Membership',
    description: 'Complete 12-month transformation membership with maximum savings',
    duration_months: 12,
    price: 5000,
    features: [
      'Full 365-day gym access',
      'Best value package (Only ~₹416/month)',
      'Complimentary Gym Bag bonus',
      'Strength, CrossFit, Cardio & Karate',
      'Priority guidance from Kapil Dev & Dev Vats'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-registration',
    name: 'Registration Fee',
    description: 'One-time admission registration fee for newly enrolled members',
    duration_months: 0,
    price: 100,
    features: [
      'One-time initial enrollment fee',
      'Member ID card and digital profile setup',
      'Member portal attendance history'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'plan-pt',
    name: 'Personal Training',
    description: 'One-on-one coaching and dedicated workout instruction (Billing cycle subject to owner confirmation)',
    duration_months: 1,
    price: 3000,
    features: [
      'Dedicated one-on-one trainer attention',
      'Customized workout & nutrition regimen',
      'Biomechanics and posture correction',
      'Note: Billing period must be confirmed with owner Kapil Dev'
    ],
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    name: 'Barbell Bench Press',
    category: 'chest',
    target_muscles: ['Pectoralis Major', 'Anterior Deltoids', 'Triceps Brachii'],
    equipment: 'Olympic Barbell & Flat Bench',
    difficulty: 'intermediate',
    sets: '4',
    reps: '8-10',
    instructions: [
      'Lie flat on the bench with eyes under the bar and feet planted firmly on the floor.',
      'Grip the bar slightly wider than shoulder-width with wrists straight.',
      'Retract scapula, arch slightly, and unrack the bar with locked arms.',
      'Lower bar with control to lower-mid sternum, elbows angled ~45-75 degrees.',
      'Press explosively back up along a slight backward arc to lockout.'
    ],
    common_mistakes: [
      'Bouncing the bar off ribs',
      'Flaring elbows out at 90 degrees putting stress on rotators',
      'Lifting glutes off the bench'
    ],
    safety_notes: [
      'Always use safety catch pins or a reliable spotter for heavy loads.',
      'Keep wrists rigid and stacked over elbows.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-2',
    name: 'Barbell Back Squat',
    category: 'legs',
    target_muscles: ['Quadriceps', 'Gluteus Maximus', 'Hamstrings', 'Core'],
    equipment: 'Squat Rack & Barbell',
    difficulty: 'intermediate',
    sets: '4',
    reps: '6-8',
    instructions: [
      'Position bar on upper traps (high bar) or rear delts (low bar).',
      'Step back, stance shoulder-width with toes flared out 15-30 degrees.',
      'Take a deep belly breath into core (valsalva maneuver).',
      'Break at hips and knees simultaneously, descending until hip crease passes knee joint.',
      'Drive through mid-foot to stand tall, exhaling through top lockout.'
    ],
    common_mistakes: [
      'Knees caving inwards (valgus collapse)',
      'Rounding the lower back in the hole (butt wink)',
      'Cutting depth short'
    ],
    safety_notes: [
      'Set rack safety bars right below bottom depth.',
      'Warm up ankles and hip flexors before loading heavy.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-3',
    name: 'Conventional Deadlift',
    category: 'back',
    target_muscles: ['Erector Spinae', 'Latissimus Dorsi', 'Glutes', 'Hamstrings', 'Forearms'],
    equipment: 'Olympic Barbell & Bumper Plates',
    difficulty: 'advanced',
    sets: '3',
    reps: '5',
    instructions: [
      'Stand with mid-foot directly under the bar, feet hip-width.',
      'Hinge hips back and grip bar just outside shins.',
      'Pull chest proud, engage lats like squeezing oranges in armpits.',
      'Push the floor away through mid-foot, keeping bar close to shins and thighs.',
      'Lock out hips and knees fully without hyperextending lower back.'
    ],
    common_mistakes: [
      'Rounding lumbar spine during initial pull',
      'Jerking the bar abruptly instead of building tension',
      'Allowing bar to drift away from body center'
    ],
    safety_notes: [
      'Prioritize spinal alignment over heavy weight.',
      'Avoid hitching the bar on knees.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-4',
    name: 'Standing Overhead Military Press',
    category: 'shoulders',
    target_muscles: ['Anterior Deltoids', 'Lateral Deltoids', 'Triceps', 'Core'],
    equipment: 'Barbell',
    difficulty: 'intermediate',
    sets: '3',
    reps: '8-10',
    instructions: [
      'Clean or unrack barbell at clavicle height with palms facing forward.',
      'Squeeze glutes and brace abdominal wall rigidly.',
      'Press barbell straight upwards, tilting head back slightly to clear chin.',
      'Lock out bar directly over shoulders/mid-foot, pushing head through the window.',
      'Lower under strict control back to collarbone.'
    ],
    common_mistakes: [
      'Excessive backward lean into lumbar hyperextension',
      'Flaring wrists backwards'
    ],
    safety_notes: [
      'Keep core braced like taking a punch.',
      'Keep eyes looking straight ahead.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=2yjwXTZQDDI',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-5',
    name: 'Standing Barbell Bicep Curl',
    category: 'biceps',
    target_muscles: ['Biceps Brachii', 'Brachialis', 'Brachioradialis'],
    equipment: 'EZ-Bar or Straight Barbell',
    difficulty: 'beginner',
    sets: '3',
    reps: '10-12',
    instructions: [
      'Hold barbell with underhand shoulder-width grip, standing tall.',
      'Keep elbows pinned near ribs, avoid swinging torso.',
      'Curl bar up by contracting biceps until peak contraction at shoulder height.',
      'Squeeze for 1 second, then lower slowly through a 3-second eccentric phase.'
    ],
    common_mistakes: [
      'Using momentum and swinging hips',
      'Allowing elbows to drift forward excessively'
    ],
    safety_notes: [
      'EZ-bar is recommended if straight bar causes wrist discomfort.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=ykJmrZ5v0Oo',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-6',
    name: 'Parallel Bar Tricep Dips',
    category: 'triceps',
    target_muscles: ['Triceps Brachii', 'Lower Pectorals', 'Anterior Deltoid'],
    equipment: 'Dip Station / Parallel Bars',
    difficulty: 'intermediate',
    sets: '3',
    reps: '10-15',
    instructions: [
      'Mount dip bars with arms locked out and wrists straight.',
      'Keep torso upright for maximum triceps focus (lean forward for chest focus).',
      'Lower body by bending elbows until upper arms are parallel to the floor.',
      'Push through palms explosively back to top lockout.'
    ],
    common_mistakes: [
      'Going deeper than shoulder mobility allows, straining capsule',
      'Shrugging shoulders towards ears'
    ],
    safety_notes: [
      'Avoid dipping past 90 degrees if you have shoulder impingement history.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=2z8JmcrW-As',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-7',
    name: 'Hanging Leg Raises',
    category: 'abs',
    target_muscles: ['Rectus Abdominis', 'Hip Flexors', 'Obliques'],
    equipment: 'Pull-up Bar',
    difficulty: 'intermediate',
    sets: '3',
    reps: '12-15',
    instructions: [
      'Hang from pull-up bar with overhand grip and active shoulders.',
      'Brace core and curl pelvis upward, lifting straight legs toward horizontal or bar.',
      'Pause for a beat at top contraction, minimizing torso swing.',
      'Lower legs back down under strict control.'
    ],
    common_mistakes: [
      'Using swinging momentum instead of abdominal flexion',
      'Only flexing hip flexors without posterior pelvic tilt'
    ],
    safety_notes: [
      'Bend knees into a knee-raise if straight legs cause lower back discomfort.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=Pr1ieGZ5atk',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'ex-8',
    name: 'HIIT Battle Ropes & Kettlebell Conditioning',
    category: 'cardio',
    target_muscles: ['Full Body', 'Cardiovascular System', 'Shoulders', 'Grip'],
    equipment: 'Heavy Battle Ropes & Kettlebells',
    difficulty: 'intermediate',
    sets: '5 rounds',
    reps: '30s work / 30s rest',
    instructions: [
      'Hold battle rope ends in half-squat athletic stance.',
      'Alternate slamming arms up and down generating fluid waves through anchors.',
      'Transition immediately to kettlebell swings for remaining work interval.',
      'Catch breath during designated 30s recovery period.'
    ],
    common_mistakes: [
      'Rounding lower back during explosive rope waves',
      'Holding breath instead of rhythmically breathing'
    ],
    safety_notes: [
      'Maintain knee soft bend and flat spine throughout high-intensity intervals.'
    ],
    demonstration_image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    video_url: 'https://www.youtube.com/watch?v=0k571vY_k3k',
    is_active: true,
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_DIET_PLANS: DietPlan[] = [
  {
    id: 'diet-veg-protein',
    title: 'High-Protein Indian Vegetarian Muscle Plan',
    category: 'indian_meal_plans',
    description: 'Scientifically crafted 100% vegetarian nutrition plan optimized with paneer, lentils, soya chunks, and dairy for maximum hypertrophy.',
    target_goal: 'muscle_gain',
    calories: 2600,
    protein_g: 145,
    carbs_g: 310,
    fat_g: 65,
    is_veg: true,
    is_indian: true,
    cost_tier: 'moderate',
    meals: [
      {
        id: 'm-1',
        diet_plan_id: 'diet-veg-protein',
        meal_type: 'breakfast',
        food_item: 'Oats in cow milk with almonds, chia seeds, and 1 scoop whey/plant protein or boiled sprout chaat',
        quantity: '1 large bowl (80g oats, 300ml milk, 15 almonds)',
        calories: 620,
        protein_g: 38,
        carbs_g: 75,
        fat_g: 16
      },
      {
        id: 'm-2',
        diet_plan_id: 'diet-veg-protein',
        meal_type: 'lunch',
        food_item: 'Low-fat Paneer (150g) bhurji cooked in mustard oil, 3 whole-wheat rotis, thick Dal Tadka, and mixed cucumber-tomato salad',
        quantity: '1 standard thali serving',
        calories: 780,
        protein_g: 44,
        carbs_g: 85,
        fat_g: 22
      },
      {
        id: 'm-3',
        diet_plan_id: 'diet-veg-protein',
        meal_type: 'snack',
        food_item: 'Roasted Chana (Bengal gram) with roasted peanuts, jaggery piece, and black coffee/green tea',
        quantity: '60g chana + 20g peanuts',
        calories: 360,
        protein_g: 18,
        carbs_g: 45,
        fat_g: 10
      },
      {
        id: 'm-4',
        diet_plan_id: 'diet-veg-protein',
        meal_type: 'dinner',
        food_item: 'High-protein Soya Chunks curry (60g dry), brown basmati rice, curd (dahi 150g), and steamed green beans',
        quantity: '1 plate',
        calories: 720,
        protein_g: 45,
        carbs_g: 88,
        fat_g: 14
      }
    ],
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'diet-budget-muscle',
    title: 'Budget-Friendly Student Muscle Builder',
    category: 'affordable_nutrition',
    description: 'Designed specifically for students and budget-conscious lifters in India. Maximizes protein-per-rupee using eggs, sattu, chana, and curd.',
    target_goal: 'weight_gain',
    calories: 2800,
    protein_g: 135,
    carbs_g: 360,
    fat_g: 70,
    is_veg: false, // Eggetarian
    is_indian: true,
    cost_tier: 'budget',
    meals: [
      {
        id: 'm-5',
        diet_plan_id: 'diet-budget-muscle',
        meal_type: 'breakfast',
        food_item: '4 whole boiled eggs, 4 slices brown bread with peanut butter, and a banana',
        quantity: '1 serving',
        calories: 680,
        protein_g: 32,
        carbs_g: 72,
        fat_g: 26
      },
      {
        id: 'm-6',
        diet_plan_id: 'diet-budget-muscle',
        meal_type: 'lunch',
        food_item: 'Double dal (Yellow moong/arhar), 250g cooked rice, green vegetables, and 200g homemade curd',
        quantity: '1 large thali',
        calories: 790,
        protein_g: 34,
        carbs_g: 110,
        fat_g: 16
      },
      {
        id: 'm-7',
        diet_plan_id: 'diet-budget-muscle',
        meal_type: 'snack',
        food_item: 'Desi Sattu Drink (roasted gram flour mixed in water with roasted cumin, pink salt, lemon juice) + roasted peanuts',
        quantity: '60g sattu powder in 400ml water',
        calories: 410,
        protein_g: 22,
        carbs_g: 58,
        fat_g: 8
      },
      {
        id: 'm-8',
        diet_plan_id: 'diet-budget-muscle',
        meal_type: 'dinner',
        food_item: 'Egg curry (3 eggs) or Soya bhurji, 4 whole wheat rotis, and fresh cucumber salad',
        quantity: '1 plate',
        calories: 740,
        protein_g: 38,
        carbs_g: 84,
        fat_g: 20
      }
    ],
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'diet-fat-loss',
    title: 'Lean Shred & Definition Plan',
    category: 'fat_loss',
    description: 'Caloric deficit diet preserving lean mass while targeting visceral and subcutaneous fat with high satiety foods.',
    target_goal: 'fat_loss',
    calories: 1850,
    protein_g: 155,
    carbs_g: 150,
    fat_g: 45,
    is_veg: false,
    is_indian: true,
    cost_tier: 'moderate',
    meals: [
      {
        id: 'm-9',
        diet_plan_id: 'diet-fat-loss',
        meal_type: 'breakfast',
        food_item: '5 egg white + 1 whole egg vegetable omelet with spinach and mushrooms, 1 slice whole multigrain toast',
        quantity: '1 plate',
        calories: 380,
        protein_g: 32,
        carbs_g: 22,
        fat_g: 9
      },
      {
        id: 'm-10',
        diet_plan_id: 'diet-fat-loss',
        meal_type: 'lunch',
        food_item: 'Grilled chicken breast (180g) or Grilled Paneer/Tofu with herbs, steamed broccoli, and 1 roti or 100g quinoa',
        quantity: '1 meal box',
        calories: 520,
        protein_g: 48,
        carbs_g: 35,
        fat_g: 14
      },
      {
        id: 'm-11',
        diet_plan_id: 'diet-fat-loss',
        meal_type: 'snack',
        food_item: 'Sprouts chaat (moong and kala chana) with lemon and chopped tomatoes, green tea',
        quantity: '1 medium bowl (120g)',
        calories: 220,
        protein_g: 14,
        carbs_g: 36,
        fat_g: 2
      },
      {
        id: 'm-12',
        diet_plan_id: 'diet-fat-loss',
        meal_type: 'dinner',
        food_item: 'Clear chicken soup or Paneer-vegetable stir-fry, large raw greens salad with apple cider vinegar dressing',
        quantity: '1 large bowl',
        calories: 480,
        protein_g: 42,
        carbs_g: 28,
        fat_g: 14
      }
    ],
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_TRAINERS: Trainer[] = [
  {
    id: 'tr-1',
    employee_id: 'emp-kapil',
    specializations: ['Strength & Weight Training', 'Cardio & Conditioning', 'CrossFit & Functional Training'],
    certifications: ['Certified Fitness Coach', 'Owner & Head Trainer (Parshuram Fitness Club)'],
    experience_years: 3,
    bio: 'Kapil Dev is the owner and coach of Parshuram Fitness Club, established in 2016 in Meerut. With 3 years of dedicated hands-on coaching, Kapil leads members with discipline, personalized guidance, and supportive strength building.',
    rating: 5.0,
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'tr-2',
    employee_id: 'emp-dev-vats',
    specializations: ['Functional & Strength Training', 'Cardio Conditioning', 'Karate Training & Self-Defence'],
    certifications: ['Fitness Coach', '8th Dan Black Belt (Specific coach qualification subject to owner verification)'],
    experience_years: 3,
    bio: 'Dev Vats is a dedicated coach at Parshuram Fitness Club with 3 years of coaching experience, helping athletes build confidence, physical resilience, and disciplined functional fitness.',
    rating: 4.9,
    photo_url: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80'
  }
];

export const INITIAL_YOUTUBE_VIDEOS: YouTubeVideo[] = [
  {
    id: 'yt-1',
    title: 'Pristine Bench Press Biomechanics & Shoulder Protection',
    youtube_id: 'rT7DgCr-3pg',
    youtube_url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    category: 'Form & Technique',
    description: 'Learn scapular retraction, grip width positioning, and elbow tuck angles to bench heavy without rotator cuff strain.',
    is_featured: true,
    order_index: 1,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'yt-2',
    title: 'The Perfect Squat: Depth, Stance & Core Bracing',
    youtube_id: 'ultWZbUMPL8',
    youtube_url: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    category: 'Lower Body Strength',
    description: 'Deep dive into hip anatomy, ankle mobility drills, and valsalva bracing for maximum squat power.',
    is_featured: true,
    order_index: 2,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'yt-3',
    title: 'Master the Conventional Deadlift in 5 Steps',
    youtube_id: 'op9kVnSso6Q',
    youtube_url: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    category: 'Compound Power',
    description: 'Step-by-step cueing to wedge hips, lock lats, and pull with zero lower back strain.',
    is_featured: true,
    order_index: 3,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'yt-4',
    title: 'Full Body Functional Conditioning & Agility',
    youtube_id: '0k571vY_k3k',
    youtube_url: 'https://www.youtube.com/watch?v=0k571vY_k3k',
    category: 'Cardio & Conditioning',
    description: 'High-octane conditioning routine to spike VO2 max and burn stubborn fat.',
    is_featured: false,
    order_index: 4,
    created_at: '2026-01-01T00:00:00Z'
  }
];

export const INITIAL_WORKOUT_PROGRAMS: WorkoutProgram[] = [
  {
    id: 'prog-1',
    title: 'Parshuram Strength Foundation',
    description: 'A 12-week classic linear progression program focused on the four pillars: Squat, Bench, Deadlift, and Overhead Press.',
    level: 'intermediate',
    duration_weeks: 12,
    goal: 'strength',
    cover_image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
    days_per_week: 4,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prog-2',
    title: 'Divine Hypertrophy Push-Pull-Legs',
    description: '6-day high-volume bodybuilding protocol designed for maximum muscle growth and symmetrical proportion.',
    level: 'advanced',
    duration_weeks: 16,
    goal: 'muscle_gain',
    cover_image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80',
    days_per_week: 6,
    created_at: '2026-01-01T00:00:00Z'
  },
  {
    id: 'prog-3',
    title: 'Warrior Fat-Incineration & Conditioning',
    description: 'Combines compound circuit training with metabolic conditioning to preserve lean muscle while accelerating fat loss.',
    level: 'beginner',
    duration_weeks: 8,
    goal: 'fat_loss',
    cover_image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80',
    days_per_week: 4,
    created_at: '2026-01-01T00:00:00Z'
  }
];
