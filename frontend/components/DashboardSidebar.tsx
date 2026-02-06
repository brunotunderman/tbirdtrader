"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Trade", path: "/dashboard" },
  { name: "Bot Control", path: "/dashboard/bot" },
  { name: "History", path: "/dashboard/history" },
  { name: "Profile", path: "/dashboard/profile" },
  { name: "Settings", path: "/dashboard/settings" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();

  function handleLogout() {
    window.location.href = "/login";
  }

  return (
    <aside className="w-64 bg-[#161b22] border-r border-[#30363d] p-6">
      <h1 className="text-xl font-semibold mb-8">TbirdTrader</h1>

      <nav className="space-y-3">
        {navItems.map((item) => {
          const active = pathname === item.path;

          return (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-sm ${
                active
                  ? "bg-[#1e90ff] text-white"
                  : "text-[#8b949e] hover:bg-[#21262d]"
              }`}
            >
              {item.name}
            </Link>
          );
        })}

        {/* Logout button (rustige danger stijl) */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2 mt-4 rounded-md w-full
                     text-[#d26a5e] hover:text-[#e08b82]
                     hover:bg-[#21262d] transition text-sm"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6A2.25 2.25 0 005.25 5.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
            />
          </svg>
          Logout
        </button>
      </nav>
    </aside>
  );
}