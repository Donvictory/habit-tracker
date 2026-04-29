"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getSession } from "@/lib/storage";
import SplashScreen from "./SplashScreen";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(() => {
    // Check session synchronously on mount if possible to avoid flicker
    if (typeof window !== "undefined") {
      return !!getSession();
    }
    return false;
  });

  useEffect(() => {
    const session = getSession();
    if (!session) {
      router.push("/login");
    } else if (!isAuthorized) {
      setIsAuthorized(true);
    }
  }, [router, isAuthorized]);

  if (!isAuthorized) {
    return <SplashScreen status="Verifying access..." />;
  }

  return <>{children}</>;
}
