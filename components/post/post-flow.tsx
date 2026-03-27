"use client";

import dynamic from "next/dynamic";
import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Camera, CheckCircle2, Clock3, MapPinned, MoveRight } from "lucide-react";

import { createDemoLocationSuggestions } from "@/lib/mock-data";
import { useCampusShare } from "@/components/providers/campusshare-provider";
import { useRouteTransition } from "@/components/providers/route-transition-provider";
import { ResourceCategoryIcon } from "@/components/map/resource-category-icon";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import type { PostDraft, ResourceCategory } from "@/lib/types";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { cn } from "@/lib/utils";

const DynamicLocationPickerMap = dynamic(() => import("@/components/post/location-picker-map").then((mod) => mod.LocationPickerMap), {
  ssr: false,
  loading: () => <div className="h-[320px] animate-pulse rounded-[28px] bg-stone" />
});

const categoryOptions: Array<{ value: ResourceCategory; label: string; description: string }> = [
  { value: "food", label: "Free food", description: "Meals, snacks, drinks, leftovers" },
  { value: "pantry", label: "Pantry", description: "Permanent shelves, fridges, resource closets" },
  { value: "supplies", label: "Supplies", description: "Textbooks, clothing, lab gear, class materials" },
  { value: "event", label: "Event", description: "Upcoming events with food or giveaways" }
];

const durationOptions: Array<{ value: PostDraft["duration"]; label: string; helper: string }> = [
  { value: "30m", label: "30 minutes", helper: "Best for hot food and short windows" },
  { value: "1h", label: "1 hour", helper: "Good for snacks or a live event table" },
  { value: "2h", label: "2 hours", helper: "Useful for supplies and leftovers" },
  { value: "eod", label: "End of day", helper: "Keeps it up until campus wraps today" },
  { value: "ongoing", label: "Ongoing", helper: "For pantry shelves or permanent resources" }
];

export function PostFlow() {
  const { activeCampus, currentUser, signInDemo, submitResource, viewerPosition } = useCampusShare();
  const { beginTransition } = useRouteTransition();
  const router = useRouter();
  const campusLocations = createDemoLocationSuggestions(viewerPosition, activeCampus).slice(0, 6);
  const defaultLocation = campusLocations[0] ?? {
    label: "Campus spot",
    latitude: viewerPosition.latitude,
    longitude: viewerPosition.longitude
  };
  const [isPending, startTransition] = useTransition();
  const [step, setStep] = useState(1);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [hasCustomLocation, setHasCustomLocation] = useState(false);
  const [draft, setDraft] = useState<PostDraft>({
    category: "food",
    title: "",
    description: "",
    building_name: defaultLocation.label,
    latitude: defaultLocation.latitude,
    longitude: defaultLocation.longitude,
    duration: "30m"
  });

  useEffect(() => {
    if (!selectedFile) {
      setFilePreview(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setFilePreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  useEffect(() => {
    if (hasCustomLocation) {
      return;
    }

    setDraft((current) => {
      if (
        current.building_name === defaultLocation.label &&
        current.latitude === defaultLocation.latitude &&
        current.longitude === defaultLocation.longitude
      ) {
        return current;
      }

      return {
        ...current,
        building_name: defaultLocation.label,
        latitude: defaultLocation.latitude,
        longitude: defaultLocation.longitude
      };
    });
  }, [defaultLocation.label, defaultLocation.latitude, defaultLocation.longitude, hasCustomLocation]);

  async function handleSubmit() {
    setStatusMessage(null);

    if (!currentUser) {
      setStatusMessage("Log in first to post on the live campus map.");
      return;
    }

    let imageUrl = draft.image_url;
    const supabase = getSupabaseBrowserClient();

    if (selectedFile && supabase) {
      const filePath = `${currentUser.id}/${Date.now()}-${selectedFile.name.replace(/\s+/g, "-").toLowerCase()}`;
      const { error } = await supabase.storage.from("resource-images").upload(filePath, selectedFile);

      if (!error) {
        const { data } = supabase.storage.from("resource-images").getPublicUrl(filePath);
        imageUrl = data.publicUrl;
      }
    } else if (selectedFile && filePreview) {
      imageUrl = filePreview;
    }

    startTransition(() => {
      void submitResource({ ...draft, image_url: imageUrl }).then((result) => {
        setStatusMessage(result.message);

        if (result.ok) {
          beginTransition();
          router.push("/map");
        }
      });
    });
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[36px] border border-bark/8 bg-stone/78 p-7 shadow-note md:p-8">
        <div className="section-kicker mb-4">Quick post flow</div>
        <h1 className="font-serif text-4xl leading-[1.05] text-bark md:text-5xl">
          Share something useful before the window closes.
        </h1>
        <p className="mt-5 max-w-[34rem] text-lg leading-8 text-bark-light">
          The post flow is designed for the in-between moments: outside a meeting, leaving the library, or spotting a supply table that should not go unseen.
        </p>

        <div className="mt-8 space-y-4">
          {[1, 2, 3].map((index) => (
            <button
              key={index}
              type="button"
              onClick={() => setStep(index)}
              className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${
                step === index ? "border-moss/20 bg-cream shadow-note" : "border-bark/8 bg-cream/60"
              }`}
            >
              <div>
                <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Step {index}</div>
                <div className="mt-1 text-base font-medium text-bark">
                  {index === 1 ? "What is it?" : index === 2 ? "Where is it?" : "How long will it last?"}
                </div>
              </div>
              <MoveRight className={`h-5 w-5 ${step === index ? "text-moss" : "text-bark-light"}`} />
            </button>
          ))}
        </div>

        {!currentUser ? (
          <div className="mt-8 rounded-[28px] border border-bark/8 bg-cream p-5">
            <div className="text-base font-medium text-bark">Posting requires an account.</div>
            <p className="mt-2 text-sm text-bark-light">
              Use demo mode now or connect Supabase Auth for magic links and Google sign-in.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button type="button" className={buttonVariants()} onClick={signInDemo}>
                Continue in demo mode
              </button>
              <Button
                variant="outline"
                onClick={() => {
                  beginTransition();
                  router.push("/auth");
                }}
              >
                Open auth page
              </Button>
            </div>
          </div>
        ) : null}

        {statusMessage ? (
          <div className="mt-6 rounded-[24px] border border-moss/14 bg-moss-subtle px-4 py-3 text-sm text-moss">
            {statusMessage}
          </div>
        ) : null}
      </div>

      <div className="rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
        {step === 1 ? (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-moss-subtle text-moss">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Step 1</div>
                <div className="text-xl font-medium text-bark">Describe the resource</div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, category: option.value }))}
                  className={`rounded-[24px] border p-4 text-left transition ${
                    draft.category === option.value
                      ? "border-moss/20 bg-moss-subtle"
                      : "border-bark/8 bg-stone/80 hover:bg-stone"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cream text-moss">
                      <ResourceCategoryIcon category={option.value} className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="text-base font-medium text-bark">{option.label}</div>
                      <div className="text-sm text-bark-light">{option.description}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-bark">Title</label>
                <Input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                  placeholder={`Free pizza near ${defaultLocation.label}`}
                  aria-label="Resource title"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-bark">Description</label>
                <Textarea
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                  placeholder="What is still available, which entrance to use, and anything students should know."
                  aria-label="Resource description"
                />
              </div>
            </div>
          </div>
        ) : null}

        {step === 2 ? (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-moss-subtle text-moss">
                <MapPinned className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Step 2</div>
                <div className="text-xl font-medium text-bark">Drop a pin or choose a building</div>
              </div>
            </div>

            <DynamicLocationPickerMap
              value={{ latitude: draft.latitude, longitude: draft.longitude }}
              onChange={(next) => {
                setHasCustomLocation(true);
                setDraft((current) => ({ ...current, latitude: next.latitude, longitude: next.longitude }));
              }}
            />

            <div className="mt-5">
              <label className="mb-2 block text-sm font-medium text-bark">Building or location name</label>
              <Input
                value={draft.building_name}
                onChange={(event) => {
                  setHasCustomLocation(true);
                  setDraft((current) => ({ ...current, building_name: event.target.value }));
                }}
                placeholder={defaultLocation.label}
                aria-label="Building name"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {campusLocations.map((location) => (
                <button
                  key={location.label}
                  type="button"
                  onClick={() => {
                    setHasCustomLocation(true);
                    setDraft((current) => ({
                      ...current,
                      building_name: location.label,
                      latitude: location.latitude,
                      longitude: location.longitude
                    }));
                  }}
                  className="rounded-full border border-bark/10 bg-stone px-3 py-2 text-sm text-bark-light hover:bg-cream hover:text-bark"
                >
                  {location.label}
                </button>
              ))}
            </div>

            <div className="mt-5 rounded-[24px] border border-bark/8 bg-stone/80 px-4 py-4 font-mono text-sm text-bark-light">
              {draft.latitude.toFixed(4)}, {draft.longitude.toFixed(4)}
            </div>
          </div>
        ) : null}

        {step === 3 ? (
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-[18px] bg-moss-subtle text-moss">
                <Clock3 className="h-6 w-6" />
              </div>
              <div>
                <div className="text-sm uppercase tracking-[0.12em] text-bark-light">Step 3</div>
                <div className="text-xl font-medium text-bark">Set the window and add a photo if helpful</div>
              </div>
            </div>

            <div className="space-y-3">
              {durationOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setDraft((current) => ({ ...current, duration: option.value }))}
                  className={`flex w-full items-center justify-between rounded-[24px] border px-4 py-4 text-left transition ${
                    draft.duration === option.value ? "border-moss/20 bg-moss-subtle" : "border-bark/8 bg-stone/80"
                  }`}
                >
                  <div>
                    <div className="text-base font-medium text-bark">{option.label}</div>
                    <div className="text-sm text-bark-light">{option.helper}</div>
                  </div>
                  {draft.duration === option.value ? <CheckCircle2 className="h-5 w-5 text-moss" /> : null}
                </button>
              ))}
            </div>

            <label className="mt-6 flex cursor-pointer flex-col rounded-[28px] border border-dashed border-bark/16 bg-stone/72 p-5 transition hover:bg-stone">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cream text-bark">
                  <Camera className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-medium text-bark">Optional photo</div>
                  <div className="text-sm text-bark-light">Uploads to Supabase Storage when configured. In demo mode it stays local.</div>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
              />
            </label>

            {filePreview ? (
              <div className="mt-4 overflow-hidden rounded-[28px] border border-bark/8 bg-stone">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={filePreview} alt="Selected upload preview" className="h-56 w-full object-cover" />
              </div>
            ) : null}

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button variant="secondary" onClick={() => setStep(2)}>
                Back
              </Button>
              <Button
                className={cn("sm:flex-1", isPending && "opacity-80")}
                onClick={() => void handleSubmit()}
                disabled={isPending || !draft.title.trim() || !draft.building_name.trim()}
              >
                {isPending ? "Posting..." : "Post resource"}
              </Button>
            </div>
          </div>
        ) : null}

        <div className="mt-8 flex items-center justify-between border-t border-bark/8 pt-6">
          <Button variant="ghost" onClick={() => setStep((current) => Math.max(1, current - 1))} disabled={step === 1}>
            Previous
          </Button>
          <Button
            variant={step === 3 ? "secondary" : "default"}
            onClick={() => setStep((current) => Math.min(3, current + 1))}
            disabled={step === 3}
          >
            Next step
          </Button>
        </div>
      </div>
    </div>
  );
}
