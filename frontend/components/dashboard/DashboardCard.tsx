"use client";

interface Props {
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export default function DashboardCard({ title, icon, children }: Props) {
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
      {/* Header (optional) */}
      {title && (
        <div
          className="
            flex items-center gap-2
            px-4 py-3 
            border-b border-gray-200 
            bg-gray-50
          "
        >
          {icon && <div className="text-blue-600">{icon}</div>}
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
        </div>
      )}

      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
}
