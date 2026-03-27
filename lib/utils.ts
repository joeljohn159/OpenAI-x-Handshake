import { clsx, type ClassValue } from "clsx";
import { addHours, addMinutes, endOfDay, formatDistanceToNowStrict, isBefore, parseISO } from "date-fns";
import { twMerge } from "tailwind-merge";

import type { CampusRegion, GeoPoint, Resource, ResourceCategory, TrustState } from "@/lib/types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const defaultCampus: CampusRegion = {
  name: "University of North Texas",
  shortName: "UNT",
  city: "Denton, TX",
  latitude: 33.2148,
  longitude: -97.1331,
  mode: "fallback"
};

export function createLocalCampusRegion(point: GeoPoint): CampusRegion {
  return {
    name: "CampusShare local demo",
    shortName: "Near you",
    city: "Current area",
    latitude: point.latitude,
    longitude: point.longitude,
    mode: "local"
  };
}

export function offsetPoint(point: GeoPoint, northMeters: number, eastMeters: number): GeoPoint {
  const latitudeDelta = northMeters / 111_320;
  const longitudeDelta = eastMeters / (111_320 * Math.cos((point.latitude * Math.PI) / 180));

  return {
    latitude: point.latitude + latitudeDelta,
    longitude: point.longitude + longitudeDelta
  };
}

export const categoryStyles: Record<
  ResourceCategory,
  { label: string; color: string; accent: string; border: string }
> = {
  food: {
    label: "Free food",
    color: "#2D6A4F",
    accent: "#D8F3DC",
    border: "rgba(45, 106, 79, 0.18)"
  },
  pantry: {
    label: "Food pantry",
    color: "#1E3A5F",
    accent: "rgba(30, 58, 95, 0.12)",
    border: "rgba(30, 58, 95, 0.2)"
  },
  supplies: {
    label: "Supplies",
    color: "#D4A843",
    accent: "rgba(212, 168, 67, 0.14)",
    border: "rgba(212, 168, 67, 0.24)"
  },
  event: {
    label: "Campus event",
    color: "#E76F51",
    accent: "rgba(231, 111, 81, 0.14)",
    border: "rgba(231, 111, 81, 0.24)"
  }
};

export function formatRelativeTime(value: string) {
  return formatDistanceToNowStrict(parseISO(value), { addSuffix: true });
}

export function formatCountdown(value: string) {
  const target = parseISO(value).getTime();
  const delta = target - Date.now();

  if (delta <= 0) {
    return "Expired";
  }

  const totalMinutes = Math.floor(delta / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 12) {
    return `${hours}h left`;
  }

  if (hours > 0) {
    return `${hours}h ${minutes}m left`;
  }

  return `${minutes}m left`;
}

export function isExpiringSoon(value: string) {
  const target = parseISO(value).getTime();
  return target - Date.now() < 30 * 60 * 1000;
}

export function distanceInMeters(
  latitudeA: number,
  longitudeA: number,
  latitudeB: number,
  longitudeB: number
) {
  const earthRadius = 6371000;
  const toRadians = (value: number) => (value * Math.PI) / 180;
  const latDelta = toRadians(latitudeB - latitudeA);
  const lonDelta = toRadians(longitudeB - longitudeA);
  const lat1 = toRadians(latitudeA);
  const lat2 = toRadians(latitudeB);

  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

export function formatDistanceLabel(meters: number) {
  if (meters < 160) {
    return `${Math.max(1, Math.round(meters / 10) * 10)} ft`;
  }

  if (meters < 1000) {
    return `${Math.round(meters)} m`;
  }

  const miles = meters / 1609.34;
  return `${miles.toFixed(1)} mi`;
}

export function getTrustState(resource: Pick<Resource, "still_available_count" | "gone_count">): TrustState {
  if (resource.gone_count >= 2) {
    return {
      tone: "gone",
      label: "Likely gone",
      description: "Multiple people reported this resource as unavailable."
    };
  }

  if (resource.still_available_count >= 3) {
    return {
      tone: "verified",
      label: `Verified by ${resource.still_available_count} people`,
      description: "Recent confirmations suggest this resource is still available."
    };
  }

  return {
    tone: "unverified",
    label: "Unverified",
    description: "This post is fresh and still waiting on more confirmations."
  };
}

export function isRecentlyVerified(lastConfirmation?: Resource["last_confirmation"] | null) {
  if (!lastConfirmation || lastConfirmation.status !== "available") {
    return false;
  }

  return Date.now() - parseISO(lastConfirmation.confirmed_at).getTime() <= 10 * 60 * 1000;
}

export function isResourceLive(resource: Pick<Resource, "expires_at" | "is_active">) {
  return resource.is_active && !isBefore(parseISO(resource.expires_at), new Date());
}

export function buildExpiryFromDuration(duration: "30m" | "1h" | "2h" | "eod" | "ongoing") {
  const now = new Date();

  switch (duration) {
    case "30m":
      return addMinutes(now, 30).toISOString();
    case "1h":
      return addHours(now, 1).toISOString();
    case "2h":
      return addHours(now, 2).toISOString();
    case "eod":
      return endOfDay(now).toISOString();
    case "ongoing":
    default:
      return addHours(now, 72).toISOString();
  }
}

export function initialsForName(username: string) {
  return username
    .split(/[\s._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}
