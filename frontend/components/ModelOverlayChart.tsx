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

const COLORS: Record<string, string> = {
  baseline: "blue",
  lstm: "green",
  xgboost: "orange",
  transformer: "purple",
  ensemble: "red",
};

export default function ModelOverlayChart({ models }) {
  if (!models) return null;

  const labels = Array.from({ length: 10 }, (_, i) => `t+${i + 1}`);

  const datasets = Object.entries(models).map(([name, result]) => ({
    label: name,
    data: result.predicted_prices,
    borderColor: COLORS[name],
    borderWidth: 2,
    pointRadius: 0,
  }));

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-bold mb-4">Model Prediction Overlay</h2>
      <Line
        data={{ labels, datasets }}
        options={{
          responsive: true,
          plugins: { legend: { position: "bottom" } },
        }}
      />
    </div>
  );
}
