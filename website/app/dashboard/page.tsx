"use client";

import { withPremium } from "../../components/auth/withPremium";
import { useAuth } from "../../components/auth/AuthProvider";

import BalancesCard from "../../components/dashboard/BalancesCard";
import TradeControls from "../../components/dashboard/TradeControls";
import BotStatus from "../../components/dashboard/BotStatus";
import TradeHistory from "../../components/dashboard/TradeHistory";
import BotLog from "../../components/dashboard/BotLog";
import OpenPositions from "../../components/dashboard/OpenPositions";

import LiveChart from "../../components/LiveChart";

function DashboardPage() {
  const auth = useAuth();

  // During SSR/build, auth can be null → prevent crash
  if (!auth) {
    return (
      <div className="p-6 text-gray-400">
        Loading dashboard…
      </div>
    );
  }

  const { user, refresh } = auth;

  async function upgradeToPremium() {
    await fetch("/api/user/upgrade", { method: "POST" });
    await refresh();
  }

  return (
    <div className="p-6 space-y-6">
      {/* User Info Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-semibold">Welcome, {user.email}</h1>
          <p className="text-sm text-gray-400">
            Profile: {user.profileType} — Fee: {user.transactionFeeRate * 100}%
          </p>
        </div>

        {user.profileType === "FOUNDATION" && (
          <button
            onClick={upgradeToPremium}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
          >
            Upgrade to Premium
          </button>
        )}
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-6">
          <BalancesCard />
          <TradeControls />
          <BotStatus />
        </div>

        <div className="space-y-6 xl:col-span-2">
          <LiveChart />
          <OpenPositions />
          <TradeHistory />
          <BotLog />
        </div>
      </div>
    </div>
  );
}

export default withPremium(DashboardPage);
