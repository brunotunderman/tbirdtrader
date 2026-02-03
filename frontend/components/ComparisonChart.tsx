"use client";

import { Line } from "react-chartjs-2";

export default function ComparisonChart({ data }) {

  if (!data || !data.models) return null;

  const labels = data.models.baseline.actual_prices.map((_, i) => i);

  const datasets = Object.entries(data.models).map(([model, result]) => ({
    label: model,
    data: result.predicted_prices,
    borderColor: model === "baseline" ? "blue" : model === "lstm" ? "green" : "orange",
    fill: false,
  }));

  return (
    <div className="p-4 bg-white rounded shadow">
      <Line
        data={{
          labels,
          datasets,
        }}
      />
    </div>
  );
}
