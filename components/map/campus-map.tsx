"use client";

import "leaflet/dist/leaflet.css";

import { useEffect } from "react";
import L, { divIcon, type DivIcon } from "leaflet";
import { Circle, CircleMarker, MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

import type { Resource, ResourceCategory, WatchZone } from "@/lib/types";
import { categoryStyles, defaultCampus } from "@/lib/utils";

function getCategoryPath(category: ResourceCategory) {
  switch (category) {
    case "food":
      return `
        <path d="M23 18v7M27 18v7M31 18v16" stroke="#FEFAE0" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M39 18v8.5C39 28.99 36.99 31 34.5 31H33v3.5" stroke="#FEFAE0" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>
      `;
    case "pantry":
      return `
        <path d="M21 21.5H43L43 37.5H21V21.5Z" stroke="#FEFAE0" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M21 26.5H43" stroke="#FEFAE0" stroke-width="2.4" stroke-linecap="round"/>
        <path d="M32 21.5V18.5" stroke="#FEFAE0" stroke-width="2.4" stroke-linecap="round"/>
      `;
    case "supplies":
      return `
        <path d="M22 21.5H38C40.7614 21.5 43 23.7386 43 26.5V39H27C24.2386 39 22 36.7614 22 34V21.5Z" stroke="#FEFAE0" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M43 21.5H47V39H43" stroke="#FEFAE0" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M27 27H36M27 31.5H36" stroke="#FEFAE0" stroke-width="2.4" stroke-linecap="round"/>
      `;
    case "event":
      return `
        <rect x="20.5" y="19.5" width="23" height="18" rx="4.5" stroke="#FEFAE0" stroke-width="2.4"/>
        <path d="M26.5 17V22M37.5 17V22M20.5 26H43.5M27.5 31H36.5" stroke="#FEFAE0" stroke-width="2.4" stroke-linecap="round"/>
      `;
    default:
      return "";
  }
}

function createMarkerIcon(category: ResourceCategory, active: boolean): DivIcon {
  const style = categoryStyles[category];

  return divIcon({
    className: "campusshare-marker",
    html: `
      <div style="transform: translateY(-6px) scale(${active ? 1.06 : 1}); transition: transform 220ms ease;">
        <svg width="64" height="74" viewBox="0 0 64 74" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g filter="url(#shadow)">
            <rect x="10" y="8" width="44" height="34" rx="14" fill="${style.color}" stroke="rgba(254,250,224,0.98)" stroke-width="${active ? 3 : 2.4}" />
            <path d="M32 61L21 42H43L32 61Z" fill="${style.color}" stroke="rgba(254,250,224,0.98)" stroke-width="${active ? 3 : 2.4}" stroke-linejoin="round"/>
            ${getCategoryPath(category)}
          </g>
          <defs>
            <filter id="shadow" x="0" y="0" width="64" height="74" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
              <feDropShadow dx="0" dy="8" stdDeviation="6" flood-color="rgba(33,38,33,0.24)"/>
            </filter>
          </defs>
        </svg>
      </div>
    `,
    iconSize: [64, 74],
    iconAnchor: [32, 62]
  });
}

function createClusterIcon(cluster: any) {
  const count = cluster.getChildCount();

  return divIcon({
    className: "campusshare-cluster",
    html: `
      <div style="
        width: 56px;
        height: 56px;
        border-radius: 999px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(45,106,79,0.92);
        border: 3px solid rgba(254,250,224,0.92);
        color: #FEFAE0;
        font-family: var(--font-dm-mono);
        font-size: 14px;
        box-shadow: 0 16px 30px rgba(33,38,33,0.22);
      ">
        ${count}
      </div>
    `,
    iconSize: [56, 56]
  });
}

function MapViewportSync({
  latitude,
  longitude,
  selectedResource
}: {
  latitude: number;
  longitude: number;
  selectedResource?: Resource | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (selectedResource) {
      map.flyTo([selectedResource.latitude, selectedResource.longitude], Math.max(map.getZoom(), 16), {
        duration: 0.7
      });
      return;
    }

    map.flyTo([latitude, longitude], map.getZoom(), { duration: 0.6 });
  }, [latitude, longitude, map, selectedResource]);

  return null;
}

export default function CampusMap({
  resources,
  selectedResourceId,
  onSelectResource,
  userPosition,
  watchZone
}: {
  resources: Resource[];
  selectedResourceId: string | null;
  onSelectResource: (resourceId: string) => void;
  userPosition: { latitude: number; longitude: number };
  watchZone: WatchZone;
}) {
  const selectedResource = resources.find((resource) => resource.id === selectedResourceId) ?? null;

  const center = [
    userPosition.latitude ?? defaultCampus.latitude,
    userPosition.longitude ?? defaultCampus.longitude
  ] as [number, number];

  return (
    <MapContainer
      center={center}
      zoom={16}
      className="h-full w-full"
      zoomControl={false}
      attributionControl={false}
      preferCanvas
    >
      <MapViewportSync
        latitude={userPosition.latitude}
        longitude={userPosition.longitude}
        selectedResource={selectedResource}
      />
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
        keepBuffer={4}
      />

      <Circle
        center={[watchZone.latitude, watchZone.longitude]}
        radius={watchZone.radius_meters}
        pathOptions={{ color: "#2D6A4F", fillColor: "#D8F3DC", fillOpacity: 0.12, weight: 1.4, dashArray: "6 8" }}
      />

      <Circle
        center={[userPosition.latitude, userPosition.longitude]}
        radius={42}
        pathOptions={{ color: "#2D6A4F", fillColor: "#2D6A4F", fillOpacity: 0.08, weight: 0 }}
      />
      <CircleMarker
        center={[userPosition.latitude, userPosition.longitude]}
        radius={9}
        pathOptions={{ color: "#FEFAE0", fillColor: "#2D6A4F", fillOpacity: 1, weight: 3 }}
      />

      <MarkerClusterGroup chunkedLoading iconCreateFunction={createClusterIcon}>
        {resources.map((resource) => (
          <Marker
            key={resource.id}
            position={[resource.latitude, resource.longitude]}
            icon={createMarkerIcon(resource.category, resource.id === selectedResourceId)}
            eventHandlers={{ click: () => onSelectResource(resource.id) }}
          />
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}
