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

export default function ChannelPage() {
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

  type StudyMaterial = {
    id: string;
    headline: string;
    supportingText?: string;
    fileName?: string;
    timeAgo: string;
    likes: string;
    thumbnail?: string;
    hasDownload?: boolean;
    edited?: boolean;
  };

  const studyMaterials: StudyMaterial[] = [
    {
      id: "mat-1",
      headline:
        "Well summarized notes covering all units and sub-topic in Devops application | Secondary #SoftwareDevelopment",
      fileName: "SWDOT501 Devops Application_085706.docx",
      timeAgo: "1 year ago",
      likes: "3.3K",
      hasDownload: true,
    },
    {
      id: "mat-2",
      headline:
        "13 new developments and controversies that happened in the technology industry in June 2024",
      supportingText: "Secondary | #EmergingTech",
      thumbnail: "/videos/ai-vs-ml-thumb.jpg",
      timeAgo: "1 year ago",
      likes: "3.4K",
      hasDownload: false,
      edited: true,
    },
    {
      id: "mat-3",
      headline:
        "What could you do today to practise most of the programming paradigms and tune up to become the greatest programmer that ever lived",
      timeAgo: "11 months ago",
      likes: "89K",
    },
  ];

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
              <button
                className="flex items-center gap-2 text-white border-white px-4 py-2 font-semibold"
                style={{ borderBottom: "2px solid" }}
              >
                {/* <PlaySquare size={16} /> */}
                Home
              </button>
              <Link
                href={`/${channelId}/videos`}
                className="flex items-center gap-2 px-4 py-2 text-neutral-300 border-b-2 border-transparent hover:border-[#717171] "
              >
                {/* <Film size={16} /> */}
                Videos
              </Link>
              <Link
                href={`/${channelId}/clips`}
                className="flex items-center gap-2 px-4 py-2 text-neutral-300 border-b-2 border-transparent hover:border-[#717171]"
              >
                {/* <ListVideo size={16} /> */}
                Short Clips
              </Link>
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
              <header className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Videos</h2>
              </header>
              <div className="relative">
                <button
                  onClick={() => scrollRow(videosRef, "left")}
                  className="absolute -left-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-[#212121] cursor-pointer p-3 text-white shadow transition hover:bg-[#4d4d4d] md:flex"
                  aria-label="Scroll videos left"
                >
                  <ChevronDown className="rotate-90" size={18} />
                </button>
                <div
                  ref={videosRef}
                  className="flex gap-4 overflow-x-hidden pb-2 pr-2 scrollbar-none"
                >
                  {Array.from({ length: channel.videos })
                    .slice(0, 10)
                    .map((_, index) => (
                      <div key={index} className="w-[320px] shrink-0">
                        <ChannelVideoCard />
                      </div>
                    ))}
                </div>
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/5 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-[#0f0f0f]/90 via-[#0f0f0f]/5 to-transparent" />
                <button
                  onClick={() => scrollRow(videosRef, "right")}
                  className="absolute -right-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-[#212121] cursor-pointer p-3 text-white shadow transition hover:bg-[#4d4d4d] md:flex"
                  aria-label="Scroll videos right"
                >
                  <ChevronDown className="-rotate-90" size={18} />
                </button>
              </div>
              <hr />
            </section>

            {/* Study materials */}
            <section className="flex flex-col gap-4">
              <header className="flex items-center gap-2">
                <h2 className="text-xl font-bold">Study Materials</h2>
              </header>
              <div className="relative">
                <button
                  onClick={() => scrollRow(materialsRef, "left")}
                  className="absolute -left-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-[#212121] cursor-pointer p-3 text-white shadow transition hover:bg-[#4d4d4d] md:flex"
                  aria-label="Scroll study materials left"
                >
                  <ChevronDown className="rotate-90" size={18} />
                </button>
                <div
                  ref={materialsRef}
                  className="flex gap-4 overflow-x-hidden pb-2 pr-2 scrollbar-none"
                >
                  {studyMaterials.map((material) => (
                    <article
                      key={material.id}
                      className="w-[360px] shrink-0 rounded-3xl border border-[#1f1f1f] bg-[#141414] p-4 transition hover:bg-[#1a1a1a]"
                    >
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 overflow-hidden rounded-full border border-[#2a2a2a]">
                          <Image
                            src={channel.avatar}
                            alt={channel.name}
                            fill
                            className="object-cover"
                            sizes="40px"
                          />
                        </div>
                        <div className="flex flex-col text-xs text-neutral-400">
                          <span className="text-sm font-semibold text-white">
                            {channel.name}
                          </span>
                          <span>{material.timeAgo}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex gap-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-neutral-100 leading-relaxed">
                            {material.headline}
                          </p>
                          {material.supportingText && (
                            <p className="mt-2 text-xs text-neutral-400">
                              {material.supportingText}
                            </p>
                          )}
                          {material.fileName && (
                            <p className="mt-2 text-xs font-medium text-neutral-500">
                              {material.fileName}
                            </p>
                          )}
                          {material.hasDownload && (
                            <button className="mt-3 inline-flex items-center gap-2 rounded-full border border-[#2d2d2d] bg-[#1b1b1b] px-4 py-1.5 text-xs font-semibold text-white transition hover:bg-[#232323]">
                              <FileDown size={16} /> Download
                            </button>
                          )}
                        </div>
                        {material.thumbnail && (
                          <div className="relative h-20 w-28 overflow-hidden rounded-xl border border-[#1f1f1f]">
                            <Image
                              src={material.thumbnail}
                              alt={material.headline}
                              fill
                              className="object-cover"
                              sizes="112px"
                            />
                          </div>
                        )}
                      </div>
                      <div className="mt-4 flex items-center gap-4 text-xs text-neutral-400">
                        <button className="flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white">
                          <ThumbsUp size={16} /> {material.likes}
                        </button>
                        <button className="flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white">
                          <ThumbsDown size={16} />
                        </button>
                        <button className="ml-auto flex items-center gap-1 rounded-full px-2 py-1 transition hover:text-white">
                          <Share2 size={16} />
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-16 bg-linear-to-r from-[#0f0f0f]/90 via-[#0f0f0f]/5 to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-16 bg-linear-to-l from-[#0f0f0f]/90 via-[#0f0f0f]/5 to-transparent" />
                <button
                  onClick={() => scrollRow(materialsRef, "right")}
                  className="absolute -right-6 top-1/2 z-20 hidden -translate-y-1/2 rounded-full bg-[#212121] cursor-pointer p-3 text-white shadow transition hover:bg-[#4d4d4d] md:flex"
                  aria-label="Scroll study materials right"
                >
                  <ChevronDown className="-rotate-90" size={18} />
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
