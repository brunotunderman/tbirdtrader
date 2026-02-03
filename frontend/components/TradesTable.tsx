export default function TradesTable({ trades }) {
  return (
    <table className="mt-6 w-full border-collapse">
      <thead>
        <tr className="bg-gray-200">
          <th className="p-2 border">Time</th>
          <th className="p-2 border">Side</th>
          <th className="p-2 border">Price</th>
          <th className="p-2 border">Size</th>
          <th className="p-2 border">PnL</th>
        </tr>
      </thead>
      <tbody>
        {trades.map((t, i) => (
          <tr key={i} className="text-center">
            <td className="p-2 border">{t.time}</td>
            <td className="p-2 border">{t.side}</td>
            <td className="p-2 border">{t.price}</td>
            <td className="p-2 border">{t.size}</td>
            <td className="p-2 border">{t.pnl}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
