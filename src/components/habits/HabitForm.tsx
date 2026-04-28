"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { validateHabitName } from "@/lib/validators";

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
