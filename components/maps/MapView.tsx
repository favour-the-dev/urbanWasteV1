"use client";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Circle,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Ensure marker icons load correctly in webpack/next
delete (L.Icon.Default.prototype as any)._getIconUrl;

// Create custom icons for different marker types
const createCustomIcon = (color: string) =>
  new L.Icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,%3csvg width='25' height='41' viewBox='0 0 25 41' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.5 0C5.59644 0 0 5.59644 0 12.5C0 19.5312 12.5 41 12.5 41C12.5 41 25 19.5312 25 12.5C25 5.59644 19.4036 0 12.5 0Z' fill='${color}'/%3e%3ccircle cx='12.5' cy='12.5' r='4' fill='white'/%3e%3c/svg%3e`,
    iconSize: [25, 41],
    iconAnchor: [12.5, 41],
    popupAnchor: [0, -41],
    shadowUrl: undefined,
  });

const nodeIcon = createCustomIcon("%2310b981"); // emerald-500
const routeIcon = createCustomIcon("%233b82f6"); // blue-500

// Fallback to default markers if custom icons fail
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    typeof window !== "undefined"
      ? require("leaflet/dist/images/marker-icon-2x.png")
      : undefined,
  iconUrl:
    typeof window !== "undefined"
      ? require("leaflet/dist/images/marker-icon.png")
      : undefined,
  shadowUrl:
    typeof window !== "undefined"
      ? require("leaflet/dist/images/marker-shadow.png")
      : undefined,
});

export default function MapView({
  nodes = [],
  path = [],
  height = 400,
}: {
  nodes?: Array<[number, number]>;
  path?: Array<[number, number]>;
  height?: number;
}) {
  const center: [number, number] = nodes.length ? nodes[0] : [4.7842, 7.0337]; // Port Harcourt coordinates

  const zoom = nodes.length > 1 ? 12 : 13;

  useEffect(() => {
    // Add any additional map initialization here
  }, []);

  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-sm">
      {/* Loading overlay for better UX */}
      {/* {nodes.length === 0 && (
        <div
          className="absolute inset-0 bg-gray-100 flex items-center justify-center z-[1000]"
          style={{ height }}
        >
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-emerald-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )} */}

      {/* Map Container */}
      <MapContainer
        {...({
          center,
          zoom,
          style: { height, width: "100%" },
          className: "z-0",
        } as any)}
      >
        {/* Tile Layer with modern styling */}
        <TileLayer
          {...({
            url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          } as any)}
        />

        {/* Node Markers */}
        {nodes.map((coord, i) => (
          <Marker
            key={`node-${i}`}
            {...({
              position: coord,
              icon: nodeIcon,
            } as any)}
          />
        ))}

        {/* Route Path */}
        {path.length > 1 && (
          <>
            {/* Route Line */}
            <Polyline
              {...({
                positions: path as any,
                pathOptions: {
                  color: "#3b82f6",
                  weight: 4,
                  opacity: 0.8,
                  lineCap: "round",
                  lineJoin: "round",
                },
              } as any)}
            />

            {/* Route Markers */}
            {path.map((coord, i) => (
              <Marker
                key={`path-${i}`}
                {...({
                  position: coord,
                  icon: routeIcon,
                } as any)}
              />
            ))}

            {/* Start and End Circles */}
            {path.length > 0 && (
              <>
                <Circle
                  {...({
                    center: path[0],
                    radius: 50,
                    pathOptions: {
                      color: "#10b981",
                      fillColor: "#10b981",
                      fillOpacity: 0.2,
                      weight: 2,
                    },
                  } as any)}
                />
                <Circle
                  {...({
                    center: path[path.length - 1],
                    radius: 50,
                    pathOptions: {
                      color: "#ef4444",
                      fillColor: "#ef4444",
                      fillOpacity: 0.2,
                      weight: 2,
                    },
                  } as any)}
                />
              </>
            )}
          </>
        )}
      </MapContainer>

      {/* Map Legend */}
      {(nodes.length > 0 || path.length > 0) && (
        <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-gray-200 z-[1000]">
          <div className="space-y-2 text-sm">
            {nodes.length > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-gray-700">
                  Collection Points ({nodes.length})
                </span>
              </div>
            )}
            {path.length > 1 && (
              <>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Route Path</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full border-2 border-white"></div>
                  <span className="text-gray-700">Start Point</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                  <span className="text-gray-700">End Point</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
