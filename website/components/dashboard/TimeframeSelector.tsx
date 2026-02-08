"use client";

type Timeframe = "1D" | "1W" | "1M" | "1Y";

interface Props {
  timeframe: Timeframe;
  onChange: (tf: Timeframe) => void;
}

export default function TimeframeSelector({ timeframe, onChange }: Props) {
  const options: Timeframe[] = ["1D", "1W", "1M", "1Y"];

  return (
    <div className="flex gap-2">
      {options.map((tf) => (
        <button
          key={tf}
          onClick={() => onChange(tf)}
          className={`px-3 py-1 rounded-md border ${
            timeframe === tf
              ? "bg-blue-600 border-blue-500 text-white"
              : "bg-[#0d1117] border-[#30363d] text-gray-300 hover:bg-[#161b22]"
          }`}
        >
          {tf}
        </button>
      ))}
    </div>
  );
}
