import DashboardSidebar from "@/components/DashboardSidebar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-[#0d1117] text-[#c9d1d9]">

      {/* SIDEBAR */}
      <DashboardSidebar />

      {/* MAIN AREA */}
      <div className="flex-1 flex flex-col">

        {/* TOP HEADER */}
        <header className="flex items-center px-6 py-4 border-b border-[#30363d] bg-[#161b22]">
          <div className="text-sm text-gray-300">
            Welcome back, Trader
          </div>
        </header>

        {/* DASHBOARD CONTENT */}
        <main className="p-6">
          {children}
        </main>

      </div>
    </div>
  );
}
