"use client";

export default function ConfidenceMeter({ confidence }) {
  const pct = Math.round(confidence * 100);

  return (
    <div className="mt-4">
      <div className="text-sm text-gray-600 mb-1">Confidence: {pct}%</div>

      <div className="w-full bg-gray-300 rounded h-3">
        <div
          className="bg-blue-600 h-3 rounded"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
