import { describe, it, expect } from "vitest";
import { toggleHabitCompletion } from "@/lib/habits";
import { Habit } from "@/types/habit";

describe("toggleHabitCompletion", () => {
  const mockHabit: Habit = {
    id: "1",
    userId: "user1",
    name: "Test",
    description: "",
    frequency: "daily",
    createdAt: "2024-01-01",
    completions: [],
  };

  it("adds a completion date when the date is not present", () => {
    const result = toggleHabitCompletion(mockHabit, "2024-01-01");
    expect(result.completions).toContain("2024-01-01");
  });

  it("removes a completion date when the date already exists", () => {
    const habitWithCompletion = { ...mockHabit, completions: ["2024-01-01"] };
    const result = toggleHabitCompletion(habitWithCompletion, "2024-01-01");
    expect(result.completions).not.toContain("2024-01-01");
  });

  it("does not mutate the original habit object", () => {
    const original = { ...mockHabit };
    toggleHabitCompletion(mockHabit, "2024-01-01");
    expect(mockHabit).toEqual(original);
  });

  it("does not return duplicate completion dates", () => {
    const habitWithDuplicate = {
      ...mockHabit,
      completions: ["2024-01-01", "2024-01-01"],
    };
    const result = toggleHabitCompletion(habitWithDuplicate, "2024-01-02");
    const uniqueCompletions = new Set(result.completions);
    expect(uniqueCompletions.size).toBe(result.completions.length);
  });
});
