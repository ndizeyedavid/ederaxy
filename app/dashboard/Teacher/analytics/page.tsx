"use client";

import { useId } from "react";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Clock3,
  Gauge,
  Share2,
  TrendingUp,
  Users,
  Eye,
  Trophy,
} from "lucide-react";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  PolarAngleAxis,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface TrendPoint {
  label: string;
  value: number;
}

interface SummaryCard {
  title: string;
  value: string;
  trend: "up" | "down";
  icon: LucideIcon;
  series: TrendPoint[];
}

interface PerformancePoint {
  label: string;
  views: number;
  watchHours: number;
}

interface QuizPerformance {
  subject: string;
  averageScore: number;
  completionRate: number;
}

interface EngagementMetric {
  label: string;
  value: string;
  percent: number;
  color: string;
}

interface TrafficSource {
  label: string;
  value: string;
  percent: number;
  color: string;
}

const summaryCards: SummaryCard[] = [
  {
    title: "Views (28 days)",
    value: "12.4K",
    trend: "up",
    icon: Eye,
    series: [
      { label: "Day 1", value: 1800 },
      { label: "Day 2", value: 2100 },
      { label: "Day 3", value: 2500 },
      { label: "Day 4", value: 2400 },
      { label: "Day 5", value: 2800 },
      { label: "Day 6", value: 3000 },
      { label: "Day 7", value: 3200 },
    ],
  },
  {
    title: "Watch time (hrs)",
    value: "1,246",
    trend: "up",
    icon: Clock3,
    series: [
      { label: "Day 1", value: 140 },
      { label: "Day 2", value: 160 },
      { label: "Day 3", value: 176 },
      { label: "Day 4", value: 180 },
      { label: "Day 5", value: 195 },
      { label: "Day 6", value: 210 },
      { label: "Day 7", value: 220 },
    ],
  },
  {
    title: "Active students",
    value: "1,180",
    trend: "up",
    icon: Users,
    series: [
      { label: "Day 1", value: 820 },
      { label: "Day 2", value: 860 },
      { label: "Day 3", value: 930 },
      { label: "Day 4", value: 980 },
      { label: "Day 5", value: 1020 },
      { label: "Day 6", value: 1100 },
      { label: "Day 7", value: 1180 },
    ],
  },
  {
    title: "Quiz accuracy",
    value: "87%",
    trend: "down",
    icon: Trophy,
    series: [
      { label: "Day 1", value: 88 },
      { label: "Day 2", value: 91 },
      { label: "Day 3", value: 92 },
      { label: "Day 4", value: 90 },
      { label: "Day 5", value: 89 },
      { label: "Day 6", value: 88 },
      { label: "Day 7", value: 87 },
    ],
  },
];

const performanceTrend: PerformancePoint[] = [
  { label: "Jul 1", views: 1800, watchHours: 310 },
  { label: "Jul 8", views: 2200, watchHours: 360 },
  { label: "Jul 15", views: 2600, watchHours: 420 },
  { label: "Jul 22", views: 2400, watchHours: 395 },
  { label: "Jul 29", views: 2950, watchHours: 460 },
  { label: "Aug 5", views: 3200, watchHours: 510 },
];

const retentionTrend: TrendPoint[] = [
  { label: "0s", value: 100 },
  { label: "30s", value: 96 },
  { label: "60s", value: 88 },
  { label: "90s", value: 75 },
  { label: "120s", value: 68 },
  { label: "150s", value: 59 },
  { label: "180s", value: 54 },
];

const quizPerformance: QuizPerformance[] = [
  { subject: "Algebra", averageScore: 84, completionRate: 97 },
  { subject: "Physics", averageScore: 78, completionRate: 92 },
  { subject: "Biology", averageScore: 82, completionRate: 90 },
  { subject: "History", averageScore: 76, completionRate: 88 },
  { subject: "Programming", averageScore: 91, completionRate: 96 },
];

const engagementMetrics: EngagementMetric[] = [
  { label: "Likes", value: "3.1K", percent: 68, color: "#22d3ee" },
  { label: "Comments", value: "840", percent: 32, color: "#38bdf8" },
  { label: "Shares", value: "510", percent: 24, color: "#f97316" },
  { label: "Saves", value: "1.9K", percent: 42, color: "#22c55e" },
];

const topVideos = [
  {
    title: "STEM lab prep walkthrough",
    views: "4.3K views",
    watch: "232 watch hours",
    growth: "+21% vs prev.",
  },
  {
    title: "Algebra mastery recap",
    views: "3.7K views",
    watch: "211 watch hours",
    growth: "+16% vs prev.",
  },
  {
    title: "Design thinking crash course",
    views: "2.9K views",
    watch: "156 watch hours",
    growth: "+9% vs prev.",
  },
];

const trafficSources: TrafficSource[] = [
  { label: "Recommended", value: "41%", percent: 41, color: "#38bdf8" },
  { label: "Search", value: "27%", percent: 27, color: "#22c55e" },
  { label: "Assignments", value: "19%", percent: 19, color: "#fbbf24" },
  { label: "External", value: "13%", percent: 13, color: "#f97316" },
];

const studentProgress = {
  completion: 78,
  returningStudents: "68% returning weekly",
  activeClassrooms: 18,
};

export default function AnalyticsPage() {
  return (
    <section className="space-y-8">
      <header className="flex flex-col gap-4 text-white md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-white/40">
            Analytics overview
          </p>
          <h1 className="mt-2 text-3xl font-semibold">Channel analytics</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
            <BarChart3 className="size-4" />
            Export report
          </button>
          <button className="inline-flex items-center gap-2 rounded-full border border-emerald-500/50 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 transition hover:border-emerald-500/60 hover:bg-emerald-500/20">
            <TrendingUp className="size-4" />
            Last 28 days
          </button>
        </div>
      </header>

      <section className="grid gap-4 text-white md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card, index) => (
          <article
            key={card.title}
            className="flex flex-col gap-4 rounded-xl border border-white/5 bg-white/5 p-5"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                  {card.title}
                </p>
                <p className="mt-3 text-2xl font-semibold">{card.value}</p>
              </div>
              <span className="flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/5">
                <card.icon className="size-5" />
              </span>
            </div>
            <Sparkline data={card.series} />
          </article>
        ))}
      </section>

      <section className="grid gap-6 text-white xl:grid-cols-[2.2fr_1fr]">
        <AnalyticsPanel
          title="Views & watch time"
          description="Daily performance across the last six weeks"
        >
          <MultiLineChart data={performanceTrend} />
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <KeyStat
              label="Average view duration"
              value="6m 12s"
              change="▲ 38s vs last period"
            />
            <KeyStat
              label="Returning viewers"
              value="54%"
              change="▲ 7% vs last period"
            />
          </div>
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Audience retention"
          description="Percentage of viewers remaining as your video progresses"
        >
          <Sparkline data={retentionTrend} color="#22d3ee" />
          <div className="mt-4 space-y-3 text-sm text-white/60">
            <RetentionRow label="Intro hook" value="96% still watching" />
            <RetentionRow
              label="Concept explanation"
              value="78% still watching"
            />
            <RetentionRow label="Practice segment" value="63% still watching" />
          </div>
        </AnalyticsPanel>
      </section>

      <section className="grid gap-6 text-white xl:grid-cols-[1.6fr_1fr]">
        <AnalyticsPanel
          title="Quiz performance by subject"
          description="Average accuracy and completion for quizzes linked to each topic"
        >
          <QuizPerformanceChart data={quizPerformance} />
        </AnalyticsPanel>

        <AnalyticsPanel
          title="Engagement breakdown"
          description="Interactions aggregated from the last 28 days"
        >
          <div className="space-y-4">
            {engagementMetrics.map((metric) => (
              <div key={metric.label} className="space-y-2">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{metric.label}</span>
                  <span className="font-semibold text-white">
                    {metric.value}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${metric.percent}%`,
                      background: `linear-gradient(90deg, ${metric.color}, ${metric.color}80)`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </AnalyticsPanel>
      </section>
    </section>
  );
}

function Sparkline({
  data,
  color = "#38bdf8",
}: {
  data: TrendPoint[];
  color?: string;
}) {
  const gradientId = useId();

  return (
    <div className="h-16 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.5} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            cursor={{ stroke: color, strokeOpacity: 0.2 }}
            contentStyle={{
              backgroundColor: "rgba(13, 15, 20, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
              fontSize: "12px",
            }}
            formatter={(value: number) => [
              `${value.toLocaleString()}`,
              "Value",
            ]}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            fillOpacity={1}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

function MultiLineChart({ data }: { data: PerformancePoint[] }) {
  return (
    <div className="space-y-6">
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
          >
            <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
            <XAxis dataKey="label" stroke="rgba(255,255,255,0.35)" />
            <YAxis
              stroke="rgba(255,255,255,0.35)"
              tickFormatter={(value) => `${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(13, 15, 20, 0.9)",
                border: "1px solid rgba(255,255,255,0.1)",
                color: "white",
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#38bdf8"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              name="Views"
            />
            <Line
              type="monotone"
              dataKey="watchHours"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 3, strokeWidth: 0 }}
              activeDot={{ r: 5 }}
              name="Watch time (hrs)"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex flex-wrap items-center px-10 gap-4 text-sm">
        <LegendChip color="#38bdf8">Views</LegendChip>
        <LegendChip color="#22c55e">Watch time (hrs)</LegendChip>
      </div>
    </div>
  );
}

function QuizPerformanceChart({ data }: { data: QuizPerformance[] }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 20, right: 20, left: 0, bottom: 20 }}
          barCategoryGap={18}
        >
          <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
          <XAxis dataKey="subject" stroke="rgba(255,255,255,0.35)" />
          <YAxis
            stroke="rgba(255,255,255,0.35)"
            tickFormatter={(value) => `${value}%`}
            domain={[0, 100]}
          />
          <Tooltip
            formatter={(value: number, key: string) => [`${value}%`, key]}
            contentStyle={{
              backgroundColor: "rgba(13, 15, 20, 0.9)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "white",
            }}
          />
          <Bar
            dataKey="averageScore"
            fill="#34d399"
            radius={[6, 6, 0, 0]}
            name="Avg score"
          >
            <Tooltip />
          </Bar>
          <Bar
            dataKey="completionRate"
            fill="#0ea5e9"
            radius={[6, 6, 0, 0]}
            name="Completion"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function ProgressGauge({ value }: { value: number }) {
  const chartId = useId();
  const data = [
    { name: "progress", value, fill: "#38bdf8" },
    { name: "remainder", value: 100, fill: "rgba(255,255,255,0.08)" },
  ];

  return (
    <div className="mx-auto h-48 w-48">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          innerRadius="70%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
          data={data}
        >
          <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
          <RadialBar
            dataKey="value"
            background
            cornerRadius={18}
            fill="#38bdf8"
            isAnimationActive={false}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="-mt-32 flex flex-col items-center justify-center text-white">
        <span className="text-3xl font-semibold">{value}%</span>
        <span className="mt-1 text-xs uppercase tracking-[0.3em] text-white/40">
          Completion
        </span>
      </div>
    </div>
  );
}

function AnalyticsPanel({
  title,
  description,
  extra,
  children,
}: {
  title: string;
  description?: string;
  extra?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <article className="rounded-xl border border-white/5 bg-[#13151b] p-6">
      <header className="flex flex-col gap-2 border-b border-white/5 pb-4 text-white/80 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {description ? (
            <p className="mt-1 text-xs text-white/50">{description}</p>
          ) : null}
        </div>
        {extra}
      </header>
      <div className="pt-5">{children}</div>
    </article>
  );
}

function LegendChip({
  color,
  children,
}: {
  color: string;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-2 text-sm text-white/60">
      <span
        className="size-2.5 rounded-full"
        style={{ backgroundColor: color }}
      />
      {children}
    </span>
  );
}

function KeyStat({
  label,
  value,
  change,
}: {
  label: string;
  value: string;
  change: string;
}) {
  return (
    <div className="rounded-xl border border-white/5 bg-white/10 p-4">
      <p className="text-xs uppercase tracking-[0.3em] text-white/40">
        {label}
      </p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="text-xs text-emerald-300">{change}</p>
    </div>
  );
}

function RetentionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/10 px-3 py-2 text-xs text-white/60">
      <span>{label}</span>
      <span className="text-white">{value}</span>
    </div>
  );
}
