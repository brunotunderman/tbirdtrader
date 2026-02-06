"use client";

import { useEffect, useState } from "react";

type Position = {
  id: number;
  symbol: string;
  size: number;
  entry_price: number;
  pnl: number;
  timestamp: string;
};

export default function OpenPositions() {
  const [positions, setPositions] = useState<Position[]>([]);

  async function fetchPositions() {
    try {
      const res = await fetch("http://localhost:8000/paper/positions");
      const data = await res.json();

      // Normalize to ensure we ALWAYS have an array
      const normalized =
        Array.isArray(data) ? data :
        Array.isArray(data?.positions) ? data.positions :
        [];

      setPositions(normalized);
    } catch (err) {
      console.error("Failed to fetch open positions", err);
      setPositions([]);
    }
  }

  useEffect(() => {
    fetchPositions();
    const interval = setInterval(fetchPositions, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d] shadow-md text-gray-200">

      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        Open Positions
      </h2>

      {positions.length === 0 && (
        <p className="text-gray-500">No open positions.</p>
      )}

      <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
        {positions.map((pos) => (
          <div
            key={pos.id}
            className="bg-[#0d1117] p-4 rounded-lg border border-[#30363d] shadow-inner"
          >
            {/* Symbol */}
            <p className="text-gray-400 text-xs uppercase">{pos.symbol}</p>

            {/* Size / Entry */}
            <p className="text-sm text-gray-100">
              Size: {pos.size} @ {pos.entry_price}
            </p>

            {/* PnL */}
            <p
              className={`text-sm font-semibold mt-1 ${
                pos.pnl >= 0 ? "text-green-400" : "text-red-400"
              }`}
            >
              PnL: {pos.pnl.toFixed(2)}
            </p>

            {/* Timestamp */}
            <p className="text-gray-500 text-xs mt-2">
              {new Date(pos.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
``