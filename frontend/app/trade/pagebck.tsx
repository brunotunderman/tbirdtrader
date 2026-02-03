"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import CandlestickChart from "@/components/CandlestickChart";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

import annotationPlugin from "chartjs-plugin-annotation";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  annotationPlugin
);

type AccountState = {
  balances: {
    EUR: number;
    BTC: number;
  };
  positions: any[];
  trade_history: any[];
};

export default function TradePage() {
  const [account, setAccount] = useState<AccountState | null>(null);
  const [candles, setCandles] = useState<Candle[]>([]);
  const [prediction, setPrediction] = useState([]);
  const [symbol, setSymbol] = useState("BTC-EUR");
  const [buyAmount, setBuyAmount] = useState(100);
  const [sellAmount, setSellAmount] = useState(0.001);
  const [loading, setLoading] = useState(false);

  const [botRunning, setBotRunning] = useState(false);
  const [botStats, setBotStats] = useState<any>(null);
  const [botLog, setBotLog] = useState<string[]>([]);

  const [chartLabels, setChartLabels] = useState<string[]>([]);
  const [chartActual, setChartActual] = useState<(number | null)[]>([]);
  const [chartPredicted, setChartPredicted] = useState<(number | null)[]>([]);
  const [chartUpper, setChartUpper] = useState<(number | null)[]>([]);
  const [chartLower, setChartLower] = useState<(number | null)[]>([]);

  // --------------------------------------
  // FETCH FUNCTIONS
  // --------------------------------------

  async function fetchCandles() {
  const res = await fetch("http://localhost:8000/market/candles");
  const data = await res.json();
  return data; // { candles: [...], prediction: [...] }
}



  // --------------------------------------
  // EXISTING EFFECT (intervals + initial loads)
  // --------------------------------------
  useEffect(() => {
    fetchAccount();
    fetchBotStatus();
    fetchBotLog();
    fetchPredictionForChart();

    const accountInterval = setInterval(fetchAccount, 5000);
    const statusInterval = setInterval(fetchBotStatus, 5000);
    const logInterval = setInterval(fetchBotLog, 3000);
    const chartInterval = setInterval(fetchPredictionForChart, 10000);

    return () => {
      clearInterval(accountInterval);
      clearInterval(statusInterval);
      clearInterval(logInterval);
      clearInterval(chartInterval);
    };
  }, []);


 // --------------------------------------
 // NEW EFFECT FOR CANDLES (CLEAN + CORRECT)
 // --------------------------------------
useEffect(() => {
  async function load() {
    const data = await fetchCandles();

    console.log("BACKEND RESPONSE:", data);
    console.log("FIRST CANDLE:", data.candles?.[0]);
    console.log("PREDICTION RECEIVED:", data.prediction);

    // Update state
    setCandles(data.candles || []);
    setPrediction(data.prediction || []);
  }

  load();
}, []);





  // --------------------------------------
  // FETCH FUNCTIONS (existing)
  // --------------------------------------
  async function fetchAccount() {
    try {
      const res = await fetch("http://localhost:8000/paper/account");
      const data = await res.json();
      setAccount(data);
    } catch (err) {
      console.error("Failed to fetch account", err);
    }
  }

  async function fetchBotStatus() {
    try {
      const res = await fetch("http://localhost:8000/bot/status");
      if (!res.ok) return;
      const data = await res.json();
      setBotRunning(data.running);
      setBotStats(data);
    } catch (err) {
      console.error("Failed to fetch bot status", err);
    }
  }

  async function fetchBotLog() {
    try {
      const res = await fetch("http://localhost:8000/bot/log");
      if (!res.ok) return;
      const data = await res.json();
      setBotLog(data.log || []);
    } catch (err) {
      console.error("Failed to fetch bot log", err);
    }
  }


  async function fetchPredictionForChart() {
    try {
      const res = await fetch(
        "http://localhost:8000/model/predict?symbol=BTC-EUR&model=baseline"
      );

      const data = await res.json();

      const actual = data.actual_prices;
      const predicted = data.predicted_prices;
      const upper = data.upper_band;
      const lower = data.lower_band;

      if (!actual || !predicted) return;

      const lastActualSlice = actual.slice(-50);

      const labels: string[] = [];

      for (let i = 0; i < lastActualSlice.length; i++) {
        labels.push(`t-${lastActualSlice.length - 1 - i}`);
      }

      labels.push("t0");

      for (let i = 1; i < predicted.length; i++) {
        labels.push(`t+${i}`);
      }

      const combinedActual = [
        ...lastActualSlice,
        ...Array(predicted.length).fill(null),
      ];

      const combinedPredicted = [
        ...Array(lastActualSlice.length).fill(null),
        ...predicted,
      ];

      const combinedUpper = upper
        ? [...Array(lastActualSlice.length).fill(null), ...upper]
        : [];

      const combinedLower = lower
        ? [...Array(lastActualSlice.length).fill(null), ...lower]
        : [];

      setChartLabels(labels);
      setChartActual(combinedActual);
      setChartPredicted(combinedPredicted);
      setChartUpper(combinedUpper);
      setChartLower(combinedLower);
    } catch (err) {
      console.error("Failed to fetch prediction for chart", err);
    }
  }

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

  async function startBot() {
    await fetch("http://localhost:8000/bot/start", { method: "POST" });
    await fetchBotStatus();
  }

  async function stopBot() {
    await fetch("http://localhost:8000/bot/stop", { method: "POST" });
    await fetchBotStatus();
  }
"Chunk 2"  
  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: "Actual Price",
        data: chartActual,
        borderColor: "rgba(59,130,246,1)",
        backgroundColor: "rgba(59,130,246,0.2)",
        tension: 0.3,
      },
      {
        label: "Predicted Price",
        data: chartPredicted,
        borderColor: "rgba(234,88,12,1)",
        backgroundColor: "rgba(234,88,12,0.2)",
        tension: 0.3,
      },
      chartUpper.length > 0 && {
        label: "Upper Band",
        data: chartUpper,
        borderColor: "rgba(34,197,94,0.8)",
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.3,
      },
      chartLower.length > 0 && {
        label: "Lower Band",
        data: chartLower,
        borderColor: "rgba(239,68,68,0.8)",
        borderDash: [4, 4],
        pointRadius: 0,
        tension: 0.3,
      },
    ].filter(Boolean),
  };

  const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  layout: {
    padding: {
      left: 0,
      right: 0,
      top: 10,
      bottom: 0,
    },
  },
  plugins: {
    legend: { position: "top" },
    annotation: {
      annotations: {
        t0Line: {
          type: "line",
          xMin: chartLabels.indexOf("t0"),
          xMax: chartLabels.indexOf("t0"),
          borderColor: "rgba(0,0,0,0.4)",
          borderWidth: 1,
          borderDash: [6, 6],
          label: {
            display: true,
            content: "t0",
            position: "start",
            backgroundColor: "rgba(255,255,255,0.8)",
            color: "#333",
            font: { size: 10 },
          },
        },
      },
    },
  },
  scales: {
    x: {
      offset: false,
      ticks: { color: "#555" },
    },
    y: {
      ticks: { color: "#555" },
    },
  },
  interaction: {
    intersect: false,
  },
};

return (
  <div className="min-h-screen bg-gray-50 flex flex-col">
    <header className="w-full bg-white border-b px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded bg-blue-600 flex items-center justify-center text-white text-sm font-semibold">
          T
        </div>
        <div>
          <div className="text-sm font-semibold text-gray-800">
            TbirdTrader
          </div>
          <div className="text-xs text-gray-500">
            AI Trading Platform · Paper Mode
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={() => (botRunning ? stopBot() : startBot())}
          className={`px-4 py-1.5 rounded text-sm font-medium ${
            botRunning
              ? "bg-green-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
        >
          {botRunning ? "Bot Running" : "Bot Stopped"}
        </button>
      </div>
    </header>

    <main className="flex-1 p-6 space-y-8">

      {/* Title */}
      <section className="space-y-1">
        <h1 className="text-2xl font-semibold text-gray-800">Paper Trading</h1>
        <p className="text-gray-600 text-sm">
          Simulated trading environment powered by your AI predictions
        </p>
      </section>

      {/* Balances + Trade Controls + Bot Status */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Balances */}
        <div className="bg-white p-4 rounded shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold mb-3">Balances</h2>
          {!account && <p className="text-gray-500">Loading...</p>}
          {account && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">EUR</p>
                <p className="text-xl font-semibold">
                  {account.balances.EUR.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">BTC</p>
                <p className="text-xl font-semibold">
                  {account.balances.BTC.toFixed(6)}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Trade Controls */}
        <div className="bg-white p-4 rounded shadow-sm lg:col-span-1 space-y-6">
          <h2 className="text-lg font-semibold">Trade Controls</h2>

          <div className="flex flex-col">
            <label className="text-xs text-gray-600 mb-1">Symbol</label>
            <input
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="border px-3 py-2 rounded text-sm"
            />
          </div>

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

        {/* Bot Status */}
        <div className="bg-white p-4 rounded shadow-sm lg:col-span-1">
          <h2 className="text-lg font-semibold mb-3">Bot Status</h2>
          {!botStats && <p className="text-gray-500">Loading...</p>}
          {botStats && (
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">Running</p>
                <p className="text-xl font-semibold">
                  {botStats.running ? "Yes" : "No"}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">Trades Today</p>
                <p className="text-xl font-semibold">
                  {botStats.trades_today}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">Trades This Week</p>
                <p className="text-xl font-semibold">
                  {botStats.trades_this_week}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">Daily Limit</p>
                <p className="text-xl font-semibold">
                  {botStats.max_trades_per_day}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded">
                <p className="text-gray-600">Weekly Limit</p>
                <p className="text-xl font-semibold">
                  {botStats.max_trades_per_week}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>
"Chunk 3"
{/* Chart + Open Positions side-by-side */}
<section className="grid grid-cols-1 lg:grid-cols-3 gap-6">

  {/* Chart (2/3 width) */}
  <div className="bg-white p-4 rounded shadow-sm lg:col-span-2">
    <h2 className="text-lg font-semibold mb-3">Price Chart</h2>

    {candles.length === 0 && (
      <p className="text-gray-500 text-sm">Loading chart...</p>
    )}

    {candles.length > 0 && (
      <div className="w-full h-96">
        <CandlestickChart
          candles={candles}
          prediction={prediction}
          height={380}
        />
      </div>
    )}
  </div>

  {/* Open Positions (1/3 width) */}
  <div className="bg-white p-4 rounded shadow-sm">
    <h2 className="text-lg font-semibold mb-3">Open Positions</h2>

    {!account && <p className="text-gray-500">Loading...</p>}

    {account && account.positions.length === 0 && (
      <p className="text-gray-500 text-sm">No open positions.</p>
    )}

    {account && account.positions.length > 0 && (
      <div className="space-y-2 text-sm">
        {account.positions.map((pos, idx) => (
          <div
            key={idx}
            className="p-3 bg-gray-50 rounded border text-gray-700"
          >
            <div>Type: {pos.type}</div>
            <div>Amount: {pos.amount}</div>
            <div>Price: {pos.price}</div>
            <div>Timestamp: {pos.timestamp}</div>
          </div>
        ))}
      </div>
    )}
  </div>

</section>

"Chunk 4"
      {/* Trade History + Bot Log */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">

        {/* Trade History */}
        <div className="bg-white p-4 rounded shadow-sm">
          <h2 className="text-lg font-semibold mb-3">Trade History</h2>

          {!account && <p className="text-gray-500">Loading...</p>}

          {account && account.trade_history.length === 0 && (
            <p className="text-gray-500 text-sm">No trades yet.</p>
          )}

          {account && account.trade_history.length > 0 && (
            <div className="space-y-2 text-sm">
              {account.trade_history.map((trade, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 rounded border text-gray-700"
                >
                  <div>Type: {trade.type}</div>
                  <div>Amount: {trade.amount}</div>
                  <div>Price: {trade.price}</div>
                  <div>Timestamp: {trade.timestamp}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bot Log */}
        <div className="bg-white p-4 rounded shadow-sm lg:col-span-2">
          <h2 className="text-lg font-semibold mb-3">Bot Log</h2>

          <div className="h-64 overflow-y-auto bg-gray-50 p-3 rounded text-xs font-mono">
            {(!botLog || botLog.length === 0) && (
              <div className="text-gray-500">No log entries yet.</div>
            )}

            {botLog &&
              botLog.length > 0 &&
              botLog.map((line, idx) => (
                <div key={idx} className="text-gray-700">
                  {line}
                </div>
              ))}
          </div>
        </div>

      </section>

    </main>
  </div>
);
}
