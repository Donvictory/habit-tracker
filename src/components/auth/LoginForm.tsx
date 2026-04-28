"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/lib/validators";
import { Mail, Lock, Loader2, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { getUsers, saveSession } from "@/lib/storage";

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
    // 1. Simulate delay for UX
    await new Promise((resolve) => setTimeout(resolve, 800));

    // 2. Find user
    const users = getUsers();
    const user = users.find(
      (u) => u.email === data.email && u.password === data.password
    );

    if (!user) {
      setError("email", { message: "Invalid email or password" });
      return;
    }

    // 3. Save Session
    saveSession({
      userId: user.id,
      email: user.email,
    });

    // 4. Redirect
    router.push("/dashboard");
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-6 w-full max-w-md p-8 bg-surface border border-border rounded-2xl shadow-premium"
    >
      <div className="flex flex-col gap-2">
        <label htmlFor="login-email" className="text-sm font-medium text-muted-foreground ml-1">
          Email Address
        </label>
        <div className="relative group">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            id="login-email"
            type="email"
            {...register("email")}
            data-testid="auth-login-email"
            className={`w-full pl-10 pr-4 py-3 bg-surface border ${
              errors.email
                ? "border-red-500 shadow-[0_0_0_1px_rgba(239,44,44,0.5)]"
                : "border-border"
            } rounded-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/50`}
            placeholder="name@example.com"
          />
        </div>
        {errors.email?.message && (
          <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center ml-1">
          <label htmlFor="login-password" className="text-sm font-medium text-muted-foreground">
            Password
          </label>
          <a
            href="#"
            className="text-xs text-primary font-semibold hover:underline"
          >
            Forgot Password?
          </a>
        </div>
        <div className="relative group">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <input
            id="login-password"
            type={showPassword ? "text" : "password"}
            {...register("password")}
            data-testid="auth-login-password"
            className={`w-full pl-10 pr-12 py-3 bg-surface border ${
              errors.password
                ? "border-red-500 shadow-[0_0_0_1px_rgba(239,44,44,0.5)]"
                : "border-border"
            } rounded-xl transition-all focus:border-primary focus:ring-4 focus:ring-primary/10 placeholder:text-muted-foreground/50`}
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground hover:text-primary transition-colors z-10"
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password?.message && (
          <p className="text-xs text-red-500 mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
            {errors.password.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        data-testid="auth-login-submit"
        disabled={isSubmitting}
        className="w-full py-3.5 px-4 bg-primary hover:bg-primary-hover text-primary-foreground font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
