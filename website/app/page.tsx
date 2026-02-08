"use client";

import Image from "next/image";
import LiveChart from "@/components/LiveChart";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">

      {/* HEADER WITH ONLY LOGIN BUTTON */}
      <header className="flex items-center justify-end px-6 py-4 border-b border-[#30363d] bg-[#0d1117]">
        <a
          href="/login"
          className="rounded-md bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#1e90ff55] hover:opacity-90 transition"
        >
          Login
        </a>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-[#30363d] bg-gradient-to-b from-[#0d1117] to-[#161b22]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-20 md:flex-row md:py-28">

          {/* Left: Text */}
          <div className="flex-1 space-y-6">
            <div className="flex items-center gap-3">
              <Image
                src="/tbird-logo.png"
                alt="TbirdTrader Logo"
                width={180}
                height={40}
                priority
              />
            </div>

            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              Trade Smarter <br />
              <span className="text-transparent bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] bg-clip-text">
                Automate with Confidence
              </span>
            </h1>

            <p className="max-w-xl text-sm text-[#8b949e] md:text-base">
              For an exchange trader, whether you are in Crypto, ETF's or more traditional assets, it's all about Buy Just After The Low and Sell Just After The High.
              The problem is that we humans need to sleep, eat, drink and have fun. And that is where the TbirdTrader comes in. TbirdTrader is an AI driven trade agent,
              a bot that is monitoring 24/7 your portfolio assets and automatically executes Buy and Sell transactions at your preferred platform such as Binance, Coinbase, Kraken, etc.
              
              Based on a prediction algorythm that includes RSI, fear and greed sentiment and volatility, backtested by historical data, TbirdTrader will trade at the right moment,
              securing your assets to automatically grow when it can, and holds or sells when it must. 
              TbirdTrader is all about next level digital trading designed for clarity, speed, and precision.
              From predictive insights to automated execution, built for traders who demand control and reliability.
            </p>

            <div className="flex flex-wrap gap-4">
              <a
                href="/signup"
                className="rounded-md bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] px-6 py-2 text-sm font-medium text-white shadow-lg shadow-[#1e90ff55] hover:opacity-90"
              >
                Ready to trade with confidence
              </a>
            </div>
          </div>

          {/* Right: PNG Chart Preview */}
          <div className="flex-1">
            <div className="relative mx-auto w-full max-w-md rounded-xl border border-[#30363d] bg-[#0d1117] p-4 shadow-[0_0_60px_rgba(30,144,255,0.35)]">
              <div className="mb-3 flex items-center justify-between text-xs text-[#8b949e]">
                <span>BTC / EUR</span>
                <span>AI Prediction Overlay</span>
              </div>

              <div className="rounded-md overflow-hidden border border-[#30363d] bg-[#0d1117]">
                <Image
                  src="/candlestick Tbirdtrader.png"
                  alt="Candlestick Chart Preview"
                  width={1200}
                  height={700}
                  className="w-full h-auto"
                  priority
                />
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-10 max-w-2xl">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Built for traders who demand more
            </h2>
            <p className="mt-3 text-sm text-[#8b949e] md:text-base">
              TbirdTrader combines AI‑driven algorithms, robust backtesting, and
              secure automation to turn market noise into actionable decisions.
              Buy & Sell transactions will be automatically executed by
              TbirdTrader at secure and trusted platforms such as Coinbase,
              Binance and Kraken.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#00b4ff]" />
              <h3 className="text-sm font-semibold">AI‑Driven Algorithms</h3>
              <p className="text-xs text-[#8b949e]">
                Harness advanced predictive models, including RSI‑based signaling
                and pattern recognition, to anticipate market movements before
                they unfold.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#00b4ff]" />
              <h3 className="text-sm font-semibold">Backtesting Engine</h3>
              <p className="text-xs text-[#8b949e]">
                Validate your strategies against historical data with precision.
                Optimize entries, exits, and risk parameters using real market
                conditions.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#00b4ff]" />
              <h3 className="text-sm font-semibold">Automated Buy, Hold & Sell</h3>
              <p className="text-xs text-[#8b949e]">
                Turn insights into execution. Automatically trigger Buy, Hold,
                or Sell decisions based on your configured strategy logic and
                risk profile.
              </p>
            </div>

            <div className="flex flex-col gap-3 rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <div className="h-1 w-10 rounded-full bg-gradient-to-r from-[#1e90ff] to-[#00b4ff]" />
              <h3 className="text-sm font-semibold">Secure API Integration</h3>
              <p className="text-xs text-[#8b949e]">
                Trade confidently through trusted platforms like Coinbase,
                Binance, and Kraken using encrypted, permission‑controlled API
                connections.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SEE IT IN ACTION */}
      <section className="border-b border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-semibold md:text-3xl">
                See it in action
              </h2>
              <p className="mt-2 text-sm text-[#8b949e] md:text-base">
                Experience the clarity of TbirdTrader’s visual engine with
                real‑time candles and predictive overlays.
              </p>
            </div>
          </div>

          {/* LIVE CHART */}
         <div className="rounded-xl overflow-hidden border border-[#30363d] bg-[#161b22] p-4">
  <Image
    src="/prediction.png"
    alt="TbirdTrader Chart Preview"
    width={1600}
    height={900}
    className="w-full h-auto"
    priority
  />
</div>

        </div>
      </section>
      {/* FEATURE SHOWCASE */}
      <section className="border-b border-[#30363d] bg-[#161b22]">
        <div className="mx-auto max-w-6xl flex flex-col gap-10 px-6 py-16 md:py-20">

          <div className="space-y-4">
            <h2 className="text-2xl font-semibold md:text-3xl">
              Designed for real automated trading
            </h2>
            <p className="text-sm text-[#8b949e] md:text-base">
              From market data to execution, TbirdTrader is built as a modular,
              extensible platform that grows with your strategies and risk
              mitigation thresholds.
            </p>
            <ul className="mt-4 space-y-2 text-sm text-[#c9d1d9]">
              <li>• Real‑time market data and multi‑exchange support</li>
              <li>• Strategy backtesting and performance analytics</li>
              <li>• Basic User Account gives unlimited Paper trading engine</li>
              <li>• Premium User Account gives access to the automated Trader bot</li>
              <li>• API keys for Buy & Sell automation are secure and encrypted</li>
              <li>• Portfolio and risk management tooling</li>
            </ul>
          </div>

          <div className="rounded-xl overflow-hidden border border-[#30363d] bg-[#0d1117]">
            <Image
              src="/Traderbot2.png"
              alt="TbirdTrader Bot Interface"
              width={1600}
              height={1200}
              className="w-full h-auto"
              priority
            />
          </div>

        </div>
      </section>

      {/* ROADMAP */}
      <section className="border-b border-[#30363d] bg-[#1b222c]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">
          <h2 className="text-2xl font-semibold md:text-3xl">
            Roadmap: from insight to full automation
          </h2>
          <p className="mt-2 text-sm text-[#8b949e] md:text-base">
            TbirdTrader is evolving into a fully automated, risk‑aware trading
            platform. Here’s where we’re headed.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-4">
            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <p className="text-xs font-semibold text-[#26a69a]">Phase 1</p>
              <h3 className="mt-1 text-sm font-semibold">Paper Trading Engine</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Simulate strategies safely with real market data and full
                visibility into performance.
              </p>
            </div>

            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <p className="text-xs font-semibold text-[#c9d1d9]">Phase 2</p>
              <h3 className="mt-1 text-sm font-semibold">Strategy Execution Layer</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Turn validated strategies into automated workflows with
                configurable rules and safeguards.
              </p>
            </div>

            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <p className="text-xs font-semibold text-[#c9d1d9]">Phase 3</p>
              <h3 className="mt-1 text-sm font-semibold">Marketplace & Plugins</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Extend TbirdTrader with community strategies, indicators, and
                integrations.
              </p>
            </div>

            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <p className="text-xs font-semibold text-[#c9d1d9]">Phase 4</p>
              <h3 className="mt-1 text-sm font-semibold">Automated Live Trading</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Execute live trades with confidence using hardened, risk‑aware
                automation pipelines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-b border-[#30363d] bg-gradient-to-r from-[#1e90ff] to-[#00b4ff]">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-12 text-center md:flex-row md:text-left">
          <div>
            <h2 className="text-xl font-semibold text-white md:text-2xl">
              Ready to trade with confidence?
            </h2>
            <p className="mt-2 text-sm text-[#e5f2ff] md:text-base">
              Start building, testing, and automating your strategies with
              TbirdTrader.
            </p>
          </div>
          <a
            href="/signup"
            className="rounded-md bg-[#0d1117] px-6 py-2 text-sm font-medium text-white hover:bg-[#161b22]"
          >
            Get Started
          </a>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0d1117]">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="flex flex-col gap-8 md:flex-row md:justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image
                  src="/tbird-logo.png"
                  alt="TbirdTrader Logo"
                  width={180}
                  height={40}
                  priority
                />
              </div>
              <p className="max-w-xs text-xs text-[#8b949e]">
                AI‑powered trading companion focused on clarity, safety, and
                automation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs text-[#8b949e] md:grid-cols-4">
              <div />
              <div>
                <h4 className="mb-2 text-xs font-semibold text-[#c9d1d9]">
                  Company
                </h4>
                <ul className="space-y-1">
                  <li><a href="/about" className="hover:text-white">About</a></li>
                  <li><a href="/roadmap" className="hover:text-white">Roadmap</a></li>
                  <li><a href="/whitepaper" className="hover:text-white">Whitepaper</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold text-[#c9d1d9]">
                  Legal
                </h4>
                <ul className="space-y-1">
                  <li><a href="/disclaimer" className="hover:text-white">Risk Disclaimer</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold text-[#c9d1d9]">
                  Connect
                </h4>
                <ul className="space-y-1">
                  <li><a href="/contact" className="hover:text-white">Contact</a></li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-8 border-t border-[#161b22] pt-4 text-xs text-[#6e7681]">
            © {new Date().getFullYear()} TbirdTrader. All rights reserved.
          </div>
        </div>
      </footer>

    </main>
  );
}
