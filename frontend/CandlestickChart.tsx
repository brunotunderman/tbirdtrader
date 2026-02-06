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

export type Candle = CandlestickData<Time>;
export type PredictionPoint = LineData<Time>;

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

export default function CandlestickChart({
  candles,
  prediction,
  height = 500,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

  const midRef = useRef<ISeriesApi<"Line"> | null>(null);
  const upperRef = useRef<ISeriesApi<"Line"> | null>(null);
  const lowerRef = useRef<ISeriesApi<"Line"> | null>(null);
  const bandRef = useRef<ISeriesApi<"Area"> | null>(null);

  // Setup chart
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "#ffffff" },
        textColor: "#333",
      },
      grid: {
        vertLines: { color: "#f0f0f0" },
        horzLines: { color: "#f0f0f0" },
      },
      width: el.clientWidth,
      height,
      crosshair: { mode: 1 },
    });

    chartRef.current = chart;

    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26A69A",
      downColor: "#EF5350",
      wickUpColor: "#26A69A",
      wickDownColor: "#EF5350",
      borderVisible: false,
    });

    candleSeriesRef.current = candleSeries;

    const resize = () => {
      if (!containerRef.current) return;
      chart.applyOptions({ width: containerRef.current.clientWidth });
    };

    window.addEventListener("resize", resize);

    return () => {
      window.removeEventListener("resize", resize);

      if (midRef.current) chart.removeSeries(midRef.current);
      if (upperRef.current) chart.removeSeries(upperRef.current);
      if (lowerRef.current) chart.removeSeries(lowerRef.current);
      if (bandRef.current) chart.removeSeries(bandRef.current);
      if (candleSeriesRef.current) chart.removeSeries(candleSeriesRef.current);

      chart.remove();
    };
  }, [height]);

  // Candle updates
  useEffect(() => {
    if (candles && candleSeriesRef.current) {
      candleSeriesRef.current.setData(candles);
      try {
        chartRef.current?.timeScale().fitContent();
      } catch {}
    }
  }, [candles]);

  // Prediction overlays
  useEffect(() => {
    const chart = chartRef.current;
    if (!chart) return;

    if (midRef.current) chart.removeSeries(midRef.current);
    if (upperRef.current) chart.removeSeries(upperRef.current);
    if (lowerRef.current) chart.removeSeries(lowerRef.current);
    if (bandRef.current) chart.removeSeries(bandRef.current);

    if (!prediction) return;

    const midLine = chart.addLineSeries({
      color: "#0A84FF",
      lineWidth: 2,
      priceLineVisible: false,
    });

    const upperLine = chart.addLineSeries({
      color: "#26A69A",
      lineWidth: 1.5,
      priceLineVisible: false,
    });

    const lowerLine = chart.addLineSeries({
      color: "#EF5350",
      lineWidth: 1.5,
      priceLineVisible: false,
    });

    const areaBand = chart.addAreaSeries({
      topColor: "rgba(10, 132, 255, 0.15)",
      bottomColor: "rgba(10, 132, 255, 0.05)",
      lineColor: "rgba(0,0,0,0)",
      lineWidth: 0,
    });

    midLine.setData(prediction.mid);
    upperLine.setData(prediction.upper);
    lowerLine.setData(prediction.lower);

    areaBand.setData(
      prediction.lower.map((p) => ({ time: p.time, value: p.value }))
    );

    midRef.current = midLine;
    upperRef.current = upperLine;
    lowerRef.current = lowerLine;
    bandRef.current = areaBand;
  }, [prediction]);

  return (
    <div className="relative">
      <div ref={containerRef} className="w-full" />

      {prediction && (
        <div className="absolute top-3 right-3 bg-white/80 backdrop-blur-sm px-3 py-2 rounded-lg shadow-sm border border-gray-200 text-xs text-gray-700 space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-blue-600" /> Prediction
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-green-500" /> Upper Confidence
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-1 rounded bg-red-500" /> Lower Confidence
          </div>
        </div>
      )}
    </div>
  );
}