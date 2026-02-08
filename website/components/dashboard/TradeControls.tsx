"use client";

import { useEffect, useState } from "react";

type AccountState = {
  balances: {
    EUR: number;
    BTC: number;
  };
};

export default function TradeControls() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [symbol, setSymbol] = useState("BTC-EUR");
  const [buyAmount, setBuyAmount] = useState(100);
  const [sellAmount, setSellAmount] = useState(0.001);
  const [loading, setLoading] = useState(false);

  async function fetchAccount() {
    try {
      const res = await fetch("http://localhost:8000/paper/account");
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error("Failed to fetch account", err);
    }
  }

  useEffect(() => {
    fetchAccount();
    const interval = setInterval(fetchAccount, 5000);
    return () => clearInterval(interval);
  }, []);

  async function buy() {
    setLoading(true);
    try {
      await fetch(
        `http://localhost:8000/paper/buy?symbol=${symbol}&eur_amount=${buyAmount}`,
        { method: "POST" }
      );
      await fetchAccount();
    } finally {
      setLoading(false);
    }
  }

  async function sell() {
    setLoading(true);
    try {
      await fetch(
        `http://localhost:8000/paper/sell?symbol=${symbol}&btc_amount=${sellAmount}`,
        { method: "POST" }
      );
      await fetchAccount();
    } finally {
      setLoading(false);
    }
  }

  function setMaxBuy() {
    if (!account) return;
    setBuyAmount(Number(account.balances.EUR.toFixed(2)));
  }

  function setMaxSell() {
    if (!account) return;
    setSellAmount(Number(account.balances.BTC.toFixed(6)));
  }

  return (
    <div className="bg-[#161b22] p-4 rounded border border-gray-800 shadow-md shadow-black/20 text-gray-300">
      <h2 className="text-lg font-semibold">Trade Controls</h2>

      {/* Symbol */}
      <div className="flex flex-col">
        <label className="text-xs text-gray-600 mb-1">Symbol</label>
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-3 py-2 rounded text-sm"
        />
      </div>

      {/* Buy */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={buyAmount}
            onChange={(e) => setBuyAmount(Number(e.target.value))}
            className="border px-3 py-2 rounded text-sm w-32"
          />
          <button
            onClick={buy}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded text-sm"
          >
            Buy BTC (spend EUR)
          </button>
        </div>
        <button
          type="button"
          onClick={setMaxBuy}
          className="text-xs text-blue-600 w-fit"
        >
          Max (use all EUR)
        </button>
      </div>

      {/* Sell */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <input
            type="number"
            value={sellAmount}
            onChange={(e) => setSellAmount(Number(e.target.value))}
            className="border px-3 py-2 rounded text-sm w-32"
          />
          <button
            onClick={sell}
            disabled={loading}
            className="px-4 py-2 bg-red-600 text-white rounded text-sm"
          >
            Sell BTC (receive EUR)
          </button>
        </div>
        <button
          type="button"
          onClick={setMaxSell}
          className="text-xs text-blue-600 w-fit"
        >
          Max (sell all BTC)
        </button>
      </div>
    </div>
  );
}

