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
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50`}
      >
        {/* Global Header */}
        <header className="flex items-center px-6 py-0 shadow bg-white">
          <Image
            src="/brand/tbird-logo.png"
            alt="TbirdTrader Logo"
            width={135}
            height={44}
            priority
          />
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </body>
    </html>
  );
}

