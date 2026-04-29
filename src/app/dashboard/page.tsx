"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getSession,
  saveSession,
  getHabitsForUser,
  getHabits,
  saveHabits,
} from "@/lib/storage";
import { Session } from "@/types/auth";
import { Habit } from "@/types/habit";
import { LogOut, Plus, Activity } from "lucide-react";
import {
  CreateHabitModal,
  EditHabitModal,
} from "@/components/habits/HabitForm";
import HabitList from "@/components/habits/HabitList";
import { toggleHabitCompletion } from "@/lib/habits";

import ProtectedRoute from "@/components/shared/ProtectedRoute";

export default function DashboardPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const refreshHabits = (userId: string) => {
    const userHabits = getHabitsForUser(userId);
    setHabits(userHabits);
  };

  useEffect(() => {
    const currentSession = getSession();
    if (currentSession) {
      setSession(currentSession);
      refreshHabits(currentSession.userId);
      setLoading(false);
    }
  }, []);

  const handleLogout = () => {
    saveSession(null);
    router.push("/login");
  };

  const handleToggleHabit = (habit: Habit) => {
    const today = new Date().toISOString().split("T")[0];
    const updatedHabit = toggleHabitCompletion(habit, today);

    const allHabits = getHabits();
    const updatedAllHabits = allHabits.map((h) =>
      h.id === habit.id ? updatedHabit : h,
    );

    saveHabits(updatedAllHabits);
    if (session) refreshHabits(session.userId);
  };

  const openEditModal = (habit: Habit) => {
    setSelectedHabit(habit);
    setIsEditModalOpen(true);
  };

  return (
    <ProtectedRoute>
      <div
        data-testid="dashboard-page"
        className="min-h-screen bg-background text-foreground"
      >
        <CreateHabitModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => session && refreshHabits(session.userId)}
          userId={session?.userId || ""}
        />

        <EditHabitModal
          habit={selectedHabit}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={() => session && refreshHabits(session.userId)}
        />

        <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-md">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-primary/10 rounded-lg">
                <Activity className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-xl tracking-tight">
                Habit Tracker
              </span>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground hidden sm:inline">
                {session?.email}
              </span>
              <button
                data-testid="auth-logout-button"
                onClick={handleLogout}
                className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </header>

        <main className="max-w-5xl mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h1 className="text-3xl font-bold">Your Dashboard</h1>
              <p className="text-muted-foreground mt-1 font-medium">
                {habits.length <= 1
                  ? `You have ${habits.length} active habit.`
                  : `You have ${habits.length} active habits.`}
              </p>
            </div>
            <button
              data-testid="create-habit-button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-primary hover:bg-primary-hover text-primary-foreground px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-primary/20 transition-all active:scale-95"
            >
              <Plus className="w-5 h-5" />
              <span>New Habit</span>
            </button>
          </div>

          <HabitList
            habits={habits}
            onToggle={handleToggleHabit}
            onEdit={openEditModal}
            onCreate={() => setIsModalOpen(true)}
          />
        </main>
      </div>
    </ProtectedRoute>
  );
}
