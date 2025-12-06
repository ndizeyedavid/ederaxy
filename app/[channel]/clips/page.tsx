"use client";
import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { useParams } from "next/navigation";
import Image from "next/image";
import { useRef, type RefObject } from "react";
import {
  BadgeCheckIcon,
  BellRing,
  ChevronDown,
  PlaySquare,
  Film,
  ListVideo,
  Search,
  ThumbsUp,
  ThumbsDown,
  Share2,
  FileDown,
} from "lucide-react";
import ChannelVideoCard from "@/components/VideoCard/ChannelVideoCard";
import Link from "next/link";
import ShortClipCard from "@/components/VideoCard/ShortClipCard";

export default function ChannelClipssPage() {
  const params: any = useParams();
  const channelId = decodeURIComponent(params.channel ?? "");

  const channel = {
    name: channelId || "Educator",
    banner: "/banners/Mixed-languages.jpg",
    avatar: "/users/1.jpg",
    subscribers: "1.05K",
    videos: 20,
    bio: "High-intensity programming lessons and tech news to help you elvate your Knowledge way faster",
    verified: true,
  };

  const videosRef = useRef<HTMLDivElement | null>(null);
  const materialsRef = useRef<HTMLDivElement | null>(null);

  const scrollRow = (
    ref: RefObject<HTMLDivElement | null>,
    direction: "left" | "right"
  ) => {
    const container = ref.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <main className="h-screen w-screen overflow-hidden flex flex-col  text-white bg-[#0f0f0f]">
      <Header />
      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <div className="fixed top-12 left-0 h-screen z-30">
          <Sidebar />
        </div>

        <div className="flex-1 ml-60 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-6 py-6">
            {/* Channel banner */}
            <div className="relative h-56 w-full overflow-hidden rounded-3xl border border-[#1f1f1f]">
              <Image
                src={channel.banner}
                alt={`${channel.name} banner`}
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 960px"
                priority
              />
            </div>
            {/* Channel header */}
            <div className="flex flex-col gap-6 rounded-3xl px-6 py-6">
              <div className="flex flex-wrap gap-6">
                <div className="relative size-[180px] overflow-hidden rounded-full border-4 border-[#0f0f0f] -mt-24">
                  <Image
                    src={channel.avatar}
                    alt={channel.name}
                    fill
                    className="object-cover"
                    sizes="112px"
                  />
                </div>

                <div className="flex-1 min-w-[220px]">
                  <div className="flex flex-wrap items-center gap-2 text-3xl font-bold">
                    <span>{channel.name}</span>
                    {channel.verified && (
                      <BadgeCheckIcon
                        className="text-emerald-400 mt-1"
                        size={18}
                      />
                    )}
                  </div>

                  <div className="mt-1 text-sm text-neutral-300 flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-white">
                      {channelId || "@educator"}
                    </span>
                    <span className="text-[#9baaaa]">•</span>
                    <span className="text-[#9baaaa]">
                      {channel.subscribers} subscribers
                    </span>
                    <span className="text-[#9baaaa]">•</span>
                    <span className="text-[#9baaaa]">
                      {channel.videos} videos
                    </span>
                  </div>

                  <p className="mt-2.5 max-w-2xl text-sm text-[#AAAAAA]">
                    {channel.bio}
                  </p>

                  <div className="mt-3">
                    <button className="flex items-center gap-2 rounded-full bg-[#2fb258] px-3 py-2 text-sm font-semibold  border hover:bg-[#2fb258]/80 cursor-pointer transition">
                      <BellRing className="text-white mt-0.5" />
                      Subscribed
                      <ChevronDown className="ml-1" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* Channel navigation */}
            <nav className="sticky top-0 z-20 flex items-center gap-1 text-[16px] overflow-x-auto  bg-[#0f0f0f]/80 backdrop-blur-lg px-3 py-1 ">
              <Link
                href={`/${channelId}`}
                className="flex items-center gap-2  text-neutral-300  border-transparent hover:border-[#717171] border-b-2  px-4 py-2 font-semibold"
              >
                {/* <PlaySquare size={16} /> */}
                Home
              </Link>
              <Link
                href={`/${channelId}/videos`}
                className="flex items-center gap-2 px-4 py-2   text-neutral-300 border-b-2 border-transparent hover:border-[#717171] "
              >
                {/* <Film size={16} /> */}
                Videos
              </Link>
              <button className="flex items-center gap-2 px-4 py-2  text-white border-white border-b-2">
                {/* <ListVideo size={16} /> */}
                Short Clips
              </button>
              <Link
                href={`/${channelId}/courses`}
                className="flex items-center gap-2 px-4 py-2 text-neutral-300 border-b-2 border-transparent hover:border-[#717171]"
              >
                {/* <PlaySquare size={16} /> */}
                Courses
              </Link>
              <button className="ml-auto flex items-center gap-2 p-2 text-neutral-300 border-2 rounded-full border-transparent hover:border-[#717171]">
                <Search size={16} />
                {/* Search */}
              </button>
            </nav>
            {/* Videos section */}
            <section className="flex flex-col gap-4">
              <div className="grid grid-cols-5 gap-5">
                <ShortClipCard />
                <ShortClipCard />
                <ShortClipCard />
                <ShortClipCard />
                <ShortClipCard />
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
