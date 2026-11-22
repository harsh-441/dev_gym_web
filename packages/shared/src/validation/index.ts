// Input Validation Utilities for Parshuram Fitness Gym

import { AIFitnessPlannerInput } from '../types';

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateMemberRegistration(data: {
  fullName?: string;
  email?: string;
  password?: string;
  phone?: string;
  fitnessGoal?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name must be at least 2 characters.';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'A valid email address is required.';
  }

  if (!data.password || data.password.length < 6) {
    errors.password = 'Password must be at least 6 characters long.';
  }

  if (data.phone && !/^\+?[0-9\s\-()]{7,15}$/.test(data.phone.trim())) {
    errors.phone = 'Please provide a valid phone number.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateEnquiry(data: {
  fullName?: string;
  email?: string;
  phone?: string;
  message?: string;
}): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your name.';
  }

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please provide a valid email.';
  }

  if (!data.phone || data.phone.trim().length < 8) {
    errors.phone = 'Please provide a reachable phone number.';
  }

  if (!data.message || data.message.trim().length < 5) {
    errors.message = 'Please enter a message or question (minimum 5 characters).';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function validateAIPlannerInput(input: Partial<AIFitnessPlannerInput>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!input.age || input.age < 12 || input.age > 100) {
    errors.age = 'Age must be between 12 and 100 years.';
  }

  if (!input.height_cm || input.height_cm < 90 || input.height_cm > 260) {
    errors.height_cm = 'Height must be between 90 cm and 260 cm.';
  }

  if (!input.weight_kg || input.weight_kg < 30 || input.weight_kg > 300) {
    errors.weight_kg = 'Weight must be between 30 kg and 300 kg.';
  }

  if (!input.fitness_goal) {
    errors.fitness_goal = 'Please select a primary fitness goal.';
  }

  if (!input.dietary_preference) {
    errors.dietary_preference = 'Please specify dietary preferences.';
  }

  if (!input.training_days_per_week || input.training_days_per_week < 1 || input.training_days_per_week > 7) {
    errors.training_days_per_week = 'Training days must be between 1 and 7.';
  }

  if (!input.workout_duration_minutes || input.workout_duration_minutes < 15 || input.workout_duration_minutes > 180) {
    errors.workout_duration_minutes = 'Session duration should be between 15 and 180 minutes.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}
