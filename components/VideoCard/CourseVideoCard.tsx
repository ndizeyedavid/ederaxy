"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

type CourseVideoCardProps = {
  index?: number;
  title?: string;
  thumbnail?: string;
  duration?: string;
  views?: string;
  published?: string;
  grade?: string;
  lesson?: string;
  unit?: string;
  href?: string;
};

export default function CourseVideoCard({
  index = 1,
  title = "#1 - Introduction to the Circulatory System",
  thumbnail = "/videos/ai-vs-ml-thumb.jpg",
  duration = "9:25",
  views = "686K views",
  published = "4 months ago",
  grade = "Primary 5",
  lesson = "Elementary Science and Technology",
  unit = "Unit 1: How our body circulatory system works",
  href = "/watch?v=<id>",
}: CourseVideoCardProps) {
  return (
    <article className="group flex w-full items-center gap-1 rounded-2xl bg-[#111111] p-4 text-white transition hover:bg-[#151515]">
      <span className="w-5 text-sm font-semibold text-neutral-500">
        {index}
      </span>

      <Link href={href} className="flex items-start gap-4 flex-1">
        <div className="relative h-32 w-56 shrink-0 overflow-hidden rounded-xl">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover transition duration-500 group-hover:scale-[1.02]"
            sizes="(max-width: 768px) 60vw, 192px"
          />
          <span className="absolute bottom-2 right-2 rounded-md bg-black/75 px-2 py-0.5 text-xs font-semibold">
            {duration}
          </span>
        </div>

        <div className="flex flex-1 flex-col gap-2">
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
            {title}
          </h3>
          <p className="text-sm text-neutral-400">
            {views} <span className="mx-1 text-neutral-600">•</span> {published}
          </p>
          <div className="space-y-1 text-sm text-neutral-300">
            <p>
              <span className="font-semibold text-white">Grade:</span> {grade}
            </p>
            <p>
              <span className="font-semibold text-white">Lesson:</span> {lesson}
            </p>
            <p>
              <span className="font-semibold text-white line-clamp-1 truncate">
                Unit:
              </span>{" "}
              {unit}
            </p>
          </div>
        </div>
      </Link>

      <button
        type="button"
        className="ml-auto rounded-full p-2 text-neutral-400 transition hover:bg-[#1f1f1f] hover:text-white"
        aria-label="Course video options"
      >
        <MoreVertical size={18} />
      </button>
    </article>
  );
}
