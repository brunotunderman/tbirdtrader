"use client";

import { ChartBarIcon } from "@heroicons/react/24/outline";

interface Props {
  title?: string;
  children: React.ReactNode;
}

export default function ChartCard({ title = "Price Chart", children }: Props) {
  return (
    <div
      className="
        bg-white 
        border border-gray-200 
        rounded-xl 
        shadow-sm 
        overflow-hidden
      "
    >
      {/* Header */}
      <div
        className="
          flex items-center justify-between 
          px-4 py-3 
          border-b border-gray-200 
          bg-gray-50
        "
      >
        <div className="flex items-center gap-2">
          <ChartBarIcon className="w-5 h-5 text-blue-600" />
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
