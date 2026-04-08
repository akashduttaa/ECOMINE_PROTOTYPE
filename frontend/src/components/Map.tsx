'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const MapContainer = dynamic(
  () => import('react-leaflet').then(mod => mod.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import('react-leaflet').then(mod => mod.TileLayer),
  { ssr: false }
);
const Marker = dynamic(
  () => import('react-leaflet').then(mod => mod.Marker),
  { ssr: false }
);
const Popup = dynamic(
  () => import('react-leaflet').then(mod => mod.Popup),
  { ssr: false }
);

interface DropZone {
  id: string;
  name: string;
  lat: number;
  lng: number;
}

const mockDropZones: DropZone[] = [
  { id: '1', name: 'Downtown Recycling Center', lat: 40.7128, lng: -74.0060 },
  { id: '2', name: 'Green Earth E-Waste', lat: 40.7300, lng: -73.9900 },
];

export default function Map() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <div className="h-64 bg-neutral-800 rounded-xl animate-pulse"></div>;
  }

  // Ensure leaflet CSS is loaded globally or here, usually better in layout or via head.
  return (
    <div className="rounded-xl overflow-hidden shadow-2xl h-[400px]">
      <MapContainer
        center={[40.7128, -74.0060]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {mockDropZones.map((zone) => (
          <Marker key={zone.id} position={[zone.lat, zone.lng]}>
            <Popup>{zone.name}</Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
