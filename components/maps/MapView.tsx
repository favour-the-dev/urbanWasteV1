"use client";
import { MapContainer, TileLayer, Marker, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

// Ensure marker icons load correctly in webpack/next
delete (L.Icon.Default.prototype as any)._getIconUrl;
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
}: {
  nodes?: Array<[number, number]>;
  path?: Array<[number, number]>;
}) {
  const center: [number, number] = nodes.length ? nodes[0] : [4.7842, 7.0337]; // Port Harcourt approx

  useEffect(() => {}, []);

  return (
    <div className="rounded overflow-hidden">
      {/* cast MapContainer to any to avoid strict prop typing differences between leaflet/react-leaflet versions */}
      <MapContainer
        {...({
          center,
          zoom: 13,
          style: { height: 400, width: "100%" },
        } as any)}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        {nodes.map((c, i) => (
          <Marker key={i} position={c as any} />
        ))}
        {path.length > 1 && (
          <Polyline
            {...({
              positions: path as any,
              pathOptions: { color: "blue" },
            } as any)}
          />
        )}
      </MapContainer>
    </div>
  );
}
