"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  CircleAlert,
  Film,
  Globe2,
  GraduationCap,
  Laptop,
  Lock,
  Mail,
  RefreshCcw,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type ToggleOption = {
  key: string;
  label: string;
  description: string;
};

type SelectOption = {
  key: string;
  label: string;
  hint: string;
  choices: string[];
};

const notificationOptions: ToggleOption[] = [
  {
    key: "newUploads",
    label: "Teacher uploads",
    description:
      "Alerts when subscribed teachers publish new lessons or notes.",
  },
  {
    key: "weeklyDigest",
    label: "Weekly digest",
    description: "Sunday recap of your streak, new clips, and curated picks.",
  },
  {
    key: "liveSessions",
    label: "Live sessions",
    description:
      "Reminders 30 minutes before live cohorts or office hours start.",
  },
  {
    key: "productUpdates",
    label: "Product updates",
    description: "Major improvements, beta invites, and roadmap highlights.",
  },
];

const learningToggleOptions: ToggleOption[] = [
  {
    key: "autoPlay",
    label: "Autoplay next lesson",
    description:
      "Automatically continue queued lessons to maintain focus flow.",
  },
  {
    key: "clipLoop",
    label: "Loop Shorts",
    description: "Replay Shorts once to reinforce quick concepts.",
  },
  {
    key: "notePrompts",
    label: "Smart note prompts",
    description: "Show structured prompts for Cornell-style notes in lessons.",
  },
];

const preferenceSelectOptions: SelectOption[] = [
  {
    key: "contentLanguage",
    label: "Content language",
    hint: "Control captions, transcripts, and recommended lesson language.",
    choices: ["English", "French", "Kinyarwanda", "Spanish"],
  },
  {
    key: "playbackQuality",
    label: "Playback quality",
    hint: "Default resolution when streaming lessons on desktop.",
    choices: ["Auto", "1080p", "720p", "480p"],
  },
];

const privacyOptions: ToggleOption[] = [
  {
    key: "profileVisibility",
    label: "Profile visibility",
    description:
      "Allow classmates to view your public profile and shared playlists.",
  },
  {
    key: "activityShare",
    label: "Share learning streak",
    description: "Show progress widgets on leaderboards and study groups.",
  },
  {
    key: "dataExport",
    label: "Automatic exports",
    description:
      "Email you a monthly archive of notes, highlights, and quiz results.",
  },
];

const ToggleControl = ({
  isOn,
  onToggle,
}: {
  isOn: boolean;
  onToggle: () => void;
}) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative inline-flex h-7 w-12 items-center rounded-full border transition ${
      isOn
        ? "border-emerald-400/80 bg-emerald-500"
        : "border-white/10 bg-white/5"
    }`}
  >
    <span
      className={`inline-block size-5 translate-x-1 rounded-full bg-white transition ${
        isOn ? "translate-x-6" : "translate-x-1"
      }`}
    />
  </button>
);

export default function SettingsPage() {
  const [notificationPrefs, setNotificationPrefs] = useState(() =>
    Object.fromEntries(notificationOptions.map((item) => [item.key, true]))
  );

  const [learningPrefs, setLearningPrefs] = useState(() =>
    Object.fromEntries(
      learningToggleOptions.map((item) => [item.key, item.key !== "clipLoop"])
    )
  );

  const [privacyPrefs, setPrivacyPrefs] = useState(() =>
    Object.fromEntries(
      privacyOptions.map((item) => [item.key, item.key !== "profileVisibility"])
    )
  );

  const [selectPrefs, setSelectPrefs] = useState(() =>
    Object.fromEntries(
      preferenceSelectOptions.map((item) => [item.key, item.choices[0]])
    )
  );

  const handleResetNotifications = () => {
    setNotificationPrefs(
      Object.fromEntries(notificationOptions.map((item) => [item.key, true]))
    );
  };

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-12 px-6 py-12">
            <section className="bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_65%)] px-8 py-10 ">
              <div className="flex flex-col  lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-4">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-sky-300">
                    Your workspace controls
                  </span>
                  <h1 className="text-3xl font-semibold tracking-tight md:text-4xl">
                    Tune Ederaxy to match how you learn, collaborate, and stay
                    secure.
                  </h1>
                  <p className="max-w-2xl text-sm text-neutral-300">
                    Update account details, personalise notifications, and
                    configure privacy in one place. Changes sync instantly
                    across desktop and mobile.
                  </p>
                  <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
                      Last updated 2 hours ago
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 rounded-lg w-sm border border-white/10 bg-black/40 p-6 text-sm text-neutral-300">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="size-5 text-emerald-300" />
                    MFA status: <span className="text-white">Enabled</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <GraduationCap className="size-5 text-sky-300" />
                    Weekly focus goal:{" "}
                    <span className="text-white">3 lessons</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe2 className="size-5 text-purple-300" />
                    Default language:{" "}
                    <span className="text-white">English</span>
                  </div>
                </div>
              </div>
            </section>

            <section
              className="grid gap-6 lg:grid-cols-[1.2fr,1fr]"
              id="profile"
            >
              <article className="rounded-3xl border border-[#1f1f1f] bg-[#101010] p-8 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Profile & account</h2>
                    <p className="text-sm text-neutral-400">
                      Refresh personal details so mentors know how to address
                      you and share resources.
                    </p>
                  </div>
                  <Button className="rounded-full bg-emerald-500 px-5 text-sm font-semibold text-black hover:bg-emerald-400">
                    Save changes
                  </Button>
                </div>

                <div className="mt-6 grid gap-6 md:grid-cols-2">
                  <div className="flex items-center gap-4 rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] p-4">
                    <div className="relative h-16 w-16 overflow-hidden rounded-full">
                      <Image
                        src="/users/1.jpg"
                        alt="Profile avatar"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="text-sm text-neutral-400">
                      <p className="text-white">David Ndizeye</p>
                      <span>Last updated 1 month ago</span>
                      <div className="mt-2 flex gap-2 text-xs">
                        <Button
                          size="sm"
                          className="rounded-full bg-white/10 px-3 text-white hover:bg-white/20"
                        >
                          Upload new photo
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="rounded-full border border-white/10 px-3 text-white hover:border-white/30"
                        >
                          Remove
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-3 text-sm">
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                        Display name
                      </span>
                      <Input
                        defaultValue="David Ndizeye"
                        className="h-11 border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-emerald-500/40"
                      />
                    </label>
                    <label className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                        Handle
                      </span>
                      <Input
                        defaultValue="@ndizeyedavid"
                        className="h-11 border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-emerald-500/40"
                      />
                    </label>
                  </div>

                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                      Contact email
                    </span>
                    <div className="flex items-center gap-3">
                      <Mail className="size-4 text-neutral-500" />
                      <Input
                        type="email"
                        defaultValue="david@ederaxy.com"
                        className="h-11 flex-1 border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:border-emerald-500/40"
                      />
                    </div>
                  </label>

                  <label className="space-y-2 text-sm md:col-span-2">
                    <span className="text-xs font-semibold px-2 uppercase tracking-[0.22em] text-white/60">
                      Bio
                    </span>
                    <textarea
                      rows={4}
                      defaultValue="I help students fall in love with persuasive writing and storytelling. Here for revision sprints and creative clinics."
                      className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3  text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none  focus-visible:border-emerald-500/40"
                    />
                  </label>
                </div>
              </article>
            </section>

            <section className="grid gap-6 lg:grid-cols-[1.1fr,1fr]">
              <article className=" p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-semibold">Notifications</h2>
                    <p className="text-sm text-neutral-400">
                      Decide how we nudge you about new content, live events,
                      and product updates.
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    onClick={handleResetNotifications}
                    className="rounded-full border border-white/10 px-4 text-sm text-white hover:border-white/30"
                  >
                    <RefreshCcw className="size-4" /> Reset defaults
                  </Button>
                </div>

                <div className="mt-6 space-y-4">
                  {notificationOptions.map((option) => (
                    <div
                      key={option.key}
                      className="flex flex-col gap-3 rounded-2xl border border-[#1f1f1f] bg-[#121212] p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {option.label}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {option.description}
                        </p>
                      </div>
                      <ToggleControl
                        isOn={notificationPrefs[option.key]}
                        onToggle={() =>
                          setNotificationPrefs((prev) => ({
                            ...prev,
                            [option.key]: !prev[option.key],
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </article>

              <article
                className="flex h-full flex-col gap-6 rounded-3xl  p-8"
                id="languages"
              >
                <div className="space-y-2">
                  <h2 className="text-xl font-semibold">
                    Learning preferences
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Tailor playback, language, and focus mode for consistent
                    study routines.
                  </p>
                </div>

                <div className="space-y-5">
                  {preferenceSelectOptions.map((option) => (
                    <label key={option.key} className="space-y-2 text-sm">
                      <span className="flex items-center gap-2 text-white">
                        {option.key == "playbackQuality" ? (
                          <Film className="size-4 text-neutral-500" />
                        ) : (
                          <Globe2 className="size-4 text-neutral-500" />
                        )}
                        {option.label}
                      </span>
                      <Select
                        value={selectPrefs[option.key]}
                        onValueChange={(value) =>
                          setSelectPrefs((prev) => ({
                            ...prev,
                            [option.key]: value,
                          }))
                        }
                      >
                        <SelectTrigger className="w-full  border border-white/10 bg-white/5 px-4 py-2.5 text-sm text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="border-white/10 bg-[#111111] text-white">
                          {option.choices.map((choice) => (
                            <SelectItem key={choice} value={choice}>
                              {choice}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-xs text-neutral-500">{option.hint}</p>
                    </label>
                  ))}
                </div>

                <div className="space-y-3">
                  {learningToggleOptions.map((option) => (
                    <div
                      key={option.key}
                      className="flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#111111] p-4"
                    >
                      <div>
                        <p className="text-sm font-medium text-white">
                          {option.label}
                        </p>
                        <p className="text-xs text-neutral-400">
                          {option.description}
                        </p>
                      </div>
                      <ToggleControl
                        isOn={learningPrefs[option.key]}
                        onToggle={() =>
                          setLearningPrefs((prev) => ({
                            ...prev,
                            [option.key]: !prev[option.key],
                          }))
                        }
                      />
                    </div>
                  ))}
                </div>
              </article>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
