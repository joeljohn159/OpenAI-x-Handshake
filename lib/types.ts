export type ResourceCategory = "food" | "pantry" | "supplies" | "event";
export type ConfirmationStatus = "available" | "gone";
export type TrustTone = "verified" | "unverified" | "gone";

export interface GeoPoint {
  latitude: number;
  longitude: number;
}

export interface CampusRegion extends GeoPoint {
  name: string;
  shortName: string;
  city: string;
  mode: "fallback" | "local";
}

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string | null;
  points: number;
  posts_count: number;
  confirmations_count: number;
  trust_score: number;
  campus: string;
  created_at: string;
}

export interface Confirmation {
  id: string;
  resource_id: string;
  user_id: string;
  status: ConfirmationStatus;
  created_at: string;
  confirmed_at: string;
  user?: Pick<Profile, "username" | "avatar_url" | "trust_score">;
}

export interface Resource {
  id: string;
  user_id: string;
  title: string;
  description?: string | null;
  category: ResourceCategory;
  latitude: number;
  longitude: number;
  building_name?: string | null;
  image_url?: string | null;
  expires_at: string;
  is_active: boolean;
  still_available_count: number;
  gone_count: number;
  created_at: string;
  campus: string;
  poster?: Pick<Profile, "username" | "trust_score" | "points">;
  last_confirmation?: {
    username: string;
    confirmed_at: string;
    status: ConfirmationStatus;
  } | null;
}

export interface WatchZone {
  id: string;
  user_id: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  categories: ResourceCategory[];
  created_at: string;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  campus: string;
  points: number;
  posts_count: number;
  confirmations_count: number;
  trust_score: number;
  badges: string[];
}

export interface ResourceFilterState {
  category: ResourceCategory | "all";
  maxDistance: number;
  availableNow: boolean;
}

export interface TrustState {
  tone: TrustTone;
  label: string;
  description: string;
}

export interface PostDraft {
  category: ResourceCategory;
  title: string;
  description: string;
  building_name: string;
  latitude: number;
  longitude: number;
  duration: "30m" | "1h" | "2h" | "eod" | "ongoing";
  image_url?: string;
}
