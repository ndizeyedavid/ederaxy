"use client";

import Header from "@/components/Header/Header";
import Sidebar from "@/components/Sidebar/Sidebar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Clock,
  Compass,
  GraduationCap,
  LifeBuoy,
  MessageCircle,
  NotebookPen,
  PlayCircle,
  Rocket,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { useState } from "react";
import type { LucideIcon } from "lucide-react";

type Highlight = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type GuidanceSection = {
  title: string;
  description: string;
  icon: LucideIcon;
  steps: string[];
};

type Audience = {
  title: string;
  description: string;
  icon: LucideIcon;
  bullets: string[];
};

type ResourceCard = {
  title: string;
  description: string;
  href: string;
  actionLabel: string;
  icon: LucideIcon;
};

type Faq = {
  question: string;
  answer: string;
};

const highlights: Highlight[] = [
  {
    title: "Personalised learning journeys",
    description:
      "Follow teachers, build playlists, and track streaks so every session compounds toward your goals.",
    icon: Compass,
  },
  {
    title: "Clips that spark momentum",
    description:
      "Jump into snackable Shorts when you have five minutes, then dive deeper with matching full lessons.",
    icon: Sparkles,
  },
  {
    title: "Guidance from top educators",
    description:
      "Discover verified teachers, see their latest drops, and join communities designed for your exam level.",
    icon: GraduationCap,
  },
];

const guidanceSections: GuidanceSection[] = [
  {
    title: "Discover & plan",
    description:
      "Use Browse, Subscriptions, and smart filters to map the next skills you want to unlock.",
    icon: NotebookPen,
    steps: [
      "Search or filter by subject, level, or exam board from the hero search.",
      "Save favourites with the heart icon to build your personal queue.",
      "Follow teachers so their new lessons and office hours surface instantly.",
    ],
  },
  {
    title: "Learn with focus",
    description:
      "Switch between immersive videos and Shorts-style clips to match your energy and schedule.",
    icon: PlayCircle,
    steps: [
      "Use Theatre mode and transcripts to take notes alongside any lesson.",
      "Queue related clips for active recall and quick refreshers between study blocks.",
      "Track progress bars in History to resume exactly where you left off.",
    ],
  },
  {
    title: "Stay consistent",
    description:
      "Set learning streaks, celebrate milestones, and revisit liked content to reinforce knowledge.",
    icon: Rocket,
    steps: [
      "Start weekly challenges from your dashboard to keep momentum high.",
      "Rewatch liked lessons with friends or classmates to compare approaches.",
      "Export notes and share playlists with study partners in a click.",
    ],
  },
];

const audiences: Audience[] = [
  {
    title: "Students",
    description:
      "Level up exam prep, portfolio projects, or uni readiness with guided playlists and streak rewards.",
    icon: Users,
    bullets: [
      "Use Subscriptions to follow teachers who match your exam board.",
      "Download recap sheets and flashcard decks from lesson resources.",
      "Keep a pulse on your watch history to balance revision and discovery.",
    ],
  },
  {
    title: "Teachers & mentors",
    description:
      "Share structured learning paths, track student engagement, and surface mixed media resources.",
    icon: MessageCircle,
    bullets: [
      "Publish clip highlights to summarise each module in under a minute.",
      "Embed comprehension check-ins or polls after every milestone video.",
      "Collaborate with fellow educators to co-create collections.",
    ],
  },
  {
    title: "Parents & supporters",
    description:
      "Stay informed about progress, celebrate wins, and recommend focus areas without micromanaging.",
    icon: ShieldCheck,
    bullets: [
      "Review highlights and notes from students’ latest sessions.",
      "Share motivation boosts via Shorts to keep energy high.",
      "Bookmarked safety resources ensure content stays age-appropriate.",
    ],
  },
];

const resources: ResourceCard[] = [
  {
    title: "Learning playbook",
    description:
      "Step-by-step checklist to plan your first week, set reminders, and create balanced study sprints.",
    href: "/browse",
    actionLabel: "Browse the catalog",
    icon: Compass,
  },
  {
    title: "Need a boost?",
    description:
      "Visit your History timeline to resume partially watched lessons or refresh last week’s wins.",
    href: "/feed/History",
    actionLabel: "Open history",
    icon: Clock,
  },
  {
    title: "Ask the community",
    description:
      "Drop questions, share wins, and join live office hours hosted by mentor teachers and alumni.",
    href: "/discover/teachers",
    actionLabel: "Find mentors",
    icon: LifeBuoy,
  },
];

const faqs: Faq[] = [
  {
    question: "How do I choose the right lessons for my goal?",
    answer:
      "Start with the Browse page filters. Pick your subject and difficulty, preview lesson outlines, then add them to your watch queue. The platform will recommend complementary Shorts and deep dives based on your picks.",
  },
  {
    question: "Is all the content free to watch?",
    answer:
      "Many discovery lessons and micro-clips are free. Premium series and live cohorts are available through teacher subscriptions, which unlock resource downloads, live Q&A, and priority feedback.",
  },
  {
    question: "Can I use Ederaxy on mobile?",
    answer:
      "Yes. The responsive layout lets you watch clips, manage playlists, and take notes from any device. For the best experience, install the web app shortcut from your browser or use the native app (beta).",
  },
  {
    question: "How do streaks and progress tracking work?",
    answer:
      "Every completed lesson, quiz, or engagement in Shorts counts toward your streak. Progress bars update in real time inside your History page, and you can reset or export them whenever you need a fresh start.",
  },
  {
    question: "Can teachers collaborate or share playlists?",
    answer:
      "Absolutely. Teachers can co-author collections, remix Shorts into themed reels, and publish collaborative study plans to their combined communities.",
  },
];

export default function AboutPage() {
  const [openFaq, setOpenFaq] = useState<string | null>(
    faqs[0]?.question ?? null
  );

  return (
    <main className="flex h-screen w-screen flex-col overflow-hidden bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex min-h-0 flex-1">
        <div className="fixed left-0 top-[72px] z-30 h-[calc(100vh-72px)]">
          <Sidebar />
        </div>

        <div className="ml-60 flex-1 overflow-y-auto">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-14 px-6 py-12">
            <section className="rounded-3xl  bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.18),_transparent_65%)] px-8 py-12 shadow-[0_30px_80px_rgba(0,0,0,0.32)]">
              <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                <div className="space-y-5">
                  <span className="inline-flex items-center gap-2 rounded-full px-4 py-1 text-xs font-semibold uppercase tracking-wide text-emerald-300">
                    For motivated students & lifelong learners
                  </span>
                  <h1 className="text-4xl font-bold tracking-tight md:text-5xl">
                    Learn with intent. Stay curious. Grow your superpowers.
                  </h1>
                  <p className="max-w-2xl text-base text-neutral-300">
                    Ederaxy is your learning co-pilot—mixing cinematic lessons,
                    interactive Shorts, and mentor-led guidance so you can move
                    from curiosity to mastery without losing momentum.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      asChild
                      className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
                    >
                      <Link href="/browse">Start exploring</Link>
                    </Button>
                    <Button
                      asChild
                      variant="ghost"
                      className="rounded-full border border-[#2a2a2a] bg-transparent px-6 py-2 text-sm font-semibold text-white hover:border-emerald-400/60 hover:text-emerald-200"
                    >
                      <Link
                        href="/feed/History"
                        className="inline-flex items-center gap-2"
                      >
                        See how progress is tracked
                        <ArrowRight className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </div>

                <dl className="grid grid-cols-2 gap-6 rounded-2xl border border-white/5 bg-black/30 p-6 text-sm text-neutral-300 sm:grid-cols-3">
                  <div className="space-y-1">
                    <dt className="text-neutral-500">
                      Learning hours streamed
                    </dt>
                    <dd className="text-2xl font-semibold text-white">28K+</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-neutral-500">Expert mentors</dt>
                    <dd className="text-2xl font-semibold text-white">180+</dd>
                  </div>
                  <div className="space-y-1">
                    <dt className="text-neutral-500">Clips saved weekly</dt>
                    <dd className="text-2xl font-semibold text-white">9.5K</dd>
                  </div>
                </dl>
              </div>
            </section>

            <section className=" px-8 py-10 shadow-[0_26px_70px_rgba(0,0,0,0.32)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    What makes Ederaxy different
                  </h2>
                  <p className="max-w-3xl text-sm text-neutral-400">
                    We blend cinematic storytelling with accountability loops so
                    you can stay inspired while mastering the fundamentals.
                  </p>
                </div>
                <Link
                  href="/feed/liked"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                >
                  View sample playlists
                  <ArrowRight className="size-4" />
                </Link>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {highlights.map((highlight) => {
                  const Icon = highlight.icon;

                  return (
                    <article
                      key={highlight.title}
                      className="rounded-2xl border border-[#1f1f1f] bg-[#0f0f0f] p-6 transition hover:border-emerald-400/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.35)]"
                    >
                      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full">
                        <Icon className="size-6 text-emerald-300" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">
                        {highlight.title}
                      </h3>
                      <p className="mt-2 text-sm text-neutral-400">
                        {highlight.description}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="px-8 py-10 shadow-[0_24px_70px_rgba(0,0,0,0.3)]">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Make the most of your learning time
                </h2>
                <p className="max-w-3xl text-sm text-neutral-400">
                  Each part of the platform is designed to meet you where you
                  are—whether you’re just exploring or doubling down for exams.
                </p>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                {guidanceSections.map((section) => {
                  const Icon = section.icon;

                  return (
                    <article
                      key={section.title}
                      className="flex h-full flex-col gap-5 rounded-2xl border border-[#1b1b1b] bg-[#0d0d0d] p-6"
                    >
                      <div className="flex items-start gap-4">
                        <div className="flex p-2 items-center justify-center rounded-full">
                          <Icon className="size-5 text-emerald-300" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-lg font-semibold text-white">
                            {section.title}
                          </h3>
                          <p className="text-sm text-neutral-400">
                            {section.description}
                          </p>
                        </div>
                      </div>
                      <ul className="space-y-3 text-sm text-neutral-300">
                        {section.steps.map((step) => (
                          <li key={step} className="flex gap-3">
                            <span className="mt-1 size-1.5 rounded-full bg-emerald-400" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="px-8 py-10 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Built for every stage of the learning journey
                </h2>
                <p className="max-w-3xl text-sm text-neutral-400">
                  Whether you’re revising for finals or mentoring the next
                  cohort, Ederaxy keeps everyone aligned around progress.
                </p>
              </div>

              <div className="mt-7 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {audiences.map((audience) => {
                  const Icon = audience.icon;

                  return (
                    <article
                      key={audience.title}
                      className="flex h-full flex-col gap-4 rounded-2xl border border-[#1b1b1b] bg-[#101010] p-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full">
                          <Icon className="size-5 text-emerald-300" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {audience.title}
                          </h3>
                          <p className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                            Guided support
                          </p>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-300">
                        {audience.description}
                      </p>
                      <ul className="mt-auto space-y-2 text-sm text-neutral-400">
                        {audience.bullets.map((bullet) => (
                          <li key={bullet} className="flex gap-2">
                            <span className="mt-1 size-1 rounded-full bg-emerald-400" />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className=" px-8 py-10 shadow-[0_24px_64px_rgba(0,0,0,0.3)]">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Guides, tips, and community resources
                </h2>
                <p className="max-w-3xl text-sm text-neutral-400">
                  Tap into support—whether you’re planning study sprints,
                  catching up on missed lessons, or seeking mentor advice.
                </p>
              </div>

              <div className="mt-8 grid gap-6 md:grid-cols-3">
                {resources.map((resource) => {
                  const Icon = resource.icon;

                  return (
                    <article
                      key={resource.title}
                      className="flex h-full flex-col gap-5 rounded-2xl border border-[#1b1b1b] bg-[#0f0f0f] p-6"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full">
                          <Icon className="size-5 text-emerald-300" />
                        </div>
                        <h3 className="text-lg font-semibold text-white">
                          {resource.title}
                        </h3>
                      </div>
                      <p className="flex-1 text-sm text-neutral-300">
                        {resource.description}
                      </p>
                      <Link
                        href={resource.href}
                        className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 hover:text-emerald-200"
                      >
                        {resource.actionLabel}
                        <ArrowRight className="size-4" />
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className=" px-8 py-10 shadow-[0_22px_60px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Frequently asked questions
                  </h2>
                  <p className="max-w-2xl text-sm text-neutral-400">
                    From pricing to progress tracking, here are the essentials
                    students, mentors, and supporters ask us most.
                  </p>
                </div>
                <Button
                  asChild
                  className="rounded-full bg-white/10 px-5 py-2 text-xs font-semibold text-white hover:bg-white/15"
                >
                  <Link href="/discover/teachers">Chat with a mentor</Link>
                </Button>
              </div>

              <div className="mt-8 space-y-4">
                {faqs.map((faq) => {
                  const isOpen = openFaq === faq.question;

                  return (
                    <article
                      key={faq.question}
                      className="rounded-2xl border border-[#1b1b1b] bg-[#0f0f0f] p-5"
                    >
                      <button
                        type="button"
                        onClick={() =>
                          setOpenFaq((prev) =>
                            prev === faq.question ? null : faq.question
                          )
                        }
                        className="flex w-full items-center justify-between gap-4"
                      >
                        <span className="text-left text-base font-semibold text-white">
                          {faq.question}
                        </span>
                        <ChevronDown
                          className={`size-5 shrink-0 transition-transform duration-300 ${
                            isOpen
                              ? "rotate-180 text-emerald-300"
                              : "text-neutral-500"
                          }`}
                        />
                      </button>
                      <div
                        className={`grid overflow-hidden transition-all duration-300 ${
                          isOpen ? "mt-3 grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div className="overflow-hidden text-sm text-neutral-400">
                          {faq.answer}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="rounded-3xl bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),_transparent_65%)] px-8 py-12 text-center shadow-[0_26px_70px_rgba(0,0,0,0.32)]">
              <div className="mx-auto max-w-3xl space-y-4">
                <h2 className="text-3xl font-semibold tracking-tight">
                  Ready to build your next chapter?
                </h2>
                <p className="text-sm text-neutral-300">
                  Join thousands of learners using Ederaxy to stay accountable,
                  discover world-class teachers, and turn inspiration into
                  consistent practice.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button
                    asChild
                    className="rounded-full bg-emerald-500 px-6 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
                  >
                    <Link href="/clips">Watch trending Shorts</Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    className="rounded-full border border-[#2a2a2a] bg-transparent px-6 py-2 text-sm font-semibold text-white hover:border-emerald-400/60 hover:text-emerald-200"
                  >
                    <Link href="/feed/subscriptions">Meet mentor teachers</Link>
                  </Button>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
