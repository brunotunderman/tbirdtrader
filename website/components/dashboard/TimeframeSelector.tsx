"use client";

interface Props {
  timeframe: string;
  onChange: (tf: string) => void;
}

export default function TimeframeSelector({ timeframe, onChange }: Props) {
  const buttons = ["1D", "1W", "1M", "1Y"];

  return (
    <div className="inline-flex bg-gray-100 border border-gray-200 rounded-xl p-1 shadow-sm">
      {buttons.map((tf) => {
        const active = tf === timeframe;

        return (
          <button
            key={tf}
            onClick={() => onChange(tf)}
            className={`
              px-4 py-2 rounded-lg text-sm font-medium transition-all
              focus:outline-none
              ${
                active
                  ? "bg-blue-600 text-white shadow-sm"
                  : "text-gray-700 hover:bg-gray-200"
              }
            `}
          >
            {tf}
          </button>
        );
      })}
    </div>
  );
}
