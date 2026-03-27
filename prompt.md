# Codex Prompt — CampusShare: Free Food & Resource Finder

> Copy this entire prompt into Codex. It's structured to produce a full, deployable, competition-grade app.

---

## PROMPT START — PASTE EVERYTHING BELOW INTO CODEX

---

Build a full-stack web app called **"CampusShare"** — a real-time, crowdsourced platform where college students can discover and post free food, supplies, clothing, and resources on or near their campus. Think of it as a hyper-local "Too Good To Go" meets campus bulletin board, but free and community-powered.

This is for a competition (OpenAI x Handshake Codex Creator Challenge). The app needs to look and feel like a real startup product — polished, modern, and immediately impressive. It should NOT look like a hackathon project. Study the design quality of sites like waynav.quest and classmate.app for reference on polish level.

---

### TECH STACK

- **Frontend:** Next.js 14+ (App Router) with TypeScript
- **Styling:** Tailwind CSS + shadcn/ui components
- **Database:** Supabase (PostgreSQL + Auth + Realtime subscriptions)
- **Maps:** Leaflet.js with OpenStreetMap (free, no API key needed)
- **Hosting:** Ready to deploy on Vercel
- **NO paid AI APIs** — this app runs entirely without AI inference costs

---

### CORE FEATURES (must have all of these)

#### 1. Interactive Campus Map (the hero feature)
- Full-screen interactive map as the main view, centered on user's campus
- Color-coded pins for resource types (use custom SVG pin markers, NOT default Leaflet pins):
  - Moss green (#2D6A4F) = Free food available now
  - Deep blue (#1E3A5F) = Food pantry / permanent resource
  - Warm amber (#D4A843) = Free supplies, clothing, textbooks
  - Coral (#E76F51) = Event with free food (upcoming)
- Clicking a pin shows a card with: title, description, location details, time posted, expiration countdown timer, number of "still available" confirmations, photo (optional)
- Pins auto-fade/remove when expired
- Cluster pins when zoomed out

#### 2. Post a Resource (quick post flow)
- Floating "+" button, always visible
- 3-step quick post: (1) What is it? (category + title + description) → (2) Where? (drop pin on map or type building name) → (3) How long? (30min / 1hr / 2hr / end of day / ongoing)
- Optional: upload a photo
- Auth required to post (Supabase magic link or Google OAuth)

#### 3. Live Feed
- Sidebar or toggleable panel showing a chronological feed of recent posts
- Each item shows: category icon, title, building/location name, relative time ("12 min ago"), distance from user, expiration countdown
- Filter by: category, distance, "available now"
- Real-time updates via Supabase Realtime — new posts appear instantly without refresh

#### 4. Community Verification System (CRITICAL — this is what makes the app trustworthy)

This is the core trust layer. Without it, the app is just a bulletin board. With it, it's a **community-verified** resource network.

**How it works:**
- Every resource post shows two prominent buttons: "✓ Still there" and "✗ It's gone"
- Anyone logged in can vote (one vote per user per post)
- The post displays a live trust indicator using colored dots and text (NO emojis):
  - Green dot + "Verified by 5 people" (high confidence)
  - Amber dot + "Unverified" (just posted, no confirmations yet)
  - Red dot + "Likely gone" (multiple people reported gone)
- **Auto-removal rule:** If 2+ people mark "Gone," the pin fades from the map and moves to a "Recently expired" section
- **Auto-expiry:** Posts auto-expire based on the time the poster set (30min / 1hr / 2hr / end of day). A countdown timer shows on each post.
- **Freshness badge:** Posts confirmed within the last 10 minutes show a pulsing green "Just verified" badge

**Trust score for posters:**
- Users who consistently post real resources build a reputation score visible on their profile
- Posts from high-reputation users get a small "Trusted poster" badge
- This discourages spam/fake posts and rewards genuine contributors

**UI for the verification buttons:**
- On the resource detail card (when you tap a pin), show a prominent section:
  ```
  ┌─────────────────────────────────────┐
  │  Is this still available?           │
  │                                     │
  │  [✓ Still there (5)]  [✗ Gone (0)] │
  │                                     │
  │  Last confirmed 3 min ago by @alex  │
  └─────────────────────────────────────┘
  ```
- Buttons should feel tactile — use spring animation on tap
- After voting, the button fills with color and shows "You confirmed this"
- One vote per user — tapping again toggles your vote

#### 5. Campus Leaderboard & Gamification
- Users earn points for posting resources and confirming availability
- Monthly leaderboard: "Top Contributors This Month"
- Badges: "First Post," "Food Hero (10 posts)," "Reliable Reporter (20 confirmations)"
- This drives engagement and shows product thinking

#### 6. Notification System
- Users can set a "Watch Zone" radius on the map
- Browser push notifications when a new resource appears in their zone
- Category filters for notifications (e.g., "only notify me about free food")

---

### LANDING PAGE (separate from the app — this is what judges see first)

Build a landing page at the root route `/` that feels like a YC startup site, NOT a student project. Every section must have intentional design — no filler.

**Hero section:**
- Large editorial headline in Instrument Serif: "Your campus has more to give than you think."
- Subtext in body font: a single compelling sentence about students missing free resources every day
- A real screenshot/mockup of the map view with pins (render an actual static version of the map, not a placeholder image)
- Two CTAs: "Find free resources" (primary, filled) and "Share with your campus" (secondary, outlined)
- Background: subtle warm gradient from cream to stone, NOT white

**The problem (by the numbers):**
- Three stat blocks using monospace font for the numbers, body font for labels
- "37% of students face food insecurity" / "2,100+ in average annual food costs" / "Thousands of free resources go unclaimed weekly"
- Numbers should animate up (count-up animation) when they scroll into view
- NO animated counters that loop — count up once and stop

**How it works:**
- Three steps, laid out asymmetrically (not a centered 1-2-3 grid)
- Step 1: "Someone shares" — icon + short description
- Step 2: "Your campus verifies" — icon + short description (emphasize the trust system)
- Step 3: "You grab it" — icon + short description
- Use Lucide icons, NOT emoji. Use subtle connecting lines or arrows between steps.

**Features section:**
- Four feature cards with LEFT-aligned text, not centered
- Each card: Lucide icon (24px, moss color) + bold title + one sentence description
- Cards should have warm stone background with subtle left border accent in moss green
- Features: Real-time map / Community verification / Smart notifications / Contribution rewards

**Impact section:**
- Full-width section with cream background
- Large quote-style text: "No student should have to choose between a meal and a textbook."
- Below: a brief, specific paragraph about why you built this (write it as if a real student wrote it — mention UNT specifically)

**Social proof:**
- Three testimonial cards with realistic, specific quotes
- Include a first name, major, and year (e.g., "Maria S., Biology, Junior")
- Quotes should reference specific app features: "I found free lab goggles someone posted in the Chemistry building" / "The verification system means I never show up to something that's already gone"
- NO star ratings. Just the quote and attribution.

**Footer:**
- Minimal. Logo on left, three links (About, Privacy, Contact) on right, copyright below.
- No multi-column link grid. No social media icons unless you have real links.

Design notes for landing page:
- All scroll animations use framer-motion whileInView with fade-up + slight Y translate
- Staggered delays on grouped elements (cards, stats, steps)
- Smooth scroll behavior for any anchor links
- Mobile responsive — single column on mobile, generous touch targets
- The entire page should feel like reading a well-designed editorial piece, not scrolling through a template

---

### DATABASE SCHEMA (Supabase)

```sql
-- Users (extends Supabase auth.users)
create table profiles (
  id uuid references auth.users primary key,
  username text unique,
  avatar_url text,
  points integer default 0,
  posts_count integer default 0,
  confirmations_count integer default 0,
  campus text,
  created_at timestamptz default now()
);

-- Resources (the main posts)
create table resources (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  title text not null,
  description text,
  category text not null check (category in ('food', 'pantry', 'supplies', 'event')),
  latitude double precision not null,
  longitude double precision not null,
  building_name text,
  image_url text,
  expires_at timestamptz not null,
  is_active boolean default true,
  still_available_count integer default 0,
  gone_count integer default 0,
  created_at timestamptz default now()
);

-- Confirmations
create table confirmations (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid references resources(id) on delete cascade,
  user_id uuid references profiles(id),
  status text check (status in ('available', 'gone')),
  created_at timestamptz default now(),
  unique(resource_id, user_id)
);

-- Watch zones for notifications
create table watch_zones (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id),
  latitude double precision not null,
  longitude double precision not null,
  radius_meters integer default 500,
  categories text[] default '{food,pantry,supplies,event}',
  created_at timestamptz default now()
);
```

Enable Supabase Realtime on the `resources` table.
Set up Row Level Security policies so users can only edit/delete their own posts.

---

### FILE STRUCTURE

```
campusshare/
├── app/
│   ├── page.tsx                 # Landing page
│   ├── layout.tsx               # Root layout with providers
│   ├── map/
│   │   └── page.tsx             # Main app map view
│   ├── post/
│   │   └── page.tsx             # Post a resource flow
│   ├── leaderboard/
│   │   └── page.tsx             # Leaderboard page
│   ├── profile/
│   │   └── page.tsx             # User profile + badges
│   └── auth/
│       └── page.tsx             # Login/signup
├── components/
│   ├── landing/                 # Landing page sections
│   ├── map/                     # Map, pins, clusters
│   ├── feed/                    # Live feed sidebar
│   ├── post/                    # Post flow components
│   ├── ui/                      # shadcn/ui components
│   └── shared/                  # Navbar, footer, etc.
├── lib/
│   ├── supabase.ts              # Supabase client
│   ├── types.ts                 # TypeScript types
│   └── utils.ts                 # Helper functions
├── public/
│   └── images/                  # Icons, mockups
├── tailwind.config.ts
├── next.config.js
└── package.json
```

---

### DESIGN SYSTEM — THIS IS NON-NEGOTIABLE

The design must feel like it was made by a talented human designer at a top agency, NOT by AI. Follow every rule below strictly.

#### ABSOLUTE RULES
- **ZERO emojis anywhere in the entire app.** No emojis in UI, buttons, labels, headings, descriptions, badges, notifications, seed data, or any text content whatsoever. Use custom SVG icons or Lucide icons instead. This is a hard rule — if you catch yourself typing an emoji, replace it with an icon.
- **NO generic AI aesthetics.** That means: no purple-to-blue gradients, no excessive rounded corners on everything, no "glassmorphism" with blur everywhere, no overly symmetrical card grids that look like a template, no stock illustration style, no "hero section with gradient text + floating 3D shapes."
- **NO Inter, Roboto, Arial, or system fonts.** These scream "AI-generated." Use distinctive, premium fonts from Google Fonts instead.

#### Typography
- **Heading font:** "Instrument Serif" (Google Fonts) — elegant, editorial, gives warmth and personality. Use for the landing page headlines and section titles.
- **Body/UI font:** "Satoshi" or "General Sans" (from fontshare.com, free for commercial use) — clean, modern, geometric but not sterile. If fontshare CDN doesn't work in Codex, fallback to "DM Sans" (Google Fonts).
- **Monospace (for stats/numbers):** "JetBrains Mono" or "DM Mono" — gives a data-informed feel to counters and timestamps.
- Heading sizes: 48px / 36px / 28px / 22px / 18px — generous sizing with tight line-height (1.1 for h1, 1.2 for h2-h3)
- Letter-spacing: -0.02em on headings (tight), +0.01em on small labels (slightly open)
- Body text: 16px, line-height 1.6, color should be a warm dark (#1A1A19) not pure black

#### Color Palette
Not a generic green app. A sophisticated, earthy palette:

```
// Core
--moss:        #2D6A4F    // Primary — deep forest green, not neon
--moss-light:  #40916C    // Primary hover
--moss-subtle: #D8F3DC    // Light green tint for backgrounds
--sage:        #95D5B2    // Secondary accent — soft sage

// Warm neutrals (this is what makes it feel human-designed)
--cream:       #FEFAE0    // Warm background — NOT pure white
--stone:       #F5F1EB    // Card backgrounds
--bark:        #3D3831    // Dark text — warm, not pure black
--bark-light:  #6B6358    // Secondary text
--bark-faint:  #B8AFA6    // Tertiary text, borders

// Status colors (for verification system)
--verified:    #2D6A4F    // Same as moss — confirmed/trusted
--unverified:  #D4A843    // Warm amber — pending
--gone:        #C1554D    // Muted red — expired/gone
--urgent:      #E76F51    // Warm coral — expiring soon

// Dark mode
--night:       #1A1B18    // Background — warm near-black, NOT blue-black
--night-card:  #252620    // Card surfaces
--night-text:  #E8E4DD    // Primary text
```

DO NOT use Tailwind's default color scale. Define these as CSS custom properties and Tailwind theme extensions. The warm neutrals are what separates this from every AI-generated green app.

#### Spatial Design & Layout
- **Asymmetry over symmetry.** The landing page should NOT be a stack of centered sections. Use offset headings, text that bleeds to the left, images that break grid alignment.
- **Generous whitespace.** Sections should breathe. Minimum 120px padding between landing page sections. Don't cram.
- **The map view should feel like a native app**, not a website. Full viewport height, no visible browser chrome, bottom sheet slides up with a spring physics animation.
- **Cards have personality.** Not identical rectangles in a grid. Use subtle rotation (0.5deg), varying padding, or an accent border on the left edge. The resource cards on the feed should feel like physical sticky notes or bulletin board pins.
- **Hover states are mandatory** on every interactive element. Use scale(1.02) + shadow increase on cards, color shifts on buttons. No element should feel "dead" on hover.

#### Micro-interactions & Motion
- Use **framer-motion** for all animations. Spring physics, not linear easing.
- **Page load:** Staggered fade-up for landing page sections (each section delays 100ms more). The map pins should drop in one by one with a spring bounce.
- **Bottom sheet:** Drag-to-expand with velocity-based snap points (peek / half / full). Use framer-motion's drag constraints.
- **Verification buttons:** On tap, the button should scale down (0.95) then spring back, with a subtle color fill animation. After confirming, a small checkmark draws itself with an SVG stroke animation.
- **Pin tap:** When tapping a map pin, the card should slide up from below with a spring animation, not just appear.
- **Scroll animations on landing page:** Elements fade up and slightly translate as they enter viewport. Use framer-motion's `whileInView`.
- **NO loading spinners.** Use skeleton screens (pulsing gray shapes) for loading states. Spinners are lazy.

#### Iconography
- Use **Lucide React** icons throughout — they're clean, consistent, 24px grid.
- For category icons (food, supplies, textbooks, clothing), create simple custom SVG icons or use specific Lucide icons:
  - Food: `UtensilsCrossed` or `Sandwich`
  - Pantry: `Store` or `Package`
  - Supplies: `BookOpen` or `Backpack`
  - Events: `Calendar` or `PartyPopper`
  - Clothing: `Shirt`
- Pin markers on the map should use custom SVGs, NOT default Leaflet markers. Design pins that match the color palette — a rounded rectangle with the category icon inside, with a small triangle pointer at the bottom.

#### What "Human-Designed" Actually Means
Study these real sites for inspiration (DO NOT copy, but understand the feel):
- **too good to go** (toogoodtogo.com) — warm, approachable, mission-driven
- **Opal** (opal.so) — gorgeous gradients, editorial typography, premium feel
- **Linear** (linear.app) — clean, fast, purposeful UI with no wasted pixels
- **Notion** (notion.so) — warm neutrals, playful but professional

The app should feel like it was designed by someone who cares deeply about the mission AND about beautiful software. Every pixel should feel intentional.

#### Anti-Patterns — DO NOT DO THESE
- No emoji anywhere (already said but repeating because AI loves adding them)
- No "Built with AI" or "Powered by AI" badges or text anywhere
- No placeholder text like "Lorem ipsum" — every piece of text should be real, specific, and related to campus resource sharing
- No stock photos — use solid color blocks, SVG illustrations, or nothing
- No centered-everything layout on the landing page
- No "Get Started Free" as a CTA — use specific copy like "Find free resources" or "Share something with your campus"
- No generic testimonials like "This app is amazing!" — write specific, believable quotes like "Found free textbooks for my organic chem class within 10 minutes of signing up"
- No cookie-cutter footer with 4 columns of links. Keep it minimal — logo, one line of links, copyright.
- No hamburger menu on desktop. Only on mobile.


---

### IMPORTANT IMPLEMENTATION DETAILS

1. **The map MUST be the star of the app.** When someone opens /map, it should feel alive — pins appearing, a pulsing "you are here" dot, smooth zooming. This is what will wow judges.

2. **Seed data:** Include a `seed.ts` script that populates 15-20 realistic sample resources around a default campus (use University of North Texas in Denton, TX as default — latitude: 33.2148, longitude: -97.1331). Sample data should include things like: "Free pizza — Union Courtyard," "Food pantry open today — Maple Hall," "Free textbooks — Library 2nd floor," "Career fair leftovers — Business Building." Make the data feel REAL.

3. **Mobile-first.** 70%+ of students will use this on their phone. The map should be full-screen on mobile with a bottom sheet for the feed. Test at 375px width.

4. **Accessibility:** Proper ARIA labels, keyboard navigation, high contrast mode support, screen reader friendly.

5. **Performance:** Lazy load map tiles, use Next.js Image component, implement virtual scrolling on the feed if >50 items.

6. **PWA support:** Add a web manifest and service worker so it can be "installed" on a phone home screen. This is a major flex in a demo.

7. **README.md:** Write a compelling README with: project description, the problem it solves (with food insecurity stats), features list, tech stack, setup instructions, screenshots section (placeholder), and a "Built for the OpenAI x Handshake Codex Creator Challenge" badge.

---

### DEPLOYMENT GUIDE (step-by-step, everything free)

#### Supabase Setup
1. Go to supabase.com → Create a free account → "New Project"
2. Name it "campusshare", pick a strong DB password, choose the region closest to you (US East)
3. Once created, go to Settings → API → copy the `Project URL` and `anon/public` key
4. Create a `.env.local` file in the project root:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
   ```
5. Go to SQL Editor in Supabase dashboard → paste the full schema SQL from this prompt → Run
6. Go to Authentication → Providers → Enable Google OAuth (get credentials from Google Cloud Console) and/or enable Magic Link (email)
7. Go to Database → Replication → Enable Realtime for the `resources` and `confirmations` tables
8. Go to Storage → Create a bucket called "resource-images" → Set it to public

#### Vercel Deployment
1. Push the project to a GitHub repo
2. Go to vercel.com → Import the repo
3. Add the same env vars (NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY)
4. Deploy — done. You get a free .vercel.app URL

#### Row Level Security (important!)
```sql
-- Anyone can read resources
create policy "Resources are viewable by everyone" on resources for select using (true);

-- Only authenticated users can insert
create policy "Authenticated users can post" on resources for insert with check (auth.uid() = user_id);

-- Users can only update/delete their own posts
create policy "Users can update own posts" on resources for update using (auth.uid() = user_id);
create policy "Users can delete own posts" on resources for delete using (auth.uid() = user_id);

-- Anyone can read confirmations
create policy "Confirmations are viewable by everyone" on confirmations for select using (true);

-- Authenticated users can confirm
create policy "Authenticated users can confirm" on confirmations for insert with check (auth.uid() = user_id);

-- Users can change their own confirmation
create policy "Users can update own confirmation" on confirmations for update using (auth.uid() = user_id);
```

Also add a `trust_score` column to the profiles table:
```sql
alter table profiles add column trust_score integer default 0;
```

And update the confirmations table to track who confirmed and when:
```sql
alter table confirmations add column confirmed_at timestamptz default now();
```

Create a database function to auto-deactivate resources when 2+ "gone" votes:
```sql
create or replace function check_gone_votes()
returns trigger as $$
begin
  if (select count(*) from confirmations where resource_id = NEW.resource_id and status = 'gone') >= 2 then
    update resources set is_active = false where id = NEW.resource_id;
  end if;
  return NEW;
end;
$$ language plpgsql;

create trigger on_confirmation_insert
after insert on confirmations
for each row execute function check_gone_votes();
```

---

### WHAT MAKES THIS WIN

This isn't just a map with pins. It's a community-verified, real-time, gamified system that solves food insecurity on campus. The combination of:
- Real-time collaboration (Supabase Realtime)
- Community verification with trust scores (not just a bulletin board)
- Gamification (leaderboard + badges)
- Instant notifications (Watch Zones)
- Stunning visual design
- A fully deployed, working product with real database (not a mockup)
- $0 infrastructure cost (Supabase free + Vercel free + OpenStreetMap free)

...makes this stand out against competitors who built AI wrappers or simple CRUD apps.

Build everything. Make it deployable. Make it beautiful. Make it win.

---

## PROMPT END
