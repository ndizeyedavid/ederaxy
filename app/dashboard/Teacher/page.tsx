import type { ComponentType, ReactNode, SVGProps } from "react";

import Image from "next/image";
import {
  BarChart3,
  ClipboardList,
  MessageCircle,
  MessageSquareText,
  PenBoxIcon,
  PlaySquare,
  ThumbsUp,
  Upload,
  Eye,
  Users,
  TrendingUp,
  Video,
} from "lucide-react";

const latestVideo = {
  title: "Making a 2D game in GODOT",
  publishedAgo: "First 113 days 18 hours",
  thumbnail: "/videos/ai-vs-ml-thumb.jpg",
  stats: [
    { label: "Views", value: "4" },
    { label: "Comments", value: "0" },
    { label: "Likes", value: "0" },
  ],
  metrics: [
    { label: "Views", value: "4" },
    { label: "Average View Duration", value: "0:21" },
  ],
};

const channelAnalytics = {
  subscribers: "0",
  summary: [
    { label: "Views", value: "0" },
    { label: "Watch time (hours)", value: "0.0" },
  ],
  topVideos: [
    { label: "Views (48h)", value: "0" },
    { label: "Watch time (48h)", value: "0.0" },
  ],
};

interface VerticalAnalyticsCard {
  icon: IconType;
  title: string;
  value: string;
  change: string;
  trend: TrendType;
}

const verticalAnalyticsCards: VerticalAnalyticsCard[] = [
  {
    icon: Video,
    title: "Total videos uploaded",
    value: "3",
    change: "+2 this month",
    trend: "positive",
  },
  {
    icon: Users,
    title: "Students reached",
    value: "1,250",
    change: "+15% vs last month",
    trend: "positive",
  },
  {
    icon: ClipboardList,
    title: "Quizzes generated",
    value: "3",
    change: "Matching your video count",
    trend: "neutral",
  },
  {
    icon: TrendingUp,
    title: "Channel growth",
    value: "+50",
    change: "New followers this month",
    trend: "positive",
  },
];

export default function Dashboardpage() {
  return (
    <section className="space-y-6">
      <header className="flex items-center justify-between text-white">
        <h1 className="text-xl font-bold ">Teacher dashboard</h1>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10"
            aria-label="Upload"
          >
            <Upload className="size-5" />
          </button>
          <button
            type="button"
            className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-white/20 hover:bg-white/10"
            aria-label="Upload Study material"
          >
            <PenBoxIcon className="size-5" />
          </button>
        </div>
      </header>

      <div className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <DashboardCard title="Latest video performance">
          <div className="space-y-4">
            <div className="overflow-hidden">
              <Image
                src={latestVideo.thumbnail}
                alt={latestVideo.title}
                width={640}
                height={360}
                className="h-48 w-full object-cover rounded-lg"
              />
              <div className="space-y-3 py-3">
                <p className="text-base font-semibold text-white">
                  {latestVideo.title}
                </p>
                <div className="flex items-center gap-5 text-sm text-white/60">
                  <StatBadge icon={Eye}>{latestVideo.stats[0].value}</StatBadge>
                  <StatBadge icon={MessageSquareText}>
                    {latestVideo.stats[1].value}
                  </StatBadge>
                  <StatBadge icon={ThumbsUp}>
                    {latestVideo.stats[2].value}
                  </StatBadge>
                </div>
              </div>
            </div>

            <div className="space-y-1 text-sm text-white/60">
              <p>{latestVideo.publishedAgo}</p>
              <div className="space-y-1 mt-2">
                {latestVideo.metrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="flex items-center justify-between"
                  >
                    <p className="text-sm  text-white/40">{metric.label}</p>
                    <p className="text-base font-semibold text-white">
                      {metric.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2">
              <GhostButton icon={PlaySquare}>Go to video analytics</GhostButton>
              <GhostButton icon={MessageCircle}>See comments</GhostButton>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Channel analytics">
          <div className="space-y-5">
            <div>
              <p className="text-sm  text-white/40">Current subscribers</p>
              <p className="mt-2 text-4xl font-semibold text-white">
                {channelAnalytics.subscribers}
              </p>
            </div>

            <div className="space-y-4">
              <AnalyticsBlock
                icon={BarChart3}
                title="Summary"
                items={channelAnalytics.summary}
              />
              <AnalyticsBlock
                icon={PlaySquare}
                title="Top videos"
                items={channelAnalytics.topVideos}
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <GhostButton icon={BarChart3}>
                Go to channel analytics
              </GhostButton>
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Channel insights">
          <div className="space-y-3">
            {verticalAnalyticsCards.map(
              ({ icon: Icon, title, value, change, trend }) => (
                <div key={title} className="border-b px-3 py-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm text-white/50">{title}</p>
                      <p className="mt-2 text-2xl font-semibold text-white">
                        {value}
                      </p>
                    </div>
                    <span className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/10 text-white">
                      <Icon className="size-5" />
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </DashboardCard>
      </div>
    </section>
  );
}

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface DashboardCardProps {
  title: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}

function DashboardCard({ title, extra, children }: DashboardCardProps) {
  return (
    <article className="flex h-fit flex-col rounded-xl border border-white/5 p-5 text-white">
      <header className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        {extra}
      </header>
      <div className="mt-4 flex-1">{children}</div>
    </article>
  );
}

interface StatBadgeProps {
  icon: IconType;
  children: React.ReactNode;
}

function StatBadge({ icon: Icon, children }: StatBadgeProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm text-white">
      <Icon className="size-4" />
      {children}
    </span>
  );
}

interface GhostButtonProps {
  icon: IconType;
  children: React.ReactNode;
}

function GhostButton({ icon: Icon, children }: GhostButtonProps) {
  return (
    <button className="inline-flex items-center gap-1 rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
      <Icon className="size-4" />
      {children}
    </button>
  );
}

interface AnalyticsBlockProps {
  icon: IconType;
  title: string;
  items: { label: string; value: string }[];
}

function AnalyticsBlock({ icon: Icon, title, items }: AnalyticsBlockProps) {
  return (
    <div className="border-b border-white/5 p-4">
      <div className="flex items-center gap-2 text-white">
        <span className="text-sm font-semibold">{title}</span>
      </div>
      <div className="mt-3 space-y-2">
        {items.map((item) => (
          <div
            key={item.label}
            className="flex items-center justify-between text-sm text-white"
          >
            <span className="text-white/60">{item.label}</span>
            <span className="font-semibold text-white">{item.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

type TrendType = "positive" | "neutral" | "negative";

function getTrendClass(trend: TrendType) {
  switch (trend) {
    case "positive":
      return "text-emerald-300";
    case "negative":
      return "text-rose-300";
    default:
      return "text-white/60";
  }
}
