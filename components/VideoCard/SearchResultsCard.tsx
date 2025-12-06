"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

type SearchResultsCardProps = {
  thumbnail?: string;
  duration?: string;
  title?: string;
  href?: string;
  views?: string;
  published?: string;
  category?: string;
  channelName?: string;
  channelAvatar?: string;
  description?: string;
  grade?: string;
  lesson?: string;
  unit?: string;
};

export default function SearchResultsCard({
  thumbnail = "/videos/ai-vs-ml-thumb.jpg",
  duration = "4:11",
  title = "Calculus - Introduction to Calculus",
  href = "/watch?v=<id>",
  views = "1.1M views",
  published = "1 year ago",
  category = "Secondary",
  channelName = "Eric KAYIHURA",
  channelAvatar = "/users/1.jpg",
  description = "This video will give you a brief introduction to calculus. It does this by explaining that calculus is the mathematics of change.",
  grade = "Level 5",
  lesson = "Apply Mathematics At Workplace",
  unit = "Unit 1: Integration & Anti-derivative",
}: SearchResultsCardProps) {
  return (
    <article className="group flex w-full flex-col cursor-pointer gap-4 rounded-3xl bg-[#101010] p-4 text-white transition hover:bg-[#151515] md:flex-row md:items-start md:p-5">
      <Link
        href={href}
        className="relative w-full flex-1 overflow-hidden rounded-3xl md:w-[320px]"
      >
        <div className="relative h-[240px] w-full overflow-hidden">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 320px"
          />
          <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold">
            {duration}
          </span>
        </div>
      </Link>

      <div className="flex flex-1/3 flex-col gap-3">
        <div className="flex flex-col gap-1 items-center md:flex-row md:items-start md:justify-between">
          <Link
            href={href}
            className="text-lg font-semibold  hover:text-green-400 md:text-xl"
          >
            {title}
          </Link>
          <button
            type="button"
            aria-label="Video options"
            className="self-start rounded-full p-2 text-neutral-500 transition hover:bg-[#1f1f1f] hover:text-white"
          >
            <MoreVertical size={18} />
          </button>
        </div>

        <p className="text-sm text-neutral-400">
          {views}
          <span className="mx-1 text-neutral-600">•</span>
          {published}
          <span className="mx-1 text-neutral-600">•</span>
          <span className="font-medium text-neutral-200">{category}</span>
        </p>

        <Link
          href="/@mellow"
          className="flex items-center gap-2 text-sm text-neutral-300"
        >
          <div className="relative size-5 overflow-hidden rounded-full bg-[#1f1f1f]">
            <Image
              src={channelAvatar}
              alt={channelName}
              fill
              className="object-cover"
              sizes="36px"
            />
          </div>
          <span className="text-xs font-medium hover:text-white">
            {channelName}
          </span>
        </Link>

        <p className="text-sm leading-relaxed text-neutral-300">
          {description}
        </p>

        <div className="space-y-1 text-xs text-neutral-300">
          <p>
            <span className="font-semibold text-white">Grade:</span> {grade}
          </p>
          <p>
            <span className="font-semibold text-white">Lesson:</span> {lesson}
          </p>
          <p>
            <span className="font-semibold text-white">Unit:</span> {unit}
          </p>
        </div>
      </div>
    </article>
  );
}
