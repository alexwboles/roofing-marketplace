import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";

export default function RoofMap({ leadId }) {
  const [geometry, setGeometry] = useState(null);

  useEffect(() => {
    async function fetchGeometry() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/roof-geometry/${leadId}`
        );
        const data = await res.json();
        if (data.geometry) {
          setGeometry(data.geometry);
        }
      } catch (err) {
        console.error("Failed to load roof geometry:", err);
      }
    }

    if (leadId) {
      fetchGeometry();
    }
  }, [leadId]);

  const defaultCenter = [29.9012, -81.3124];

  return (
    <div style={{ height: "400px", width: "100%", borderRadius: "12px", overflow: "hidden" }}>
      <MapContainer
        center={defaultCenter}
        zoom={17}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="© OpenStreetMap contributors"
        />

        {geometry && (
          <GeoJSON
            data={geometry}
            style={{
              color: "#ef4444",
              weight: 3,
              opacity: 0.9,
              fillOpacity: 0.25
            }}
            onEachFeature={(feature, layer) => {
              const bounds = layer.getBounds();
              layer._map.fitBounds(bounds, { padding: [20, 20] });
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
