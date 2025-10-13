"use client";
import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  loading: () => (
    <div
      className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-gray-100 flex items-center justify-center"
      style={{ height: 400 }}
    >
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-gray-600 text-sm">Loading map...</p>
      </div>
    </div>
  ),
  ssr: false,
});

export default MapView;
