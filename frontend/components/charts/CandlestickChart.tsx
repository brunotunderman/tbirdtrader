"use client";

import { useEffect, useRef } from "react";
import {
  createChart,
  ColorType,
  LineStyle,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type LineData,
  type Time,
} from "lightweight-charts";

// ---- Types expected from parent ----
export type Candle = CandlestickData<Time>;        // { time: number, open, high, low, close }
export type PredictionPoint = LineData<Time>;      // { time: number, value: number }
export interface PredictionData {
  mid: PredictionPoint[];
  upper: PredictionPoint[];
  lower: PredictionPoint[];
}

interface Props {
  candles: Candle[];
  prediction: PredictionData | null;
  height?: number;
}

/**
 * Dark-themed candlestick + prediction-overlay chart.
 * - Expects epoch seconds for `time`.
 * - Ensures ascending data before calling setData.
 */
export default function CandlestickChart({
  candles,
  prediction,
  height = 500,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  // Overlay series refs (recreated on each update)
  const midRef = useRef<ISeriesApi<"Line"> | null>(null);
  const upperRef = useRef<ISeriesApi<"Line"> | null>(null);
  const lowerRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bandRef = useRef<ISeriesApi<"Area"> | null>(null);

  // ---------------------------------------------------------------------------
  // INITIALIZE CHART (dark theme)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "#0d1117" }, // GitHub dark
        textColor: "#c9d1d9",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.05)" },
        horzLines: { color: "rgba(255,255,255,0.05)" },
      },
      width: el.clientWidth,
      height,
      crosshair: {
        mode: 1,
        vertLine: {
          color: "rgba(255,255,255,0.2)",
          labelBackgroundColor: "#1f6feb",
        },
        horzLine: {
          color: "rgba(255,255,255,0.2)",
          labelBackgroundColor: "#1f6feb",
        },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.15)",
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.15)",
      },
    });

    chartRef.current = chart;

    // Candlesticks — dark‑mode friendly palette
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#1f8b4c",
      downColor: "#d63a44",
      wickUpColor: "#1f8b4c",
      wickDownColor: "#d63a44",
      borderUpColor: "#1f8b4c",
      borderDownColor: "#d63a44",
    });
    candleSeriesRef.current = candleSeries;

    const handleResize = () => {
      if (containerRef.current) {
        chart.applyOptions({
          width: containerRef.current.clientWidth,
          height,
        });
      }
    };

    window.addEventListener("resize", handleResize);

    // Fit shortly after mount
    const timer = window.setTimeout(() => {
      try {
        chart.timeScale().fitContent();
      } catch {
        /* no-op */
      }
    }, 80);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.clearTimeout(timer);

      // Remove overlay series if present
      if (midRef.current) { chart.removeSeries(midRef.current); midRef.current = null; }
      if (upperRef.current) { chart.removeSeries(upperRef.current); upperRef.current = null; }
      if (lowerRef.current) { chart.removeSeries(lowerRef.current); lowerRef.current = null; }
      if (bandRef.current) { chart.removeSeries(bandRef.current); bandRef.current = null; }

      if (candleSeriesRef.current) {
        chart.removeSeries(candleSeriesRef.current);
        candleSeriesRef.current = null;
      }

      chart.remove();
      chartRef.current = null;
    };
  }, [height]);

  // ---------------------------------------------------------------------------
  // UPDATE CANDLES (ensure ascending order)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!candleSeriesRef.current) return;

    const sorted = [...candles].sort(
      (a, b) => (a.time as number) - (b.time as number)
    );

    candleSeriesRef.current.setData(sorted);

    try {
      chartRef.current?.timeScale().fitContent();
    } catch {
      /* no-op */
    }
  }, [candles]);

  // ---------------------------------------------------------------------------
  // UPDATE PREDICTION OVERLAY (mid/upper/lower + area under lower)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    // Remove previous overlay series
    if (midRef.current) { chart.removeSeries(midRef.current); midRef.current = null; }
    if (upperRef.current) { chart.removeSeries(upperRef.current); upperRef.current = null; }
    if (lowerRef.current) { chart.removeSeries(lowerRef.current); lowerRef.current = null; }
    if (bandRef.current) { chart.removeSeries(bandRef.current); bandRef.current = null; }

    if (!prediction) return;

    // Create new overlay series with dark-friendly colors
    const midLine = chart.addLineSeries({
      color: "#58a6ff", // GitHub blue
      lineWidth: 2,
      lineType: LineStyle.Solid,
      priceLineVisible: false,
      crosshairMarkerVisible: true,
    });

    const upperLine = chart.addLineSeries({
      color: "#3fb950", // Green
      lineWidth: 1.5,
      lineType: LineStyle.Solid,
      priceLineVisible: false,
    });

    const lowerLine = chart.addLineSeries({
      color: "#f85149", // Red
      lineWidth: 1.5,
      lineType: LineStyle.Solid,
      priceLineVisible: false,
    });

    // Area fill under lower (simple band effect)
    const areaBand = chart.addAreaSeries({
      topColor: "rgba(88, 166, 255, 0.25)",
      bottomColor: "rgba(88, 166, 255, 0.05)",
      lineColor: "rgba(0,0,0,0)",
      lineWidth: 0,
    });

    // Ensure ascending time
    const midSorted   = [...prediction.mid].sort((a, b) => (a.time as number) - (b.time as number));
    const upperSorted = [...prediction.upper].sort((a, b) => (a.time as number) - (b.time as number));
    const lowerSorted = [...prediction.lower].sort((a, b) => (a.time as number) - (b.time as number));

    midLine.setData(midSorted);
    upperLine.setData(upperSorted);
    lowerLine.setData(lowerSorted);

    areaBand.setData(lowerSorted.map((p) => ({ time: p.time, value: p.value })));

    // Keep refs for cleanup
    midRef.current = midLine;
    upperRef.current = upperLine;
    lowerRef.current = lowerLine;
    bandRef.current = areaBand;
  }, [prediction]);

  // ---------------------------------------------------------------------------
  // RENDER (dark container too)
  // ---------------------------------------------------------------------------
  return (
    <div className="relative bg-[#0d1117] text-white w-full h-full rounded-lg shadow-lg">
      {/* Chart canvas container */}
      <div ref={containerRef} className="w-full" />

      {/* Legend */}
      {prediction && (
        <div
          className="
            absolute top-3 right-3
            bg-[#161b22] border border-gray-700
            px-3 py-2 rounded-md shadow-md
            text-xs text-gray-300 space-y-1
          "
        >
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-[#58a6ff]" />
            Prediction (mid)
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-[#3fb950]" />
            Upper Confidence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-[#f85149]" />
            Lower Confidence
          </div>
        </div>
      )}
    </div>
  );
}