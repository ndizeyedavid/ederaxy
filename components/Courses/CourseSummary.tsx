"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightCircle, Download, Play, Share2 } from "lucide-react";

type CourseSummaryProps = {
  coverImage?: string;
  title?: string;
  educator?: string;
  level?: string;
  videoCount?: number;
  lastUpdated?: string;
  description?: string;
  href?: string;
};

export default function CourseSummary({
  coverImage = "/videos/ai-vs-ml-thumb.jpg",
  title = "Circulatory System",
  educator = "Papa Science",
  level = "Primary",
  videoCount = 6,
  lastUpdated = "Jan 7, 2023",
  description = "Dive deep onto how blood flows from our hearts and throughout our entire bodies",
  href = "/course/<id>",
}: CourseSummaryProps) {
  const summaryStats = `${videoCount} ${
    videoCount === 1 ? "video" : "videos"
  } · Last updated on ${lastUpdated}`;

  return (
    <article className="group relative flex w-full max-w-md flex-col bg-[#0f0f0f] overflow-hidden rounded-lg text-white shadow-[0_40px_80px_-40px_rgba(0,0,0,0.65)]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: `url(${coverImage})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(50px)",
        }}
      />
      <div className="relative grid gap-6 px-8 py-8">
        <div className="relative rounded-lg overflow-hidden ">
          <div className="relative h-48 w-full overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 90vw, 480px"
            />
          </div>
        </div>

        <header className="space-y-2">
          <h1 className="text-3xl font-bold leading-tight drop-shadow-sm">
            {title}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-sm text-white/80">
            <Link
              href={`/channel/@${educator}`}
              className="font-semibold text-white  hover:text-white/80"
            >
              {educator}
            </Link>
            <span className="inline-flex items-center rounded-full cursor-pointer hover:bg-white/30 transition-colors bg-white/15 px-3 py-0.5 text-xs font-semibold uppercase tracking-wide text-white">
              {level}
            </span>
          </div>
          <p className="text-sm text-white/75">{summaryStats}</p>
        </header>

        <div className="flex items-center gap-3">
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
            <Share2 size={22} />
          </button>
          <button className="flex h-12 w-12 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25">
            <Download size={22} />
          </button>
        </div>

        <Link
          href={href}
          className="inline-flex items-center justify-center gap-2 w-[150px] rounded-full bg-white px-6 py-2 text-base font-semibold text-[#0f1a30] shadow-lg transition hover:bg-white/90"
        >
          <Play size={18} fill="#0f1a30" className="text-[#0f1a30]" />
          Play
        </Link>

        <p className="text-sm leading-relaxed text-white/80">{description}</p>
      </div>
    </article>
  );
}
