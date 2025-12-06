"use client";

import Header from "@/components/Header/Header";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useMemo, useState } from "react";
import {
  CalendarDays,
  CheckCheck,
  Mic,
  MoreVertical,
  Paperclip,
  Phone,
  Plus,
  Search,
  SendHorizontal,
  ShieldCheck,
  Smile,
  Sparkles,
  Video,
} from "lucide-react";

type Conversation = {
  id: string;
  name: string;
  role: string;
  avatar: string;
  lastMessage: string;
  lastActivity: string;
  unreadCount?: number;
  tags: string[];
};

type Message = {
  id: string;
  sender: "student" | "teacher" | "peer";
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  attachments?: { type: "link" | "resource"; label: string; href?: string }[];
  status?: "delivered" | "seen";
};

const conversations: Conversation[] = [
  {
    id: "sarah-m",
    name: "Sarah Mukundarugo",
    role: "Chemistry teacher • Advanced level",
    avatar: "/users/2.jpeg",
    lastMessage: "Sending over the revised lab outline now.",
    lastActivity: "Online",
    unreadCount: 2,
    tags: ["Teacher", "Chemistry"],
  },
  {
    id: "arsene-i",
    name: "IRABA Arsene",
    role: "Literature mentor",
    avatar: "/users/5.jpeg",
    lastMessage: "Great job on the persuasive essay draft!",
    lastActivity: "Active 15m ago",
    tags: ["Teacher", "Essay clinic"],
  },
  {
    id: "group-stem",
    name: "STEM revision circle",
    role: "Peers • 6 members",
    avatar: "/users/6.png",
    lastMessage: "Reminder: mock exam starts at 8am.",
    lastActivity: "Active 1h ago",
    tags: ["Group", "Physics"],
  },
  {
    id: "mentor-jules",
    name: "Jules Habineza",
    role: "Career mentor • Internship prep",
    avatar: "/users/4.jpg",
    lastMessage: "Let’s confirm your portfolio review call.",
    lastActivity: "Active yesterday",
    tags: ["Mentor", "Portfolio"],
  },
];

const conversationMessages: Record<string, Message[]> = {
  "sarah-m": [
    {
      id: "1",
      sender: "teacher",
      author: "Sarah Mukundarugo",
      content:
        "Hi David! I reviewed your lab plan — the hypothesis is strong but let’s tighten the variables before Friday.",
      timestamp: "09:18",
      attachments: [
        {
          type: "link",
          label: "View lab planning rubric",
        },
      ],
    },
    {
      id: "2",
      sender: "student",
      author: "You",
      content:
        "Thank you! Adding the control notes now. Could we schedule a quick check-in tomorrow afternoon?",
      timestamp: "09:23",
      status: "seen",
    },
    {
      id: "3",
      sender: "teacher",
      author: "Sarah Mukundarugo",
      content:
        "Absolutely. Send me two times that work and I’ll lock one in. Upload your updated doc before the call.",
      timestamp: "09:24",
      attachments: [
        {
          type: "resource",
          label: "Chemistry Form 5 — Lab safety checklist.pdf",
        },
      ],
    },
  ],
  "arsene-i": [
    {
      id: "1",
      sender: "teacher",
      author: "IRABA Arsene",
      content:
        "Loved the intro paragraph, David. Let’s amplify the hook so examiners lean in from line one.",
      timestamp: "Yesterday",
    },
    {
      id: "2",
      sender: "student",
      author: "You",
      content:
        "Appreciate the feedback! I’ll add the recommended statistic and send a revision tonight.",
      timestamp: "Yesterday",
      status: "delivered",
    },
  ],
  "group-stem": [
    {
      id: "1",
      sender: "peer",
      author: "Linda",
      content: "Can someone share the thermodynamics cheat sheet again?",
      timestamp: "08:31",
    },
    {
      id: "2",
      sender: "student",
      author: "You",
      content:
        "Uploading it now! Let me know if you'd like the annotated version too.",
      timestamp: "08:34",
    },
    {
      id: "3",
      sender: "peer",
      author: "Eric",
      content:
        "Annotated please 🙏🏽 Also remember the mock starts at 8am sharp — cameras on.",
      timestamp: "08:36",
    },
  ],
  "mentor-jules": [
    {
      id: "1",
      sender: "teacher",
      author: "Jules Habineza",
      content:
        "Great momentum on the case study breakdown. Let’s plan a 20-minute sync this weekend to refine your pitch deck slide order.",
      timestamp: "Mon",
    },
  ],
};

const quickReplies = [
  "Thanks for the prompt feedback!",
  "Sharing the doc now — let me know if anything’s missing.",
  "Can we move our session to later today?",
];

export default function MessagePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeConversationId, setActiveConversationId] = useState<string>("");

  const filteredConversations = useMemo(() => {
    const term = searchTerm.toLowerCase();
    if (!term) return conversations;
    return conversations.filter(
      (item) =>
        item.name.toLowerCase().includes(term) ||
        item.tags.some((tag) => tag.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  const activeConversation = conversations.find(
    (conversation) => conversation.id === activeConversationId
  );
  const activeMessages = conversationMessages[activeConversationId] ?? [];

  return (
    <main className="flex flex-col  bg-[#050505] text-white">
      <Header />
      <div className="relative  flex flex-1 flex-col overflow-y-auto  overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.12),transparent_70%)]" />
        <div className="pointer-events-none absolute inset-y-0 right-[-25%] w-[60%] bg-[radial-gradient(circle_at_center,rgba(34,197,94,0.16),transparent_75%)] blur-3xl" />

        <div className="relative mx-auto flex w-full flex-1 flex-col gap-6 ">
          <div className="flex flex-1 rounded-lg  bg-black/60 backdrop-blur-2xl">
            <aside className="hidden w-[320px] h-full  top-0 flex-col border-r border-white/10 bg-white/4 md:flex">
              <div className="border-b border-white/10 px-6 pb-6 pt-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm uppercase tracking-[0.28em] text-neutral-500">
                      Conversations
                    </p>
                    <h2 className="mt-2 text-xl font-semibold">Your circles</h2>
                  </div>
                </div>
                <div className="mt-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2">
                  <Search className="size-4 text-neutral-500" />
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search mentors or peers"
                    className="h-5 flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] text-neutral-400">
                  <span className="rounded-full cursor-pointer bg-white/10 hover:bg-white/30 hover:text-white px-3 py-1">
                    Teachers
                  </span>
                  <span className="rounded-full cursor-pointer bg-white/10 hover:bg-white/30 hover:text-white px-3 py-1">
                    Mentors
                  </span>
                  <span className="rounded-full cursor-pointer bg-white/10 hover:bg-white/30 hover:text-white px-3 py-1">
                    Study groups
                  </span>
                </div>
              </div>

              <div className="custom-scrollbar flex-1 overflow-y-auto px-4 pb-6 pt-5">
                <div className="space-y-3">
                  {filteredConversations.map((conversation) => {
                    const isActive = conversation.id === activeConversationId;
                    return (
                      <button
                        key={conversation.id}
                        onClick={() => setActiveConversationId(conversation.id)}
                        className={`group relative w-full  rounded-3xl border px-4 py-4 text-left transition ${
                          isActive
                            ? "border-emerald-400/50 bg-emerald-500/12 shadow-[0_18px_40px_rgba(16,185,129,0.2)]"
                            : "border-white/10 bg-white/10 hover:border-emerald-400/40 hover:bg-emerald-500/5"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span className="relative h-11 w-11 overflow-hidden rounded-2xl border border-white/10">
                            <Image
                              src={conversation.avatar}
                              alt={conversation.name}
                              fill
                              sizes="44px"
                              className="object-cover"
                            />
                            <span
                              className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border-2 border-[#050505] ${
                                conversation.lastActivity === "Online"
                                  ? "bg-emerald-400"
                                  : "bg-neutral-500"
                              }`}
                            />
                          </span>
                          <div className="min-w-0 flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2">
                              <p className="truncate text-sm font-semibold">
                                {conversation.name}
                              </p>
                              <span className="shrink-0 text-xs text-neutral-500">
                                {conversation.lastActivity}
                              </span>
                            </div>
                            <p className="truncate text-xs text-neutral-400">
                              {conversation.lastMessage}
                            </p>
                            <div className="flex flex-wrap gap-2 text-[11px] text-neutral-400">
                              {conversation.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full border border-white/10 bg-white/10 px-2 py-0.5"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            <div className="flex w-full flex-col border-b border-white/10 bg-white/4 px-4 pb-4 pt-5 md:hidden">
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-black/60 px-3 py-2">
                <Search className="size-4 text-neutral-500" />
                <input
                  placeholder="Search mentors, teachers, groups"
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  className="h-9 flex-1 bg-transparent text-sm text-white placeholder:text-neutral-500 outline-none"
                />
              </div>
              <div className="mt-4 flex gap-3 overflow-x-auto pb-2">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversationId(conversation.id)}
                    className={`min-w-[220px] rounded-3xl border px-3 py-3 text-left transition ${
                      conversation.id === activeConversationId
                        ? "border-emerald-400/50 bg-emerald-500/15"
                        : "border-white/10 bg-white/10 hover:border-emerald-400/40"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="relative size-10 overflow-hidden rounded-2xl border border-white/10">
                        <Image
                          src={conversation.avatar}
                          alt={conversation.name}
                          fill
                          sizes="40px"
                          className="object-cover"
                        />
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {conversation.name}
                        </p>
                        <p className="truncate text-xs text-neutral-400">
                          {conversation.lastActivity}
                        </p>
                      </div>
                    </div>
                    <p className="mt-3 line-clamp-2 text-xs text-neutral-400">
                      {conversation.lastMessage}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            <section className="relative flex min-h-0 flex-1 flex-col">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(56,189,248,0.12),transparent_70%)]" />

              {activeConversation ? (
                <>
                  <header className="relative z-10 flex flex-col gap-5 border-b border-white/10 px-6 py-3 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="relative size-10 overflow-hidden rounded-3xl border border-white/10">
                        <Image
                          src={activeConversation.avatar}
                          alt={activeConversation.name}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      </span>
                      <div className="">
                        <div className="flex items-center gap-2">
                          <h2 className="text-lg font-semibold text-white">
                            {activeConversation.name}
                          </h2>
                          <span className="rounded-full border size-2 bg-green-600/80"></span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button className="rounded-full border border-white/10 p-2 text-neutral-400 transition hover:border-white/30 hover:text-white">
                        <MoreVertical className="size-4" />
                      </button>
                    </div>
                  </header>

                  <div className="relative z-10 flex min-h-0 flex-1 flex-col gap-6 overflow-hidden">
                    <div className="custom-scrollbar flex flex-1 flex-col gap-4 overflow-y-auto px-4 pb-6 pt-4 md:px-8">
                      <div className="mx-auto w-full max-w-2xl py-2 text-center text-[11px] uppercase tracking-[0.4em] text-neutral-500">
                        Today
                      </div>
                      {activeMessages.map((message) => {
                        const isStudent = message.sender === "student";
                        return (
                          <div
                            key={message.id}
                            className={`flex w-full ${
                              isStudent ? "justify-end" : "justify-start"
                            }`}
                          >
                            <div
                              className={`relative max-w-[76%] space-y-3 rounded-3xl border px-5 py-4 text-sm leading-relaxed shadow-[0_18px_45px_rgba(0,0,0,0.35)] backdrop-blur ${
                                isStudent
                                  ? "border-emerald-400/40 bg-linear-to-tr from-emerald-500/30 to-emerald-400/10 text-emerald-50"
                                  : "border-white/10 bg-white/10 text-neutral-100"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2 text-xs text-neutral-400">
                                <span className="font-medium text-white/90">
                                  {isStudent ? "You" : message.author}
                                </span>
                                <span>{message.timestamp}</span>
                              </div>
                              <p className="text-[15px] leading-relaxed">
                                {message.content}
                              </p>

                              {message.status ? (
                                <div className="flex items-center gap-1 text-[11px] text-emerald-100/80">
                                  <CheckCheck className="size-3" />
                                  {message.status === "seen"
                                    ? "Seen"
                                    : "Delivered"}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    <div className="relative z-10  border-t pb-2 border-white/10 px-4 pt-2 md:px-8">
                      <div className="flex items-center  gap-2 rounded-[28px] border border-white/10 px-2 bg-white/10 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
                        <div className="flex-1">
                          <textarea
                            rows={1}
                            placeholder={
                              activeConversation
                                ? `Reply to ${
                                    activeConversation.name.split(" ")[0]
                                  }...`
                                : "Type a message..."
                            }
                            className="w-full p-2 mt-1 resize-none rounded-lg border border-transparent bg-transparent text-[15px] leading-relaxed text-white placeholder:text-neutral-500 outline-none  focus:ring-0"
                          />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                          <Button className="flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-2 text-sm font-semibold text-black hover:bg-emerald-400">
                            <SendHorizontal className="size-4" /> Send
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="relative z-10 flex flex-1 items-center justify-center px-6 text-center text-sm text-neutral-400">
                  Select a conversation to start messaging.
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
