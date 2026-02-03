"use client";

export default function SymbolSelector({ value, onChange }) {
  const symbols = [
    "BTC-EUR",
    "ETH-EUR",
    "ADA-EUR",
    "SOL-EUR",
    "XRP-EUR",
    "DOT-EUR",
  ];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="px-3 py-2 border rounded bg-white"
    >
      {symbols.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
