"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/lib/validators";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { useState } from "react";

import { useRouter } from "next/navigation";
import { getUsers, saveUser, saveSession } from "@/lib/storage";

export default function SignupForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof SignupSchema>>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async (data: z.infer<typeof SignupSchema>) => {
    // 1. Simulate a tiny delay for UX
    if (isLoading) return;
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Check if user exists
    const users = getUsers();
    if (users.some((u) => u.email === data.email)) {
      setError("email", { message: "This email is already registered" });
      return;
    }

    // 3. Create the user object
    const newUser = {
      id: crypto.randomUUID(),
      email: data.email,
      password: data.password, // Storing plain for this stage as per requirements
      createdAt: new Date().toISOString(),
    };

    // 4. Persist
    saveUser(newUser);
    saveSession({
      userId: newUser.id,
      email: newUser.email,
    });

    // 5. Redirect
    router.push("/dashboard");
    setIsLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-5 w-full max-w-md p-8 bg-surface border border-border rounded-2xl shadow-premium"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="full-name" className="text-sm font-medium text-muted-foreground ml-1">
          Full Name
        </label>
        <div className="relative group">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            id="full-name"
            type="text"
            {...register("name")}
            className={`w-full pl-10 pr-4 py-2.5 bg-surface border ${
              errors.name ? "border-red-500" : "border-border"
            } rounded-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/30`}
            placeholder="John Doe"
          />
        </div>
        {errors.name?.message && (
          <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {errors.name.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="signup-email" className="text-sm font-medium text-muted-foreground ml-1">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            id="signup-email"
            type="email"
            {...register("email")}
            data-testid="auth-signup-email"
            className={`w-full pl-10 pr-4 py-2.5 bg-surface border ${
              errors.email ? "border-red-500" : "border-border"
            } rounded-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/30`}
            placeholder="name@example.com"
          />
        </div>
        {errors.email?.message && (
          <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-password" className="text-sm font-medium text-muted-foreground ml-1">
            Password
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              id="signup-password"
              type={showPassword ? "text" : "password"}
              {...register("password")}
              data-testid="auth-signup-password"
              className={`w-full pl-10 pr-10 py-2.5 bg-surface border ${
                errors.password ? "border-red-500" : "border-border"
              } rounded-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/30`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.password?.message && (
            <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="signup-confirm" className="text-sm font-medium text-muted-foreground ml-1">
            Confirm
          </label>
          <div className="relative group">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              id="signup-confirm"
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className={`w-full pl-10 pr-10 py-2.5 bg-surface border ${
                errors.confirmPassword ? "border-red-500" : "border-border"
              } rounded-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/30`}
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
            >
              {showConfirmPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          {errors.confirmPassword?.message && (
            <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
      </div>

      <button
        type="submit"
        data-testid="auth-signup-submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-4 mt-2 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Create Account"
        )}
      </button>
    </form>
  );
}
