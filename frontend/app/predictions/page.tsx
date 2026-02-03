"use client";

import { useState, useEffect } from "react";

// Hooks
import { useModelPrediction } from "@/hooks/useModelPrediction";
import { useModelComparison } from "@/hooks/useModelComparison";
import { useModelRanking } from "@/hooks/useModelRanking";

// Components
import Spinner from "@/components/Spinner";
import ModelRankingTable from "@/components/ModelRankingTable";
import ComparisonChart from "@/components/ComparisonChart";
import PredictionChart from "@/components/PredictionChart";

export default function Page() {
  const [symbol, setSymbol] = useState("BTC-EUR");
  const [model, setModel] = useState("baseline");
  const [activeTab, setActiveTab] = useState("predict");
  const [autoRefresh, setAutoRefresh] = useState(false);

  const prediction = useModelPrediction();
  const comparison = useModelComparison();
  const ranking = useModelRanking();

  return (
    <div className="p-6 space-y-8">

      {/* ------------------------------------------------ */}
      {/* PAGE HEADER (Fiori-inspired) */}
      {/* ------------------------------------------------ */}
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800">
          AI Trading Dashboard
        </h1>
        <p className="text-gray-600 text-sm">
          Predictions, model comparison, and ranking insights
        </p>
      </header>

      {/* ------------------------------------------------ */}
      {/* INPUT BAR (Fiori-style compact form) */}
      {/* ------------------------------------------------ */}
      <div className="flex gap-4 items-center bg-white p-4 rounded shadow-sm">
        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Symbol</label>
          <input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-xs text-gray-600 mb-1">Model</label>
          <select
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="border px-3 py-2 rounded text-sm"
          >
            <option value="baseline">Baseline</option>
            <option value="lstm">LSTM</option>
            <option value="xgboost">XGBoost</option>
            <option value="transformer">Transformer</option>
            <option value="ensemble">Ensemble</option>
          </select>
        </div>
      </div>

      {/* ------------------------------------------------ */}
      {/* TABS (Fiori-style anchor bar) */}
      {/* ------------------------------------------------ */}
      <div className="flex gap-6 border-b pb-2 text-sm">
        {["predict", "compare", "ranking"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-1 ${
              activeTab === tab
                ? "font-semibold border-b-2 border-blue-600 text-blue-700"
                : "text-gray-600"
            }`}
          >
            {tab === "predict" && "Predict"}
            {tab === "compare" && "Compare"}
            {tab === "ranking" && "Rank Models"}
          </button>
        ))}
      </div>

      {/* ------------------------------------------------ */}
      {/* PREDICT TAB */}
      {/* ------------------------------------------------ */}
      {activeTab === "predict" && (
        <div className="space-y-6">

          {/* ACTION BAR (Fiori-inspired) */}
          <div className="bg-white p-4 rounded shadow-sm flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded text-white text-sm ${
                autoRefresh ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {autoRefresh ? "Auto Refresh: ON" : "Auto Refresh: OFF"}
            </button>

            <button
              type="button"
              onClick={() => prediction.run(symbol, model)}
              className="px-4 py-2 bg-blue-600 text-white rounded text-sm"
            >
              Predict
            </button>
          </div>

          {/* Auto Refresh Logic */}
          {autoRefresh && (
            <AutoRefreshRunner
              symbol={symbol}
              model={model}
              run={prediction.run}
            />
          )}

          {/* Chart Card */}
          <div className="bg-white p-4 rounded shadow-sm">
            {prediction.loading && <Spinner />}
            {prediction.data && <PredictionChart data={prediction.data} />}
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* COMPARE TAB */}
      {/* ------------------------------------------------ */}
      {activeTab === "compare" && (
        <div className="space-y-6">

          <div className="bg-white p-4 rounded shadow-sm flex items-center">
            <button
              type="button"
              onClick={() => comparison.run(symbol)}
              className="px-4 py-2 bg-green-600 text-white rounded text-sm"
            >
              Compare Models
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            {comparison.loading && <Spinner />}
            {comparison.data && <ComparisonChart data={comparison.data} />}
          </div>
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* RANKING TAB */}
      {/* ------------------------------------------------ */}
      {activeTab === "ranking" && (
        <div className="space-y-6">

          <div className="bg-white p-4 rounded shadow-sm flex items-center">
            <button
              type="button"
              onClick={() => ranking.run(symbol)}
              className="px-4 py-2 bg-orange-600 text-white rounded text-sm"
            >
              Rank Models
            </button>
          </div>

          <div className="bg-white p-4 rounded shadow-sm">
            {ranking.loading && (
              <div className="mt-4">
                <Spinner />
                <p className="text-center text-gray-500 mt-2 text-sm">
                  Ranking models… this may take a few seconds.
                </p>
              </div>
            )}

            {!ranking.loading && ranking.data?.ranking && (
              <ModelRankingTable ranking={ranking.data.ranking} />
            )}

            {!ranking.loading && !ranking.data && (
              <p className="text-gray-600 text-sm">
                Click “Rank Models” to compute model rankings.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------ */
/* AUTO REFRESH HELPER COMPONENT */
/* ------------------------------------------------ */
function AutoRefreshRunner({ symbol, model, run }) {
  useEffect(() => {
    const id = setInterval(() => {
      run(symbol, model);
    }, 30000); // 30 seconds

    return () => clearInterval(id);
  }, [symbol, model, run]);

  return null;
}
