"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { validateHabitName } from "@/lib/validators";

import { Trash2 } from "lucide-react";
import { X } from "lucide-react";
import { getHabits, saveHabits } from "@/lib/storage";
import { Habit } from "@/types/habit";

type CreateHabitModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  userId: string;
};

type EditHabitModalProps = {
  habit: Habit | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

type HabitFormData = {
  name: string;
  description: string;
};

type HabitFormProps = {
  initialData?: HabitFormData;
  onSubmit: (data: HabitFormData) => Promise<void>;
  submitLabel: string;
};

export default function HabitForm({
  initialData,
  onSubmit,
  submitLabel,
}: HabitFormProps) {
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validation = validateHabitName(name);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: validation.value,
        description: description.trim(),
      });
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground ml-1">
          Habit Name
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Save daily 2k for my babe"
          className={`w-full px-4 py-3 bg-muted/50 border ${
            error ? "border-red-500" : "border-border"
          } rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none`}
          autoFocus
          data-testid="habit-name-input"
        />
        {error && <p className="text-xs text-red-500 ml-1">{error}</p>}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-semibold text-muted-foreground ml-1">
          Description (Optional)
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Why is this habit important?"
          className="w-full px-4 py-3 bg-muted/50 border border-border rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all outline-none resize-none h-24"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        data-testid="habit-save-button"
        className="w-full py-4 bg-primary hover:bg-primary-hover text-primary-foreground font-bold rounded-2xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          submitLabel
        )}
      </button>
    </form>
  );
}

export function CreateHabitModal({
  isOpen,
  onClose,
  onSuccess,
  userId,
}: CreateHabitModalProps) {
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

export function EditHabitModal({ habit, isOpen, onClose, onSuccess }: EditHabitModalProps) {
  if (!isOpen || !habit) return null;

  const handleDelete = () => {
    if (
      confirm(
        "Are you sure you want to delete this habit? This action cannot be undone.",
      )
    ) {
      const allHabits = getHabits();
      const filteredHabits = allHabits.filter((h) => h.id !== habit.id);
      saveHabits(filteredHabits);
      onSuccess();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-surface border border-border rounded-3xl shadow-2xl animate-in zoom-in-95 slide-in-from-bottom-4 duration-300 overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-bold">Edit Habit</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDelete}
              data-testid="confirm-delete-button"
              className="p-2 hover:bg-red-50 text-red-500 rounded-xl transition-colors"
              title="Delete Habit"
            >
              <Trash2 className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-xl transition-colors text-muted-foreground"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6">
          <HabitForm
            initialData={{
              name: habit.name,
              description: habit.description,
            }}
            onSubmit={async (data) => {
              await new Promise((resolve) => setTimeout(resolve, 600));

              const allHabits = getHabits();
              const updatedHabits = allHabits.map((h) =>
                h.id === habit.id
                  ? { ...h, name: data.name, description: data.description }
                  : h,
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
