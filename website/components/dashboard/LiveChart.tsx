"use client";

import { useCallback, useEffect, useState } from "react";

// ---------------------------
// Types
// ---------------------------
type RawCandle = {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type Candle = {
  time: number;
  open: number;
  high: number;
  low: number;
  close: number;
};

type PredictionPoint = {
  time: number;
  value: number;
};

type PredictionData = {
  mid: PredictionPoint[];
  upper: PredictionPoint[];
  lower: PredictionPoint[];
};

type CandlesApiResponse = {
  candles: RawCandle[];
  prediction?: any;
  meta?: {
    tf?: string;
    interval?: string;
    limit?: number;
  };
  error?: string;
  details?: string;
};

// Helpers
function toSeconds(v: number) {
  return v > 1e12 ? Math.floor(v / 1000) : Math.floor(v);
}

const TIMEFRAMES = ["1D", "1W", "1M", "1Y"] as const;
type Timeframe = (typeof TIMEFRAMES)[number];

const INTERVAL_SECONDS: Record<string, number> = {
  "1m": 60,
  "3m": 180,
  "5m": 300,
  "15m": 900,
  "30m": 1800,
  "1h": 3600,
  "2h": 7200,
  "4h": 14400,
  "6h": 21600,
  "8h": 28800,
  "12h": 43200,
  "1d": 86400,
  "3d": 259200,
  "1w": 604800,
  "1M": 2592000,
};

export default function LiveChart() {
  const [timeframe, setTimeframe] = useState<Timeframe>("1D");
  const [candles, setCandles] = useState<Candle[]>([]);
  const [prediction, setPrediction] = useState<PredictionData | null>(null);

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchCandlesAndPrediction = useCallback(async (tf: Timeframe) => {
    setLoading(true);
    setErr(null);

    try {
      const res = await fetch(`/api/candles?tf=${encodeURIComponent(tf)}`, {
        cache: "no-store",
      });

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Proxy /api/candles ${res.status} ${res.statusText} - ${text}`);
      }

      const data: CandlesApiResponse = await res.json();

      if (data.error) throw new Error(data.details || data.error);

      const raw: RawCandle[] = Array.isArray(data.candles) ? data.candles : [];
      const formatted: Candle[] = raw
        .map((c) => ({
          time: toSeconds(c.timestamp),
          open: Number(c.open),
          high: Number(c.high),
          low: Number(c.low),
          close: Number(c.close),
        }))
        .sort((a, b) => a.time - b.time);

      setCandles(formatted);

      const lastTime =
        formatted.length > 0
          ? formatted[formatted.length - 1].time
          : Math.floor(Date.now() / 1000);

      let secStep = INTERVAL_SECONDS[data.meta?.interval ?? ""] ?? 0;
      if (!secStep) {
        const tfStep: Record<Timeframe, number> = {
          "1D": INTERVAL_SECONDS["5m"],
          "1W": INTERVAL_SECONDS["1h"],
          "1M": INTERVAL_SECONDS["4h"],
          "1Y": INTERVAL_SECONDS["1d"],
        };
        secStep = tfStep[tf];
      }

      const pred = data.prediction;

      if (
        pred &&
        Array.isArray(pred.predicted_prices) &&
        Array.isArray(pred.upper_band) &&
        Array.isArray(pred.lower_band)
      ) {
        const midArr = pred.predicted_prices;
        const upArr = pred.upper_band;
        const lowArr = pred.lower_band;

        const n = Math.min(midArr.length, upArr.length, lowArr.length);

        const mid: PredictionPoint[] = [];
        const upper: PredictionPoint[] = [];
        const lower: PredictionPoint[] = [];

        for (let i = 0; i < n; i++) {
          const t = lastTime + (i + 1) * secStep;
          mid.push({ time: t, value: Number(midArr[i]) });
          upper.push({ time: t, value: Number(upArr[i]) });
          lower.push({ time: t, value: Number(lowArr[i]) });
        }

        mid.sort((a, b) => a.time - b.time);
        upper.sort((a, b) => a.time - b.time);
        lower.sort((a, b) => a.time - b.time);

        setPrediction({ mid, upper, lower });
      } else {
        setPrediction(null);
      }

      setLoading(false);
    } catch (e: any) {
      console.error(e);
      setErr(e?.message ?? "Unknown error");
      setCandles([]);
      setPrediction(null);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCandlesAndPrediction(timeframe);
  }, [timeframe, fetchCandlesAndPrediction]);

  return (
    <div className="w-full bg-[#161b22] p-5 rounded-xl border border-[#30363d] shadow-xl">
      <div className="mb-4">
        <TimeframeSelector timeframe={timeframe} onChange={setTimeframe} />
      </div>

      {err && (
        <div className="mb-3 text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded px-3 py-2">
          {err}
        </div>
      )}

      <CandlestickChart candles={candles} prediction={prediction} height={500} />

      <div className="mt-3 flex items-center gap-3 text-[11px] text-gray-400">
        {loading && (
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
            <span>Loading data…</span>
          </div>
        )}

        {!loading && candles.length > 0 && (
          <span>
            Showing {candles.length} candles ·{" "}
            {new Date(candles[0].time * 1000).toLocaleDateString()} →{" "}
            {new Date(candles[candles.length - 1].time * 1000).toLocaleDateString()}
          </span>
        )}

        {!loading && candles.length === 0 && <span>No candle data</span>}
      </div>
    </div>
  );
}
