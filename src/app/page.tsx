"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import SplashScreen from "@/components/shared/SplashScreen";

export default function RootPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const checkSession = async () => {
      // 1. Minimum delay for testability (800ms)
      const startTime = Date.now();

      const session = getSession();
      setStatus(session ? "Welcome back!" : "Preparing your routine...");

      // 2. Wait at least 1200ms for a smooth experience
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, 1200 - elapsed);

      await new Promise((resolve) => setTimeout(resolve, remaining));

      // 3. Redirect
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    };

    checkSession();
  }, [router]);

  return <SplashScreen status={status} />;
}
