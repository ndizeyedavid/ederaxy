import React from "react";
import Image from "next/image";
import { MoreVertical } from "lucide-react";
import Link from "next/link";

export default function VideoCard() {
  return (
    <div className="transition-all p-2 hover:bg-[#232323] rounded-2xl overflow-hidden shadow-lg w-full max-w-xl">
      {/* Thumbnail */}
      <Link href="/watch?v=<id>">
        <div className="relative w-full aspect-video">
          <Image
            src="/videos/ai-vs-ml-thumb.jpg"
            alt="AI vs Machine Learning"
            fill
            className="object-cover w-full h-full rounded-xl"
          />
          {/* Duration */}
          <span className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-semibold px-2 py-0.5 rounded">
            6:47
          </span>
        </div>
      </Link>
      {/* Video Info */}
      <div className="relative flex gap-3 px-3 pt-3 pb-2">
        {/* Channel Avatar */}

        <Image
          src="/users/3.jpeg"
          alt="IRABA Arsene"
          width={44}
          height={44}
          className="rounded-full object-cover w-11 h-11"
        />
        {/* Details */}
        <div className="flex-1 min-w-0">
          <Link
            href="/watch?v=<id>"
            className="text-white font-semibold leading-snug text-base line-clamp-2"
          >
            Difference between artificial intelligence and Machine learning.
          </Link>
          <div className="text-neutral-400 text-xs mt-0.5 truncate">
            L5 SOD | Machine Learning | Unit 1: Introduction to Machine Learning
          </div>
          <Link
            href="/@channel-id"
            className="font-medium text-xs text-neutral-400 hover:text-[#f1f1f1]"
          >
            IRABA Arsene
          </Link>
          <div className="flex flex-wrap items-center gap-1 text-neutral-400 text-xs mt-0.5">
            <span>18K views</span>
            <span className="mx-1">•</span>
            <span>5 days ago</span>
            <span className="mx-1">•</span>
            <span className="text-blue-300">Secondary</span>
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
