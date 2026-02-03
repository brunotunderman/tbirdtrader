import { useState } from "react";
import { apiGet } from "../services/api";
import { endpoints } from "../services/endpoints";

export function useBacktest() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  async function run(symbol: string, start: string, end: string) {
    setLoading(true);

    const result = await apiGet(
      endpoints.backtest(symbol, start, end)
    );

    setData(result);
    setLoading(false);
  }

  return { run, data, loading };
}

