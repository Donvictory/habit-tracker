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

    const timer = setTimeout(() => {
      if (session) {
        router.replace("/dashboard");
      } else {
        router.replace("/login");
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [router]);

  return <SplashScreen status="Starting Habit Tracker..." />;
}
