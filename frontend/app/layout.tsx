import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TbirdTrader",
  description: "AI-powered crypto trading platform",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#0d1117] text-[#c9d1d9]`}
      >
        {/* Global Header */}
        <header className="flex items-center px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
          <Image
            src="/brand/logo_new.png"
            alt="TbirdTrader Logo"
            width={160}
            height={40}
            priority
          />
        </header>

        {/* Page Content */}
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}

