import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

export const SignupSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function validateHabitName(name: string): {
  valid: boolean;
  value: string;
  error: string | null;
} {
  const trimmed = name.trim();

  if (trimmed === "") {
    return {
      valid: false,
      value: trimmed,
      error: "Habit name is required",
    };
  }

  if (trimmed.length > 60) {
    return {
      valid: false,
      value: trimmed,
      error: "Habit name must be 60 characters or fewer",
    };
  }

  return {
    valid: true,
    value: trimmed,
    error: null,
  };
}
