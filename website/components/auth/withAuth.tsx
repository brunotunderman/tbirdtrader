"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./AuthProvider";

export function withAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return <p className="p-6">Loading…</p>;
    }

    return <Component {...props} />;
  };
}
