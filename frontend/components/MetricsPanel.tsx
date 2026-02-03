export default function MetricsPanel({ metrics }) {
  return (
    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
      {Object.entries(metrics).map(([key, value]) => (
        <div
          key={key}
          className="p-4 bg-gray-100 rounded shadow text-center"
        >
          <div className="text-sm text-gray-500">{key}</div>
          <div className="text-xl font-bold">{value}</div>
        </div>
      ))}
    </div>
  );
}
