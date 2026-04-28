import SignupForm from "@/components/auth/SignupForm";
import Link from "next/link";
import { Rocket } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-primary/10 via-background to-background">
      <div className="w-full max-w-xl flex flex-col items-center">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/30 mb-4 animate-in zoom-in duration-500">
            <Rocket className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight">Get Started</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Join thousands of others building better habits
          </p>
        </div>

        <div className="w-full p-8 rounded-3xl bg-surface/50 dark:bg-surface-dark/50 backdrop-blur-xl border border-slate-200 dark:border-slate-800 shadow-2xl">
          <SignupForm />
        </div>

        <p className="mt-8 text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  );
}
