"use client";

import { useEffect, useRef } from "react";
import { createChart, ColorType } from "lightweight-charts";

interface Candle {
  timestamp: number;
  open: number;
  high: number;
  low: number;
  close: number;
}

interface PredictionPoint {
  timestamp: number;
  price: number;
  high: number;
  low: number;
}

interface Props {
  candles: Candle[];
  prediction: PredictionPoint[];
  height?: number;
}

export default function CandlestickChart({
  candles,
  prediction,
  height = 400,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<ReturnType<typeof createChart> | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // No candles? Don't render chart
    if (!candles || candles.length === 0) {
      console.warn("No candles received — chart not rendered");
      return;
    }

    // Create chart
    const chart = createChart(container, {
      width: container.clientWidth,
      height,
      layout: {
        background: { type: ColorType.Solid, color: "#0d1117" },
        textColor: "#c9d1d9",
      },
      grid: {
        vertLines: { color: "#161b22" },
        horzLines: { color: "#161b22" },
      },
      timeScale: {
        borderColor: "#30363d",
      },
      rightPriceScale: {
        borderColor: "#30363d",
      },
      leftPriceScale: {
        visible: true,
        borderColor: "#30363d",
      },
    });

    chartRef.current = chart;

    // -----------------------------
    // 1. Historical Candlesticks
    // -----------------------------
    const candleSeries = chart.addCandlestickSeries({
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
      priceScaleId: "right",
    });

    const formattedCandles = candles
      .filter(
        (c) =>
          c &&
          typeof c.timestamp === "number" &&
          typeof c.open === "number" &&
          typeof c.high === "number" &&
          typeof c.low === "number" &&
          typeof c.close === "number"
      )
      .sort((a, b) => a.timestamp - b.timestamp)
      .map((c) => ({
        time: c.timestamp, // <-- seconds (correct for lightweight-charts)
        open: c.open,
        high: c.high,
        low: c.low,
        close: c.close,
      }));

    if (formattedCandles.length === 0) {
      console.warn("No valid candles after formatting");
      return;
    }

    candleSeries.setData(formattedCandles);

    // -----------------------------
    // 2. Vertical NOW line
    // -----------------------------
    const lastCandle = formattedCandles[formattedCandles.length - 1];
    if (!lastCandle) {
      console.warn("No last candle found");
      return;
    }

    const nowTime = lastCandle.time;

    const nowLine = chart.addLineSeries({
      color: "#ffffff",
      lineWidth: 1,
      lineStyle: 2,
      priceScaleId: "overlay",
    });

    nowLine.setData([
      { time: nowTime, value: 0 },
      { time: nowTime + 1, value: 1 },
    ]);

    // -----------------------------
    // 3. Prediction Lines (LEFT SCALE)
    // -----------------------------
    const safePrediction = prediction
      .filter(
        (p) =>
          p &&
          typeof p.timestamp === "number" &&
          typeof p.price === "number" &&
          typeof p.high === "number" &&
          typeof p.low === "number" &&
          p.timestamp > nowTime // compare seconds to seconds
      )
      .sort((a, b) => a.timestamp - b.timestamp);

    if (safePrediction.length > 0) {
      const priceSeries = chart.addLineSeries({
        color: "#ffeb3b",
        lineWidth: 2,
        priceScaleId: "left",
      });

      priceSeries.setData(
        safePrediction.map((p) => ({
          time: p.timestamp,
          value: p.price,
        }))
      );

      const highSeries = chart.addLineSeries({
        color: "#4caf50",
        lineWidth: 1,
        priceScaleId: "left",
      });

      highSeries.setData(
        safePrediction.map((p) => ({
          time: p.timestamp,
          value: p.high,
        }))
      );

      const lowSeries = chart.addLineSeries({
        color: "#f44336",
        lineWidth: 1,
        priceScaleId: "left",
      });

      lowSeries.setData(
        safePrediction.map((p) => ({
          time: p.timestamp,
          value: p.low,
        }))
      );
    }

    // -----------------------------
    // Resize handler
    // -----------------------------
    const handleResize = () => {
      chart.applyOptions({ width: container.clientWidth });
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, [candles, prediction, height]);

  return <div ref={containerRef} style={{ width: "100%", height }} />;
}
