"use client";

import Image from "next/image";

export default function RoadmapPage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] px-6 py-16">
      <div className="mx-auto max-w-5xl space-y-12">

        {/* Logo */}
        <div className="flex items-center gap-3">
          <Image
            src="/tbird-logo.png"
            alt="TbirdTrader Logo"
            width={180}
            height={40}
            priority
          />
        </div>

        {/* Home Button */}
        <div className="mt-2">
          <a
            href="/"
            className="inline-block rounded-md border border-[#30363d] px-4 py-1 text-sm text-[#c9d1d9] hover:bg-[#161b22]"
          >
            ← Home
          </a>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-semibold md:text-4xl">
          TbirdTrader Roadmap
        </h1>

        <p className="text-[#8b949e] text-sm md:text-base leading-relaxed max-w-3xl">
          TbirdTrader is evolving into a fully automated, risk‑aware trading platform. 
          This roadmap outlines the major phases of development and the capabilities 
          we’re building to empower traders with clarity, precision, and trust.
        </p>

        {/* Roadmap Grid */}
        <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">

          {/* Phase 1 */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
            <p className="text-xs font-semibold text-[#26a69a]">Phase 1</p>
            <h3 className="text-sm font-semibold">Paper Trading Engine</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Simulate strategies safely with real market data and full visibility 
              into performance. Includes buy/sell logic, prediction overlays, and 
              risk‑aware execution.
            </p>
          </div>

          {/* Phase 2 */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
            <p className="text-xs font-semibold text-[#c9d1d9]">Phase 2</p>
            <h3 className="text-sm font-semibold">Strategy Execution Layer</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Turn validated strategies into automated workflows with configurable 
              rules, risk parameters, and execution safeguards.
            </p>
          </div>

          {/* Phase 3 */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
            <p className="text-xs font-semibold text-[#c9d1d9]">Phase 3</p>
            <h3 className="text-sm font-semibold">Marketplace & Plugins</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Extend TbirdTrader with community strategies, indicators, and 
              integrations. A modular ecosystem for advanced traders and developers.
            </p>
          </div>

          {/* Phase 4 */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-5 space-y-3">
            <p className="text-xs font-semibold text-[#c9d1d9]">Phase 4</p>
            <h3 className="text-sm font-semibold">Automated Live Trading</h3>
            <p className="text-xs text-[#8b949e] leading-relaxed">
              Execute live trades with confidence using hardened, risk‑aware 
              automation pipelines and secure exchange integrations.
            </p>
          </div>
        </section>

        {/* Future Vision */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Looking Ahead</h2>
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed max-w-3xl">
            The long‑term vision for TbirdTrader is a fully autonomous trading 
            companion that adapts to your strategies, learns from market behavior, 
            and provides transparent, data‑driven insights. Every phase builds 
            toward a platform that traders can trust with both experimentation 
            and execution.
          </p>
        </section>

      </div>
    </main>
  );
}
