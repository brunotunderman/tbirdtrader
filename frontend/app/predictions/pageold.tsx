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
    <div className="p-6 space-y-6">
      {/* Header */}
      <h1 className="text-3xl font-bold">AI Trading Dashboard</h1>

      {/* Symbol + Model Selector */}
      <div className="flex gap-4 items-center">
        <input
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
          className="border px-3 py-2 rounded"
        />

        <select
          value={model}
          onChange={(e) => setModel(e.target.value)}
          className="border px-3 py-2 rounded"
        >
          <option value="baseline">Baseline</option>
          <option value="lstm">LSTM</option>
          <option value="xgboost">XGBoost</option>
          <option value="transformer">Transformer</option>
          <option value="ensemble">Ensemble</option>
        </select>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b pb-2">
        <button
          onClick={() => setActiveTab("predict")}
          className={activeTab === "predict" ? "font-bold" : ""}
        >
          Predict
        </button>

        <button
          onClick={() => setActiveTab("compare")}
          className={activeTab === "compare" ? "font-bold" : ""}
        >
          Compare
        </button>

        <button
          onClick={() => setActiveTab("ranking")}
          className={activeTab === "ranking" ? "font-bold" : ""}
        >
          Rank Models
        </button>
      </div>

      {/* ------------------------------------------------ */}
      {/* PREDICT TAB */}
      {/* ------------------------------------------------ */}
      {activeTab === "predict" && (
        <div className="space-y-4">

          {/* Auto Refresh + Predict Button */}
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setAutoRefresh(!autoRefresh)}
              className={`px-4 py-2 rounded text-white ${
                autoRefresh ? "bg-green-600" : "bg-gray-500"
              }`}
            >
              {autoRefresh ? "Auto Refresh: ON" : "Auto Refresh: OFF"}
            </button>

            <button
              type="button"
              onClick={() => prediction.run(symbol, model)}
              className="px-4 py-2 bg-blue-600 text-white rounded"
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

          {prediction.loading && <Spinner />}

          {prediction.data && (
            <PredictionChart data={prediction.data} />
          )}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* COMPARE TAB */}
      {/* ------------------------------------------------ */}
      {activeTab === "compare" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => comparison.run(symbol)}
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Compare Models
          </button>

          {comparison.loading && <Spinner />}

          {comparison.data && (
            <ComparisonChart data={comparison.data} />
          )}
        </div>
      )}

      {/* ------------------------------------------------ */}
      {/* RANKING TAB */}
      {/* ------------------------------------------------ */}
      {activeTab === "ranking" && (
        <div className="space-y-4">
          <button
            type="button"
            onClick={() => ranking.run(symbol)}
            className="px-4 py-2 bg-orange-600 text-white rounded"
          >
            Rank Models
          </button>

          {ranking.loading && (
            <div className="mt-4">
              <Spinner />
              <p className="text-center text-gray-500 mt-2">
                Ranking models… this may take a few seconds.
              </p>
            </div>
          )}

          {!ranking.loading && ranking.data?.ranking && (
            <ModelRankingTable ranking={ranking.data.ranking} />
          )}

          {!ranking.loading && !ranking.data && (
            <p className="text-gray-600">
              Click “Rank Models” to compute model rankings.
            </p>
          )}
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
    }, 30000);

    return () => clearInterval(id);
  }, [symbol, model, run]);

  return null;
}
