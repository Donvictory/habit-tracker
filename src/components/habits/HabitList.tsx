"use client";

import { LayoutGrid } from "lucide-react";
import { Habit } from "@/types/habit";
import HabitCard from "./HabitCard";

type HabitListProps = {
  habits: Habit[];
  onToggle: (habit: Habit) => void;
  onEdit: (habit: Habit) => void;
  onCreate: () => void;
};

export default function HabitList({
  habits,
  onToggle,
  onEdit,
  onCreate,
}: HabitListProps) {
  if (habits.length === 0) {
    return (
      <div
        data-testid="empty-state"
        className="flex flex-col items-center justify-center py-20 px-4 bg-surface border border-dashed border-border rounded-3xl"
      >
        <div className="p-4 bg-muted rounded-2xl mb-4">
          <LayoutGrid className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-bold">No habits yet</h3>
        <p className="text-muted-foreground text-center max-w-xs mt-2">
          Start your journey by creating your first daily routine.
        </p>
        <button
          onClick={onCreate}
          className="mt-6 text-primary font-semibold hover:underline"
        >
          Create one now &rarr;
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {habits.map((habit) => (
        <HabitCard
          key={habit.id}
          habit={habit}
          onToggle={onToggle}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
}
