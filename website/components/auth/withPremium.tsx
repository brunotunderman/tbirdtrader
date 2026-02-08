"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function withPremium(Component: any) {
  return function PremiumProtectedPage(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && user && user.profileType !== "PREMIUM") {
        router.push("/upgrade");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return <p className="p-6">Loading…</p>;
    }

    return <Component {...props} />;
  };
}
