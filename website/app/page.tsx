"use client";

import Image from "next/image";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9]">

      {/* HEADER */}
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

          {/* Left */}
          <div className="flex-1 space-y-6">
            <Image
              src="/tbird-logo.png"
              alt="TbirdTrader Logo"
              width={180}
              height={40}
              priority
            />

            <h1 className="text-3xl font-semibold leading-tight md:text-5xl">
              Trade Smarter <br />
              <span className="text-transparent bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] bg-clip-text">
                Automate with Confidence
              </span>
            </h1>

            <p className="max-w-xl text-sm text-[#8b949e] md:text-base">
              For an exchange trader, whether you are in Crypto, ETF's or more traditional assets,
              it's all about Buy Just After The Low and Sell Just After The High. Humans need sleep,
              food and fun — TbirdTrader does not. It monitors your assets 24/7 and executes Buy/Sell
              transactions automatically on platforms like Binance, Coinbase and Kraken.
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

          {/* Right: Screenshot */}
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
      
      {/* SEE IT IN ACTION */}
      <section className="border-b border-[#30363d] bg-[#0d1117]">
        <div className="mx-auto max-w-6xl px-6 py-16 md:py-20">

          <div className="mb-6">
            <h2 className="text-2xl font-semibold md:text-3xl">See it in action</h2>
            <p className="mt-2 text-sm text-[#8b949e] md:text-base">
              Experience the clarity of TbirdTrader’s visual engine with predictive overlays.
            </p>
          </div>

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
              extensible platform that grows with your strategies and risk thresholds.
            </p>

            <ul className="mt-4 space-y-2 text-sm text-[#c9d1d9]">
              <li>• Real‑time market data and multi‑exchange support</li>
              <li>• Strategy backtesting and performance analytics</li>
              <li>• Unlimited Paper Trading for basic accounts</li>
              <li>• Automated Trader Bot for premium accounts</li>
              <li>• Secure encrypted API keys for automation</li>
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
            TbirdTrader is evolving into a fully automated, risk‑aware trading platform.
          </p>

          <div className="mt-8 grid gap-6 md:grid-cols-4">

            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <p className="text-xs font-semibold text-[#26a69a]">Phase 1</p>
              <h3 className="mt-1 text-sm font-semibold">Paper Trading Engine</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Simulate strategies safely with real market data.
              </p>
            </div>

            <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-4">
              <p className="text-xs font-semibold text-[#c9d1d9]">Phase 2</p>
              <h3 className="mt-1 text-sm font-semibold">Strategy Execution Layer</h3>
              <p className="mt-2 text-xs text-[#8b949e]">
                Turn validated strategies into automated workflows.
              </p>
            </div>

            {/* Keep your remaining roadmap items unchanged */}
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
              Start building, testing, and automating your strategies with TbirdTrader.
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
              <Image
                src="/tbird-logo.png"
                alt="TbirdTrader Logo"
                width={180}
                height={40}
                priority
              />
              <p className="max-w-xs text-xs text-[#8b949e]">
                AI‑powered trading companion focused on clarity, safety, and automation.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 text-xs text-[#8b949e] md:grid-cols-4">
              <div />
              <div>
                <h4 className="mb-2 text-xs font-semibold text-[#c9d1d9]">Company</h4>
                <ul className="space-y-1">
                  <li><a href="/about" className="hover:text-white">About</a></li>
                  <li><a href="/roadmap" className="hover:text-white">Roadmap</a></li>
                  <li><a href="/whitepaper" className="hover:text-white">Whitepaper</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold text-[#c9d1d9]">Legal</h4>
                <ul className="space-y-1">
                  <li><a href="/disclaimer" className="hover:text-white">Risk Disclaimer</a></li>
                </ul>
              </div>

              <div>
                <h4 className="mb-2 text-xs font-semibold text-[#c9d1d9]">Connect</h4>
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
