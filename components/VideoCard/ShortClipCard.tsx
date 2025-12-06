"use client";

import Image from "next/image";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

type ShortClipCardProps = {
  thumbnail?: string;
  title?: string;
  views?: string;
  href?: string;
};

export default function ShortClipCard({
  thumbnail = "/videos/ai-vs-ml-thumb.jpg",
  title = "This rubber duck can debug your code",
  views = "425K views",
  href = "/clips/<id>",
}: ShortClipCardProps) {
  return (
    <article className="group w-[220px] shrink-0 cursor-pointer overflow-hidden rounded-xl transition hover:bg-[#161616]">
      <Link href={href} className="block">
        <div className="relative aspect-9/12 w-full overflow-hidden rounded-lg">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 60vw, 220px"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
          <button
            className="absolute right-2 top-2 rounded-full bg-black/70 p-1.5 text-white opacity-0 transition group-hover:opacity-100"
            type="button"
            aria-label="Open clip menu"
            onClick={(event) => event.preventDefault()}
          >
            <MoreVertical size={16} />
          </button>
        </div>
        <div className="space-y-2 px-3 py-4">
          <h3 className="line-clamp-2 text-sm font-semibold text-white">
            {title}
          </h3>
          <p className="text-xs font-medium text-neutral-400">{views}</p>
        </div>
      </Link>
    </article>
  );
}
