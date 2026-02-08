"use client";

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  id: string;
  email: string;
  profileType: string;
  transactionFeeRate: number;
}

interface AuthContextType {
  user: User | null;
  refresh: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refresh() {
    const res = await fetch("/api/user/me");
    if (res.ok) {
      const data = await res.json();
      setUser(data.user);
    }
  }

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const value: AuthContextType = {
    user,
    refresh,
  };

  if (loading) {
    return <div className="p-6 text-gray-400">Loading…</div>;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
