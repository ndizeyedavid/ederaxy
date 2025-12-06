import Image from "next/image";
import Link from "next/link";

export default function ChannelVideoCard() {
  return (
    <article className="rounded-2xl hover:bg-[#141414] p-2 overflow-hidden cursor-pointer">
      <Link href="/watch?v=<id>">
        <div className="relative aspect-video rounded-2xl overflow-hidden w-full">
          <Image
            src="/videos/ai-vs-ml-thumb.jpg"
            alt="Ai vs ml thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 360px"
          />
          <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-0.5 text-xs font-semibold text-white">
            3:21
          </span>
        </div>
      </Link>
      <div className="px-1 py-3">
        <Link
          href="/watch?v=<id>"
          className="line-clamp-2 text-lg font-semibold text-white"
        >
          Difference between machine learning and AI
        </Link>
        <div className="mt-1 text-neutral-400 text-xs truncate">
          L5 SOD | Machine Learning | Unit 1: Introduction to Machine Learning
        </div>
        <div className="mt-1 text-xs text-neutral-400 flex flex-wrap items-center gap-1">
          <span>230 views</span>
          <span className="text-neutral-600">•</span>
          <span>3 days ago</span>
          <span className="text-neutral-600 ">•</span>
          <span className="font-semibold">Secondary</span>
        </div>
      </div>
    </article>
  );
}
