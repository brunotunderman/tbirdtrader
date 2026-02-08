"use client";

import { useAuth } from "./AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export function withAuth(Component: any) {
  return function ProtectedPage(props: any) {
    const auth = useAuth();
    const router = useRouter();

    if (!auth) {
      return null;
    }

    const { user, loading } = auth;

    useEffect(() => {
      if (!loading && !user) {
        router.push("/login");
      }
    }, [loading, user, router]);

    if (loading || !user) {
      return <div className="p-6 text-gray-400">Checking authentication…</div>;
    }

    return <Component {...props} />;
  };
}
