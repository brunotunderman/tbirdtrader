import { NextRequest, NextResponse } from "next/server";

// Prefer environment variable; fallback for local dev
const BACKEND = process.env.BACKEND_BASE_URL ?? "http://localhost:8000";

// Map your UI timeframe to backend interval + limit
function getParams(tf: string) {
  switch (tf) {
    case "1D":
      return { interval: "5m", limit: 288 };   // ~24h @ 5m
    case "1W":
      return { interval: "15m", limit: 672 }; // finer resolution
    case "1M":
      return { interval: "4h", limit: 180 };   // ~30d @ 4h
    case "1Y":
      return { interval: "1d", limit: 365 };   // 365d @ 1d
    default:
      return { interval: "1h", limit: 200 };
  }
}

export async function GET(req: NextRequest) {
  try {
    const tf = req.nextUrl.searchParams.get("tf") || "1D";
    const { interval, limit } = getParams(tf);

    // Build backend URLs (paper candles + model predict)
    // NOTE: no HTML entities; use raw '&'
    const candlesUrl = `${BACKEND}/paper/candles?symbol=BTC-EUR&interval=${encodeURIComponent(
      interval
    )}&limit=${encodeURIComponent(String(limit))}`;

    const predictionUrl = `${BACKEND}/model/predict?symbol=BTC-EUR&model=baseline&interval=${encodeURIComponent(
      interval
    )}`;

    const [candlesRes, predictionRes] = await Promise.all([
      fetch(candlesUrl, { cache: "no-store" }),
      fetch(predictionUrl, { cache: "no-store" }),
    ]);

    // If backend responded with an error code, forward details
    if (!candlesRes.ok) {
      const text = await candlesRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Candles backend error", status: candlesRes.status, details: text },
        { status: 502 }
      );
    }
    if (!predictionRes.ok) {
      const text = await predictionRes.text().catch(() => "");
      return NextResponse.json(
        { error: "Prediction backend error", status: predictionRes.status, details: text },
        { status: 502 }
      );
    }

    const candlesPayload = await candlesRes.json();
    const predictionPayload = await predictionRes.json();

    // Normalize candles: accept either an array or { candles: [...] }
    const candles = Array.isArray(candlesPayload)
      ? candlesPayload
      : Array.isArray(candlesPayload?.candles)
      ? candlesPayload.candles
      : [];

    return NextResponse.json({
      candles,
      prediction: predictionPayload, // full object (predicted_prices, upper_band, lower_band)
      meta: { tf, interval, limit },
    });
  } catch (err: any) {
    return NextResponse.json(
      {
        error: "Backend unreachable",
        details: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}