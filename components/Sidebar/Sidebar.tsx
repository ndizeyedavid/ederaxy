"use client";

import {
  Home,
  Film,
  ChevronDown,
  History,
  List,
  ThumbsUp,
  HelpCircle,
  MessageSquare,
  ChevronRight,
  X,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const subscriptions = [
  { name: "KWIZERA Alexis", avatar: "/users/1.jpg", handle: "@kwizera" },
  {
    name: "Sarah MUKUNDARUGO",
    avatar: "/users/2.jpeg",
    handle: "@sarah",
  },
  {
    name: "Robert D. Junior",
    avatar: "/users/3.jpeg",
    handle: "@robert",
  },
  {
    name: "Rwanda Coding Academy",
    avatar: "/users/4.jpg",
    handle: "@rwandacodingacademy",
  },
  { name: "IRABA Arsene", avatar: "/users/5.jpeg", handle: "@iraba" },
  {
    name: "KABUTORE Boniface",
    avatar: "/users/6.png",
    handle: "@kabutore",
  },
];

export default function Sidebar() {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [submissionState, setSubmissionState] = useState<
    "idle" | "sending" | "success"
  >("idle");

  const handleCloseFeedback = () => {
    setFeedbackOpen(false);
    setTimeout(() => {
      setSubmissionState("idle");
    }, 250);
  };

  const handleSubmitFeedback = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmissionState("sending");

    const form = event.currentTarget;

    setTimeout(() => {
      setSubmissionState("success");
      form.reset();
    }, 700);
  };

  return (
    <aside
      className="w-60 h-[95%] flex flex-col text-white select-none overflow-y-scroll bg-[#0f0f0f]"
      id="sidebar"
    >
      {/* Top: Home & Clips */}
      <div className="py-4 px-2 flex flex-col gap-1">
        <Link
          href="/"
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#232323] font-medium text-base"
        >
          <Home size={24} /> Home
        </Link>
        <Link
          href={"/clips/<id>"}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg hover:bg-[#232323]"
        >
          <Film size={22} /> Short Clips
        </Link>
      </div>
      <hr className="border-[#222] my-2" />
      {/* Subscriptions */}
      <div className="px-4 py-2">
        <Link
          href="/feed/subscriptions"
          className="flex items-center gap-2 mb-2 hover:bg-[#232323] w-full px-2 py-2 rounded-lg"
        >
          <span className="font-semibold text-[17px]">Subscriptions</span>
          <ChevronRight size={16} />
        </Link>
        <div className="flex flex-col gap-1">
          {subscriptions.slice(0, 6).map((sub, idx) => (
            // =============== ACTIVE ==========================
            // <button
            //   key={sub.name}
            //   className={`flex items-center gap-3 w-full px-2 py-2 rounded-lg ${
            //     idx === 0 ? "bg-[#232323]" : "hover:bg-[#232323]"
            //   }`}
            // >
            // =============== ACTIVE ==========================

            <Link
              href={`/${sub.handle}`}
              key={sub.handle}
              className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#232323] "
            >
              <span className="relative w-8 h-8">
                <Image
                  src={sub.avatar}
                  alt={sub.name}
                  width={32}
                  height={32}
                  className="rounded-full size-[32px] object-cover"
                />
              </span>
              <span className="truncate text-sm text-left">{sub.name}</span>
            </Link>
          ))}
          <Link
            href="/feed/subscriptions"
            className="flex items-center gap-2 text-sm  px-2 py-2 hover:bg-[#232323] rounded-lg"
          >
            <ChevronDown size={18} /> Show more
          </Link>
        </div>
      </div>
      <hr className="border-[#222] my-2" />
      {/* You Section */}
      <div className="px-4 py-2">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-lg">You</span>
        </div>
        <div className="flex flex-col gap-1">
          <Link
            href="/feed/history"
            className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#232323]"
          >
            <History size={20} /> History
          </Link>
          <Link
            href="/browse"
            className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#232323]"
          >
            <List size={20} /> Browse
          </Link>
          <Link
            href="/feed/liked"
            className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#232323]"
          >
            <ThumbsUp size={20} /> Liked videos
          </Link>
        </div>
      </div>
      <hr className="border-[#222] my-2" />
      {/* Settings & Help */}
      <div className="px-4 py-2 flex flex-col gap-1 mt-auto">
        <Link
          href="/help"
          className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#232323]"
        >
          <HelpCircle size={20} /> Help
        </Link>
        <button
          type="button"
          onClick={() => {
            setFeedbackOpen(true);
            setSubmissionState("idle");
          }}
          className="flex items-center gap-3 w-full px-2 py-2 rounded-lg hover:bg-[#232323]"
        >
          <MessageSquare size={20} /> Send feedback
        </button>
      </div>

      {feedbackOpen && (
        <div className="fixed inset-0 z-1200 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div
            className="absolute inset-0"
            onClick={handleCloseFeedback}
            aria-hidden="true"
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#141414] p-8 shadow-[0_40px_120px_rgba(0,0,0,0.6)]">
            <button
              type="button"
              onClick={handleCloseFeedback}
              className="absolute right-5 top-5 rounded-full bg-white/5 p-2 text-xs font-medium uppercase tracking-wide text-white/70 transition hover:bg-white/10 hover:text-white"
            >
              <X />
            </button>

            <div className="space-y-2 pb-6">
              <h2 className="text-2xl font-semibold text-white">
                Help us improve your learning experience
              </h2>
              <p className="text-sm text-neutral-400">
                Share what&apos;s working, what feels clunky, or features
                you&apos;d love to have. Your notes go straight to the product
                team.
              </p>
            </div>

            <form className="space-y-5" onSubmit={handleSubmitFeedback}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Topic
                </label>
                <Input
                  name="topic"
                  placeholder="Summarise your feedback (e.g. Subscriptions layout feels busy)"
                  className="h-11 border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:border-emerald-500/40"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Details
                </label>
                <textarea
                  name="details"
                  rows={5}
                  required
                  placeholder="Tell us what happened, where you were, and how we can make it better"
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-neutral-500 focus-visible:outline-none focus-visible:ring-0 focus-visible:border-emerald-500/40"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-[0.22em] text-white/60">
                  Optional contact
                </label>
                <Input
                  name="contact"
                  type="email"
                  placeholder="Email to follow up (optional)"
                  className="h-11 border-white/10 bg-white/5 text-sm text-white placeholder:text-neutral-500 focus-visible:ring-0 focus-visible:border-emerald-500/40"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-neutral-500">
                <span>
                  We respond within 48 hours for reported bugs or urgent issues.
                </span>
                <span className="text-neutral-400">
                  {submissionState === "idle" && "All fields secure"}
                  {submissionState === "sending" && "Sending..."}
                  {submissionState === "success" && "Feedback received"}
                </span>
              </div>

              <div className="flex items-center justify-end gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="rounded-full border border-white/10 px-4 text-sm text-white hover:border-white/30"
                  onClick={handleCloseFeedback}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submissionState === "sending"}
                  className="rounded-full bg-emerald-500 px-6 text-sm font-semibold text-black hover:bg-emerald-400"
                >
                  {submissionState === "success" ? "Sent" : "Submit feedback"}
                </Button>
              </div>

              {submissionState === "success" && (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
                  Thanks! Your suggestions help shape upcoming releases. Keep an
                  eye on the changelog for updates.
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </aside>
  );
}
