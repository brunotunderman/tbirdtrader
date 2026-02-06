"use client";

import Image from "next/image";

export default function WhitepaperPage() {
  return (
    <main className="min-h-screen bg-[#1a1f27] text-[#c9d1d9]">

      {/* PRINT + FIORI HEADING STYLES */}
      <style jsx global>{`
        .fiori-heading {
          position: relative;
          padding-left: 20px;
        }

        .fiori-heading::before {
          content: "";
          position: absolute;
          left: 0;
          top: 6px;
          width: 4px;
          height: 36px;
          border-radius: 2px;
          background: #0A6ED1;
        }

        @media print {
          body, main, section, footer {
            background: #1a1f27 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          header {
            display: none !important;
          }

          section.hero {
            page-break-after: always !important;
            padding: 60px 20px !important;
          }

          .page-2-block {
            page-break-after: always !important;
          }

          .page-3-block {
            page-break-after: always !important;
          }

          .page-4-block {
            page-break-inside: avoid !important;
            page-break-after: always !important;
          }

          .closing-page {
            display: flex !important;
            flex-direction: column !important;
            height: 100vh !important;
            justify-content: flex-end !important;
            page-break-before: always !important;
          }

          section.cta-section {
            background: #1e90ff !important;
            padding-top: 40px !important;
            padding-bottom: 40px !important;
          }

          p, li {
            color: #8b949e !important;
            font-size: 14px !important;
            line-height: 1.6 !important;
          }

          .cta-section p {
            color: #ffffff !important;
          }

          h1, h2, h3 {
            color: #ffffff !important;
          }

          img {
            max-width: 100% !important;
            height: auto !important;
          }

          footer {
            background: #1a1f27 !important;
            padding-top: 20px !important;
          }
        }
      `}</style>

      {/* HEADER WITH HOME + DOWNLOAD */}
      <header className="flex items-center justify-end gap-4 px-6 py-4 border-b border-[#30363d] bg-[#1a1f27]">

        {/* HOME BUTTON — same style as About/Roadmap */}
        <a
          href="/"
          className="rounded-md bg-[#0d1117] px-5 py-2 text-sm font-semibold text-white border border-[#30363d] hover:bg-[#161b22] transition"
        >
          Home
        </a>

        {/* DOWNLOAD WHITEPAPER */}
        <a
          href="/TbirdTrade Whitepaper Feb_26.pdf"
          download
          className="rounded-md bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] px-5 py-2 text-sm font-semibold text-white shadow-md shadow-[#1e90ff55] hover:opacity-90 transition"
        >
          Download Whitepaper
        </a>

      </header>

      {/* PAGE 1 — HERO */}
      <section className="hero relative overflow-hidden border-b border-[#30363d] bg-[#1a1f27]">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-12 px-6 py-24 md:flex-row md:py-32">

          <div className="flex-1 space-y-6">
            <Image
              src="/tbird-logo.png"
              alt="TbirdTrader Logo"
              width={180}
              height={40}
              priority
            />

            <h1 className="text-4xl font-semibold leading-tight md:text-6xl">
              Trade Smarter <br />
              <span className="text-transparent bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] bg-clip-text">
                Automate with Confidence
              </span>
            </h1>

            <p className="max-w-xl text-sm text-[#8b949e] md:text-base">
              AI‑powered trading tools designed for clarity, speed, and precision.
              Built for traders who demand control, transparency, and reliability.
            </p>
          </div>

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

      {/* PAGE 2 — INTRO + PROBLEM + APPROACH */}
      <section className="page-2-block max-w-6xl mx-auto px-6 py-20">

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">Introduction</h2>
        <p className="text-[#8b949e]">
          The cryptocurrency market has matured rapidly, but the rise of AI‑themed scams has created an
          environment where traders struggle to distinguish legitimate tools from fraudulent schemes.
          Countless platforms promise unrealistic returns, hide their technology behind vague claims, or
          disappear with user funds. This erosion of trust harms the entire ecosystem.
          <br /><br />
          TbirdTrader was created in direct response to this problem. Our mission is to provide a transparent,
          secure, and technically sound AI trading assistant that empowers users without ever taking custody
          of their assets or making deceptive promises.
        </p>

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">The Problem: Noise, Scams, and Misinformation</h2>
        <p className="text-[#8b949e]">
          Crypto traders face a unique challenge: the market is fast‑moving, highly volatile, and saturated with
          misinformation. Many AI trading bots exploit this environment by guaranteeing impossible returns,
          obscuring how predictions are generated, requesting full access to user funds, using fabricated
          backtests, or operating anonymously with no accountability.
        </p>

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">TbirdTrader’s Approach</h2>
        <p className="text-[#8b949e]">
          TbirdTrader is not a magic money machine. It is a sophisticated decision‑support system that helps
          traders interpret market conditions, identify opportunities, and manage risk more effectively.
          <br /><br />
          <strong>Transparency</strong> — We clearly explain what our models do and do not do.
          <br />
          <strong>Security</strong> — User data and API keys are protected using modern encryption.
          <br />
          <strong>Control</strong> — Users remain in full control of their trading accounts.
        </p>

      </section>

      {/* PAGE 3 — PREDICTION + SECURITY */}
      <section className="page-3-block max-w-6xl mx-auto px-6 py-20">

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">Prediction Architecture</h2>
        <p className="text-[#8b949e]">
          TbirdTrader’s predictive engine is built on a hybrid ensemble of machine‑learning models. While we
          do not disclose proprietary weights or training methods, we provide a transparent overview of the
          system’s structure.
          <br /><br />
          <strong>4.1 Pattern Recognition Models</strong> — Identify recurring structures such as breakouts and momentum shifts.
          <br />
          <strong>4.2 Volatility‑Adaptive Models</strong> — Adjust sensitivity based on real‑time volatility regimes.
          <br />
          <strong>4.3 Statistical Momentum & Reversion Layers</strong> — Detect short‑term directional bias and mean‑reversion tendencies.
          <br />
          <strong>4.4 Ensemble Aggregation</strong> — Combine multiple predictions using weighted voting.
          <br />
          <strong>4.5 Confidence Scoring</strong> — Each signal includes a confidence score based on model agreement and volatility context.
        </p>

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">Security & Encryption</h2>
        <p className="text-[#8b949e]">
          Security is foundational to TbirdTrader. Because we never take custody of user funds, our primary
          responsibility is protecting user credentials, API keys, and personal data.
          <br /><br />
          <strong>5.1 Authentication</strong> — Argon2id for password hashing.
          <br />
          <strong>5.2 Transport Encryption</strong> — TLS 1.3 for secure communication.
          <br />
          <strong>5.3 Session Management</strong> — Encrypted JWTs with short‑lived tokens.
          <br />
          <strong>5.4 API Key Protection</strong> — Keys encrypted at rest, never stored in plaintext.
          <br />
          <strong>5.5 Infrastructure Security</strong> — Zero‑trust architecture and strict service isolation.
          <br />
          <strong>5.6 Compliance Alignment</strong> — Practices aligned with OWASP, NIST, and ISO27001.
          <br />
          <strong>5.7 Exchange Integrations</strong> — Non‑custodial, trade‑only API permissions ensure user sovereignty.
        </p>

      </section>

      {/* PAGE 4 — PLATFORM FEATURES + ROADMAP + CONCLUSION */}
      <section className="page-4-block max-w-6xl mx-auto px-6 py-20">

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">Platform Features</h2>
        <p className="text-[#8b949e]">
          TbirdTrader provides:
          <br />
          Real‑time AI‑driven market predictions  
          Risk‑adjusted trade signals  
          Volatility alerts  
          Portfolio insights  
          Clean, intuitive interface  
          Non‑custodial architecture  
          No hidden fees or misleading claims  
        </p>

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">Roadmap</h2>
        <p className="text-[#8b949e]">
          Upcoming milestones:
          <br />
          Expanded asset coverage  
          Advanced portfolio analytics  
          User‑defined strategy layers  
          Mobile application  
          API access for algorithmic traders  
        </p>

        <h2 className="fiori-heading text-3xl font-semibold mb-6 mt-16">Conclusion</h2>
        <p className="text-[#8b949e]">
          TbirdTrader exists to bring trust back to AI‑assisted crypto trading. By combining transparent
          communication, robust machine‑learning models, and industry‑standard security, we offer a platform
          that empowers traders without compromising their autonomy or safety.
          <br /><br />
          We do not promise guaranteed returns.  
          We do not take custody of funds.  
          We do not hide behind marketing language.  
          <br /><br />
          Instead, we provide a reliable, secure, and honest tool for traders who want to navigate the crypto
          markets with intelligence and confidence.
        </p>

      </section>

      {/* PAGE 5 — CTA + FOOTER */}
      <div className="closing-page">

        <section className="cta-section border-t border-[#30363d] bg-[#1e90ff]">
          <div className="mx-auto max-w-6xl px-6 py-20 text-center">

            <h2 className="text-3xl font-semibold text-white">
              Ready to trade with confidence?
            </h2>

            <p className="mt-4 text-base text-white">
              Start building, testing, and automating your strategies with TbirdTrader.
            </p>

          </div>
        </section>

        <footer className="bg-[#1a1f27] border-t border-[#30363d]">
          <div className="mx-auto max-w-6xl px-6 py-10">
            <Image
              src="/tbird-logo.png"
              alt="TbirdTrader Logo"
              width={160}
              height={40}
              priority
            />
            <div className="mt-8 border-t border-[#30363d] pt-4 text-xs text-[#6e7681]">
              © {new Date().getFullYear()} TbirdTrader. All rights reserved.
            </div>
          </div>
        </footer>

      </div>

    </main>
  );
}
