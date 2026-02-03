"use client";

export default function SignalPanel({ signal }) {
  const color =
    signal === "BUY"
      ? "bg-green-600"
      : signal === "SELL"
      ? "bg-red-600"
      : "bg-gray-600";

  return (
    <div className={`p-4 rounded text-white ${color} text-center text-xl font-bold`}>
      Signal: {signal}
    </div>
  );
}
