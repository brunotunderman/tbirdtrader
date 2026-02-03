"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FeatureTrendChart({ series }) {
  if (!series) return null;

  const labels = series.rsi.map((_, i) => i.toString());

  const data = {
    labels,
    datasets: [
      {
        label: "RSI",
        data: series.rsi,
        borderColor: "purple",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "MACD",
        data: series.macd,
        borderColor: "blue",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "MACD Signal",
        data: series.macd_signal,
        borderColor: "lightblue",
        borderWidth: 1,
        pointRadius: 0,
      },
      {
        label: "SMA",
        data: series.sma,
        borderColor: "orange",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Volatility",
        data: series.volatility,
        borderColor: "red",
        borderWidth: 1,
        pointRadius: 0,
        yAxisID: "y1",
      },
    ],
  };

  const options = {
    responsive: true,
    scales: {
      y: { title: { display: true, text: "Value" } },
      y1: {
        position: "right",
        grid: { drawOnChartArea: false },
        title: { display: true, text: "Volatility" },
      },
    },
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Feature Trends</h2>
      <Line data={data} options={options} />
    </div>
  );
}
