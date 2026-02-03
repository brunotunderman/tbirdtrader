"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
} from "chart.js";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip
);

export default function PricePredictionChart({ labels, prices, predictions }) {
  const data = {
    labels,
    datasets: [
      {
        label: "Market Price (BTC-EUR)",
        data: prices,
        borderColor: "rgba(59,130,246,1)", // blue
        backgroundColor: "rgba(59,130,246,0.3)",
        tension: 0.3,
      },
      {
        label: "Predicted Price",
        data: predictions,
        borderColor: "rgba(234,88,12,1)", // orange
        backgroundColor: "rgba(234,88,12,0.3)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
    },
    scales: {
      y: {
        ticks: { color: "#555" },
      },
      x: {
        ticks: { color: "#555" },
      },
    },
  };

  return <Line data={data} options={options} />;
}
