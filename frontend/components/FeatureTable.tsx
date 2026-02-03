"use client";

export default function FeatureTable({ features }) {
  if (!features || typeof features !== "object") {
    return <p className="mt-4">No feature data available.</p>;
  }

  return (
    <table className="mt-6 w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Feature</th>
          <th className="p-2 border">Value</th>
        </tr>
      </thead>

      <tbody>
        {Object.entries(features).map(([key, value]) => (
          <tr key={key}>
            <td className="p-2 border font-medium">{key}</td>
            <td className="p-2 border">{String(value)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
