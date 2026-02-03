"use client";

import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line } from "react-chartjs-2";

// Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend,
  Filler
);

export default function PredictionChart({ data }) {
  if (!data) return null;

  const {
    actual_prices = [],
    predicted_prices = [],
    upper_band = [],
    lower_band = [],
  } = data;

  // -----------------------------
  // 1. Build timeline labels
  // -----------------------------
  const labels = [
    ...actual_prices.map((_, i) => `T-${actual_prices.length - i}`),
    ...predicted_prices.map((_, i) => `P+${i + 1}`),
  ];

  // -----------------------------
  // 2. Merge actual + predicted
  // -----------------------------
  const mergedActual = [
    ...actual_prices,
    ...Array(predicted_prices.length).fill(null),
  ];

  const mergedPredicted = [
    ...Array(actual_prices.length).fill(null),
    ...predicted_prices,
  ];

  const mergedUpper = [
    ...Array(actual_prices.length).fill(null),
    ...upper_band,
  ];

  const mergedLower = [
    ...Array(actual_prices.length).fill(null),
    ...lower_band,
  ];

  // -----------------------------
  // 3. Chart.js dataset config
  // -----------------------------
  const chartData = {
    labels,
    datasets: [
      {
        label: "Actual Prices",
        data: mergedActual,
        borderColor: "#555",
        backgroundColor: "rgba(120,120,120,0.2)",
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: "Predicted Prices",
        data: mergedPredicted,
        borderColor: "#0070f3",
        backgroundColor: "rgba(0,112,243,0.15)",
        pointRadius: 0,
        tension: 0.3,
      },
      {
        label: "Upper Band",
        data: mergedUpper,
        borderColor: "rgba(0,200,0,0.6)",
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.3,
        fill: false,
      },
      {
        label: "Lower Band",
        data: mergedLower,
        borderColor: "rgba(200,0,0,0.6)",
        borderWidth: 1,
        pointRadius: 0,
        tension: 0.3,
        fill: "-1", // fills area between lower and upper
        backgroundColor: "rgba(0,200,0,0.05)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: { mode: "index", intersect: false },
    },
    scales: {
      y: { beginAtZero: false },
      x: { ticks: { maxRotation: 0 } },
    },
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <Line data={chartData} options={options} />
    </div>
  );
}
