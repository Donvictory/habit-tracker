"use client";

import { Flame, Settings2, CheckCircle, CheckCircle2 } from "lucide-react";
import { Habit } from "@/types/habit";
import { calculateCurrentStreak } from "@/lib/streaks";
import { getHabitSlug } from "@/lib/slug";

type HabitCardProps = {
  habit: Habit;
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
};

export default function HabitCard({ habit, onToggle, onEdit }: HabitCardProps) {
  const streak = calculateCurrentStreak(habit.completions);
  const today = new Date().toISOString().split("T")[0];
  const isCompletedToday = habit.completions.includes(today);
  const slug = getHabitSlug(habit.name);

  return (
    <div
      data-testid={`habit-card-${slug}`}
      className={`group p-6 bg-surface border ${
        isCompletedToday ? "border-primary/50" : "border-border"
      } rounded-2xl shadow-sm hover:shadow-premium transition-all`}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3
            className={`font-bold text-xl leading-tight transition-colors ${
              isCompletedToday ? "text-primary" : "group-hover:text-primary"
            }`}
          >
            {habit.name}
          </h3>
          {streak > 0 && (
            <div
              data-testid={`habit-streak-${slug}`}
              className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-orange-500/10 text-orange-500 rounded-lg text-xs font-bold animate-in zoom-in"
            >
              <Flame className="w-3 h-3" />
              {streak} day streak
            </div>
          )}
        </div>
        <button
          data-testid={`habit-edit-${slug}`}
          onClick={() => onEdit(habit)}
          className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
        >
          <Settings2 className="w-5 h-5" />
        </button>
      </div>
      <p className="text-muted-foreground text-sm line-clamp-2 min-h-[2.5rem]">
        {habit.description || "No description provided."}
      </p>

      <div className="mt-6 pt-6 border-t border-border flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/50">
          Daily Routine
        </div>
        <button
          data-testid={`habit-complete-${slug}`}
          onClick={() => onToggle(habit)}
          className={`p-2 rounded-xl transition-all ${
            isCompletedToday
              ? "bg-primary text-primary-foreground"
              : "bg-muted hover:bg-primary/10 hover:text-primary"
          }`}
        >
          {isCompletedToday ? (
            <CheckCircle className="w-6 h-6" />
          ) : (
            <CheckCircle2 className="w-6 h-6" />
          )}
        </button>
      </div>
    </div>
  );
}
