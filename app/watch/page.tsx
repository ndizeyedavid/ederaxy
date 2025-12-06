"use client";
import Header from "@/components/Header/Header";
import VideoPlayer from "@/components/VideoPlayer/VideoPlayer";
import LessonDetailsPanel from "@/components/Watch/LessonDetailsPanel";
import CommentSection from "@/components/Watch/CommentSection";
import Image from "next/image";
import {
  Download,
  Share2,
  ThumbsDown,
  ThumbsUp,
  FileText,
  ClipboardList,
  Sparkles,
} from "lucide-react";
import SuggestedVideoCard from "@/components/VideoCard/SuggestedVideoCard";
import Link from "next/link";

export default function WatchPage() {
  const lessonStats = {
    views: "658,122 views",
    date: "Nov 29, 2025",
    grade: "Level 4 Software Development",
    lesson: "Apply Machine Learning And Computer Automation",
    unit: "Unit 1: Introduction to AI & Machine Learning",
  };

  const lessonTabs = [
    {
      id: "notes",
      label: "Lesson Notes",
      icon: FileText,
      content: (
        <div>
          <h3 className="text-base font-semibold text-white">
            3 Lesson Materials
          </h3>
          <div className="mt-4 flex items-center gap-3 rounded-2xl border border-[#2a2a2a] bg-[#202020] p-3">
            <div className="relative h-16 w-16 overflow-hidden rounded-xl">
              <Image
                src="/videos/ai-vs-ml-thumb.jpg"
                alt="Lesson Notes"
                fill
                className="object-cover"
                sizes="64px"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-white">
                SWDML501 Machine Learning Application.pdf
              </p>
              <p className="truncate text-xs text-neutral-400">
                by RTB • IRABA Arsene
              </p>
            </div>
            <button className="rounded-full border border-[#3a3a3a] px-3 py-1 text-xs font-medium text-white transition hover:bg-[#2a2a2a]">
              Download
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "summary",
      label: "Summary",
      icon: ClipboardList,
      content: (
        <article className="space-y-3 text-sm text-neutral-100">
          <h3 className="text-base font-semibold text-white">
            The Difference Between Artificial Intelligence and Machine Learning
          </h3>
          <p className="text-neutral-200">
            In today&apos;s technological landscape, the terms artificial
            intelligence (AI) and machine learning (ML) are often used
            interchangeably, but they represent distinct concepts. While both
            aim to create intelligent systems, their approaches and scopes
            differ. Understanding the differences between AI and ML is crucial
            for appreciating how these technologies are reshaping industries and
            society.
          </p>

          <section className="space-y-2">
            <h4 className="font-semibold text-white">
              Defining Artificial Intelligence (AI)
            </h4>
            <p className="text-neutral-200">
              Artificial intelligence is the broad field of computer science
              focused on creating machines that can perform tasks typically
              requiring human intelligence. These tasks include problem-solving,
              decision-making, language understanding, and visual perception. AI
              systems are designed to mimic human cognitive functions, with the
              ultimate goal of developing machines that can think, reason, and
              adapt in complex environments.
            </p>
            <p className="text-neutral-200">
              AI can be divided into two categories: narrow AI (or weak AI),
              which is specialized in performing specific tasks, and artificial
              general intelligence (AGI), a more theoretical concept that
              involves machines capable of performing any intellectual task a
              human can do. In many AI systems, the intelligence is either
              pre-programmed or based on logic and rules, and does not
              necessarily involve learning from data.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-white">
              Defining Machine Learning (ML)
            </h4>
            <p className="text-neutral-200">
              Machine learning is a subset of AI that focuses on enabling
              machines to learn from data and improve their performance over
              time without being explicitly programmed. Instead of following
              pre-defined rules, ML algorithms identify patterns in data and use
              these patterns to make predictions or decisions.
            </p>
          </section>

          <section className="space-y-2">
            <h4 className="font-semibold text-white">Conclusion</h4>
            <p className="text-neutral-200">
              In essence, AI is the broader goal of creating intelligent
              machines, while machine learning is a method to achieve this goal
              by enabling systems to learn from data. Both technologies have
              significant potential, but understanding their differences helps
              clarify their unique roles in technological advancement.
            </p>
          </section>

          <div className=" w-full text-right text-neutral-500">
            <i>
              <span className="text-primary">*</span> Generated by AI. Check for
              mistakes
            </i>
          </div>
        </article>
      ),
    },
    {
      id: "quiz",
      label: "AI Quiz",
      icon: Sparkles,
      content: (
        <div className="space-y-4 text-sm text-neutral-200">
          <div className="rounded-2xl border border-[#2a2a2a] bg-[#1a1a1a] p-6 shadow-inner">
            <div className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
              Question #1
            </div>
            <h3 className="mt-2 text-lg font-semibold text-white">
              What is AI in full
            </h3>

            <div className="mt-4 space-y-2">
              <button className="w-full text-center rounded-xl bg-green-600 px-4 py-3  text-sm font-semibold text-white shadow">
                Answer option 1
              </button>
              <button className="w-full text-center rounded-xl border border-[#2a2a2a] bg-[#212121] px-4 py-3  text-sm text-neutral-200 transition hover:border-[#3a3a3a]">
                Answer option 2
              </button>
              <button className="w-full text-center rounded-xl border border-[#2a2a2a] bg-[#212121] px-4 py-3  text-sm text-neutral-200 transition hover:border-[#3a3a3a]">
                Answer option 3
              </button>
              <button className="w-full text-center rounded-xl border border-[#2a2a2a] bg-[#212121] px-4 py-3  text-sm text-neutral-200 transition hover:border-[#3a3a3a]">
                Answer option 4
              </button>
            </div>

            <div className="mt-6 flex items-center justify-between border-t border-[#2a2a2a] pt-4">
              <button className="rounded-lg border border-[#2a2a2a] px-5 py-2 text-sm font-medium text-white transition hover:bg-[#2a2a2a]">
                Prev
              </button>
              <span className="text-xs font-medium text-neutral-400">
                1 of 5
              </span>
              <button className="rounded-lg bg-green-600 px-6 py-2 text-sm font-semibold text-white transition hover:bg-green-500">
                Next
              </button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  const suggestedVideos = new Array(6).fill(null);

  return (
    <main className="h-screen overflow-hidden flex flex-col bg-[#0f0f0f] text-white">
      <Header />
      <div className="flex flex-1 overflow-y-auto px-10">
        <section className="">
          <div className="mx-auto flex w-full max-w-[1080px] flex-col gap-6 px-6 py-6">
            <div className="w-full h-[480px] overflow-hidden rounded-2xl">
              <VideoPlayer />
            </div>

            <div className="flex flex-col gap-4">
              <h1 className="text-2xl font-semibold">
                Difference between artificial intelligence and Machine learning.
              </h1>

              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl px-5 py-4">
                <div className="flex flex-wrap items-center gap-4">
                  <Link href="/@mellow" className="flex items-center gap-3">
                    <Image
                      src="/users/5.jpeg"
                      alt="IRABA Arsene"
                      width={48}
                      height={48}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-semibold">
                        IRABA Arsene
                      </span>
                      <span className="text-xs text-neutral-400">
                        9.35K subscribers
                      </span>
                    </div>
                  </Link>
                  <button className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-neutral-200">
                    Subscribe
                  </button>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-white">
                  <div className="flex items-center overflow-hidden rounded-full bg-[#232323] text-sm">
                    <button className="flex items-center gap-2 px-4 py-2 hover:bg-[#2f2f2f]">
                      <ThumbsUp size={18} />
                      <span>1.1K</span>
                    </button>
                    <span className="h-6 w-px bg-[#3d3d3d]" />
                    <button className="flex items-center px-3 py-2 hover:bg-[#2f2f2f]">
                      <ThumbsDown size={18} />
                    </button>
                  </div>
                  <button className="flex items-center gap-2 rounded-full bg-[#232323] px-4 py-2 text-sm transition hover:bg-[#2f2f2f]">
                    <Share2 size={18} /> Share
                  </button>
                  <button className="flex items-center gap-2 rounded-full bg-[#232323] px-4 py-2 text-sm transition hover:bg-[#2f2f2f]">
                    <Download size={18} /> Download
                  </button>
                </div>
              </div>

              <LessonDetailsPanel stats={lessonStats} tabs={lessonTabs} />

              <CommentSection />
            </div>
          </div>
        </section>

        <aside className="w-full max-w-[550px] hidden lg:block">
          <div className=" px-4 py-4 text-lg font-semibold text-white">
            Continue with
          </div>
          <div className="space-y-4 px-4 pb-6">
            {suggestedVideos.map((_, index) => (
              <SuggestedVideoCard key={index} />
            ))}
          </div>
        </aside>
      </div>
    </main>
  );
}
