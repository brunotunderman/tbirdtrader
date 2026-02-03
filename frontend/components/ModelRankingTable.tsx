"use client";

export default function ModelRankingTable({ ranking }) {
  if (!ranking) return null;

  return (
    <div className="mt-10 p-6 bg-gray-100 rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Model Ranking</h2>

      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b">
            <th className="p-2">Rank</th>
            <th className="p-2">Model</th>
            <th className="p-2">RMSE</th>
            <th className="p-2">MAE</th>
            <th className="p-2">Max Drawdown</th>
          </tr>
        </thead>

        <tbody>
          {ranking.map((row, index) => (
            <tr key={row.model} className="border-b">
              <td className="p-2 font-semibold">{index + 1}</td>
              <td className="p-2">{row.model}</td>
              <td className="p-2">{row.rmse.toFixed(4)}</td>
              <td className="p-2">{row.mae.toFixed(4)}</td>
              <td className="p-2">{(row.max_drawdown * 100).toFixed(2)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
