"use client";

import Image from "next/image";

export default function ContactPage() {
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
          Contact TbirdTrader
        </h1>

        <p className="text-[#8b949e] text-sm md:text-base leading-relaxed max-w-3xl">
          Whether you have questions, need support, or want to influence the future 
          of TbirdTrader, we’re here to help. Choose the option that fits your request.
        </p>

        {/* Contact Options */}
        <section className="space-y-8">

          {/* Request for Information */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-6 space-y-3">
            <h2 className="text-xl font-semibold">Request for Information</h2>
            <p className="text-[#8b949e] text-sm md:text-base">
              Have a question about features, roadmap, integrations, or how 
              TbirdTrader works? Reach out and we’ll provide the details you need.
            </p>
            <a
              href="mailto:info@tbirdtrader.com?subject=Request%20for%20Information"
              className="text-[#1e90ff] text-sm md:text-base hover:underline"
            >
              info@tbirdtrader.com
            </a>
          </div>

          {/* Support Ticket */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-6 space-y-3">
            <h2 className="text-xl font-semibold">Raise a Support Ticket</h2>
            <p className="text-[#8b949e] text-sm md:text-base">
              Encountered an issue, bug, or unexpected behavior? Submit a support 
              request so we can investigate and assist you.
            </p>
            <a
              href="mailto:support@tbirdtrader.com?subject=Support%20Ticket"
              className="text-[#1e90ff] text-sm md:text-base hover:underline"
            >
              support@tbirdtrader.com
            </a>
          </div>

          {/* Influence Request */}
          <div className="rounded-lg border border-[#30363d] bg-[#0d1117] p-6 space-y-3">
            <h2 className="text-xl font-semibold">Influence Request</h2>
            <p className="text-[#8b949e] text-sm md:text-base">
              Want to suggest a new feature, improvement, or integration? 
              Influence the future of TbirdTrader by sharing your ideas.
            </p>
            <a
              href="mailto:influence@tbirdtrader.com?subject=Influence%20Request"
              className="text-[#1e90ff] text-sm md:text-base hover:underline"
            >
              influence@tbirdtrader.com
            </a>
          </div>

        </section>

        

      </div>
    </main>
  );
}
