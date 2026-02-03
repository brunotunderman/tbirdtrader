"use client";

import React from "react";

export default function DrawdownPanel({ drawdown, maxDrawdown }) {
  if (!drawdown || drawdown.length === 0) return null;

  const current = drawdown[drawdown.length - 1];
  const recovering = current > drawdown[drawdown.length - 2];

  return (
    <div className="p-4 bg-gray-100 rounded shadow">
      <h2 className="text-xl font-bold mb-3">Drawdown</h2>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Max Drawdown</p>
          <p className="text-2xl font-bold text-red-600">
            {(maxDrawdown * 100).toFixed(2)}%
          </p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Current Drawdown</p>
          <p
            className={`text-2xl font-bold ${
              current < 0 ? "text-red-600" : "text-green-600"
            }`}
          >
            {(current * 100).toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Sparkline */}
      <div className="h-12 w-full flex items-end gap-1">
        {drawdown.map((d, i) => (
          <div
            key={i}
            className="flex-1 bg-red-500"
            style={{
              height: `${Math.abs(d) * 100}%`,
              opacity: 0.4 + Math.abs(d) * 0.6,
            }}
          ></div>
        ))}
      </div>

      <p
        className={`mt-3 text-sm font-semibold ${
          recovering ? "text-green-600" : "text-red-600"
        }`}
      >
        {recovering ? "Recovering" : "Falling"}
      </p>
    </div>
  );
}
