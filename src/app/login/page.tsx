import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";
import { Flame } from "lucide-react";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-lg flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 mb-4 animate-in zoom-in duration-500">
            <Flame className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Enter your details to continue your journey
          </p>
        </div>

        <div className="w-full p-8 rounded-3xl bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <LoginForm />
        </div>

        <p className="mt-8 text-slate-500 dark:text-slate-400">
          Don't have an account?{" "}
          <Link href="/signup" className="text-primary font-semibold hover:underline">
            Create one for free
          </Link>
        </p>
      </div>
    </div>
  );
}
