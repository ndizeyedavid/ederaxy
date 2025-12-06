import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BadgeCheck, BellRing, PlaySquare } from "lucide-react";

const subscribedTeachers = [
  {
    id: "teacher-1",
    name: "Lina Fernandez",
    handle: "@coachlina",
    subject: "Physics & Advanced Mechanics",
    level: "Secondary",
    avatar: "/users/1.jpg",
    banner: "/banners/Mixed-languages.jpg",
    newVideos: 3,
    subscribers: "42.1K",
    since: "Subscribed 5 months ago",
    highlights: ["Exam Prep", "Interactive Labs"],
    latestLesson: "How to read complex motion graphs in under 5 minutes",
  },
  {
    id: "teacher-2",
    name: "Marcus Patel",
    handle: "@marcuslearns",
    subject: "Full-stack Development",
    level: "Tertiary",
    avatar: "/users/2.jpeg",
    banner: "/banners/Mixed-languages.jpg",
    newVideos: 1,
    subscribers: "68.5K",
    since: "Subscribed 1 year ago",
    highlights: ["Project Workshops", "Weekly Challenges"],
    latestLesson: "Deploying a Next.js app with CI/CD in 12 minutes",
  },
  {
    id: "teacher-3",
    name: "Keisha Mbaye",
    handle: "@keishamaths",
    subject: "Mathematics & Data Literacy",
    level: "Primary & Lower Secondary",
    avatar: "/users/3.jpeg",
    banner: "/banners/Mixed-languages.jpg",
    newVideos: 4,
    subscribers: "25.9K",
    since: "Subscribed 2 months ago",
    highlights: ["Gamified Practice", "Printable Worksheets"],
    latestLesson: "Probability made visual with everyday objects",
  },
  {
    id: "teacher-4",
    name: "Dr. Ahmed Noor",
    handle: "@stemwithnoor",
    subject: "STEM & Robotics",
    level: "Upper Secondary",
    avatar: "/users/4.jpg",
    banner: "/banners/Mixed-languages.jpg",
    newVideos: 0,
    subscribers: "91.2K",
    since: "Subscribed 8 months ago",
    highlights: ["Live Builds", "Hardware Kits"],
    latestLesson: "Designing a sensor network for smart farms",
  },
];

export default function SubscriptionPage() {
  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 py-8">
            <header className="flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h1 className="text-3xl font-bold tracking-tight">
                    Your subscribed teachers
                  </h1>
                  <p className="mt-2 text-sm text-neutral-400">
                    Catch up with the mentors you follow. See who posted new
                    lessons, join live sessions, and jump straight back into
                    their content.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-emerald-500 px-5 text-sm font-semibold text-black hover:bg-emerald-400"
                  >
                    <Link href="/discover/teachers">
                      Discover more teachers
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-neutral-400">
                <span className="rounded-full border border-[#242424] px-3 py-1">
                  {subscribedTeachers.length} teachers
                </span>
              </div>
            </header>

            <section className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {subscribedTeachers.map((teacher) => (
                <article
                  key={teacher.id}
                  className="group relative flex flex-col overflow-hidden rounded-3xl bg-[#111111] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition hover:bg-[#141414]"
                >
                  <div className="relative h-36 w-full">
                    <Image
                      src={teacher.banner}
                      alt={`${teacher.name} banner`}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover brightness-[0.85]"
                    />
                    <div className="absolute inset-0 bg-linear-to-r  from-black/60 via-black/20 to-black/60" />
                    <div className="absolute -bottom-10 left-5 z-2000">
                      <div className="relative size-20  overflow-hidden rounded-full border-4 border-[#111111] shadow-lg">
                        <Image
                          src={teacher.avatar}
                          alt={teacher.name}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-1 flex-col gap-3 px-6 pb-6 pt-12">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-lg font-semibold">
                        <span>{teacher.name}</span>
                        <BadgeCheck className="size-4 text-emerald-400 mt-0.5" />
                      </div>
                      <Link
                        href="/@mellow"
                        className="text-sm text-neutral-400 hover:text-white"
                      >
                        {teacher.handle}
                      </Link>
                      <div className="text-xs uppercase tracking-wide text-neutral-500">
                        {teacher.subject} • {teacher.level}
                      </div>
                    </div>

                    <div className="space-y-2 text-sm text-neutral-300">
                      <Link
                        href="/watch?v=<id>"
                        className="flex items-center gap-1 hover:text-neutral-100 text-neutral-300"
                      >
                        <PlaySquare className="size-4 text-emerald-400" />
                        Latest:
                        <span className="font-medium line-clamp-1">
                          {teacher.latestLesson}
                        </span>
                      </Link>

                      <p className="text-xs text-neutral-500">
                        {teacher.since}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1 text-xs">
                      <span className="text-neutral-100 font-semibold text-sm">
                        {teacher.subscribers} subscribers
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button
                        asChild
                        className="flex-1 rounded-full bg-white px-4 text-sm font-semibold text-black transition hover:bg-white/90"
                      >
                        <Link href={`/${teacher.handle.replace("@", "")}`}>
                          Go to channel
                        </Link>
                      </Button>
                      <Button
                        variant="secondary"
                        className="rounded-full border border-red-800/50 bg-red-600/10 px-4 text-sm text-neutral-200 hover:bg-bg-red-600/70"
                      >
                        Unsubscribe
                      </Button>
                    </div>
                  </div>
                </article>
              ))}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
