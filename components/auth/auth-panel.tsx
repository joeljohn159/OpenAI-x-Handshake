"use client";

import { useState } from "react";
import { Mail, Sparkles } from "lucide-react";

import { useCampusShare } from "@/components/providers/campusshare-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isSupabaseConfigured } from "@/lib/supabase";

export function AuthPanel() {
  const { signInDemo, signInWithEmail, signInWithGoogle } = useCampusShare();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
      <div className="rounded-[36px] border border-bark/8 bg-stone/80 p-7 shadow-note md:p-8">
        <div className="section-kicker mb-4">Authentication</div>
        <h1 className="font-serif text-4xl leading-[1.04] text-bark md:text-5xl">
          Log in fast and keep posting friction low.
        </h1>
        <p className="mt-5 max-w-[34rem] text-lg leading-8 text-bark-light">
          CampusShare supports passwordless magic links, Google OAuth, and a demo session so judges can experience the product immediately.
        </p>
        <div className="mt-8 rounded-[28px] border border-bark/8 bg-cream p-5">
          <div className="text-base font-medium text-bark">Environment status</div>
          <p className="mt-2 text-sm text-bark-light">
            {isSupabaseConfigured
              ? "Supabase keys detected. Magic links, Google OAuth, storage, and realtime can all be enabled."
              : "Supabase keys are missing, so the app is running in polished demo mode with location-aware seed data."}
          </p>
        </div>
      </div>

      <div className="rounded-[36px] border border-bark/8 bg-cream p-7 shadow-soft md:p-8">
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-bark">School email</label>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="student@campus.edu"
              aria-label="School email"
            />
          </div>
          <Button
            className="w-full"
            onClick={() => void signInWithEmail(email).then((result) => setMessage(result.message))}
            disabled={!email}
          >
            <Mail className="h-4 w-4" />
            Send magic link
          </Button>
          <Button className="w-full" variant="secondary" onClick={() => void signInWithGoogle().then((result) => setMessage(result.message))}>
            Continue with Google
          </Button>
          <Button className="w-full" variant="outline" onClick={() => { signInDemo(); setMessage("Demo session started. You can now post and verify resources."); }}>
            <Sparkles className="h-4 w-4" />
            Continue in demo mode
          </Button>
        </div>

        {message ? (
          <div className="mt-5 rounded-[24px] border border-moss/12 bg-moss-subtle px-4 py-3 text-sm text-moss">
            {message}
          </div>
        ) : null}

        <div className="mt-8 rounded-[28px] border border-bark/8 bg-stone/72 p-5">
          <div className="text-base font-medium text-bark">Why auth matters here</div>
          <ul className="mt-3 space-y-2 text-sm leading-6 text-bark-light">
            <li>Voting is one person per resource, which makes the verification layer meaningful.</li>
            <li>Profiles accumulate points, trust score, and monthly leaderboard standings.</li>
            <li>Photo uploads and watch zone preferences can persist across sessions.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
