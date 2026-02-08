"use client";

import { useState } from "react";

export default function BotStatus() {
  // Example state (replace with real backend later)
  const [isRunning, setIsRunning] = useState(true);

  // Example stats
  const tradesToday = 12;
  const tradesThisWeek = 87;
  const dailyLimit = 25;
  const weeklyLimit = 200;

  return (
    <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d] shadow-md text-gray-200 w-full">
      
      {/* Title */}
      <h2 className="text-lg font-semibold mb-5 text-gray-100">
        Bot Status
      </h2>

      {/* ================= TOP STATUS ROW ================= */}
      <div className="flex items-center justify-start gap-4 mb-6">

        {/* Bot status pill */}
        <span
          className={`px-4 py-1 rounded-full text-sm font-medium ${
            isRunning
              ? "bg-green-600/20 text-green-400 border border-green-600/40"
              : "bg-red-600/20 text-red-400 border border-red-600/40"
          }`}
        >
          {isRunning ? "Bot is Running" : "Bot is Stopped"}
        </span>

        {/* Action button */}
        <button
          onClick={() => setIsRunning(!isRunning)}
          className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${
            isRunning
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "bg-green-600 hover:bg-green-700 text-white"
          }`}
        >
          {isRunning ? "Stop Bot" : "Start Bot"}
        </button>
      </div>

      {/* ================= METRICS GRID ================= */}
      <div className="grid grid-cols-2 gap-4">

        {/* Trades Today */}
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[#30363d] shadow-inner">
          <div className="text-gray-400 text-xs">Trades Today</div>
          <div className="text-xl font-semibold text-gray-100">{tradesToday}</div>
        </div>

        {/* Trades This Week */}
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[#30363d] shadow-inner">
          <div className="text-gray-400 text-xs">Trades This Week</div>
          <div className="text-xl font-semibold text-gray-100">{tradesThisWeek}</div>
        </div>

        {/* Daily Limit */}
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[#30363d] shadow-inner">
          <div className="text-gray-400 text-xs">Daily Limit</div>
          <div className="text-xl font-semibold text-gray-100">{dailyLimit}</div>
        </div>

        {/* Weekly Limit */}
        <div className="bg-[#0d1117] rounded-lg p-4 border border-[#30363d] shadow-inner">
          <div className="text-gray-400 text-xs">Weekly Limit</div>
          <div className="text-xl font-semibold text-gray-100">{weeklyLimit}</div>
        </div>

      </div>
    </div>
  );
}