"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AuthGuard({ children }) {
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  const supabase = createClient();

  useEffect(() => {
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const isAuthPage =
        pathname === "/auth/login" || pathname === "/auth/sign-up";

      if (session) {
        // User is logged in
        if (isAuthPage) {
          router.replace("/"); // Redirect logged-in users away from login/signup
        }
      } else {
        // User not logged in
        if (!isAuthPage) {
          router.replace("/auth/login"); // Redirect non-logged-in users to login
        }
      }

      setLoading(false);
    };

    checkAuth();
  }, [router]);

  if (loading) return null; // Or a loading spinner

  return <>{children}</>;
}
