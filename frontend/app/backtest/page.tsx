"use client";

import { useState } from "react";
import { useBacktest } from "../../hooks/useBacktest";
import EquityCurveChart from "../../components/EquityCurveChart";
import MetricsPanel from "../../components/MetricsPanel";
import TradesTable from "../../components/TradesTable";
import SymbolSelector from "../../components/SymbolSelector";
import DateRangeSelector from "../../components/DateRangeSelector";

export default function BacktestPage() {
  const { run, data, loading } = useBacktest();

  const [symbol, setSymbol] = useState("BTC-EUR");
  const [startDate, setStartDate] = useState("2023-01-01");
  const [endDate, setEndDate] = useState("2023-12-31");

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Backtest</h1>

      <div className="flex items-center gap-6 mb-6">
        <SymbolSelector value={symbol} onChange={setSymbol} />

        <DateRangeSelector
          start={startDate}
          end={endDate}
          onStartChange={setStartDate}
          onEndChange={setEndDate}
        />

        <button
          onClick={() => run(symbol, startDate, endDate)}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          Run Backtest
        </button>
      </div>

      {loading && <p className="mt-4">Running backtest…</p>}

      {data && (
        <>
          <EquityCurveChart equity={data.equity_curve} />

          <MetricsPanel metrics={data.metrics} />

          <TradesTable trades={data.trades} />

          <pre className="mt-6 bg-gray-900 text-white p-4 rounded">
            {JSON.stringify(data, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}
