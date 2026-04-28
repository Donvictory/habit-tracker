"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { getHabits, saveHabits } from "@/lib/storage";
import { Habit } from "@/types/habit";
import HabitForm from "./HabitForm";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
};

export default function CreateHabitModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">New Habit</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          <HabitForm
            onSubmit={async (data) => {
              // 2. Artificial delay for "Premium" feel
              await new Promise((resolve) => setTimeout(resolve, 600));

              // 3. Create Habit Object
              const newHabit: Habit = {
                id: crypto.randomUUID(),
                userId,
                name: data.name,
                description: data.description,
                frequency: "daily",
                createdAt: new Date().toISOString(),
                completions: [],
              };

              // 4. Save to Storage
              const allHabits = getHabits();
              saveHabits([...allHabits, newHabit]);

              // 5. Cleanup
              onSuccess();
              onClose();
            }}
            submitLabel="Create Habit"
          />
        </div>
      </div>
    </div>
  );
}
