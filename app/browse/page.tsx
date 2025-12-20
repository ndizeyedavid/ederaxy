"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { ApiError } from "@/lib/api/client";
import { listCurriculums } from "@/lib/api/curriculums";
import { listSubjectsByCurriculum } from "@/lib/api/subjects";
import { listCourses } from "@/lib/api/courses";
import {
  Compass,
  GraduationCap,
  Layers,
  Play,
  PlayCircle,
  Search,
  Sparkles,
  Tag,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";

const topicFilters = [
  "STEM",
  "Revision",
  "Creative",
  "Career",
  "Short lessons",
  "Exam prep",
  "Coding",
  "Languages",
  "Finance",
  "Life skills",
];

const featuredVideo = {
  title: "Level-up Algebra: graph transformations explained visually",
  description:
    "A 14-minute visual breakdown that moves from basic functions to real-world modelling. Perfect when you need a confidence boost before homework.",
  thumbnail: "/videos/ai-vs-ml-thumb.jpg",
  href: "/watch",
  teacher: "Keisha Mbaye",
  level: "Secondary",
  duration: "14:21",
};

export default function BrowsePage() {
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<
    "forYou" | "curriculums" | "subjects" | "courses"
  >("forYou");
  const [isTabSwitching, setIsTabSwitching] = useState(false);
  const [activeFilter, setActiveFilter] = useState<
    "all" | "primary" | "secondary" | "tertiary" | "exam_prep"
  >("all");

  const [apiCurriculums, setApiCurriculums] = useState<
    { _id: string; title: string; description?: string | null }[]
  >([]);
  const [apiSubjects, setApiSubjects] = useState<
    { _id: string; title: string; description?: string | null }[]
  >([]);
  const [apiCourses, setApiCourses] = useState<
    { _id: string; title: string; description?: string | null }[]
  >([]);
  const [activeCurriculumId, setActiveCurriculumId] = useState<string | null>(
    null
  );
  const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    const tab = searchParams?.get("tab");
    const curriculumId = searchParams?.get("curriculumId");
    const subjectId = searchParams?.get("subjectId");

    if (tab === "forYou") setActiveTab("forYou");
    if (tab === "curriculums") setActiveTab("curriculums");
    if (tab === "subjects") setActiveTab("subjects");
    if (tab === "courses") setActiveTab("courses");

    if (curriculumId) setActiveCurriculumId(curriculumId);
    if (subjectId) setActiveSubjectId(subjectId);
  }, [searchParams]);

  useEffect(() => {
    setActiveFilter("all");
  }, [activeTab, activeSubjectId]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setApiError(null);
        const res = await listCurriculums();
        if (cancelled) return;
        setApiCurriculums(
          res.curriculums.map((c) => ({
            _id: c._id,
            title: c.title,
            description: c.description ?? null,
          }))
        );
        if (!activeCurriculumId && res.curriculums[0]?._id) {
          setActiveCurriculumId(res.curriculums[0]._id);
        }
      } catch (err) {
        if (cancelled) return;
        setApiError(err instanceof ApiError ? err.message : "Failed to load");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    if (activeTab !== "subjects") return;
    if (!activeCurriculumId) return;

    if (!searchParams?.get("subjectId")) {
      setActiveSubjectId(null);
    }

    (async () => {
      try {
        setApiError(null);
        const res = await listSubjectsByCurriculum(activeCurriculumId);
        if (cancelled) return;
        setApiSubjects(
          res.subjects.map((s) => ({
            _id: s._id,
            title: s.title,
            description: s.description ?? null,
          }))
        );
      } catch (err) {
        if (cancelled) return;
        setApiError(err instanceof ApiError ? err.message : "Failed to load");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeCurriculumId, activeTab]);

  useEffect(() => {
    let cancelled = false;

    if (activeTab !== "courses") return;

    const subjectId = activeSubjectId ?? undefined;

    (async () => {
      try {
        setApiError(null);
        const res = await listCourses({ subjectId });
        if (cancelled) return;
        setApiCourses(
          res.courses.map((c) => ({
            _id: c._id,
            title: c.title,
            description: c.description ?? null,
          }))
        );
      } catch (err) {
        if (cancelled) return;
        setApiError(err instanceof ApiError ? err.message : "Failed to load");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [activeTab, activeSubjectId]);

  useEffect(() => {
    setIsTabSwitching(true);
    const t = setTimeout(() => {
      setIsTabSwitching(false);
    }, 420);

    return () => {
      clearTimeout(t);
    };
  }, [activeTab]);

  const browseSections = useMemo(
    () => [
      {
        id: "fresh",
        title: "Fresh for you",
        description:
          "Quick, high-impact sessions based on what similar learners revisited this week.",
        cta: "View playlist",
        items: [
          {
            id: "fresh-1",
            title: "Design thinking crash course",
            teacher: "Lumi Anders",
            tag: "Creative",
            duration: "08:34",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Secondary",
            sentiment: "Most bookmarked",
          },
          {
            id: "fresh-2",
            title: "React hooks for beginners",
            teacher: "Marcus Patel",
            tag: "Coding",
            duration: "12:05",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Tertiary",
            sentiment: "Trending now",
          },
          {
            id: "fresh-3",
            title: "Chemistry lab prep: titrations explained",
            teacher: "Sana Rodriguez",
            tag: "STEM",
            duration: "09:19",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Upper Secondary",
            sentiment: "Teacher favourite",
          },
        ],
      },
      {
        id: "quickwins",
        title: "Need-it-now topics",
        description:
          "Bite-sized videos under 10 minutes to help you nail tonight's homework.",
        cta: "Browse short lessons",
        items: [
          {
            id: "quick-1",
            title: "Speed reading strategies",
            teacher: "Avery Njoroge",
            tag: "Life skills",
            duration: "07:02",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "All levels",
            sentiment: "Popular this week",
          },
          {
            id: "quick-2",
            title: "Understanding ratios with recipes",
            teacher: "Dr. Mei Wong",
            tag: "Revision",
            duration: "05:48",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Lower Secondary",
            sentiment: "Student pick",
          },
          {
            id: "quick-3",
            title: "Pitch your idea in 90 seconds",
            teacher: "Jamal Everett",
            tag: "Career",
            duration: "06:31",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Senior Secondary",
            sentiment: "Confidence booster",
          },
          {
            id: "quick-4",
            title: "Mindful study reset",
            teacher: "Lina Fernandez",
            tag: "Wellbeing",
            duration: "04:55",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "All levels",
            sentiment: "Most replayed",
          },
        ],
      },
      {
        id: "deepdives",
        title: "Deep dives",
        description:
          "Long-form lessons to binge when you're ready to stay curious for longer.",
        cta: "Explore series",
        items: [
          {
            id: "deep-1",
            title: "Full-stack portfolio project walkthrough",
            teacher: "Marcus Patel",
            tag: "Coding",
            duration: "32:44",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Tertiary",
            sentiment: "Project based",
          },
          {
            id: "deep-2",
            title: "Climate change and resilient cities",
            teacher: "FutureNow Talks",
            tag: "Humanities",
            duration: "28:12",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Upper Secondary",
            sentiment: "Panel discussion",
          },
          {
            id: "deep-3",
            title: "Finance fundamentals for teens",
            teacher: "David Okafor",
            tag: "Finance",
            duration: "24:58",
            thumbnail: "/videos/ai-vs-ml-thumb.jpg",
            href: "/watch",
            level: "Secondary",
            sentiment: "Starter kit",
          },
        ],
      },
    ],
    []
  );

  const placeholderCurriculumItems = useMemo(
    () => [
      {
        id: "cur-1",
        title: "REB (Rwanda)",
        subtitle: "K-12 • National curriculum",
        badge: "Popular",
        href: "/browse",
      },
      {
        id: "cur-2",
        title: "Cambridge",
        subtitle: "IGCSE • O/A level tracks",
        badge: "Structured",
        href: "/browse",
      },
      {
        id: "cur-3",
        title: "IB",
        subtitle: "DP • High-impact prep",
        badge: "Advanced",
        href: "/browse",
      },
      {
        id: "cur-4",
        title: "STEM Packs",
        subtitle: "Projects • Labs • Robotics",
        badge: "Hands-on",
        href: "/browse",
      },
    ],
    []
  );

  const placeholderSubjectItems = useMemo(
    () => [
      {
        id: "sub-1",
        title: "Mathematics",
        tag: "Secondary",
        lessons: "120 lessons",
        href: "/browse",
      },
      {
        id: "sub-2",
        title: "Physics",
        tag: "Upper Secondary",
        lessons: "88 lessons",
        href: "/browse",
      },
      {
        id: "sub-3",
        title: "Biology",
        tag: "Secondary",
        lessons: "94 lessons",
        href: "/browse",
      },
      {
        id: "sub-4",
        title: "Software Development",
        tag: "Tertiary",
        lessons: "140 lessons",
        href: "/browse",
      },
      {
        id: "sub-5",
        title: "English",
        tag: "All levels",
        lessons: "76 lessons",
        href: "/browse",
      },
      {
        id: "sub-6",
        title: "Entrepreneurship",
        tag: "Career",
        lessons: "42 lessons",
        href: "/browse",
      },
    ],
    []
  );

  const placeholderCourseItems = useMemo(
    () => [
      {
        id: "co-1",
        title: "Algebra essentials",
        subtitle: "Mathematics • Secondary",
        teacher: "Keisha Mbaye",
        thumb: "/videos/ai-vs-ml-thumb.jpg",
        href: "/browse",
      },
      {
        id: "co-2",
        title: "Intro to Robotics",
        subtitle: "STEM • Upper Secondary",
        teacher: "Dr. Ahmed Noor",
        thumb: "/videos/ai-vs-ml-thumb.jpg",
        href: "/browse",
      },
      {
        id: "co-3",
        title: "React for beginners",
        subtitle: "Software Dev • Tertiary",
        teacher: "Marcus Patel",
        thumb: "/videos/ai-vs-ml-thumb.jpg",
        href: "/browse",
      },
      {
        id: "co-4",
        title: "Chemistry exam prep",
        subtitle: "Chemistry • Secondary",
        teacher: "Sana Rodriguez",
        thumb: "/videos/ai-vs-ml-thumb.jpg",
        href: "/browse",
      },
    ],
    []
  );

  const curriculumItems = useMemo(() => {
    if (!apiCurriculums.length) return placeholderCurriculumItems;
    return apiCurriculums.map((c, idx) => ({
      id: c._id,
      title: c.title,
      subtitle: c.description ? String(c.description) : "Curriculum",
      badge: idx === 0 ? "Popular" : "Track",
      href: `/browse?tab=subjects&curriculumId=${c._id}`,
    }));
  }, [apiCurriculums, placeholderCurriculumItems]);

  const subjectItems = useMemo(() => {
    if (!apiSubjects.length) return placeholderSubjectItems;
    return apiSubjects.map((s) => ({
      id: s._id,
      title: s.title,
      tag: "Subject",
      lessons: "",
      href: `/browse?tab=courses&curriculumId=${
        activeCurriculumId ?? ""
      }&subjectId=${s._id}`,
    }));
  }, [activeCurriculumId, apiSubjects, placeholderSubjectItems]);

  const courseItems = useMemo(() => {
    if (!apiCourses.length) return placeholderCourseItems;
    return apiCourses.map((c) => ({
      id: c._id,
      title: c.title,
      subtitle: c.description ? String(c.description) : "Course",
      teacher: "",
      thumb: "/videos/ai-vs-ml-thumb.jpg",
      href: `/course/${c._id}`,
    }));
  }, [apiCourses, placeholderCourseItems]);

  const filterChips = useMemo(
    () =>
      [
        { key: "all" as const, label: "All" },
        { key: "primary" as const, label: "Primary" },
        { key: "secondary" as const, label: "Secondary" },
        { key: "tertiary" as const, label: "Tertiary" },
        { key: "exam_prep" as const, label: "Exam prep" },
      ] as const,
    []
  );

  const matchesFilter = (text: string) => {
    const hay = text.toLowerCase();
    if (activeFilter === "all") return true;
    if (activeFilter === "primary") return hay.includes("primary");
    if (activeFilter === "secondary") return hay.includes("secondary");
    if (activeFilter === "tertiary") return hay.includes("tertiary");
    if (activeFilter === "exam_prep")
      return hay.includes("exam") || hay.includes("prep");
    return true;
  };

  const filteredForYouSections = useMemo(() => {
    if (activeFilter === "all") return browseSections;
    return browseSections
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => {
          const combined = `${item.level} ${item.tag} ${item.sentiment}`;
          return matchesFilter(combined);
        }),
      }))
      .filter((section) => section.items.length > 0);
  }, [activeFilter, browseSections]);

  const discoveryTabs = useMemo(
    () =>
      [
        { key: "forYou" as const, label: "For you" },
        { key: "curriculums" as const, label: "Curriculums" },
        { key: "subjects" as const, label: "Subjects" },
        { key: "courses" as const, label: "Courses" },
      ] as const,
    []
  );

  const filteredSubjects = useMemo(() => {
    if (activeFilter === "all") return subjectItems;
    return subjectItems.filter((s) => matchesFilter(String(s.tag ?? "")));
  }, [activeFilter, subjectItems]);

  const filteredCourses = useMemo(() => {
    if (activeFilter === "all") return courseItems;
    return courseItems.filter((c) => matchesFilter(String(c.subtitle ?? "")));
  }, [activeFilter, courseItems]);

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-6 py-10">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full border border-[#242424] bg-[#141414] px-3 py-2 text-xs font-semibold text-neutral-200">
                  <Compass className="size-4 text-emerald-300" />
                  Explore
                </div>
                <div className="flex flex-wrap gap-2">
                  {discoveryTabs.map((tab) => {
                    const active = tab.key === activeTab;
                    return (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setActiveTab(tab.key)}
                        className={
                          active
                            ? "rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
                            : "rounded-full border border-[#242424] bg-[#141414] px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-[#1b1b1b]"
                        }
                      >
                        {tab.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden items-center gap-2 rounded-full border border-[#272727] bg-[#141414] px-4 md:flex">
                <Search className="size-4 text-neutral-500" />
                <Input
                  placeholder="Search subjects, courses, teachers"
                  className="h-9 w-[320px] border-0 bg-transparent! text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0"
                />
              </div>
            </div>

            <section className="relative overflow-hidden rounded-3xl border border-[#1f1f1f] bg-linear-to-r from-[#161616] via-[#111111] to-[#0f0f0f] px-8 py-10 shadow-[0_22px_60px_rgba(0,0,0,0.35)]">
              <div className="absolute inset-y-0 right-0 hidden w-[45%] bg-[radial-gradient(circle_at_center,rgba(79,209,197,0.18)_0%,transparent_65%)] md:block" />
              <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:gap-14">
                <div className="flex-1 space-y-6">
                  <div className="space-y-4">
                    <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                      Discover lessons that match the way you like to learn
                    </h1>
                    <p className="max-w-2xl text-sm text-neutral-300">
                      Filter by topic, duration, or vibe. Save the ones you plan
                      to watch later, and let the algorithm surface mentors
                      other students loved.
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,420px)_auto]">
                    <div className="flex items-center gap-2 rounded-full border border-[#272727] bg-[#141414] px-4">
                      <Search className="size-4 text-neutral-500" />
                      <Input
                        placeholder="Search for a skill, subject, or teacher"
                        className="h-9 border-0 bg-transparent! text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0"
                      />
                    </div>
                    <Button className="rounded-full bg-white px-6 text-sm font-semibold text-black hover:bg-white/90">
                      Start exploring
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {topicFilters.map((filter) => (
                      <button
                        key={filter}
                        className="group flex items-center gap-2 rounded-full border border-[#252525] bg-[#181818] px-3 py-2 text-xs font-medium text-neutral-300 transition hover:border-emerald-500/60 hover:text-white"
                      >
                        <Tag className="size-3 text-neutral-500 transition group-hover:text-emerald-300" />
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <Link
                  href={featuredVideo.href}
                  className="group relative flex w-full max-w-sm flex-col overflow-hidden rounded-3xl border border-[#222222] bg-[#101010] shadow-[0_18px_48px_rgba(0,0,0,0.35)] transition hover:border-emerald-500/50 hover:bg-[#111111]"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image
                      src={featuredVideo.thumbnail}
                      alt={featuredVideo.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 360px"
                      className="object-cover transition duration-500 group-hover:scale-[1.04]"
                    />
                    <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                      <div className="absolute inset-0 bg-black/35" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="flex size-14 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/10">
                          <Play
                            className="size-6 text-white"
                            fill="currentColor"
                          />
                        </div>
                      </div>
                    </div>
                    <span className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold">
                      <PlayCircle className="size-3.5" />
                      {featuredVideo.duration}
                    </span>
                  </div>
                  <div className="flex flex-col gap-3 px-5 py-6">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-emerald-300">
                      <Sparkles className="size-3" />
                      Featured for you
                    </div>
                    <h2 className="text-lg font-semibold leading-snug text-white">
                      {featuredVideo.title}
                    </h2>
                    <p className="text-sm text-neutral-300 line-clamp-3">
                      {featuredVideo.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-400">
                      <span>{featuredVideo.teacher}</span>
                      <span className="text-neutral-600">•</span>
                      <span>{featuredVideo.level}</span>
                    </div>
                    <Button className="mt-2 w-full rounded-full bg-emerald-500 text-sm font-semibold text-black transition hover:bg-emerald-400">
                      Watch now
                    </Button>
                  </div>
                </Link>
              </div>
            </section>

            <div className="sticky top-0 z-20 -mx-6 px-6 py-3 bg-[#0f0f0f]/85 backdrop-blur supports-backdrop-filter:bg-[#0f0f0f]/65 border-b border-white/5">
              <div className="flex flex-wrap items-center gap-2">
                {filterChips.map((chip) => {
                  const active = chip.key === activeFilter;
                  return (
                    <button
                      key={chip.key}
                      type="button"
                      onClick={() => setActiveFilter(chip.key)}
                      className={
                        active
                          ? "rounded-full bg-white px-4 py-2 text-xs font-semibold text-black"
                          : "rounded-full border border-[#242424] bg-[#141414] px-4 py-2 text-xs font-semibold text-neutral-200 transition hover:bg-[#1b1b1b]"
                      }
                    >
                      {chip.label}
                    </button>
                  );
                })}

                <span className="ml-2 text-xs text-white/40">
                  {activeFilter === "all"
                    ? "Showing everything"
                    : "Filtered (placeholder)"}
                </span>
              </div>
            </div>

            {isTabSwitching ? (
              <section className="space-y-4">
                <div className="h-6 w-64 rounded bg-white/5" />
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 6 }).map((_, idx) => (
                    <div
                      key={idx}
                      className="h-[170px] animate-pulse rounded-3xl border border-white/10 bg-white/5"
                    />
                  ))}
                </div>
              </section>
            ) : null}

            {!isTabSwitching && activeTab === "forYou" ? (
              <>
                {apiError ? (
                  <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 text-sm text-white/60">
                    {apiError}
                  </section>
                ) : null}
                {filteredForYouSections.length ? (
                  filteredForYouSections.map((section) => (
                    <section key={section.id} className="flex flex-col gap-4">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <div>
                          <h2 className="text-xl font-semibold text-white">
                            {section.title}
                          </h2>
                          <p className="text-sm text-neutral-400">
                            {section.description}
                          </p>
                        </div>
                        <Button
                          variant="secondary"
                          className="rounded-full border border-[#272727] bg-[#151515] px-4 text-xs font-semibold text-neutral-200 hover:bg-[#1d1d1d]"
                        >
                          {section.cta}
                        </Button>
                      </div>

                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {section.items.map((item) => (
                          <article
                            key={item.id}
                            className=" relative flex w-[260px] shrink-0 flex-col overflow-hidden rounded-3xl  bg-[#111111] shadow-[0_18px_40px_rgba(0,0,0,0.32)] transition hover:bg-[#141414]"
                          >
                            <Link
                              href={item.href}
                              className="group relative h-40 w-full overflow-hidden"
                            >
                              <Image
                                src={item.thumbnail}
                                alt={item.title}
                                fill
                                sizes="260px"
                                className="object-cover "
                              />
                              <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                                <div className="absolute inset-0 bg-black/35" />
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="flex size-12 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/10">
                                    <Play
                                      className="size-5 text-white"
                                      fill="currentColor"
                                    />
                                  </div>
                                </div>
                              </div>
                              <span className="absolute top-3 left-3 rounded-full bg-black/70 px-3 py-1 text-[11px] font-semibold">
                                {item.tag}
                              </span>
                              <span className="absolute bottom-3 right-3 rounded-md bg-black/75 px-2 py-0.5 text-[11px] font-semibold">
                                {item.duration}
                              </span>
                            </Link>

                            <div className="flex flex-1 flex-col gap-3 px-5 py-5">
                              <div className="space-y-2">
                                <h3 className="text-sm font-semibold leading-snug text-white line-clamp-2">
                                  {item.title}
                                </h3>
                                <div className="flex flex-wrap items-center gap-1 text-xs text-neutral-400">
                                  <Link
                                    href="/@mellow"
                                    className="hover:text-white"
                                  >
                                    {item.teacher}
                                  </Link>
                                  <span className="text-neutral-600">•</span>
                                  <span>{item.level}</span>
                                  <span className="text-neutral-600">•</span>
                                  <span>3.2K Views</span>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 text-[11px] text-emerald-300">
                                <Sparkles className="size-3" />
                                {item.sentiment}
                              </div>

                              <div className="mt-auto flex items-center gap-3">
                                <Button
                                  asChild
                                  className="flex-1 rounded-full bg-white px-4 text-xs font-semibold text-black hover:bg-white/90"
                                >
                                  <Link href={item.href}>Play</Link>
                                </Button>
                              </div>
                            </div>
                          </article>
                        ))}
                      </div>
                    </section>
                  ))
                ) : (
                  <section className="rounded-3xl border border-white/10 bg-[#111111] p-6 text-sm text-white/60">
                    No videos match this filter yet.
                  </section>
                )}
              </>
            ) : null}

            {!isTabSwitching && activeTab === "curriculums" ? (
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">
                    Choose your curriculum
                  </h2>
                  <p className="text-sm text-neutral-400">
                    Pick the learning track you follow, then drill down into
                    subjects and courses.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {curriculumItems.map((c) => (
                    <Link
                      key={c.id}
                      href={c.href}
                      className="group rounded-3xl border border-[#1f1f1f] bg-[#111111] p-5 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition hover:border-emerald-500/50 hover:bg-[#141414]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-200">
                          <GraduationCap className="size-5" />
                        </div>
                        <span className="rounded-full border border-[#2a2a2a] bg-black/20 px-3 py-1 text-[11px] font-semibold text-neutral-200">
                          {c.badge}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">
                        {c.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-400">
                        {c.subtitle}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 transition group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15">
                          Explore subjects
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}

            {!isTabSwitching && activeTab === "subjects" ? (
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Subjects</h2>
                  <p className="text-sm text-neutral-400">
                    Jump straight to a subject and find the courses inside.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredSubjects.map((s) => (
                    <Link
                      key={s.id}
                      href={s.href}
                      className="group rounded-3xl border border-[#1f1f1f] bg-[#111111] p-5 shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition hover:border-emerald-500/50 hover:bg-[#141414]"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="inline-flex size-10 items-center justify-center rounded-2xl bg-white/5 text-neutral-200">
                          <Layers className="size-5" />
                        </div>
                        <span className="rounded-full border border-[#2a2a2a] bg-black/20 px-3 py-1 text-[11px] font-semibold text-neutral-200">
                          {s.tag}
                        </span>
                      </div>
                      <h3 className="mt-4 text-lg font-semibold text-white">
                        {s.title}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-400">
                        {s.lessons}
                      </p>
                      <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-emerald-300">
                        <span className="rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 transition group-hover:border-emerald-500/40 group-hover:bg-emerald-500/15">
                          View courses
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>

                {!filteredSubjects.length ? (
                  <div className="rounded-3xl border border-white/10 bg-[#111111] p-6 text-sm text-white/60">
                    No subjects match this filter yet.
                  </div>
                ) : null}
              </section>
            ) : null}

            {!isTabSwitching && activeTab === "courses" ? (
              <section className="space-y-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Courses</h2>
                  <p className="text-sm text-neutral-400">
                    Pick a course and start lesson-by-lesson.
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredCourses.map((course) => (
                    <Link
                      key={course.id}
                      href={course.href}
                      className="group overflow-hidden rounded-3xl border border-[#1f1f1f] bg-[#111111] shadow-[0_18px_36px_rgba(0,0,0,0.35)] transition hover:border-emerald-500/50 hover:bg-[#141414]"
                    >
                      <div className="relative h-40 w-full overflow-hidden">
                        <Image
                          src={course.thumb}
                          alt={course.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 360px"
                          className="object-cover transition duration-500 group-hover:scale-[1.03]"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />
                        <div className="pointer-events-none absolute inset-0 opacity-0 transition group-hover:opacity-100">
                          <div className="absolute inset-0 bg-black/25" />
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="flex size-12 items-center justify-center rounded-full bg-black/70 ring-1 ring-white/10">
                              <Play
                                className="size-5 text-white"
                                fill="currentColor"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full bg-black/65 px-3 py-1 text-[11px] font-semibold">
                          <PlayCircle className="size-3.5" />
                          Start course
                        </div>
                      </div>
                      <div className="p-5">
                        <h3 className="text-base font-semibold text-white line-clamp-2">
                          {course.title}
                        </h3>
                        <p className="mt-1 text-sm text-neutral-400">
                          {course.subtitle}
                        </p>
                        <p className="mt-3 text-xs text-neutral-400">
                          Teacher{" "}
                          <span className="text-neutral-200 font-semibold">
                            {course.teacher}
                          </span>
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            ) : null}
          </div>
        </div>
      </div>
    </main>
  );
}
