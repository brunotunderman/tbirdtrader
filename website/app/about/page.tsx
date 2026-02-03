"use client";

import Image from "next/image";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] px-6 py-16">
      <div className="mx-auto max-w-4xl space-y-12">

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
          About TbirdTrader
        </h1>

        {/* Intro */}
        <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
          TbirdTrader is built for traders who want clarity, precision, and 
          automation without sacrificing control. Our mission is to turn 
          complex market data into actionable insights and provide a platform 
          that grows with your strategies.
        </p>

        {/* Founder Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-48 flex-shrink-0">
            <Image
              src="/bruno_new.jpg"
              alt="Bruno Tunderman"
              width={180}
              height={180}
              className="rounded-lg border border-[#30363d] object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Founder Story</h2>
            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              CEO and founder <span className="font-semibold text-[#c9d1d9]">Bruno Tunderman </span> 
              has decades of experience in IT dating back to the late ’80s. 
              With a long-standing career at SAP, he has always been dedicated 
              to helping customers innovate and drive their business forward 
              in the best way possible.
            </p>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              Motivated by the rise of trader scams and the need for genuine, 
              transparent solutions, Bruno developed TbirdTrader as a real-world 
              business case for AI‑driven improvement. His goal is to offer 
              innovative capabilities that are honest, practical, and 
              straightforward — empowering traders with tools they can trust.
            </p>
          </div>
        </section>

        {/* Vision */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Our Vision</h2>
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
            We believe trading tools should empower, not overwhelm. TbirdTrader 
            blends AI‑driven analytics with a clean, intuitive interface so you 
            can focus on making smart decisions — or automate them with confidence.
          </p>
        </section>

        {/* What We're Building */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">What We’re Building</h2>
          <ul className="list-disc pl-6 text-[#8b949e] text-sm md:text-base space-y-2">
            <li>Real‑time market insights with predictive overlays</li>
            <li>Backtesting tools that reveal strategy performance</li>
            <li>Paper trading for safe experimentation</li>
            <li>Automated execution with risk‑aware safeguards</li>
            <li>A modular platform that evolves with your workflow</li>
          </ul>
        </section>

        {/* Commitment */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold">Our Commitment</h2>
          <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
            Reliability, transparency, and user trust are at the core of 
            everything we build. Whether you're testing a new strategy or 
            preparing for full automation, TbirdTrader is designed to support 
            your journey every step of the way.
          </p>
        </section>

      </div>
    </main>
  );
}
