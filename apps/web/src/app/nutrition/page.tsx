'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Utensils, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Flame } from 'lucide-react';
import { INITIAL_DIET_PLANS, DietPlan } from '@parshuram/shared';

export default function NutritionPage() {
  const [selectedGoal, setSelectedGoal] = useState<string>('all');
  const [selectedPlan, setSelectedPlan] = useState<DietPlan | null>(null);

  const filterTabs = [
    { id: 'all', label: 'All Nutrition Plans' },
    { id: 'muscle_gain', label: 'Muscle Gain' },
    { id: 'weight_gain', label: 'Weight & Mass' },
    { id: 'fat_loss', label: 'Fat Loss & Shred' }
  ];

  const filteredPlans = selectedGoal === 'all'
    ? INITIAL_DIET_PLANS
    : INITIAL_DIET_PLANS.filter((p) => p.target_goal === selectedGoal);

  return (
    <div className="bg-gym-black text-white min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-gym-red">Indian Nutrition Mastery</span>
          <h1 className="text-4xl sm:text-5xl font-black uppercase font-display text-white mt-2">
            Diet &amp; Nutrition Library
          </h1>
          <p className="text-sm text-zinc-300 mt-4 leading-relaxed">
            High-protein Indian meal plans, budget student hacks, and macro breakdowns. Built to prove that traditional Indian cuisine can build elite physiques.
          </p>
        </div>

        {/* Educational vs AI distinction banner */}
        <div className="bg-gym-charcoal border border-gym-border rounded-xl p-4 mb-10 flex items-start space-x-3 text-xs text-zinc-300">
          <AlertCircle className="w-5 h-5 text-gym-silver shrink-0 mt-0.5" />
          <div>
            <span className="font-bold text-white block mb-0.5">Educational Nutrition Library vs. AI Personalized Planner</span>
            These curated meal plans represent general educational templates. For a custom caloric calculation tailored to your exact height, weight, activity level, allergies, and injuries, use our{' '}
            <Link href="/ai-planner" className="text-gym-red font-bold underline">
              AI Fitness &amp; Nutrition Planner
            </Link>.
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 justify-center mb-10">
          {filterTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setSelectedGoal(t.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                selectedGoal === t.id
                  ? 'bg-gym-red text-white'
                  : 'bg-gym-card text-zinc-400 hover:text-white border border-gym-border'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Diet Plans Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {filteredPlans.map((plan) => (
            <div
              key={plan.id}
              className="bg-gym-card rounded-2xl border border-gym-border p-6 flex flex-col justify-between hover:border-gym-red/50 transition-all shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded ${
                    plan.is_veg
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                      : 'bg-red-950 text-red-300 border border-red-800'
                  }`}>
                    {plan.is_veg ? '100% Vegetarian' : 'Includes Eggs / Poultry'}
                  </span>
                  <span className="text-[10px] uppercase font-bold text-gym-silver">
                    Tier: {plan.cost_tier}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-display uppercase tracking-wide mb-2">
                  {plan.title}
                </h3>
                <p className="text-xs text-zinc-400 leading-relaxed mb-6">
                  {plan.description}
                </p>

                {/* Macro breakdown pill */}
                <div className="grid grid-cols-4 gap-2 bg-gym-charcoal p-3 rounded-xl border border-gym-border text-center mb-6">
                  <div>
                    <span className="block text-xs font-black text-white">{plan.calories}</span>
                    <span className="text-[9px] uppercase text-zinc-400">Calories</span>
                  </div>
                  <div>
                    <span className="block text-xs font-black text-gym-red">{plan.protein_g}g</span>
                    <span className="text-[9px] uppercase text-zinc-400">Protein</span>
                  </div>
                  <div>
                    <span className="block text-xs font-black text-gym-silver">{plan.carbs_g}g</span>
                    <span className="text-[9px] uppercase text-zinc-400">Carbs</span>
                  </div>
                  <div>
                    <span className="block text-xs font-black text-zinc-300">{plan.fat_g}g</span>
                    <span className="text-[9px] uppercase text-zinc-400">Fats</span>
                  </div>
                </div>

                {/* Sample meals list */}
                {plan.meals && (
                  <div className="space-y-3 mb-6">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-gym-silver">Daily Meal Breakdown</h4>
                    {plan.meals.map((meal) => (
                      <div key={meal.id} className="text-xs bg-gym-black/60 p-3 rounded-lg border border-gym-border">
                        <div className="flex items-center justify-between text-gym-silver font-semibold mb-1 uppercase text-[10px]">
                          <span>{meal.meal_type}</span>
                          <span className="text-gym-red">{meal.protein_g}g Protein • {meal.calories} kcal</span>
                        </div>
                        <p className="text-zinc-300 text-[11px] leading-relaxed">
                          {meal.food_item}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="pt-4 border-t border-gym-border">
                <Link
                  href="/ai-planner"
                  className="w-full py-2.5 rounded-lg bg-gym-charcoal hover:bg-gym-red text-white text-xs font-bold uppercase tracking-wider border border-gym-border transition-colors flex items-center justify-center space-x-1"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Customize For My Body</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* 4 Pillars of Indian High-Protein Nutrition */}
        <div className="bg-gym-card rounded-2xl border border-gym-border p-8">
          <h3 className="text-xl font-bold uppercase font-display text-white mb-6 text-center">
            Coach Dave&apos;s Desi High-Protein Principles
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-xs text-zinc-300 leading-relaxed">
            <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border">
              <span className="text-gym-red font-bold block mb-1 uppercase">1. Dal + Grain Synergy</span>
              Lentils alone lack methionine. Pair your dal with rotis, brown rice, or oats to form complete, high-absorption protein chains.
            </div>
            <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border">
              <span className="text-gym-red font-bold block mb-1 uppercase">2. Paneer &amp; Dahi Mastery</span>
              High in bioavailable casein protein and gut-friendly probiotics. Essential for slow nocturnal amino-acid release during sleep.
            </div>
            <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border">
              <span className="text-gym-red font-bold block mb-1 uppercase">3. Sattu &amp; Chana Superfoods</span>
              At ~₹60 per kg, roasted Bengal gram (chana) and sattu provide the highest protein-per-rupee ratio of any Indian food.
            </div>
            <div className="bg-gym-charcoal p-4 rounded-xl border border-gym-border">
              <span className="text-gym-red font-bold block mb-1 uppercase">4. Soya Chunks Hypertrophy</span>
              52g protein per 100g dry weight. A complete plant-based powerhouse packed with Branched-Chain Amino Acids (BCAAs) and leucine.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
