"use client";

import Image from "next/image";
import { useState, type ChangeEvent } from "react";
import type { ReactNode } from "react";

import {
  Camera,
  Check,
  Eye,
  Info,
  Link as LinkIcon,
  PenSquare,
  Save,
  Upload,
} from "lucide-react";

interface SocialLink {
  label: string;
  placeholder: string;
}

const socialLinks: SocialLink[] = [
  { label: "Website", placeholder: "https://" },
  { label: "YouTube", placeholder: "https://youtube.com/@" },
  { label: "LinkedIn", placeholder: "https://linkedin.com/in/" },
  { label: "Twitter", placeholder: "https://x.com/" },
];

const brandTags: readonly string[] = [
  "Artificial Intelligence",
  "STEM",
  "Creative Coding",
  "GCSE",
];

export default function CustomizationPage() {
  const [channelName, setChannelName] = useState("Ederaxy Learning Studio");
  const [channelHandle, setChannelHandle] = useState("ederaxyacademy");
  const [channelDescription, setChannelDescription] = useState(
    "Weekly lessons, quizzes and live workshops helping learners explore science, technology and creative problem solving."
  );
  const [highlightTrailer, setHighlightTrailer] = useState(
    "Making a 2D game in GODOT"
  );

  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Channel look & feel
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Channel customization</h1>
          <p className="mt-2 text-sm text-white/60">
            Update your branding, identity and default information across the
            student experience.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-400/80 hover:bg-emerald-500/20">
            <Save className="size-4" /> Save changes
          </button>
        </div>
      </header>

      <div className="grid gap-6 text-white xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <CustomizationCard
            title="Brand assets"
            description="Your banner and profile photo appear on your channel landing page and across course recommendations."
          >
            <div className="space-y-6">
              <div className="relative overflow-hidden rounded-lg bg-[#101219]">
                <div className="relative flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold">Channel banner</p>
                    <p className="mt-1 max-w-xl text-sm text-white/60">
                      For the best results on all devices, use an image that’s
                      at least 2048 x 1152 pixels and 6MB or less
                    </p>
                  </div>
                  <UploadAction label="Upload banner" icon={Upload} />
                </div>
              </div>

              <div className="flex flex-wrap gap-4 ">
                <div className="flex w-full items-start gap-4 rounded-lg bg-[#101219] p-5">
                  <div className="relative">
                    <Image
                      src="/users/2.jpeg"
                      alt="Channel avatar"
                      width={96}
                      height={96}
                      className="h-24 w-24 rounded-full border border-white/10 object-cover shadow-lg"
                    />
                    <button className="absolute bottom-1 right-1 inline-flex size-8 items-center justify-center rounded-full border border-white/10 bg-[#0f1117] text-white transition hover:border-white/20 hover:bg-white/10">
                      <Camera className="size-4" />
                    </button>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">Profile picture</p>
                    <p className="mt-1 text-sm text-white/60">
                      Minimum 800 × 800 px · PNG with transparent background
                      recommended.
                    </p>
                    <div className="mt-3 flex gap-2 text-xs text-white/60">
                      <button className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 transition hover:border-white/20 hover:bg-white/10">
                        <Upload className="size-3" /> Replace
                      </button>
                      <button className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-1 transition hover:border-white/20 hover:bg-white/10">
                        <PenSquare className="size-3" /> Adjust
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CustomizationCard>

          <CustomizationCard
            title="Channel identity"
            description="Update public-facing details students see across discovery surfaces."
          >
            <div className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <Field
                  label="Channel name"
                  hint="Your classroom or organization name."
                  value={channelName}
                  onChange={(event) => setChannelName(event.target.value)}
                />
                <Field
                  label="Channel handle"
                  hint="Unique identifier learners can search."
                  value={channelHandle}
                  onChange={(event) => setChannelHandle(event.target.value)}
                  prefix="@"
                />
              </div>

              <div>
                <label
                  className="text-sm font-semibold text-white"
                  htmlFor="channel-description"
                >
                  Channel description
                </label>
                <p className="mt-1 text-sm text-white/60">
                  Communicate your mission, teaching style and what students can
                  expect.
                </p>
                <textarea
                  id="channel-description"
                  value={channelDescription}
                  onChange={(event) =>
                    setChannelDescription(event.target.value)
                  }
                  rows={5}
                  className="mt-3 w-full rounded-xl border border-white/10 p-4 text-sm text-white placeholder:text-white/30 focus:border-[#067855] focus:outline-none"
                  placeholder="Share your teaching focus, formats and achievements..."
                />
                <div className="mt-2 flex items-center justify-between text-xs text-white/40">
                  <span>Max 1,000 characters</span>
                  <span>{channelDescription.length}/1000</span>
                </div>
              </div>
            </div>
          </CustomizationCard>

          <CustomizationCard
            title="Featured content"
            description="Set the default trailer and featured playlist for new visitors."
          >
            <div className="grid gap-4 md:grid-cols-[180px_1fr]">
              <div className="relative h-32 overflow-hidden rounded-xl border border-white/10 bg-[#101219]">
                <Image
                  src="/videos/ai-vs-ml-thumb.jpg"
                  alt="Featured video"
                  fill
                  className="object-cover"
                />
                <span className="absolute bottom-2 left-2 rounded-full bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
                  Trailer
                </span>
              </div>
              <div className="space-y-3">
                <Field
                  label="Highlight video"
                  value={highlightTrailer}
                  onChange={(event) => setHighlightTrailer(event.target.value)}
                  hint="Pick an engaging video to introduce students to your teaching style."
                />
                <button className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-xs font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
                  <Upload className="size-3" /> Choose different video
                </button>
              </div>
            </div>
          </CustomizationCard>
        </div>

        <aside className="space-y-6">
          <CustomizationCard
            title="Live preview"
            description="What learners see when they visit your channel."
          >
            <div className="space-y-3 ">
              <div className="relative">
                <div className="h-32 rounded-lg bg-gradient-to-r from-sky-500/20 via-purple-400/20 to-emerald-400/20" />
                <div className="flex items-center gap-3">
                  <Image
                    src="/users/2.jpeg"
                    alt="Channel avatar preview"
                    width={56}
                    height={56}
                    className="size-16  -translate-y-3 rounded-full border-2 border-[#141517] object-cover"
                  />
                  <div>
                    <p className="text-base font-semibold">{channelName}</p>
                    <p className="text-sm text-white/50">@{channelHandle}</p>
                  </div>
                </div>
              </div>
              <p className="text-sm text-white/60">{channelDescription}</p>
            </div>
          </CustomizationCard>

          <CustomizationCard
            title="Brand safety"
            description="Control what appears on your channel by default."
          >
            <div className="space-y-4 text-sm text-white/70">
              <ToggleRow
                label="Allow student comments"
                description="Comments remain moderated. Toggle off to pause new replies on your videos."
                defaultChecked
              />
              <ToggleRow
                label="Display quiz performance"
                description="Show average quiz scores publicly on video pages."
                defaultChecked
              />
            </div>
          </CustomizationCard>
        </aside>
      </div>
    </section>
  );
}

function CustomizationCard({
  title,
  description,
  extra,
  children,
}: {
  title: string;
  description?: string;
  extra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border p-4 text-white">
      <header className="flex flex-col gap-2 border-b border-white/10 pb-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 text-sm text-white/60">{description}</p>
          ) : null}
        </div>
        {extra}
      </header>
      <div className="pt-5">{children}</div>
    </article>
  );
}

function UploadAction({
  label,
  icon: Icon,
}: {
  label: string;
  icon: typeof Upload;
}) {
  return (
    <button className="inline-flex items-center justify-center gap-1 rounded-full border border-white/10 bg-white/5 px-3 w-[170px] py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
      <Icon className="size-4" />
      {label}
    </button>
  );
}

function Field({
  label,
  value,
  onChange,
  hint,
  prefix,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  hint?: string;
  prefix?: string;
}) {
  return (
    <label className="flex flex-col gap-2">
      <span className="text-sm font-semibold text-white">{label}</span>
      <div className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-white focus-within:border-[#067855]">
        {prefix ? <span className="text-white/40">{prefix}</span> : null}
        <input
          value={value}
          onChange={onChange}
          className="w-full bg-transparent text-sm text-white placeholder:text-white/30 focus:outline-none"
        />
      </div>
      {hint ? <span className="text-xs text-white/50">{hint}</span> : null}
    </label>
  );
}

function ToggleRow({
  label,
  description,
  defaultChecked,
}: {
  label: string;
  description?: string;
  defaultChecked?: boolean;
}) {
  const [checked, setChecked] = useState(Boolean(defaultChecked));

  return (
    <div className="flex items-start justify-between gap-4 rounded-lg bg-[#101219] p-4">
      <div>
        <p className="text-sm font-semibold text-white">{label}</p>
        {description ? (
          <p className="mt-1 text-xs text-white/60">{description}</p>
        ) : null}
      </div>
      <label className="relative inline-flex cursor-pointer items-center">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(event) => setChecked(event.target.checked)}
        />
        <div className="h-6 w-11 rounded-full bg-white/20 transition peer-checked:bg-emerald-500/60" />
        <span className="absolute left-1 top-1 size-4 rounded-full bg-white transition peer-checked:translate-x-5" />
      </label>
    </div>
  );
}
