import Image from "next/image";
import { MoreVertical } from "lucide-react";

export default function SuggestedVideoCard() {
  return (
    <div className="flex w-full items-start gap-3 rounded-2xl px-2 py-3 hover:bg-[#1e1e1e] transition-colors">
      {/* Thumbnail */}
      <div className="relative w-48 shrink-0 overflow-hidden rounded-xl">
        <div className="relative aspect-video w-full">
          <Image
            src="/videos/ai-vs-ml-thumb.jpg"
            alt="Functions of a Kernel in OS"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 192px"
          />
        </div>
        <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-2 py-0.5 text-xs font-semibold text-white">
          12:02
        </span>
      </div>

      {/* Details */}
      <div className="flex flex-1 items-start gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-snug text-white line-clamp-2">
            How a Kernel works - Develop Hobby Kernel #computerSystem
          </h3>
          <p className="mt-1 text-xs text-neutral-300">KABUTORE Boniface</p>
          <div className="mt-1 flex flex-wrap items-center gap-1 text-[13.5px] text-neutral-400">
            <span>686K views</span>
            <span className="text-neutral-500">•</span>
            <span>4 months ago</span>
            <span className="text-neutral-500">•</span>
            <span className="font-semibold ">Secondary</span>
            <span className="text-neutral-500">|</span>
            <span className="font-semibold ">University</span>
          </div>
          <p className="mt-1 text-xs text-neutral-400 truncate">
            L5 CSA | Hobby Kernel | Unit 1: What is a Kernel
          </p>
        </div>

        <button className="text-neutral-400 transition hover:text-white hover:bg-[#4f4f4f] p-2 rounded-full">
          <MoreVertical size={20} />
        </button>
      </div>
    </div>
  );
}
