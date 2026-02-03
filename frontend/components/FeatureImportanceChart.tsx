"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function FeatureImportanceChart({ importance }) {
  if (!importance || typeof importance !== "object") {
    return <p className="mt-4">No feature importance data available.</p>;
  }

  const labels = Object.keys(importance);
  const values = Object.values(importance);

  const data = {
    labels,
    datasets: [
      {
        label: "Importance",
        data: values,
        backgroundColor: "rgba(59, 130, 246, 0.6)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { display: false },
    },
  };

  return (
    <div className="mt-6">
      <h2 className="text-xl font-bold mb-2">Feature Importance</h2>
      <Bar data={data} options={options} />
    </div>
  );
}
