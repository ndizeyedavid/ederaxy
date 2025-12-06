"use client";

import Image from "next/image";
import Link from "next/link";
import { ListVideo } from "lucide-react";

type CourseCollectionCardProps = {
  thumbnail?: string;
  title?: string;
  href?: string;
  videoCount?: number;
  subtitle?: string;
};

export default function CourseCollectionCard({
  thumbnail = "/videos/ai-vs-ml-thumb.jpg",
  title = "Apply machine learning in workplaces",
  href = "/course/<id>",
  videoCount = 5,
  subtitle = "View full playlist",
}: CourseCollectionCardProps) {
  const badgeLabel = `${videoCount} ${videoCount === 1 ? "Lesson" : "Lessons"}`;

  return (
    <article className="group w-[280px] shrink-0 cursor-pointer overflow-hidden rounded-xl transition hover:bg-[#161616]">
      <Link href={href} className="block">
        <div className="relative mx-auto mt-3 aspect-video w-full max-w-[260px]">
          <div className="absolute inset-0 -translate-y-[12px] scale-[0.97] rounded-lg border border-[#0f0f0f]  bg-[#424651] blur-[0.2px]" />
          <div className="absolute inset-0 -translate-y-[6px] scale-[0.985] rounded-lg border border-[#0f0f0f] bg-[#767d93]" />
          <div className="relative aspect-video w-full overflow-hidden rounded-lg ">
            <Image
              src={thumbnail}
              alt={title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 80vw, 280px"
              priority={false}
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-black/75 px-3 py-1 text-xs font-semibold text-white shadow-lg">
              <ListVideo size={16} />
              <span>{badgeLabel}</span>
            </div>
          </div>
        </div>
        <div className="space-y-1.5 px-3 py-4">
          <h3 className="line-clamp-2 text-base font-semibold text-white">
            {title}
          </h3>
          <p className="text-sm font-medium text-neutral-400">{subtitle}</p>
        </div>
      </Link>
    </article>
  );
}
