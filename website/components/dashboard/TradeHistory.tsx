"use client";

import { useEffect, useState } from "react";

type Trade = {
  type: string;
  amount: number;
  price: number;
  timestamp: string;
};

type AccountState = {
  trade_history?: Trade[];   // <- optional so no crash if missing
};

export default function TradeHistory() {
  const [account, setAccount] = useState<AccountState | null>(null);

  async function fetchAccount() {
    try {
      const res = await fetch("http://localhost:8000/paper/account");
      const data = await res.json();

      // Guard against undefined shapes
      if (!Array.isArray(data.trade_history)) {
        data.trade_history = [];
      }

      setAccount(data);
    } catch (err) {
      console.error("Failed to fetch account", err);
      setAccount({ trade_history: [] });
    }
  }

  useEffect(() => {
    fetchAccount();
    const interval = setInterval(fetchAccount, 5000);
    return () => clearInterval(interval);
  }, []);

  // Extract safely
  const history = account?.trade_history ?? [];

  return (
    <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d] shadow-md text-gray-200">

      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        Trade History
      </h2>

      {!account && (
        <p className="text-gray-500 text-sm">Loading trade history...</p>
      )}

      {account && history.length === 0 && (
        <p className="text-gray-500 text-sm">No trades yet.</p>
      )}

      {account && history.length > 0 && (
        <div className="space-y-3 max-h-[350px] overflow-y-auto pr-2">

          {history.map((trade, idx) => {
            const isBuy = trade.type?.toLowerCase() === "buy";
            const badgeColor = isBuy
              ? "bg-green-600/20 text-green-400 border border-green-600/40"
              : "bg-red-600/20 text-red-400 border border-red-600/40";
            const badgeLabel = isBuy ? "Bought" : "Sold";

            return (
              <div
                key={idx}
                className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] shadow-inner"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded ${badgeColor}`}>
                    {badgeLabel}
                  </span>

                  <span className="text-xs text-gray-500">
                    {new Date(trade.timestamp).toLocaleString()}
                  </span>
                </div>

                <div className="text-sm text-gray-300 space-y-1">
                  <div>
                    <span className="font-medium text-gray-400">Amount:</span>{" "}
                    <span className="text-gray-100">{trade.amount}</span>
                  </div>

                  <div>
                    <span className="font-medium text-gray-400">Price:</span>{" "}
                    <span className="text-gray-100">€{trade.price}</span>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}