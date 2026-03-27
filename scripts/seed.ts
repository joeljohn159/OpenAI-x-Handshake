import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

import { createClient } from "@supabase/supabase-js";

import { createSampleResources, sampleProfiles } from "../lib/mock-data";

function loadEnvFile(filename: string) {
  const path = join(process.cwd(), filename);

  if (!existsSync(path)) {
    return;
  }

  const content = readFileSync(path, "utf8");

  content
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#") && line.includes("="))
    .forEach((line) => {
      const [key, ...rest] = line.split("=");
      if (!process.env[key]) {
        process.env[key] = rest.join("=").trim();
      }
    });
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceRoleKey) {
  throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Add them before running the seed script.");
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const seedUsers = [
  { username: "alex_nguyen", email: "alex@campusshare.dev", campus: "UNT" },
  { username: "maria_sol", email: "maria@campusshare.dev", campus: "UNT" },
  { username: "isaac_cho", email: "isaac@campusshare.dev", campus: "UNT" },
  { username: "jada_mills", email: "jada@campusshare.dev", campus: "UNT" },
  { username: "owen_park", email: "owen@campusshare.dev", campus: "UNT" },
  { username: "noah_t", email: "noah@campusshare.dev", campus: "UNT" }
];

async function ensureUser(email: string, username: string, campus: string) {
  const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers();

  if (listError) {
    throw listError;
  }

  const existing = existingUsers.users.find((user) => user.email === email);

  if (existing) {
    return existing.id;
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    email_confirm: true,
    password: "CampusShareDemo123!",
    user_metadata: {
      user_name: username
    }
  });

  if (error || !data.user) {
    throw error ?? new Error(`Failed to create user ${email}`);
  }

  await supabase.from("profiles").upsert({
    id: data.user.id,
    username,
    campus
  });

  return data.user.id;
}

async function main() {
  const userMap = new Map<string, string>();

  for (const [index, seedUser] of seedUsers.entries()) {
    const id = await ensureUser(seedUser.email, seedUser.username, seedUser.campus);
    const sampleProfile = sampleProfiles[index];

    await supabase.from("profiles").upsert({
      id,
      username: seedUser.username,
      campus: seedUser.campus,
      points: sampleProfile?.points ?? 0,
      posts_count: sampleProfile?.posts_count ?? 0,
      confirmations_count: sampleProfile?.confirmations_count ?? 0,
      trust_score: sampleProfile?.trust_score ?? 0
    });

    userMap.set(seedUser.username, id);
  }

  await supabase.from("resources").delete().eq("campus", "UNT");

  const resources = createSampleResources().map((resource) => ({
    user_id: userMap.get(resource.poster?.username ?? "") ?? null,
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
    campus: resource.campus,
    created_at: resource.created_at
  }));

  const { error } = await supabase.from("resources").insert(resources);

  if (error) {
    throw error;
  }

  console.log(`Seeded ${resources.length} resources around UNT.`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
