import React from "react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-white text-black">
      <div className="animate-pulse">
        <div className="h-16 bg-gray-100" />
        <div className="max-w-screen-2xl mx-auto px-6 py-6 space-y-4">
          <div className="h-8 w-1/3 bg-gray-100 rounded" />
          <div className="grid grid-cols-3 gap-4 max-lg:grid-cols-2 max-sm:grid-cols-1">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-48 bg-gray-100 rounded" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
