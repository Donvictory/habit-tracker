import { User, Session } from "../types/auth";
import { Habit } from "../types/habit";

const KEYS = {
  USERS: "habit-tracker-users",
  SESSION: "habit-tracker-session",
  HABITS: "habit-tracker-habits",
};

// --- Generic Helpers ---

function getItem<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  const item = localStorage.getItem(key);
  if (!item) return null;
  try {
    return JSON.parse(item) as T;
  } catch {
    return null;
  }
}

function setItem<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

// --- Auth Storage ---

export function getUsers(): User[] {
  return getItem<User[]>(KEYS.USERS) || [];
}

export function saveUser(user: User): void {
  const users = getUsers();
  setItem(KEYS.USERS, [...users, user]);
}

export function getSession(): Session | null {
  return getItem<Session>(KEYS.SESSION);
}

export function saveSession(session: Session | null): void {
  setItem(KEYS.SESSION, session);
}

// --- Habit Storage ---

export function getHabits(): Habit[] {
  return getItem<Habit[]>(KEYS.HABITS) || [];
}

export function saveHabits(habits: Habit[]): void {
  setItem(KEYS.HABITS, habits);
}

export function getHabitsForUser(userId: string): Habit[] {
  const habits = getHabits();
  return habits.filter((h) => h.userId === userId);
}
