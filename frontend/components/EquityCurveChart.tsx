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

export default function EquityCurveChart({ equity, drawdown }) {
  if (!equity) return null;

  const labels = equity.map((_, i) => i.toString());

  const data = {
    labels,
    datasets: [
      {
        label: "Equity Curve",
        data: equity,
        borderColor: "green",
        borderWidth: 2,
        pointRadius: 0,
      },
      {
        label: "Drawdown",
        data: drawdown,
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
      y: { title: { text: "Equity", display: true } },
      y1: {
        position: "right",
        title: { text: "Drawdown", display: true },
        grid: { drawOnChartArea: false },
      },
    },
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Equity Curve</h2>
      <Line data={data} options={options} />
    </div>
  );
}

