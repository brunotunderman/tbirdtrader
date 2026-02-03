"use client";

export function Tabs({ active, onChange }) {
  const tabs = [
    { id: "prediction", label: "Prediction" },
    { id: "comparison", label: "Comparison" },
    { id: "ranking", label: "Ranking" },
    { id: "features", label: "Features & Risk" },
  ];

  return (
    <div className="flex gap-4 border-b mb-6">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`pb-2 px-2 text-lg font-semibold ${
            active === t.id
              ? "border-b-4 border-blue-600 text-blue-600"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
