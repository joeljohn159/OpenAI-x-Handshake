import { addMinutes, subMinutes } from "date-fns";

import type {
  CampusRegion,
  GeoPoint,
  LeaderboardEntry,
  Profile,
  Resource,
  ResourceCategory
} from "@/lib/types";
import { defaultCampus, offsetPoint } from "@/lib/utils";

const now = new Date();

interface ProfileBlueprint {
  id: string;
  username: string;
  points: number;
  posts_count: number;
  confirmations_count: number;
  trust_score: number;
  createdAgoMinutes: number;
}

interface LocationBlueprint {
  label: string;
  north: number;
  east: number;
}

interface ResourceBlueprint {
  title: string;
  description: string;
  category: ResourceCategory;
  locationIndex: number;
  image_url: string | null;
  expiresInMinutes: number;
  createdAgoMinutes: number;
  posterIndex: number;
  still_available_count: number;
  gone_count: number;
  is_active?: boolean;
  last_confirmation?: {
    username: string;
    confirmedAgoMinutes: number;
    status: "available" | "gone";
  } | null;
}

type LocationSuggestion = GeoPoint & { label: string };

const profileBlueprints: ProfileBlueprint[] = [
  { id: "profile-1", username: "alex_nguyen", points: 460, posts_count: 18, confirmations_count: 41, trust_score: 94, createdAgoMinutes: 240 * 60 },
  { id: "profile-2", username: "maria_sol", points: 390, posts_count: 14, confirmations_count: 36, trust_score: 91, createdAgoMinutes: 190 * 60 },
  { id: "profile-3", username: "isaac_cho", points: 328, posts_count: 11, confirmations_count: 34, trust_score: 88, createdAgoMinutes: 144 * 60 },
  { id: "profile-4", username: "jada_mills", points: 304, posts_count: 9, confirmations_count: 28, trust_score: 84, createdAgoMinutes: 112 * 60 },
  { id: "profile-5", username: "owen_park", points: 268, posts_count: 7, confirmations_count: 26, trust_score: 80, createdAgoMinutes: 86 * 60 },
  { id: "profile-6", username: "noah_t", points: 224, posts_count: 6, confirmations_count: 22, trust_score: 78, createdAgoMinutes: 72 * 60 }
];

const untLocationBlueprints: LocationBlueprint[] = [
  { label: "Union Courtyard", north: -455, east: -1275 },
  { label: "Willis Library", north: -520, east: 390 },
  { label: "Business Leadership Building", north: -380, east: -820 },
  { label: "Maple Hall", north: -135, east: 250 },
  { label: "ESSC", north: 70, east: -730 },
  { label: "Discovery Park Atrium", north: -230, east: 760 },
  { label: "Chestnut Hall", north: 380, east: 170 },
  { label: "Gateway Center", north: 160, east: -80 },
  { label: "Matthews Hall", north: -600, east: -420 },
  { label: "Art Annex", north: -330, east: 10 },
  { label: "Kerr Hall", north: 590, east: 430 },
  { label: "Rawlins Hall", north: 450, east: -260 }
];

const genericLocationBlueprints: LocationBlueprint[] = [
  { label: "Student union patio", north: -320, east: -360 },
  { label: "Main library commons", north: -180, east: 270 },
  { label: "Business hall lobby", north: -110, east: -180 },
  { label: "Residence hall pantry", north: 110, east: 200 },
  { label: "Academic success center", north: 210, east: -250 },
  { label: "Research atrium", north: -60, east: 520 },
  { label: "Wellness office fridge", north: 360, east: 150 },
  { label: "Student org hallway", north: 140, east: -40 },
  { label: "Advising center plaza", north: -460, east: -70 },
  { label: "Studio annex", north: 90, east: 35 },
  { label: "North quad lawn", north: 520, east: 310 },
  { label: "Peer support lounge", north: 430, east: -220 }
];

const untLeadingResources: ResourceBlueprint[] = [
  {
    title: "Free pizza from student senate meeting",
    description: "Six boxes still warm on the north side tables. Grab napkins before they disappear.",
    category: "food",
    locationIndex: 0,
    image_url: "/images/pizza-note.svg",
    expiresInMinutes: 28,
    createdAgoMinutes: 12,
    posterIndex: 0,
    still_available_count: 5,
    gone_count: 0,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 3, status: "available" }
  },
  {
    title: "UNT food pantry open with produce boxes",
    description: "Maple Hall pantry has canned goods, oatmeal, and a few fresh produce packs.",
    category: "pantry",
    locationIndex: 3,
    image_url: "/images/pantry-note.svg",
    expiresInMinutes: 7 * 60,
    createdAgoMinutes: 60,
    posterIndex: 1,
    still_available_count: 3,
    gone_count: 0,
    last_confirmation: { username: "owen_park", confirmedAgoMinutes: 7, status: "available" }
  },
  {
    title: "Organic chemistry textbook stack",
    description: "Three copies on the second floor commons shelf near the west windows.",
    category: "supplies",
    locationIndex: 1,
    image_url: "/images/book-note.svg",
    expiresInMinutes: 5 * 60,
    createdAgoMinutes: 120,
    posterIndex: 2,
    still_available_count: 2,
    gone_count: 0,
    last_confirmation: { username: "alex_nguyen", confirmedAgoMinutes: 11, status: "available" }
  },
  {
    title: "Career fair leftovers",
    description: "Sandwich trays and bottled water at the alumni side of the lobby. Event wraps at 3:30.",
    category: "event",
    locationIndex: 2,
    image_url: null,
    expiresInMinutes: 120,
    createdAgoMinutes: 25,
    posterIndex: 0,
    still_available_count: 4,
    gone_count: 0,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 6, status: "available" }
  }
];

const genericLeadingResources: ResourceBlueprint[] = [
  {
    title: "Free pizza after senate meeting",
    description: "Six boxes still warm on the side tables. Grab napkins before they disappear.",
    category: "food",
    locationIndex: 0,
    image_url: "/images/pizza-note.svg",
    expiresInMinutes: 28,
    createdAgoMinutes: 12,
    posterIndex: 0,
    still_available_count: 5,
    gone_count: 0,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 3, status: "available" }
  },
  {
    title: "Campus pantry open with produce boxes",
    description: "The shelf has canned goods, oatmeal, and a few fresh produce packs.",
    category: "pantry",
    locationIndex: 3,
    image_url: "/images/pantry-note.svg",
    expiresInMinutes: 7 * 60,
    createdAgoMinutes: 60,
    posterIndex: 1,
    still_available_count: 3,
    gone_count: 0,
    last_confirmation: { username: "owen_park", confirmedAgoMinutes: 7, status: "available" }
  },
  {
    title: "Organic chemistry textbook stack",
    description: "Three copies on the second floor commons shelf near the west windows.",
    category: "supplies",
    locationIndex: 1,
    image_url: "/images/book-note.svg",
    expiresInMinutes: 5 * 60,
    createdAgoMinutes: 120,
    posterIndex: 2,
    still_available_count: 2,
    gone_count: 0,
    last_confirmation: { username: "alex_nguyen", confirmedAgoMinutes: 11, status: "available" }
  },
  {
    title: "Career fair leftovers",
    description: "Sandwich trays and bottled water are still set out by the lobby doors.",
    category: "event",
    locationIndex: 2,
    image_url: null,
    expiresInMinutes: 120,
    createdAgoMinutes: 25,
    posterIndex: 0,
    still_available_count: 4,
    gone_count: 0,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 6, status: "available" }
  }
];

const sharedResources: ResourceBlueprint[] = [
  {
    title: "Late-night study break sandwiches",
    description: "A cooler with turkey and veggie wraps is sitting near the front desk.",
    category: "food",
    locationIndex: 4,
    image_url: null,
    expiresInMinutes: 74,
    createdAgoMinutes: 15,
    posterIndex: 2,
    still_available_count: 4,
    gone_count: 0,
    last_confirmation: { username: "owen_park", confirmedAgoMinutes: 5, status: "available" }
  },
  {
    title: "Open fridge pickup shelf",
    description: "Reusable meal shelf by the lobby fridge. Yogurt cups and fruit available through tonight.",
    category: "pantry",
    locationIndex: 6,
    image_url: "/images/pantry-note.svg",
    expiresInMinutes: 26 * 60,
    createdAgoMinutes: 240,
    posterIndex: 1,
    still_available_count: 4,
    gone_count: 0,
    last_confirmation: { username: "alex_nguyen", confirmedAgoMinutes: 8, status: "available" }
  },
  {
    title: "Free blue books and calculators",
    description: "Exam prep shelf has six calculators, blue books, and spare pencils.",
    category: "supplies",
    locationIndex: 5,
    image_url: "/images/book-note.svg",
    expiresInMinutes: 180,
    createdAgoMinutes: 35,
    posterIndex: 4,
    still_available_count: 2,
    gone_count: 0,
    last_confirmation: { username: "jada_mills", confirmedAgoMinutes: 14, status: "available" }
  },
  {
    title: "Club fair tote bags and notebooks",
    description: "Leftover merch table from the involvement fair. Mostly blank notebooks and canvas totes.",
    category: "supplies",
    locationIndex: 7,
    image_url: null,
    expiresInMinutes: 120,
    createdAgoMinutes: 40,
    posterIndex: 3,
    still_available_count: 1,
    gone_count: 0,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 18, status: "available" }
  },
  {
    title: "Breakfast tacos after advising event",
    description: "Two trays left by the east doors. Salsa is in the cooler bag underneath the table.",
    category: "event",
    locationIndex: 8,
    image_url: null,
    expiresInMinutes: 22,
    createdAgoMinutes: 5,
    posterIndex: 5,
    still_available_count: 2,
    gone_count: 0,
    last_confirmation: { username: "alex_nguyen", confirmedAgoMinutes: 2, status: "available" }
  },
  {
    title: "Free lab coats and goggles",
    description: "Donation rack outside the prep lab. Mixed sizes, mostly small and medium.",
    category: "supplies",
    locationIndex: 9,
    image_url: "/images/book-note.svg",
    expiresInMinutes: 6 * 60,
    createdAgoMinutes: 90,
    posterIndex: 4,
    still_available_count: 3,
    gone_count: 0,
    last_confirmation: { username: "isaac_cho", confirmedAgoMinutes: 9, status: "available" }
  },
  {
    title: "Faculty lunch leftovers",
    description: "Pasta trays and sparkling water are still outside the office suite. Please take a container too.",
    category: "food",
    locationIndex: 10,
    image_url: "/images/pizza-note.svg",
    expiresInMinutes: 18,
    createdAgoMinutes: 8,
    posterIndex: 3,
    still_available_count: 1,
    gone_count: 0,
    last_confirmation: { username: "noah_t", confirmedAgoMinutes: 4, status: "available" }
  },
  {
    title: "Winter coat swap table",
    description: "Student org set out jackets, gloves, and one unopened umbrella. Take what helps.",
    category: "supplies",
    locationIndex: 7,
    image_url: null,
    expiresInMinutes: 8 * 60,
    createdAgoMinutes: 180,
    posterIndex: 5,
    still_available_count: 2,
    gone_count: 0,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 13, status: "available" }
  },
  {
    title: "Pantry fridge restocked",
    description: "Milk, granola, fruit cups, and a shelf of canned soup were just restocked near the lounge.",
    category: "pantry",
    locationIndex: 3,
    image_url: "/images/pantry-note.svg",
    expiresInMinutes: 10 * 60,
    createdAgoMinutes: 70,
    posterIndex: 1,
    still_available_count: 3,
    gone_count: 0,
    last_confirmation: { username: "alex_nguyen", confirmedAgoMinutes: 16, status: "available" }
  },
  {
    title: "Student org snack table",
    description: "Cookies and fruit snacks are still near the check-in stand. The meeting wrapped a few minutes ago.",
    category: "food",
    locationIndex: 10,
    image_url: null,
    expiresInMinutes: -10,
    createdAgoMinutes: 54,
    posterIndex: 0,
    still_available_count: 1,
    gone_count: 2,
    is_active: false,
    last_confirmation: { username: "owen_park", confirmedAgoMinutes: 17, status: "gone" }
  },
  {
    title: "Resume clinic bagels and coffee",
    description: "Hot coffee and half a dozen bagels were left near the west doors after the employer panel.",
    category: "event",
    locationIndex: 4,
    image_url: null,
    expiresInMinutes: -24,
    createdAgoMinutes: 120,
    posterIndex: 2,
    still_available_count: 0,
    gone_count: 2,
    is_active: false,
    last_confirmation: { username: "jada_mills", confirmedAgoMinutes: 21, status: "gone" }
  },
  {
    title: "Open shelf notebooks and binders",
    description: "Shelving unit by the tutoring lab still has a few new binders and graph notebooks.",
    category: "supplies",
    locationIndex: 5,
    image_url: "/images/book-note.svg",
    expiresInMinutes: -65,
    createdAgoMinutes: 180,
    posterIndex: 4,
    still_available_count: 0,
    gone_count: 1,
    last_confirmation: { username: "maria_sol", confirmedAgoMinutes: 34, status: "gone" }
  },
  {
    title: "Mutual aid closet open tonight",
    description: "Toiletries, ramen, and hygiene kits are available through tonight in the peer support office.",
    category: "pantry",
    locationIndex: 11,
    image_url: "/images/pantry-note.svg",
    expiresInMinutes: 20 * 60,
    createdAgoMinutes: 360,
    posterIndex: 1,
    still_available_count: 5,
    gone_count: 0,
    last_confirmation: { username: "alex_nguyen", confirmedAgoMinutes: 10, status: "available" }
  },
  {
    title: "Free poster tubes outside studio",
    description: "Review wrapped and there are still a few clean poster tubes by the trash room.",
    category: "supplies",
    locationIndex: 9,
    image_url: null,
    expiresInMinutes: 90,
    createdAgoMinutes: 30,
    posterIndex: 3,
    still_available_count: 0,
    gone_count: 0,
    last_confirmation: null
  }
];

function buildBadges(profile: Pick<Profile, "posts_count" | "confirmations_count" | "trust_score">) {
  const badges = [];

  if (profile.posts_count > 0) badges.push("First Post");
  if (profile.posts_count >= 10) badges.push("Food Hero");
  if (profile.confirmations_count >= 20) badges.push("Reliable Reporter");
  if (profile.trust_score >= 85) badges.push("Trusted Poster");

  return badges;
}

function isDefaultRegion(region: CampusRegion) {
  return region.mode === "fallback" && region.shortName === defaultCampus.shortName;
}

export function createSampleProfiles(campus = defaultCampus.shortName): Profile[] {
  return profileBlueprints.map((profile) => ({
    id: profile.id,
    username: profile.username,
    avatar_url: null,
    points: profile.points,
    posts_count: profile.posts_count,
    confirmations_count: profile.confirmations_count,
    trust_score: profile.trust_score,
    campus,
    created_at: subMinutes(now, profile.createdAgoMinutes).toISOString()
  }));
}

export function createSampleLeaderboard(campus = defaultCampus.shortName): LeaderboardEntry[] {
  return createSampleProfiles(campus).slice(0, 5).map((profile) => ({
    id: profile.id,
    username: profile.username,
    campus: profile.campus,
    points: profile.points,
    posts_count: profile.posts_count,
    confirmations_count: profile.confirmations_count,
    trust_score: profile.trust_score,
    badges: buildBadges(profile)
  }));
}

export const sampleProfiles = createSampleProfiles();
export const sampleLeaderboard = createSampleLeaderboard();

export const landingStats = [
  {
    value: 37,
    suffix: "%",
    label: "of students face food insecurity while balancing class, rent, and transportation."
  },
  {
    value: 2100,
    suffix: "+",
    label: "in average annual food costs can shape whether a student can stay focused and enrolled."
  },
  {
    value: 1000,
    suffix: "+",
    label: "free meals, extra supplies, and event leftovers can go unclaimed across campus every week."
  }
];

export const testimonials = [
  {
    quote:
      "I found free lab goggles someone posted outside the Chemistry Building and picked them up before my afternoon lab started.",
    attribution: "Maria S., Biology, Junior"
  },
  {
    quote:
      "The verification system matters. If two people say it is gone, I do not waste time walking across campus hoping there is still pizza left.",
    attribution: "Noah T., Finance, Sophomore"
  },
  {
    quote:
      "I set a watch zone around Willis Library and got a notification for donated calc textbooks ten minutes before my study group.",
    attribution: "Ariana P., Mathematics, Senior"
  }
];

export function createDemoLocationSuggestions(
  center: GeoPoint = defaultCampus,
  region: CampusRegion = defaultCampus
): LocationSuggestion[] {
  const blueprints = isDefaultRegion(region) ? untLocationBlueprints : genericLocationBlueprints;

  return blueprints.map((location) => ({
    ...offsetPoint(center, location.north, location.east),
    label: location.label
  }));
}

export function createSampleResources({
  center = defaultCampus,
  campus = defaultCampus
}: {
  center?: GeoPoint;
  campus?: CampusRegion;
} = {}): Resource[] {
  const locations = createDemoLocationSuggestions(center, campus);
  const profiles = createSampleProfiles(campus.shortName);
  const resourceBlueprints = [...(isDefaultRegion(campus) ? untLeadingResources : genericLeadingResources), ...sharedResources];

  return resourceBlueprints.map((resource, index) => {
    const poster = profiles[resource.posterIndex];
    const location = locations[resource.locationIndex];

    return {
      id: `resource-${index + 1}`,
      user_id: poster.id,
      title: resource.title,
      description: resource.description,
      category: resource.category,
      latitude: location.latitude,
      longitude: location.longitude,
      building_name: location.label,
      image_url: resource.image_url,
      expires_at: addMinutes(now, resource.expiresInMinutes).toISOString(),
      is_active: resource.is_active ?? true,
      still_available_count: resource.still_available_count,
      gone_count: resource.gone_count,
      created_at: subMinutes(now, resource.createdAgoMinutes).toISOString(),
      campus: campus.shortName,
      poster: {
        username: poster.username,
        trust_score: poster.trust_score,
        points: poster.points
      },
      last_confirmation: resource.last_confirmation
        ? {
            username: resource.last_confirmation.username,
            confirmed_at: subMinutes(now, resource.last_confirmation.confirmedAgoMinutes).toISOString(),
            status: resource.last_confirmation.status
          }
        : null
    };
  });
}
