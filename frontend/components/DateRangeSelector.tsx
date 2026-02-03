"use client";

export default function DateRangeSelector({ start, end, onStartChange, onEndChange }) {
  return (
    <div className="flex items-center gap-4">
      <div>
        <label className="block text-sm text-gray-600">Start Date</label>
        <input
          type="date"
          value={start}
          onChange={(e) => onStartChange(e.target.value)}
          className="px-3 py-2 border rounded bg-white"
        />
      </div>

      <div>
        <label className="block text-sm text-gray-600">End Date</label>
        <input
          type="date"
          value={end}
          onChange={(e) => onEndChange(e.target.value)}
          className="px-3 py-2 border rounded bg-white"
        />
      </div>
    </div>
  );
}
