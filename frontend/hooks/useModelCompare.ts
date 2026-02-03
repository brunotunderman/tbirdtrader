import { useState } from "react";

export function useModelCompare() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  async function run(symbol) {
    setLoading(true);

    const res = await fetch(
      `http://localhost:8000/compare?symbol=${symbol}`
    );

    const json = await res.json();
    setData(json);
    setLoading(false);
  }

  return { run, data, loading };
}
