"use client";

import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import L, { divIcon } from "leaflet";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";

function createDropPin() {
  return divIcon({
    className: "campusshare-picker-pin",
    html: `
      <svg width="62" height="76" viewBox="0 0 62 76" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="8" width="42" height="42" rx="16" fill="#D8F3DC" stroke="#2D6A4F" stroke-width="2.5"/>
        <path d="M31 67L21 48H41L31 67Z" fill="#D8F3DC" stroke="#2D6A4F" stroke-width="2.5" stroke-linejoin="round"/>
        <circle cx="31" cy="29" r="7" fill="#2D6A4F"/>
      </svg>
    `,
    iconSize: [62, 76],
    iconAnchor: [31, 67]
  });
}

function LocationEvents({
  onPick
}: {
  onPick: (next: { latitude: number; longitude: number }) => void;
}) {
  useMapEvents({
    click(event) {
      onPick({ latitude: event.latlng.lat, longitude: event.latlng.lng });
    }
  });

  return null;
}

function LocationViewportSync({
  value
}: {
  value: { latitude: number; longitude: number };
}) {
  const map = useMap();

  useEffect(() => {
    map.flyTo([value.latitude, value.longitude], map.getZoom(), { duration: 0.45 });
  }, [map, value.latitude, value.longitude]);

  return null;
}

export function LocationPickerMap({
  value,
  onChange
}: {
  value: { latitude: number; longitude: number };
  onChange: (next: { latitude: number; longitude: number }) => void;
}) {
  useEffect(() => {
    delete (L.Icon.Default.prototype as unknown as { _getIconUrl?: string })._getIconUrl;
  }, []);

  return (
    <MapContainer center={[value.latitude, value.longitude]} zoom={16} className="h-[320px] w-full rounded-[28px]" zoomControl={false}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      <LocationViewportSync value={value} />
      <LocationEvents onPick={onChange} />
      <Marker
        position={[value.latitude, value.longitude]}
        icon={createDropPin()}
        draggable
        eventHandlers={{
          dragend(event) {
            const marker = event.target;
            const latLng = marker.getLatLng();
            onChange({ latitude: latLng.lat, longitude: latLng.lng });
          }
        }}
      />
    </MapContainer>
  );
}
