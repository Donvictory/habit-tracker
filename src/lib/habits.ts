import { Habit } from "../types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const exists = habit.completions.includes(date);
  
  let newCompletions: string[];
  
  if (exists) {
    // Remove the date
    newCompletions = habit.completions.filter((d) => d !== date);
  } else {
    // Add the date
    newCompletions = [...habit.completions, date];
  }

  // Ensure unique dates as per requirement
  const uniqueCompletions = Array.from(new Set(newCompletions));

  return {
    ...habit,
    completions: uniqueCompletions,
  };
}
