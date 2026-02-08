"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withPremium(Component: any) {
  return function PremiumProtectedPage(props: any) {
    const auth = useAuth();
    const router = useRouter();

    // Null-safe: useAuth() kan null zijn tijdens SSR/build
    if (!auth) {
      return <div className="p-6 text-gray-400">Loading…</div>;
    }

    const { user, loading } = auth;

    useEffect(() => {
      if (!loading && user && user.profileType !== "PREMIUM") {
        router.push("/upgrade");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return <div className="p-6 text-gray-400">Checking premium access…</div>;
    }

    return <Component {...props} />;
  };
}
