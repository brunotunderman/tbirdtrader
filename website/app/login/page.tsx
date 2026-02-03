"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
      return;
    }

    router.push("/dashboard");
  }

  return (
    <main className="min-h-screen bg-[#0d1117] text-[#c9d1d9] flex items-center justify-center px-6">
      <div className="w-full max-w-md rounded-xl border border-[#30363d] bg-[#161b22] p-8 shadow-lg">
        
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

        <h1 className="text-2xl font-semibold text-center mb-6">
          Login to TbirdTrader
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:border-[#1e90ff]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              className="w-full rounded-md bg-[#0d1117] border border-[#30363d] px-3 py-2 text-sm focus:outline-none focus:border-[#1e90ff]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            className="w-full rounded-md bg-gradient-to-r from-[#1e90ff] to-[#00b4ff] py-2 text-sm font-semibold text-white hover:opacity-90"
          >
            Login
          </button>
        </form>

        <p className="text-xs text-center text-[#8b949e] mt-6">
          Don’t have an account? <span className="text-[#1e90ff]">Coming soon</span>
        </p>
      </div>
    </main>
  );
}
