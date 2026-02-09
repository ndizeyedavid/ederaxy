import React from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

type VideoCardProps = {
  lessonId?: string;
  title?: string;
  thumbnailUrl?: string;
  duration?: string;
  channelName?: string;
  channelAvatarUrl?: string;
  subtitle?: string;
  metaLeft?: string;
  metaRight?: string;
};

function resolveBackendUrl(rawUrl?: string | null) {
  if (!rawUrl) return undefined;
  if (rawUrl.startsWith("http://") || rawUrl.startsWith("https://")) {
    return rawUrl;
  }
  const apiBaseUrl =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/+$/, "") ||
    "http://localhost:8080";
  return `${apiBaseUrl}${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
}

export default function VideoCard({
  lessonId,
  title,
  thumbnailUrl,
  duration,
  channelName,
  channelAvatarUrl,
  subtitle,
  metaLeft,
  metaRight,
}: VideoCardProps) {
  const watchHref = lessonId ? `/watch/${lessonId}` : "/watch";
  const resolvedThumb =
    resolveBackendUrl(thumbnailUrl) ?? "/videos/ai-vs-ml-thumb.jpg";
  const resolvedAvatar =
    resolveBackendUrl(channelAvatarUrl) ?? "/users/default-avatar.svg";

  const thumbIsRemote = resolvedThumb.startsWith("http");
  const avatarIsRemote = resolvedAvatar.startsWith("http");

  const displayTitle =
    title ?? "Difference between artificial intelligence and Machine learning.";
  const displayDuration = duration ?? "6:47";
  const displayChannel = channelName ?? "IRABA Arsene";
  const displaySubtitle =
    subtitle ??
    "L5 SOD | Machine Learning | Unit 1: Introduction to Machine Learning";
  const displayMetaLeft = metaLeft ?? "18K views";
  const displayMetaRight = metaRight ?? "5 days ago";
  return (
    <div className="transition-all p-2 hover:bg-[#232323] rounded-2xl overflow-hidden shadow-lg w-full max-w-xl">
      {/* Thumbnail */}
      <Link href={watchHref}>
        <div className="relative w-full aspect-video">
          <Image
            src={resolvedThumb}
            alt={displayTitle}
            fill
            unoptimized={thumbIsRemote}
            className="object-cover w-full h-full rounded-xl"
          />
          {/* Duration */}
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-0.5 rounded">
            {displayDuration}
          </span>
        </div>
      </Link>
      {/* Video Info */}
      <div className="relative flex gap-3 px-3 pt-3 pb-2">
        {/* Channel Avatar */}

        <Image
          src={resolvedAvatar}
          alt={displayChannel}
          width={44}
          height={44}
          unoptimized={avatarIsRemote}
          className="rounded-full object-cover w-11 h-11"
        />
        {/* Details */}
        <div className="flex-1 min-w-0">
          <Link
            href={watchHref}
            className="text-white font-semibold leading-snug text-base line-clamp-2"
          >
            {displayTitle}
          </Link>
          <div className="text-neutral-400 text-xs mt-0.5 truncate">
            {displaySubtitle}
          </div>
          <Link
            href="/@channel-id"
            className="font-medium text-xs text-neutral-400 hover:text-[#f1f1f1]"
          >
            {displayChannel}
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-neutral-400 text-xs mt-0.5">
            <span>{displayMetaLeft}</span>
            <span className="mx-1">•</span>
            <span>{displayMetaRight}</span>
          </div>
        </div>
        {/* Menu */}
        <button className="absolute -right-1 text-neutral-300 hover:text-white p-1.5 hover:bg-[#4f4f4f] rounded-full">
          <MoreVertical size={22} />
        </button>
      </div>
    </div>
  );
}
