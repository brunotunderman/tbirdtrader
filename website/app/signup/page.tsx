"use client";

import { useState } from "react";
import Image from "next/image";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Signup:", { email, password });
    // Later: echte signup API call
  };

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex items-center justify-center px-6">
      <div className="w-full max-w-md bg-[#161b22] border border-[#30363d] rounded-xl p-8 shadow-xl">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/tbird-logo.png"
            alt="TbirdTrader Logo"
            width={180}
            height={40}
            priority
          />
        </div>

        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create your TbirdTrader account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#1e90ff]"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] py-2 text-sm font-medium text-white shadow-lg shadow-[#1e90ff55] hover:opacity-90"
          >
            Create Account
          </button>
        </form>

        <p className="text-xs text-center text-[#8b949e] mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#1e90ff] hover:underline">
            Log in
          </a>
        </p>
      </div>
    </main>
  );
}
