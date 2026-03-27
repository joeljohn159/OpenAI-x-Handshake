"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type Dispatch,
  type SetStateAction
} from "react";

import { createSampleLeaderboard, createSampleProfiles, createSampleResources } from "@/lib/mock-data";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import type {
  CampusRegion,
  ConfirmationStatus,
  GeoPoint,
  LeaderboardEntry,
  PostDraft,
  Profile,
  Resource,
  ResourceCategory,
  ResourceFilterState,
  WatchZone
} from "@/lib/types";
import {
  buildExpiryFromDuration,
  createLocalCampusRegion,
  defaultCampus,
  distanceInMeters,
  isResourceLive
} from "@/lib/utils";

interface CampusShareContextValue {
  resources: Resource[];
  recentExpired: Resource[];
  leaderboard: LeaderboardEntry[];
  currentUser: Profile | null;
  activeCampus: CampusRegion;
  viewerPosition: GeoPoint;
  isDemoData: boolean;
  syncViewerLocation: (next: GeoPoint) => void;
  selectedResourceId: string | null;
  setSelectedResourceId: Dispatch<SetStateAction<string | null>>;
  filters: ResourceFilterState;
  setFilters: Dispatch<SetStateAction<ResourceFilterState>>;
  watchZone: WatchZone;
  setWatchZone: Dispatch<SetStateAction<WatchZone>>;
  notificationPermission: NotificationPermission | "unsupported";
  requestNotificationPermission: () => Promise<void>;
  submitResource: (draft: PostDraft) => Promise<{ ok: boolean; message: string }>;
  confirmResource: (
    resourceId: string,
    status: ConfirmationStatus
  ) => Promise<{ ok: boolean; message: string; activeVote?: ConfirmationStatus | null }>;
  userVotes: Record<string, ConfirmationStatus>;
  signInWithEmail: (email: string) => Promise<{ ok: boolean; message: string }>;
  signInWithGoogle: () => Promise<{ ok: boolean; message: string }>;
  signInDemo: () => void;
  signOut: () => Promise<void>;
}

const CampusShareContext = createContext<CampusShareContextValue | null>(null);

const DEMO_USER_KEY = "campusshare-demo-user";
const DEMO_VOTES_KEY = "campusshare-demo-votes";
const WATCH_ZONE_KEY = "campusshare-watch-zone";

const defaultFilters: ResourceFilterState = {
  category: "all",
  maxDistance: 1600,
  availableNow: true
};

const defaultWatchZone: WatchZone = {
  id: "watch-zone-default",
  user_id: "guest",
  latitude: defaultCampus.latitude,
  longitude: defaultCampus.longitude,
  radius_meters: 700,
  categories: ["food", "pantry", "supplies", "event"],
  created_at: new Date().toISOString()
};

function isDemoProfile(profile: Profile | null) {
  return Boolean(profile?.id.startsWith("profile-"));
}

function toLeaderboardEntry(profile: Profile): LeaderboardEntry {
  const badges = [];

  if (profile.posts_count > 0) {
    badges.push("First Post");
  }

  if (profile.posts_count >= 10) {
    badges.push("Food Hero");
  }

  if (profile.confirmations_count >= 20) {
    badges.push("Reliable Reporter");
  }

  if (profile.trust_score >= 85) {
    badges.push("Trusted Poster");
  }

  return {
    id: profile.id,
    username: profile.username,
    campus: profile.campus,
    points: profile.points,
    posts_count: profile.posts_count,
    confirmations_count: profile.confirmations_count,
    trust_score: profile.trust_score,
    badges
  };
}

function updateLeaderboardEntry(
  leaderboard: LeaderboardEntry[],
  userId: string,
  updates: Partial<Pick<LeaderboardEntry, "points" | "posts_count" | "confirmations_count" | "trust_score">>
) {
  return leaderboard.map((entry) => {
    if (entry.id !== userId) {
      return entry;
    }

    const nextEntry = {
      ...entry,
      ...updates
    };

    return {
      ...nextEntry,
      badges: toLeaderboardEntry({
        id: nextEntry.id,
        username: nextEntry.username,
        avatar_url: null,
        points: nextEntry.points,
        posts_count: nextEntry.posts_count,
        confirmations_count: nextEntry.confirmations_count,
        trust_score: nextEntry.trust_score,
        campus: nextEntry.campus,
        created_at: new Date().toISOString()
      }).badges
    };
  });
}

export function CampusShareProvider({ children }: { children: React.ReactNode }) {
  const [resources, setResources] = useState<Resource[]>(() => createSampleResources());
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(() => createSampleLeaderboard());
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [activeCampus, setActiveCampus] = useState<CampusRegion>(defaultCampus);
  const [viewerPosition, setViewerPosition] = useState<GeoPoint>({
    latitude: defaultCampus.latitude,
    longitude: defaultCampus.longitude
  });
  const [isDemoData, setIsDemoData] = useState(true);
  const [selectedResourceId, setSelectedResourceId] = useState<string | null>(null);
  const [filters, setFilters] = useState<ResourceFilterState>(defaultFilters);
  const [watchZone, setWatchZone] = useState<WatchZone>(defaultWatchZone);
  const [userVotes, setUserVotes] = useState<Record<string, ConfirmationStatus>>({});
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission | "unsupported">(
    typeof window !== "undefined" && "Notification" in window ? Notification.permission : "unsupported"
  );
  const seenResourceIds = useRef<Set<string>>(new Set(resources.map((resource) => resource.id)));

  const syncViewerLocation = useCallback(
    (next: GeoPoint) => {
      setViewerPosition(next);
      setWatchZone((current) => ({
        ...current,
        latitude: next.latitude,
        longitude: next.longitude
      }));

      const nextCampus = createLocalCampusRegion(next);
      setActiveCampus(nextCampus);

      if (!isDemoData) {
        return;
      }

      setResources(createSampleResources({ center: next, campus: nextCampus }));
      setLeaderboard(createSampleLeaderboard(nextCampus.shortName));
      setCurrentUser((user) => {
        if (!user || !isDemoProfile(user)) {
          return user;
        }

        return {
          ...user,
          campus: nextCampus.shortName
        };
      });
    },
    [isDemoData]
  );

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const storedUser = window.localStorage.getItem(DEMO_USER_KEY);
    const storedVotes = window.localStorage.getItem(DEMO_VOTES_KEY);
    const storedZone = window.localStorage.getItem(WATCH_ZONE_KEY);

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }

    if (storedVotes) {
      setUserVotes(JSON.parse(storedVotes));
    }

    if (storedZone) {
      const parsedZone = JSON.parse(storedZone) as WatchZone;
      setWatchZone(parsedZone);
      setViewerPosition({
        latitude: parsedZone.latitude,
        longitude: parsedZone.longitude
      });

      if (
        parsedZone.latitude !== defaultCampus.latitude ||
        parsedZone.longitude !== defaultCampus.longitude
      ) {
        setActiveCampus(createLocalCampusRegion(parsedZone));
      }
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || !currentUser || !isDemoProfile(currentUser)) {
      return;
    }

    window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(DEMO_VOTES_KEY, JSON.stringify(userVotes));
  }, [userVotes]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(WATCH_ZONE_KEY, JSON.stringify(watchZone));
  }, [watchZone]);

  useEffect(() => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        syncViewerLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      () => undefined,
      { enableHighAccuracy: true, timeout: 6000 }
    );
  }, [syncViewerLocation]);

  useEffect(() => {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      return;
    }

    let isMounted = true;

    const load = async () => {
      const [{ data: resourcesData }, { data: profilesData }, { data: sessionData }] = await Promise.all([
        supabase.from("resources").select("*").order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").order("points", { ascending: false }).limit(10),
        supabase.auth.getSession()
      ]);

      if (!isMounted) {
        return;
      }

      const profileMap = new Map(
        (profilesData ?? []).map((profile) => [
          profile.id,
          {
            username: profile.username ?? "campus_friend",
            trust_score: profile.trust_score ?? 0,
            points: profile.points ?? 0
          }
        ])
      );

      if (resourcesData?.length) {
        setIsDemoData(false);
        setResources(
          resourcesData.map((resource) => ({
            ...resource,
            campus: resource.campus ?? defaultCampus.shortName,
            poster: profileMap.get(resource.user_id),
            last_confirmation: null
          }))
        );
      }

      if (profilesData?.length) {
        setLeaderboard(
          profilesData.map((profile) =>
            toLeaderboardEntry({
              id: profile.id,
              username: profile.username ?? "campus_friend",
              avatar_url: profile.avatar_url,
              points: profile.points ?? 0,
              posts_count: profile.posts_count ?? 0,
              confirmations_count: profile.confirmations_count ?? 0,
              trust_score: profile.trust_score ?? 0,
              campus: profile.campus ?? defaultCampus.shortName,
              created_at: profile.created_at
            })
          )
        );
      }

      const sessionUser = sessionData.session?.user;
      if (sessionUser) {
        const matchedProfile =
          profilesData?.find((profile) => profile.id === sessionUser.id) ??
          ({
            id: sessionUser.id,
            username: sessionUser.user_metadata?.user_name ?? sessionUser.email?.split("@")[0] ?? "campus_friend",
            avatar_url: sessionUser.user_metadata?.avatar_url ?? null,
            points: 0,
            posts_count: 0,
            confirmations_count: 0,
            trust_score: 0,
            campus: activeCampus.shortName,
            created_at: new Date().toISOString()
          } as Profile);

        setCurrentUser(matchedProfile as Profile);
      }
    };

    load().catch(() => undefined);

    const channel = supabase
      .channel("campusshare-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "resources" },
        (payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> }) => {
          const nextResource = payload.new as Partial<Resource>;
          const previousResource = payload.old as Partial<Resource>;

          if (payload.eventType === "INSERT" && nextResource.id) {
            const normalized = {
              ...(nextResource as Resource),
              campus: (nextResource.campus as string) ?? defaultCampus.shortName,
              poster: currentUser && currentUser.id === nextResource.user_id ? currentUser : undefined
            } as Resource;
            setResources((existing) =>
              existing.some((resource) => resource.id === normalized.id) ? existing : [normalized, ...existing]
            );
          }

          if (payload.eventType === "UPDATE" && nextResource.id) {
            setResources((existing) =>
              existing.map((resource) =>
                resource.id === nextResource.id
                  ? {
                      ...resource,
                      ...(nextResource as Resource),
                      campus: (nextResource.campus as string) ?? resource.campus
                    }
                  : resource
              )
            );
          }

          if (payload.eventType === "DELETE" && previousResource.id) {
            setResources((existing) => existing.filter((resource) => resource.id !== previousResource.id));
          }
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [activeCampus.shortName, currentUser]);

  useEffect(() => {
    if (notificationPermission !== "granted") {
      seenResourceIds.current = new Set(resources.map((resource) => resource.id));
      return;
    }

    const newResources = resources.filter((resource) => !seenResourceIds.current.has(resource.id));

    newResources.forEach((resource) => {
      const matchesCategory = watchZone.categories.includes(resource.category);
      const distance = distanceInMeters(
        watchZone.latitude,
        watchZone.longitude,
        resource.latitude,
        resource.longitude
      );

      if (!matchesCategory || distance > watchZone.radius_meters || !isResourceLive(resource)) {
        return;
      }

      if ("serviceWorker" in navigator) {
        navigator.serviceWorker.ready
          .then((registration) =>
            registration.showNotification("CampusShare alert", {
              body: `${resource.title} near ${resource.building_name ?? "campus"}`,
              icon: "/icons/icon.svg",
              badge: "/icons/icon.svg",
              data: { resourceId: resource.id }
            })
          )
          .catch(() => undefined);
      } else {
        new Notification("CampusShare alert", {
          body: `${resource.title} near ${resource.building_name ?? "campus"}`
        });
      }
    });

    seenResourceIds.current = new Set(resources.map((resource) => resource.id));
  }, [notificationPermission, resources, watchZone]);

  async function requestNotificationPermission() {
    if (typeof window === "undefined" || !("Notification" in window)) {
      setNotificationPermission("unsupported");
      return;
    }

    const permission = await Notification.requestPermission();
    setNotificationPermission(permission);
  }

  async function submitResource(draft: PostDraft) {
    if (!currentUser) {
      return { ok: false, message: "Log in to share a resource." };
    }

    const resource: Resource = {
      id: `resource-${Date.now()}`,
      user_id: currentUser.id,
      title: draft.title,
      description: draft.description,
      category: draft.category,
      latitude: draft.latitude,
      longitude: draft.longitude,
      building_name: draft.building_name,
      image_url: draft.image_url ?? null,
      expires_at: buildExpiryFromDuration(draft.duration),
      is_active: true,
      still_available_count: 0,
      gone_count: 0,
      created_at: new Date().toISOString(),
      campus: currentUser.campus,
      poster: {
        username: currentUser.username,
        trust_score: currentUser.trust_score,
        points: currentUser.points
      },
      last_confirmation: null
    };

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      const { data } = await supabase
        .from("resources")
        .insert({
          user_id: resource.user_id,
          title: resource.title,
          description: resource.description,
          category: resource.category,
          latitude: resource.latitude,
          longitude: resource.longitude,
          building_name: resource.building_name,
          image_url: resource.image_url,
          expires_at: resource.expires_at,
          is_active: resource.is_active,
          still_available_count: resource.still_available_count,
          gone_count: resource.gone_count,
          campus: resource.campus
        })
        .select()
        .single();

      if (data) {
        setResources((existing) => {
          if (existing.some((item) => item.id === data.id)) {
            return existing;
          }

          return [
            {
              ...resource,
              ...data,
              campus: data.campus ?? resource.campus
            },
            ...existing
          ];
        });
      }
    } else {
      setResources((existing) => [resource, ...existing]);
    }

    setCurrentUser((user) => {
      if (!user) {
        return user;
      }

      const nextUser = {
        ...user,
        points: user.points + 20,
        posts_count: user.posts_count + 1,
        trust_score: Math.min(100, user.trust_score + 2)
      };

      setLeaderboard((existing) =>
        updateLeaderboardEntry(existing, user.id, {
          points: nextUser.points,
          posts_count: nextUser.posts_count,
          trust_score: nextUser.trust_score
        })
      );

      return nextUser;
    });

    return {
      ok: true,
      message: "Resource posted. It is live on the map."
    };
  }

  async function confirmResource(resourceId: string, status: ConfirmationStatus) {
    if (!currentUser) {
      return { ok: false, message: "Log in to verify a post." };
    }

    const existingVote = userVotes[resourceId];
    const nextVote = existingVote === status ? null : status;

    setUserVotes((existing) => {
      const next = { ...existing };

      if (!nextVote) {
        delete next[resourceId];
      } else {
        next[resourceId] = nextVote;
      }

      return next;
    });

    setResources((existing) =>
      existing.map((resource) => {
        if (resource.id !== resourceId) {
          return resource;
        }

        let stillAvailableCount = resource.still_available_count;
        let goneCount = resource.gone_count;

        if (existingVote === "available") {
          stillAvailableCount -= 1;
        }

        if (existingVote === "gone") {
          goneCount -= 1;
        }

        if (nextVote === "available") {
          stillAvailableCount += 1;
        }

        if (nextVote === "gone") {
          goneCount += 1;
        }

        return {
          ...resource,
          still_available_count: Math.max(0, stillAvailableCount),
          gone_count: Math.max(0, goneCount),
          is_active: nextVote === "gone" && goneCount >= 2 ? false : resource.is_active,
          last_confirmation: nextVote
            ? {
                username: currentUser.username,
                confirmed_at: new Date().toISOString(),
                status: nextVote
              }
            : resource.last_confirmation
        };
      })
    );

    const supabase = getSupabaseBrowserClient();
    if (supabase) {
      if (!nextVote) {
        await supabase
          .from("confirmations")
          .delete()
          .eq("resource_id", resourceId)
          .eq("user_id", currentUser.id);
      } else {
        await supabase.from("confirmations").upsert(
          {
            resource_id: resourceId,
            user_id: currentUser.id,
            status: nextVote,
            confirmed_at: new Date().toISOString()
          },
          { onConflict: "resource_id,user_id" }
        );
      }
    }

    if (!existingVote && nextVote) {
      setCurrentUser((user) => {
        if (!user) {
          return user;
        }

        const nextUser = {
          ...user,
          points: user.points + 5,
          confirmations_count: user.confirmations_count + 1
        };

        setLeaderboard((existing) =>
          updateLeaderboardEntry(existing, user.id, {
            points: nextUser.points,
            confirmations_count: nextUser.confirmations_count
          })
        );

        return nextUser;
      });
    }

    return {
      ok: true,
      message: nextVote ? "Verification saved." : "Verification removed.",
      activeVote: nextVote
    };
  }

  async function signInWithEmail(email: string) {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      signInDemo();
      return { ok: true, message: `Demo session started for ${email}. Connect Supabase to enable magic links.` };
    }

    await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/map`
      }
    });

    return { ok: true, message: "Check your inbox for a magic link." };
  }

  async function signInWithGoogle() {
    const supabase = getSupabaseBrowserClient();

    if (!supabase) {
      signInDemo();
      return { ok: true, message: "Demo session started. Connect Supabase to enable Google OAuth." };
    }

    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/map`
      }
    });

    return { ok: true, message: "Redirecting to Google." };
  }

  function signInDemo() {
    const nextUser = createSampleProfiles(activeCampus.shortName)[0];
    setCurrentUser(nextUser);

    if (typeof window !== "undefined") {
      window.localStorage.setItem(DEMO_USER_KEY, JSON.stringify(nextUser));
    }
  }

  async function signOut() {
    const supabase = getSupabaseBrowserClient();

    if (supabase) {
      await supabase.auth.signOut();
    }

    setCurrentUser(null);
    setUserVotes({});

    if (typeof window !== "undefined") {
      window.localStorage.removeItem(DEMO_USER_KEY);
      window.localStorage.removeItem(DEMO_VOTES_KEY);
    }
  }

  const recentExpired = resources.filter((resource) => !isResourceLive(resource));

  return (
    <CampusShareContext.Provider
      value={{
        resources,
        recentExpired,
        leaderboard,
        currentUser,
        activeCampus,
        viewerPosition,
        isDemoData,
        syncViewerLocation,
        selectedResourceId,
        setSelectedResourceId,
        filters,
        setFilters,
        watchZone,
        setWatchZone,
        notificationPermission,
        requestNotificationPermission,
        submitResource,
        confirmResource,
        userVotes,
        signInWithEmail,
        signInWithGoogle,
        signInDemo,
        signOut
      }}
    >
      {children}
    </CampusShareContext.Provider>
  );
}

export function useCampusShare() {
  const context = useContext(CampusShareContext);

  if (!context) {
    throw new Error("useCampusShare must be used within CampusShareProvider");
  }

  return context;
}
