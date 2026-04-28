"use client";

import { X, Trash2 } from "lucide-react";
import { getHabits, saveHabits } from "@/lib/storage";
import { Habit } from "@/types/habit";
import HabitForm from "./HabitForm";

type Props = {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

export default function EditHabitModal({ habit, isOpen, onClose, onSuccess }: Props) {
  if (!isOpen || !habit) return null;

  const handleDelete = () => {
    if (confirm("Are you sure you want to delete this habit? This action cannot be undone.")) {
      const allHabits = getHabits();
      const filteredHabits = allHabits.filter((h) => h.id !== habit.id);
      saveHabits(filteredHabits);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300" onClick={onClose} />
      
      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Habit</h2>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleDelete}
              className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
              title="Delete Habit"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <HabitForm 
            initialData={{
              name: habit.name,
              description: habit.description
            }}
            onSubmit={async (data) => {
              await new Promise((resolve) => setTimeout(resolve, 600));

              const allHabits = getHabits();
              const updatedHabits = allHabits.map((h) => 
                h.id === habit.id ? { ...h, name: data.name, description: data.description } : h
              );
              
              saveHabits(updatedHabits);
              onSuccess();
              onClose();
            }}
            submitLabel="Save Changes"
          />
        </div>
      </div>
    </div>
  );
}
