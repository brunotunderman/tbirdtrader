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

        {/* Founder Section — BRUNO */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-48 flex-shrink-0">
            <Image
              src="/bruno.png"
              alt="Bruno Tunderman"
              width={180}
              height={319}
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
              business case for AI‑driven trade automation. His goal is to offer 
              innovative capabilities that are honest, practical, and 
              straightforward — empowering traders with tools they can trust.
            </p>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              Bruno holds a NIMA‑C marketing degree, a Master of Arts in Marketing 
              Management with Birmingham City University in the United Kingdom, 
              and a Master in Philosophy with the Vrije Universiteit Amsterdam.
            </p>
          </div>
        </section>

        {/* COO Section — NIELS */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-48 flex-shrink-0">
            <Image
              src="/Niels.png"
              alt="Niels van Oostrum"
              width={180}
              height={319}
              className="rounded-lg border border-[#30363d] object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Chief Operating Officer</h2>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              <span className="font-semibold text-[#c9d1d9]">Niels van Oostrum </span> 
              grew up in an entrepreneurial family in Noordwijk, where he developed 
              a strong customer‑focused mindset from an early age while working in 
              the family hotel. He holds a Bachelor of Commerce from Hogeschool 
              Leiden and an MBA from Dublin Business School.
            </p>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              With over ten years of experience in commercial technology roles — 
              including six years at global software leader SAP — Niels has built 
              deep expertise in helping organizations use data, automation, and AI 
              to create smarter and more reliable digital solutions.
            </p>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              As Chief Operating Officer at TbirdTrader, Niels focuses on combining 
              innovation with trust and transparency. He ensures the platform delivers 
              secure, user‑friendly, and data‑driven trading experiences. By leveraging 
              AI and advanced technology, he helps position TbirdTrader as a reliable 
              partner for traders who want to navigate the crypto market with confidence.
            </p>
          </div>
        </section>

        {/* Thierry Section */}
        <section className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-full md:w-48 flex-shrink-0">
            <Image
              src="/thierry.png"
              alt="Thierry Tunderman"
              width={180}
              height={319}
              className="rounded-lg border border-[#30363d] object-cover"
            />
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Commercial Leadership</h2>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              <span className="font-semibold text-[#c9d1d9]">Thierry Tunderman </span> 
              combines a strong commercial mindset with a passion for technology 
              and building businesses around solutions that actually deliver value. 
              With experience working closely with clients, sales teams, and 
              technology-driven products, he focuses on translating complex 
              technology into clear, practical value that customers understand 
              and want to buy.
            </p>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              As Chief Revenue Officer, Thierry is responsible for driving global 
              sales strategy, revenue growth, and commercial partnerships — ensuring 
              advanced technology is positioned in a way that creates trust, market 
              traction, and sustainable revenue.
            </p>

            <p className="text-[#8b949e] text-sm md:text-base leading-relaxed">
              Driven by the rapid evolution of AI, automation, and digital finance, 
              Thierry plays a key role in bringing an AI‑driven crypto trading 
              solution to market. His focus is on connecting innovative technology 
              with real customer needs.
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
            your digital trading journey every step of the way.
          </p>
        </section>

      </div>
    </main>
  );
}
