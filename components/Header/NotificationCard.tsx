import Image from "next/image";
import React from "react";

export default function NotificationCard({ item }: { item: any }) {
  return (
    <article className="flex items-start gap-3 cursor-pointer hover:bg-[#3e3e3e] px-3 py-3 transition">
      <div className="relative mt-1 size-9 overflow-hidden rounded-full bg-[#2a2a2a]">
        <Image
          src={item.avatar}
          alt={item.channel}
          fill
          className="object-cover"
          sizes="36px"
        />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
          {item.title}
        </p>
        <p className="mt-1 text-xs text-neutral-400">{item.timeAgo}</p>
      </div>
      <div className="relative h-16 w-24 overflow-hidden rounded-md">
        <Image
          src={item.thumbnail}
          alt={item.title}
          fill
          className="object-cover"
          sizes="96px"
        />
      </div>
    </article>
  );
}
