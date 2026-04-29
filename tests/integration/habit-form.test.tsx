import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage from "@/app/dashboard/page";
import { saveSession, saveHabits } from "@/lib/storage";
import React from "react";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

global.confirm = vi.fn(() => true);

describe("habit form", () => {
  beforeEach(() => {
    localStorage.clear();
    saveSession({ userId: "user1", email: "test@example.com" });
  });

  it("shows a validation error when habit name is empty", async () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("create-habit-button"));
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByText(/Habit name is required/i)).toBeTruthy();
    });
  });

  it("creates a new habit and renders it in the list", async () => {
    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("create-habit-button"));
    fireEvent.change(screen.getByTestId("habit-name-input"), {
      target: { value: "Drink Water" },
    });
    fireEvent.click(screen.getByTestId("habit-save-button"));

    await waitFor(() => {
      expect(screen.getByTestId("habit-card-drink-water")).toBeTruthy();
    });
  });

  it("edits an existing habit and preserves immutable fields", async () => {
    saveHabits([
      {
        id: "h1",
        userId: "user1",
        name: "Old Name",
        description: "",
        frequency: "daily",
        createdAt: "2024-01-01",
        completions: [],
      },
    ]);

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-edit-old-name"));
    fireEvent.change(screen.getByDisplayValue("Old Name"), {
      target: { value: "New Name" },
    });
    fireEvent.click(screen.getByText(/Save Changes/i));

    await waitFor(() => {
      expect(screen.getByTestId("habit-card-new-name")).toBeTruthy();
      const habits = JSON.parse(
        localStorage.getItem("habit-tracker-habits") || "[]",
      );
      expect(habits[0].id).toBe("h1");
      expect(habits[0].createdAt).toBe("2024-01-01");
    });
  });

  it("deletes a habit only after explicit confirmation", async () => {
    saveHabits([
      {
        id: "h1",
        userId: "user1",
        name: "Delete Me",
        description: "",
        frequency: "daily",
        createdAt: "2024-01-01",
        completions: [],
      },
    ]);

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-edit-delete-me"));
    fireEvent.click(screen.getByTestId("confirm-delete-button"));

    await waitFor(() => {
      expect(screen.queryByTestId("habit-card-delete-me")).toBeNull();
    });
  });

  it("toggles completion and updates the streak display", async () => {
    saveHabits([
      {
        id: "h1",
        userId: "user1",
        name: "Streak Habit",
        description: "",
        frequency: "daily",
        createdAt: "2024-01-01",
        completions: [],
      },
    ]);

    render(<DashboardPage />);

    fireEvent.click(screen.getByTestId("habit-complete-streak-habit"));

    await waitFor(() => {
      expect(screen.getByTestId("habit-streak-streak-habit")).toBeTruthy();
      expect(screen.getByText(/1 day streak/i)).toBeTruthy();
    });
  });
});
