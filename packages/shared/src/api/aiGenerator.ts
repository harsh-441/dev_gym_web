// Intelligent Fitness & Nutrition Calculation Engine
// Adheres strictly to safety disclaimers, Indian culinary alternatives, and macronutrient science

import { AIFitnessPlannerInput, AIFitnessPlannerResult } from '../types';

export function generatePersonalizedFitnessPlan(input: AIFitnessPlannerInput): AIFitnessPlannerResult {
  // 1. BMI and Basal Metabolic Rate (Mifflin-St Jeor formula)
  const heightM = input.height_cm / 100;
  const bmi = parseFloat((input.weight_kg / (heightM * heightM)).toFixed(1));

  // Base BMR estimation
  let bmr = 10 * input.weight_kg + 6.25 * input.height_cm - 5 * input.age;
  if (input.gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }

  // Activity multipliers
  const activityMultipliers = {
    sedentary: 1.2,
    lightly_active: 1.375,
    moderately_active: 1.55,
    very_active: 1.725
  };
  const tdee = Math.round(bmr * (activityMultipliers[input.activity_level] || 1.4));

  // Caloric adjustment according to primary goal
  let targetCalories = tdee;
  let proteinRatio = 2.0; // g per kg of bodyweight
  let fatRatio = 0.8;

  switch (input.fitness_goal) {
    case 'fat_loss':
      targetCalories = Math.max(1400, Math.round(tdee - 450));
      proteinRatio = 2.2;
      break;
    case 'muscle_gain':
      targetCalories = Math.round(tdee + 300);
      proteinRatio = 2.0;
      break;
    case 'weight_gain':
      targetCalories = Math.round(tdee + 500);
      proteinRatio = 1.8;
      break;
    case 'strength':
      targetCalories = Math.round(tdee + 200);
      proteinRatio = 2.0;
      break;
    case 'endurance':
    case 'general_fitness':
    default:
      targetCalories = tdee;
      proteinRatio = 1.6;
      break;
  }

  const targetProteinG = Math.round(input.weight_kg * proteinRatio);
  const targetFatG = Math.round(input.weight_kg * fatRatio);
  const caloriesFromProteinAndFat = targetProteinG * 4 + targetFatG * 9;
  const remainingCalories = Math.max(0, targetCalories - caloriesFromProteinAndFat);
  const targetCarbsG = Math.round(remainingCalories / 4);

  // Determine workout split based on training days per week
  const days = input.training_days_per_week || 4;
  let weeklyWorkout: AIFitnessPlannerResult['weekly_workout_plan'] = [];

  if (days <= 3) {
    // Full Body Split
    weeklyWorkout = [
      {
        day: 'Monday',
        focus: 'Full Body Compound Power (Squat & Press Focus)',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Focus on hitting parallel depth with tight brace' },
          { name: 'Barbell Bench Press', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Controlled eccentric down to lower chest' },
          { name: 'Bent-Over Barbell Rows', sets: 3, reps: '8-10', rest_seconds: 90, notes: 'Keep spine neutral, pull with elbows' },
          { name: 'Standing Overhead Dumbbell Press', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Core rigid, squeeze glutes' },
          { name: 'Plank Hold', sets: 3, reps: '45-60s', rest_seconds: 60, notes: 'Tuck pelvis, create full-body tension' }
        ]
      },
      {
        day: 'Wednesday',
        focus: 'Full Body Posterior Chain & Conditioning',
        exercises: [
          { name: 'Conventional Deadlift or Trap-Bar Deadlift', sets: 3, reps: '5', rest_seconds: 150, notes: 'Pull chest proud before bar breaks floor' },
          { name: 'Incline Dumbbell Press', sets: 3, reps: '10-12', rest_seconds: 90, notes: '30-degree bench incline' },
          { name: 'Lat Pulldowns or Pull-ups', sets: 4, reps: '8-10', rest_seconds: 75, notes: 'Drive elbows down to waist' },
          { name: 'Walking Dumbbell Lunges', sets: 3, reps: '12 per leg', rest_seconds: 75, notes: 'Torso slightly pitched forward' },
          { name: 'Hanging Knee Raises', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Posterior pelvic tilt at top' }
        ]
      },
      {
        day: 'Friday',
        focus: 'Full Body Hypertrophy & Core Resilience',
        exercises: [
          { name: 'Leg Press or Front Squats', sets: 4, reps: '10-12', rest_seconds: 90, notes: 'Full knee flexion without tailbone lifting' },
          { name: 'Seated Cable Cable Rows', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Squeeze shoulder blades for 1 second' },
          { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', rest_seconds: 60, notes: 'Lead with elbows, controlled tempo' },
          { name: 'Barbell Bicep Curls', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'No momentum swinging' },
          { name: 'Triceps Overhead Extensions', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Full long-head triceps stretch' }
        ]
      }
    ];
  } else if (days === 4) {
    // Upper / Lower Split
    weeklyWorkout = [
      {
        day: 'Monday',
        focus: 'Upper Body Strength (Chest & Back Heavy)',
        exercises: [
          { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Primary compound chest press' },
          { name: 'Chest-Supported T-Bar Rows', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Full upper-back contraction' },
          { name: 'Standing Overhead Military Press', sets: 3, reps: '8-10', rest_seconds: 90, notes: 'Braced standing position' },
          { name: 'Weighted Dips or Machine Dips', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Strict 90-degree arm bend' },
          { name: 'Face Pulls with Rope', sets: 3, reps: '15', rest_seconds: 60, notes: 'External shoulder rotation focus' }
        ]
      },
      {
        day: 'Tuesday',
        focus: 'Lower Body Strength & Core',
        exercises: [
          { name: 'Barbell Back Squats', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Drive through mid-foot' },
          { name: 'Romanian Deadlifts (RDL)', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Deep hamstring stretch, soft knees' },
          { name: 'Bulgarian Split Squats', sets: 3, reps: '10 per leg', rest_seconds: 75, notes: 'Unilateral quad balance' },
          { name: 'Standing Calf Raises', sets: 4, reps: '15', rest_seconds: 45, notes: '2-second stretch at bottom' },
          { name: 'Hanging Leg Raises', sets: 3, reps: '12', rest_seconds: 60, notes: 'Strict core flexion' }
        ]
      },
      {
        day: 'Thursday',
        focus: 'Upper Body Hypertrophy (Arms & Delts Focus)',
        exercises: [
          { name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Clavicular pectorals emphasis' },
          { name: 'Lat Pulldowns (Wide Grip)', sets: 4, reps: '10-12', rest_seconds: 75, notes: 'Lats engagement' },
          { name: 'Dumbbell Lateral Raises', sets: 4, reps: '12-15', rest_seconds: 60, notes: 'Side delt cap isolation' },
          { name: 'Incline Dumbbell Bicep Curls', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Full stretch of long head' },
          { name: 'Cable Triceps Pushdowns', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Lockout contraction' }
        ]
      },
      {
        day: 'Friday',
        focus: 'Lower Body Hypertrophy & Posterior Chain',
        exercises: [
          { name: 'Leg Press', sets: 4, reps: '10-12', rest_seconds: 90, notes: 'High volume quad overload' },
          { name: 'Lying Hamstring Curls', sets: 4, reps: '12', rest_seconds: 60, notes: 'Hamstrings isolation' },
          { name: 'Dumbbell Goblet Squats', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Upright torso posture' },
          { name: 'Cable Woodchoppers', sets: 3, reps: '12 per side', rest_seconds: 45, notes: 'Rotational core power' }
        ]
      }
    ];
  } else {
    // 5-6 Day Push-Pull-Legs Split
    weeklyWorkout = [
      {
        day: 'Day 1 (Push A)',
        focus: 'Chest, Shoulders & Triceps Heavy',
        exercises: [
          { name: 'Barbell Flat Bench Press', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Heavy primary builder' },
          { name: 'Seated Dumbbell Shoulder Press', sets: 3, reps: '8-10', rest_seconds: 90, notes: 'Full range overhead' },
          { name: 'Incline Dumbbell Fly/Press', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Chest contraction' },
          { name: 'Cable Lateral Raises', sets: 4, reps: '12-15', rest_seconds: 60, notes: 'Continuous delt tension' },
          { name: 'Overhead Rope Tricep Extension', sets: 3, reps: '12', rest_seconds: 60, notes: 'Long head tricep' }
        ]
      },
      {
        day: 'Day 2 (Pull A)',
        focus: 'Back, Rear Delts & Biceps',
        exercises: [
          { name: 'Deadlift or Barbell Row', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Posterior back thickness' },
          { name: 'Wide-Grip Pull-ups / Lat Pulldown', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Lat sweep width' },
          { name: 'Seated Cable Row (Close Grip)', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Mid-back thickness' },
          { name: 'Reverse Pec-Deck Flyes', sets: 4, reps: '15', rest_seconds: 60, notes: 'Rear deltoids' },
          { name: 'Barbell Bicep Curls', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Strict peak form' }
        ]
      },
      {
        day: 'Day 3 (Legs A)',
        focus: 'Quads, Hamstrings & Calves',
        exercises: [
          { name: 'Barbell Back Squat', sets: 4, reps: '6-8', rest_seconds: 120, notes: 'Foundational leg strength' },
          { name: 'Romanian Deadlift (RDL)', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Hips back, hamstring stretch' },
          { name: 'Leg Extensions', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Rectus femoris pump' },
          { name: 'Seated Leg Curls', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Knee flexion focus' },
          { name: 'Standing Calf Raises', sets: 4, reps: '15-20', rest_seconds: 45, notes: 'Pause at top and bottom' }
        ]
      },
      {
        day: 'Day 4 (Push B)',
        focus: 'Upper Chest & Triceps Hypertrophy',
        exercises: [
          { name: 'Incline Barbell Bench Press', sets: 4, reps: '8-10', rest_seconds: 90, notes: 'Upper chest builder' },
          { name: 'Standing Overhead Military Press', sets: 3, reps: '8-10', rest_seconds: 90, notes: 'Deltoid push' },
          { name: 'Dips (Chest Leaned)', sets: 3, reps: '10-12', rest_seconds: 75, notes: 'Lower pec & tricep' },
          { name: 'Dumbbell Lateral Raises', sets: 4, reps: '15', rest_seconds: 60, notes: 'Deltoid width' },
          { name: 'Tricep Pushdowns', sets: 3, reps: '12-15', rest_seconds: 60, notes: 'Arm lockout' }
        ]
      },
      {
        day: 'Day 5 (Pull B)',
        focus: 'Lats, Traps & Bicep Brachialis',
        exercises: [
          { name: 'Weighted Neutral Pull-ups', sets: 4, reps: '6-8', rest_seconds: 90, notes: 'Strong lat stretch' },
          { name: 'One-Arm Dumbbell Rows', sets: 4, reps: '10 each', rest_seconds: 75, notes: 'Unilateral symmetry' },
          { name: 'Barbell Shrugs', sets: 3, reps: '12', rest_seconds: 60, notes: 'Upper trapezius' },
          { name: 'Incline Dumbbell Curls', sets: 3, reps: '10-12', rest_seconds: 60, notes: 'Long head stretch' },
          { name: 'Hammer Curls', sets: 3, reps: '12', rest_seconds: 60, notes: 'Brachialis & forearm thickness' }
        ]
      }
    ];
  }

  // Tailor Diet Plan based on dietary preference
  const isVeg = input.dietary_preference === 'vegetarian' || input.dietary_preference === 'vegan';

  const breakfastCalories = Math.round(targetCalories * 0.25);
  const lunchCalories = Math.round(targetCalories * 0.35);
  const dinnerCalories = Math.round(targetCalories * 0.28);
  const snackCalories = Math.round(targetCalories * 0.12);

  const breakfast = isVeg
    ? {
        items: [
          '80g Rolled Oats cooked with 250ml warm milk / plant milk',
          '15 Raw California Almonds + 1 tbsp Chia Seeds',
          '1 scoop Clean Whey or Soya/Plant Protein isolate (or 100g sprouted Moong Chaat)',
          '1 Medium Banana / seasonal apple'
        ],
        calories: breakfastCalories,
        protein_g: Math.round(targetProteinG * 0.28)
      }
    : {
        items: [
          '4 Whole Eggs (boiled or prepared as desi masala bhurji)',
          '3 Slices 100% Whole Wheat Bread with 1 tbsp natural peanut butter',
          '1 Cup Green Tea or black coffee',
          '1 Seasonal fruit (banana or apple)'
        ],
        calories: breakfastCalories,
        protein_g: Math.round(targetProteinG * 0.28)
      };

  const lunch = isVeg
    ? {
        items: [
          '150g Low-fat Paneer prepared with tomatoes and capsicum in cold-pressed oil',
          '1 Large bowl Thick Dal Tadka (Arhar / Moong / Chana Dal)',
          '3 Fresh Whole Wheat Rotis or 200g Brown Basmati Rice',
          '1 Cup Fresh homemade Curd (Dahi) + Green salad (cucumber, beetroot, onion)'
        ],
        calories: lunchCalories,
        protein_g: Math.round(targetProteinG * 0.35)
      }
    : {
        items: [
          '180g Marinated Tandoori/Curry Chicken Breast or 200g Fresh Rohu/Katla Fish',
          '1 Bowl Yellow Dal or Rajma',
          '2-3 Whole Wheat Rotis or 180g steamed rice',
          'Fresh vegetable salad with lemon and rock salt'
        ],
        calories: lunchCalories,
        protein_g: Math.round(targetProteinG * 0.35)
      };

  const snacks = isVeg
    ? {
        items: [
          '60g Roasted Chana (Bhuna Chana) with 20g roasted peanuts',
          '1 Glass Buttermilk (Chaas) with roasted jeera & mint, or 40g roasted Makhana',
          'Black coffee or Ginger-cardamom tea without refined sugar'
        ],
        calories: snackCalories,
        protein_g: Math.round(targetProteinG * 0.12)
      }
    : {
        items: [
          'Desi Sattu Drink (50g roasted gram powder in 350ml water with lemon & pink salt)',
          '2 Boiled egg whites + handful of walnuts',
          'Black coffee or green tea'
        ],
        calories: snackCalories,
        protein_g: Math.round(targetProteinG * 0.12)
      };

  const dinner = isVeg
    ? {
        items: [
          '65g Soya Chunks curry (yields ~200g cooked, rich in leucine & protein)',
          '2 Soft Whole Wheat Rotis with light ghee',
          'Steamed green vegetables (palak, bottle gourd, or French beans)',
          'Warm Turmeric milk (Haldi Doodh) before sleep'
        ],
        calories: dinnerCalories,
        protein_g: Math.round(targetProteinG * 0.25)
      }
    : {
        items: [
          '150g Grilled Chicken or 4 Boiled Egg Whites + 1 Whole Egg Curry',
          '2 Whole Wheat Rotis or 150g sweet potato mash',
          'Stir-fried broccoli and bell peppers',
          'Warm chamomile tea or 1 glass warm cow milk'
        ],
        calories: dinnerCalories,
        protein_g: Math.round(targetProteinG * 0.25)
      };

  const indianAlternatives = [
    'Replace costly exotic berries with local Amla (Indian gooseberry) for 20x higher natural Vitamin C.',
    'Utilize Desi Sattu as an exceptionally affordable, high-fiber natural protein powder (20g protein per 100g).',
    'Pair lentils (Dal) with whole grains (Rice/Roti) to synthesize a complete amino acid profile.',
    'Incorporate Paneer and homemade Dahi daily to fortify gut microbiome and calcium absorption.'
  ];

  const affordableTips = [
    'Buy whole eggs by the crate (30 eggs) for a 35% discount compared to retail cartons.',
    'Opt for Soya Chunks: one 200g box costs ~₹45 and delivers a massive 104g of complete plant protein.',
    'Roast your own Kala Chana and Peanuts at home instead of packaged protein bars.',
    'Purchase seasonal local vegetables from Mandis rather than supermarkets.'
  ];

  const advice = `Your estimated Daily Total Energy Expenditure is ${tdee} kcal. We calibrated your plan to ${targetCalories} kcal with ${targetProteinG}g of daily protein, aligning specifically with your ${input.fitness_goal.replace('_', ' ')} target and ${input.training_experience} lifting experience. Focus on progressive overload, staying hydrated (3-4L water daily), and sleeping 7-8 hours for cellular recovery.`;

  return {
    overview: {
      bmi,
      daily_calories: targetCalories,
      macro_split: {
        protein_g: targetProteinG,
        carbs_g: targetCarbsG,
        fat_g: targetFatG
      },
      advice,
      safety_disclaimer:
        'IMPORTANT SAFETY NOTICE: This AI-generated fitness and nutrition plan is created for educational and informational purposes only. It is not medical advice, diagnosis, or treatment. Consult with a qualified physician or healthcare provider before beginning any strenuous workout routine or altering your diet, especially if you have pre-existing cardiovascular conditions, joint injuries, or metabolic disorders. Respect physical limitations and listen to your body.'
    },
    weekly_workout_plan: weeklyWorkout,
    daily_diet_plan: {
      breakfast,
      lunch,
      snacks,
      dinner,
      indian_alternatives: indianAlternatives,
      affordable_tips: affordableTips
    }
  };
}
