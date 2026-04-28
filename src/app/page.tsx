"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import SplashScreen from "@/components/shared/SplashScreen";

export default function RootPage() {
  const router = useRouter();
  const [status, setStatus] = useState("Initializing...");

  useEffect(() => {
    const session = getSession();
    
    // Brief delay for the splash animation to show
    const timer = setTimeout(() => {
      if (session) {
        router.push("/dashboard");
      } else {
        router.push("/login");
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen status="Starting Habit Tracker..." />;
}
