import { useState } from "react";

export function useModelRanking() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run(symbol: string) {
    setLoading(true);

    const res = await fetch(`http://localhost:8000/compare/rank?symbol=${symbol}`);
    const json = await res.json();

    setData(json);
    setLoading(false);
  }

  return { run, data, loading };
}
