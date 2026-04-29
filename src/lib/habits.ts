import { Habit } from "../types/habit";

export function toggleHabitCompletion(habit: Habit, date: string): Habit {
  const exists = habit.completions.includes(date);

  let newCompletions: string[];

  if (exists) {
    newCompletions = habit.completions.filter((d) => d !== date);
  } else {
    newCompletions = [...habit.completions, date];
  }

  const uniqueCompletions = Array.from(new Set(newCompletions));

  return {
    ...habit,
    completions: uniqueCompletions,
  };
}
