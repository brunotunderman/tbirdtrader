"use client";

import { useEffect, useState } from "react";

type AccountState = {
  balances: {
    EUR: number;
    BTC: number;
  };
};

export default function BalancesCard() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function fetchAccount() {
    try {
      setError(null);
      // ✅ Use Next.js proxy (same-origin) to avoid CORS/mixed-content
      const res = await fetch("/api/account", { cache: "no-store" });
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Account ${res.status} ${res.statusText} - ${text}`);
      }
      const data = await res.json();
      setAccount(data);
    } catch (err: any) {
      console.error("Failed to fetch account", err);
      setError(err?.message ?? "Failed to fetch account");
      setAccount(null);
    }
  }

  useEffect(() => {
    fetchAccount();
    const interval = setInterval(fetchAccount, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d] shadow-md text-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">Balances</h2>

      {!account && !error && (
        <p className="text-gray-500">Loading...</p>
      )}

      {error && (
        <p className="text-red-400 text-sm">{error}</p>
      )}

      {account && (
        <div className="grid grid-cols-2 gap-4 text-sm">
          {/* EUR tile */}
          <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] shadow-inner">
            <p className="text-gray-400 text-xs">EUR</p>
            <p className="text-2xl font-semibold text-gray-100">
              {account.balances.EUR.toFixed(2)}
            </p>
          </div>

          {/* BTC tile */}
          <div className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] shadow-inner">
            <p className="text-gray-400 text-xs">BTC</p>
            <p className="text-2xl font-semibold text-gray-100">
              {account.balances.BTC.toFixed(8)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}