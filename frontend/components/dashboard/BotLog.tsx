"use client";

import { useEffect, useMemo, useState } from "react";

// ---- Types ----
type Provider = "binance" | "coinbase" | "coingecko";

// One rendered line in the log feed
type LogLine = {
  ts: number;     // epoch seconds
  text: string;   // rendered content
  source: "backend" | "ticker";
};

// ---- Helpers ----
const fmtTime = (ts: number) =>
  new Date(ts * 1000).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });

const nowSec = () => Math.floor(Date.now() / 1000);

// Provider URL builders
function buildTickerUrl(provider: Provider): string {
  const p = provider;
  if (p === "binance") {
    const symbol = process.env.NEXT_PUBLIC_BTC_SYMBOL ?? "BTCEUR";
    return `https://api.binance.com/api/v3/ticker/price?symbol=${encodeURIComponent(symbol)}`;
  }
  if (p === "coinbase") {
    const pair = process.env.NEXT_PUBLIC_BTC_COINBASE_PAIR ?? "BTC-EUR";
    return `https://api.exchange.coinbase.com/products/${encodeURIComponent(pair)}/ticker`;
  }
  // coingecko
  const id = process.env.NEXT_PUBLIC_BTC_CG_ID ?? "bitcoin";
  const vs = process.env.NEXT_PUBLIC_BTC_CG_VS ?? "eur";
  return `https://api.coingecko.com/api/v3/simple/price?ids=${encodeURIComponent(id)}&vs_currencies=${encodeURIComponent(vs)}`;
}

// Parse provider response safely → numeric price
async function fetchTickerPrice(provider: Provider): Promise<number | null> {
  try {
    const url = buildTickerUrl(provider);
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) throw new Error(`${provider} ${res.status} ${res.statusText}`);
    const data = await res.json();

    if (provider === "binance") {
      // { symbol: "BTCEUR", price: "59850.12000000" }
      const price = Number(data?.price);
      return Number.isFinite(price) ? price : null;
    }

    if (provider === "coinbase") {
      // { price: "59850.12", bid: "...", ask: "..." }
      const price = Number(data?.price);
      return Number.isFinite(price) ? price : null;
    }

    // coingecko: { bitcoin: { eur: 59850.12 } }
    const id = process.env.NEXT_PUBLIC_BTC_CG_ID ?? "bitcoin";
    const vs = process.env.NEXT_PUBLIC_BTC_CG_VS ?? "eur";
    const price = Number(data?.[id]?.[vs]);
    return Number.isFinite(price) ? price : null;
  } catch (err) {
    console.error("Ticker fetch failed:", err);
    return null;
  }
}

// Normalize backend logs → array of strings
function normalizeBackendLogs(raw: unknown): string[] {
  if (Array.isArray(raw)) return raw.filter(x => typeof x === "string");
  // { logs: [...] }
  if (raw && typeof raw === "object" && Array.isArray((raw as any).logs)) {
    return (raw as any).logs.filter((x: any) => typeof x === "string");
  }
  if (typeof raw === "string") return [raw];
  return [];
}

// ---- Component ----
export default function BotLog() {
  const [lines, setLines] = useState<LogLine[]>([]);

  const provider: Provider = useMemo(() => {
    const v = (process.env.NEXT_PUBLIC_BTC_PROVIDER ?? "binance").toLowerCase();
    return (["binance", "coinbase", "coingecko"].includes(v) ? v : "binance") as Provider;
  }, []);

  // Poll backend logs
  useEffect(() => {
    let isMounted = true;

    async function fetchBackendLogs() {
      try {
        const res = await fetch("http://localhost:8000/paper/logs", { cache: "no-store" });
        const data = await res.json();
        const arr = normalizeBackendLogs(data);
        if (!isMounted) return;

        // Map to LogLine; assume backend messages already hold text
        const ts = nowSec();
        const newLines: LogLine[] = arr.map((t) => ({
          ts,            // If your backend includes per-line timestamps, parse & use that instead
          text: t,
          source: "backend",
        }));

        setLines((prev) => {
          // Merge but avoid duplicates (simple strategy)
          const merged = [...prev];
          for (const ln of newLines) {
            const dup = merged.find(m => m.source === "backend" && m.text === ln.text);
            if (!dup) merged.push(ln);
          }
          // Keep only latest ~500 lines
          return merged.slice(-500);
        });
      } catch (err) {
        console.error("Failed to fetch bot logs:", err);
      }
    }

    // initial + interval
    fetchBackendLogs();
    const id = setInterval(fetchBackendLogs, 5000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, []);

  // Poll ticker and append as feed line
  useEffect(() => {
    let isMounted = true;

    async function tick() {
      const price = await fetchTickerPrice(provider);
      if (!isMounted) return;

      if (price !== null) {
        const ts = nowSec();
        const providerLabel =
          provider === "binance"
            ? (process.env.NEXT_PUBLIC_BTC_SYMBOL ?? "BTCEUR")
            : provider === "coinbase"
            ? (process.env.NEXT_PUBLIC_BTC_COINBASE_PAIR ?? "BTC-EUR")
            : `${process.env.NEXT_PUBLIC_BTC_CG_ID ?? "bitcoin"}:${process.env.NEXT_PUBLIC_BTC_CG_VS ?? "eur"}`;

        const text = `[${providerLabel}] BTC Price: ${price.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;

        setLines((prev) => {
          const merged = [...prev, { ts, text, source: "ticker" as const }];
          return merged.slice(-500);
        });
      }
    }

    // initial + interval
    tick();
    const id = setInterval(tick, 5000);
    return () => {
      isMounted = false;
      clearInterval(id);
    };
  }, [provider]);

  // Sort newest first for display readability (or oldest first if you prefer)
  const sorted = useMemo(
    () => [...lines].sort((a, b) => b.ts - a.ts),
    [lines]
  );

  return (
    <div className="bg-[#161b22] p-5 rounded-lg border border-[#30363d] shadow-md text-gray-200">
      <h2 className="text-lg font-semibold mb-4 text-gray-100">
        Bot Log
      </h2>

      {sorted.length === 0 && (
        <p className="text-gray-500">No logs recorded yet.</p>
      )}

      <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
        {sorted.map((ln, idx) => (
          <div
            key={`${ln.ts}-${idx}-${ln.source}`}
            className={`bg-[#0d1117] p-3 rounded-lg border border-[#30363d] shadow-inner text-sm ${
              ln.source === "ticker" ? "text-gray-300" : "text-gray-200"
            }`}
          >
            <span className="text-gray-500 text-xs mr-2">[{fmtTime(ln.ts)}]</span>
            {ln.text}
            {ln.source === "ticker" && (
              <span className="ml-2 text-xs text-gray-500">(live)</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}