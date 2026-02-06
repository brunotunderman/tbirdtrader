"use client";

import BalancesCard from "@/components/dashboard/BalancesCard";
import TradeControls from "@/components/dashboard/TradeControls";
import BotStatus from "@/components/dashboard/BotStatus";
import TradeHistory from "@/components/dashboard/TradeHistory";
import BotLog from "@/components/dashboard/BotLog";
import OpenPositions from "@/components/dashboard/OpenPositions";
import LiveChart from "@/components/dashboard/LiveChart";

export default function DashboardPage() {
  return (
    <main className="min-h-screen w-full bg-[#161b22] text-gray-200 p-6 space-y-6">

      {/* === TOP ROW: Balances + Bot Status === */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Balances Panel */}
        <div className="dashboard-panel">
          <BalancesCard />
        </div>

        {/* Bot Status Panel */}
        <div className="dashboard-panel">
          <BotStatus />
        </div>
      </div>

      {/* === TRADE CONTROLS === */}
      <div className="dashboard-panel">
        <TradeControls />
      </div>

      {/* === LIVE PRICE CHART (with integrated timeframe selector) === */}
      <LiveChart />

      {/* === BOTTOM ROW PANELS === */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left: Open Positions */}
        <div className="dashboard-panel">
          <OpenPositions />
        </div>

        {/* Middle: Trade History */}
        <div className="dashboard-panel">
          <TradeHistory />
        </div>

        {/* Right: Bot Log */}
        <div className="Dashboard-panel">
          <BotLog />
        </div>

      </section>
    </main>
  );
}