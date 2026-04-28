"use client";

import { Activity, Loader2 } from "lucide-react";

type SplashScreenProps = {
  status?: string;
};

export default function SplashScreen({ status = "Initializing..." }: SplashScreenProps) {
  return (
    <main
      data-testid="splash-screen"
      className="flex min-h-screen flex-col items-center justify-center p-6 bg-background"
    >
      <div className="flex flex-col items-center gap-8 animate-in fade-in zoom-in duration-700">
        {/* Animated Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full animate-pulse" />
          <div className="relative p-6 bg-surface border border-border rounded-3xl shadow-premium">
            <Activity className="w-16 h-16 text-primary animate-pulse" />
          </div>
        </div>

        {/* Branding */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Habit <span className="text-primary">Tracker</span>
          </h1>
          <p className="text-muted-foreground font-medium flex items-center justify-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            {status}
          </p>
        </div>
      </div>

      {/* Subtle Bottom Credit */}
      <div className="absolute bottom-12 text-xs font-semibold uppercase tracking-widest text-muted-foreground/30">
        Master Your Routine
      </div>
    </main>
  );
}
