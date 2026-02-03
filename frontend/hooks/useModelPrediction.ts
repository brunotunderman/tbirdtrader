"use client";

import { useState } from "react";

export function useModelPrediction() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const run = async (symbol: string, model: string) => {
    setLoading(true);
    setData(null);

    const res = await fetch(
      `http://localhost:8000/model/predict?symbol=${symbol}&model=${model}`
    );

    const json = await res.json();
    setData(json);
    setLoading(false);
  };

  return { run, data, loading };
}
