'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Dumbbell,
  Utensils,
  ShieldAlert,
  Save,
  CheckCircle2,
  Calendar,
  Flame,
  AlertCircle,
  Clock,
  Printer
} from 'lucide-react';
import {
  AIFitnessPlannerInput,
  AIFitnessPlannerResult,
  FitnessGoalType,
  ActivityLevel,
  validateAIPlannerInput
} from '@parshuram/shared';

export default function AIPlannerPage() {
  const [formData, setFormData] = useState<Partial<AIFitnessPlannerInput>>({
    age: 26,
    height_cm: 175,
    weight_kg: 72,
    gender: 'male',
    fitness_goal: 'muscle_gain',
    training_experience: 'intermediate',
    activity_level: 'moderately_active',
    dietary_preference: 'vegetarian',
    available_equipment: 'full_gym',
    training_days_per_week: 4,
    workout_duration_minutes: 60,
    food_allergies: [],
    injuries_or_limitations: ''
  });

  const [loading, setLoading] = useState(false);
  const [planResult, setPlanResult] = useState<AIFitnessPlannerResult | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [savedSuccess, setSavedSuccess] = useState(false);

  const allergyOptions = ['Lactose/Dairy', 'Peanuts', 'Gluten', 'Soy', 'Shellfish', 'Eggs'];

  const toggleAllergy = (allergy: string) => {
    const current = formData.food_allergies || [];
    if (current.includes(allergy)) {
      setFormData({ ...formData, food_allergies: current.filter((a) => a !== allergy) });
    } else {
      setFormData({ ...formData, food_allergies: [...current, allergy] });
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSavedSuccess(false);

    const validation = validateAIPlannerInput(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setLoading(true);

    try {
      const res = await fetch('/api/ai-planner', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!res.ok) {
        throw new Error('Failed to generate plan');
      }

      const data = await res.json();
      setPlanResult(data.plan);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#050B17] text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black/20 text-[#D4AF37] text-xs font-bold uppercase tracking-wider mb-3 border border-[#D4AF37]/40">
            <Sparkles className="w-4 h-4" />
            <span>Intelligent Conditioning Engine</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white">
            AI Fitness &amp; Indian Nutrition Planner
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            Calibrate an exact periodized weekly routine and macro-accurate Indian meal blueprint based on your biometric profile and dietary goals.
          </p>
        </div>

        {/* Mandatory Safety Notice */}
        <div className="bg-red-950/20 border border-[#D4AF37]/40 rounded-2xl p-5 mb-12 flex items-start space-x-3.5 shadow-xl">
          <ShieldAlert className="w-6 h-6 text-[#D4AF37] shrink-0 mt-0.5" />
          <div className="text-xs text-zinc-300 leading-relaxed">
            <span className="font-bold text-white uppercase tracking-wider block mb-1">
              Safety &amp; Healthcare Disclaimer
            </span>
            All AI-generated fitness and nutrition plans are strictly educational and informational. They do not constitute medical diagnosis or healthcare advice. We never guarantee instant weight loss or rapid muscle building. Consult a qualified physician before starting any rigorous regimen, particularly if managing pre-existing injuries or chronic conditions.
          </div>
        </div>

        {/* Input Form & Preview Split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Questionnaire Form */}
          <div className="lg:col-span-5 bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 sm:p-8 shadow-2xl h-fit">
            <h2 className="text-lg font-bold uppercase font-display text-white mb-6 border-b border-[#1E305C] pb-3 flex items-center justify-between">
              <span>Your Biometrics &amp; Goals</span>
              <span className="text-[11px] font-normal text-gym-silver">No sign-in required</span>
            </h2>

            <form onSubmit={handleGenerate} className="space-y-5">
              {/* Age, Height, Weight */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Age</label>
                  <input
                    type="number"
                    min="12"
                    max="100"
                    value={formData.age || ''}
                    onChange={(e) => setFormData({ ...formData, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.age && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.age}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Height (cm)</label>
                  <input
                    type="number"
                    min="100"
                    max="250"
                    value={formData.height_cm || ''}
                    onChange={(e) => setFormData({ ...formData, height_cm: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.height_cm && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.height_cm}</p>}
                </div>
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    min="30"
                    max="250"
                    value={formData.weight_kg || ''}
                    onChange={(e) => setFormData({ ...formData, weight_kg: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                  {errors.weight_kg && <p className="text-[10px] text-[#D4AF37] mt-0.5">{errors.weight_kg}</p>}
                </div>
              </div>

              {/* Primary Fitness Goal */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Primary Goal</label>
                <select
                  value={formData.fitness_goal}
                  onChange={(e) => setFormData({ ...formData, fitness_goal: e.target.value as FitnessGoalType })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                >
                  <option value="muscle_gain">Muscle Hypertrophy &amp; Growth</option>
                  <option value="fat_loss">Fat Loss &amp; Lean Definition</option>
                  <option value="weight_gain">Healthy Weight Gain &amp; Mass</option>
                  <option value="strength">Maximum Barbell Strength</option>
                  <option value="endurance">Endurance &amp; Stamina</option>
                  <option value="general_fitness">General Fitness &amp; Longevity</option>
                </select>
              </div>

              {/* Dietary Preference & Training Experience */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Diet Preference</label>
                  <select
                    value={formData.dietary_preference}
                    onChange={(e) => setFormData({ ...formData, dietary_preference: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="vegetarian">Indian Vegetarian</option>
                    <option value="non_vegetarian">Non-Vegetarian</option>
                    <option value="eggetarian">Eggetarian</option>
                    <option value="vegan">Vegan</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Experience Level</label>
                  <select
                    value={formData.training_experience}
                    onChange={(e) => setFormData({ ...formData, training_experience: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value="beginner">Beginner (&lt; 1 yr)</option>
                    <option value="intermediate">Intermediate (1-3 yrs)</option>
                    <option value="advanced">Advanced (3+ yrs)</option>
                  </select>
                </div>
              </div>

              {/* Training Days & Duration */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Days Per Week</label>
                  <select
                    value={formData.training_days_per_week}
                    onChange={(e) => setFormData({ ...formData, training_days_per_week: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  >
                    <option value={3}>3 Days (Full Body)</option>
                    <option value={4}>4 Days (Upper / Lower)</option>
                    <option value={5}>5 Days (Push-Pull-Legs)</option>
                    <option value={6}>6 Days (Intense Split)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">Duration (Mins)</label>
                  <input
                    type="number"
                    min="30"
                    max="120"
                    step="15"
                    value={formData.workout_duration_minutes || 60}
                    onChange={(e) => setFormData({ ...formData, workout_duration_minutes: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs focus:border-[#D4AF37] focus:outline-none"
                  />
                </div>
              </div>

              {/* Food Allergies */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1.5">Food Allergies / Exclusions</label>
                <div className="flex flex-wrap gap-1.5">
                  {allergyOptions.map((item) => {
                    const isSelected = formData.food_allergies?.includes(item);
                    return (
                      <button
                        type="button"
                        key={item}
                        onClick={() => toggleAllergy(item)}
                        className={`text-[10px] px-2.5 py-1 rounded-md font-semibold transition-colors ${
                          isSelected
                            ? 'bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black'
                            : 'bg-[#0A1128] text-zinc-400 border border-[#1E305C] hover:text-white'
                        }`}
                      >
                        {item}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Injuries or Limitations */}
              <div>
                <label className="block text-[11px] font-bold uppercase text-zinc-400 mb-1">
                  Injuries / Joint Limitations (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Mild lower back sensitivity, right rotator cuff tweak..."
                  value={formData.injuries_or_limitations || ''}
                  onChange={(e) => setFormData({ ...formData, injuries_or_limitations: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#0A1128] border border-[#1E305C] text-white text-xs placeholder-zinc-500 focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-lg shadow-black/60 flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {loading ? (
                  <span>Synthesizing Periodized Plan...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Personalized Blueprint</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7">
            {planResult ? (
              <div className="space-y-6">
                {/* Overview Card */}
                <div className="bg-[#101B37] rounded-2xl border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1E305C] pb-4 mb-6">
                    <div>
                      <span className="text-xs uppercase font-bold text-[#D4AF37]">Biometric Target Synthesis</span>
                      <h3 className="text-2xl font-black uppercase text-white font-display mt-0.5">
                        Your Custom Fitness Blueprint
                      </h3>
                    </div>

                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => window.print()}
                        className="px-3 py-1.5 rounded bg-[#0A1128] border border-[#1E305C] text-zinc-300 hover:text-white text-xs font-bold flex items-center space-x-1"
                      >
                        <Printer className="w-3.5 h-3.5" />
                        <span>Print</span>
                      </button>

                      <button
                        onClick={() => setSavedSuccess(true)}
                        className="px-3.5 py-1.5 rounded bg-gradient-to-r from-[#D4AF37] to-[#B38F24] text-[#050B17] font-black hover:bg-[#E5C158] text-white text-xs font-bold flex items-center space-x-1 shadow-md"
                      >
                        <Save className="w-3.5 h-3.5" />
                        <span>{savedSuccess ? 'Saved to App!' : 'Save Plan'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Macros grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center mb-6">
                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C]">
                      <span className="text-xl font-black text-white">{planResult.overview.daily_calories}</span>
                      <span className="block text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Daily Calories</span>
                    </div>
                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C]">
                      <span className="text-xl font-black text-[#D4AF37]">{planResult.overview.macro_split.protein_g}g</span>
                      <span className="block text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Target Protein</span>
                    </div>
                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C]">
                      <span className="text-xl font-black text-gym-silver">{planResult.overview.macro_split.carbs_g}g</span>
                      <span className="block text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Carbohydrates</span>
                    </div>
                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C]">
                      <span className="text-xl font-black text-zinc-300">{planResult.overview.macro_split.fat_g}g</span>
                      <span className="block text-[10px] uppercase font-bold text-zinc-400 mt-0.5">Fats</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300 leading-relaxed bg-[#050B17]/60 p-4 rounded-xl border border-[#1E305C]">
                    {planResult.overview.advice}
                  </p>
                </div>

                {/* Weekly Workout Split */}
                <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl">
                  <h3 className="text-lg font-bold uppercase font-display text-white mb-4 flex items-center space-x-2">
                    <Dumbbell className="w-5 h-5 text-[#D4AF37]" />
                    <span>Weekly Resistance Routine</span>
                  </h3>

                  <div className="space-y-4">
                    {planResult.weekly_workout_plan.map((dayPlan, dIdx) => (
                      <div key={dIdx} className="bg-[#0A1128] rounded-xl border border-[#1E305C] p-4">
                        <div className="flex items-center justify-between mb-3 border-b border-[#1E305C] pb-2">
                          <span className="text-xs font-black uppercase text-[#D4AF37]">{dayPlan.day}</span>
                          <span className="text-xs font-semibold text-white">{dayPlan.focus}</span>
                        </div>
                        <div className="space-y-2">
                          {dayPlan.exercises.map((ex, eIdx) => (
                            <div key={eIdx} className="text-xs flex flex-col sm:flex-row sm:items-center justify-between bg-[#050B17]/40 p-2.5 rounded-lg border border-[#1E305C]/60">
                              <div>
                                <span className="font-bold text-white">{ex.name}</span>
                                <p className="text-[11px] text-zinc-400">{ex.notes}</p>
                              </div>
                              <div className="text-right mt-1 sm:mt-0 text-[11px] text-gym-silver font-semibold shrink-0">
                                {ex.sets} Sets × {ex.reps} | {ex.rest_seconds}s Rest
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Indian Nutrition & Meal Schedule */}
                <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-6 shadow-xl">
                  <h3 className="text-lg font-bold uppercase font-display text-white mb-4 flex items-center space-x-2">
                    <Utensils className="w-5 h-5 text-gym-silver" />
                    <span>Tailored Daily Meals &amp; Indian Alternatives</span>
                  </h3>

                  <div className="space-y-3">
                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#D4AF37] uppercase text-[10px] mb-1">
                        <span>Breakfast</span>
                        <span>{planResult.daily_diet_plan.breakfast.protein_g}g Protein • {planResult.daily_diet_plan.breakfast.calories} kcal</span>
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-0.5">
                        {planResult.daily_diet_plan.breakfast.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#D4AF37] uppercase text-[10px] mb-1">
                        <span>Lunch</span>
                        <span>{planResult.daily_diet_plan.lunch.protein_g}g Protein • {planResult.daily_diet_plan.lunch.calories} kcal</span>
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-0.5">
                        {planResult.daily_diet_plan.lunch.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#D4AF37] uppercase text-[10px] mb-1">
                        <span>Snacks / Pre-Workout</span>
                        <span>{planResult.daily_diet_plan.snacks.protein_g}g Protein • {planResult.daily_diet_plan.snacks.calories} kcal</span>
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-0.5">
                        {planResult.daily_diet_plan.snacks.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-[#0A1128] p-3.5 rounded-xl border border-[#1E305C] text-xs">
                      <div className="flex items-center justify-between font-bold text-[#D4AF37] uppercase text-[10px] mb-1">
                        <span>Dinner</span>
                        <span>{planResult.daily_diet_plan.dinner.protein_g}g Protein • {planResult.daily_diet_plan.dinner.calories} kcal</span>
                      </div>
                      <ul className="list-disc list-inside text-zinc-300 text-[11px] space-y-0.5">
                        {planResult.daily_diet_plan.dinner.items.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Budget & Desi Tips */}
                  <div className="mt-5 pt-4 border-t border-[#1E305C]">
                    <h4 className="text-xs font-bold uppercase text-gym-silver mb-2">Desi Food Swaps &amp; Budget Tips</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-zinc-300">
                      {planResult.daily_diet_plan.indian_alternatives.map((tip, idx) => (
                        <div key={idx} className="bg-[#050B17]/40 p-2.5 rounded-lg border border-[#1E305C]">
                          {tip}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-[#101B37] rounded-2xl border border-[#1E305C] p-12 text-center h-full flex flex-col items-center justify-center">
                <Sparkles className="w-16 h-16 text-[#D4AF37]/40 mb-4 animate-pulse" />
                <h3 className="text-xl font-bold uppercase font-display text-white mb-2">
                  Ready to Generate Your Personalized Routine
                </h3>
                <p className="text-xs text-zinc-400 max-w-md leading-relaxed">
                  Fill in your stats on the left and tap &quot;Generate Personalized Blueprint&quot; to compute exact calories, macros, and workout splits.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


