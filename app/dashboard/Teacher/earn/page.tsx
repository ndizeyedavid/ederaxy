"use client";

import { useMemo, type ReactNode } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  DollarSign,
  HandCoins,
  Info,
  PiggyBank,
  PlayCircle,
  Sparkles,
  TrendingUp,
  Wallet,
} from "lucide-react";
import {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  ComposedChart,
  Legend,
  Line,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type EarningsPoint = {
  month: string;
  revenue: number;
  monetizedViews: number;
  rpm: number;
};

type RevenueStream = {
  label: string;
  amount: string;
  delta: string;
  trend: "up" | "down" | "flat";
  icon: typeof DollarSign;
  description: string;
};

const PIE_COLORS = ["#22d3ee", "#60a5fa", "#f97316", "#a78bfa"];

export default function EarnPage() {
  const earningsTrend = useMemo<EarningsPoint[]>(
    () => [
      {
        month: "Jan",
        revenue: 820,
        monetizedViews: 32000,
        rpm: 25.6,
      },
      {
        month: "Feb",
        revenue: 900,
        monetizedViews: 34500,
        rpm: 26.0,
      },
      {
        month: "Mar",
        revenue: 1040,
        monetizedViews: 38900,
        rpm: 26.7,
      },
      {
        month: "Apr",
        revenue: 1195,
        monetizedViews: 42800,
        rpm: 27.9,
      },
      {
        month: "May",
        revenue: 1320,
        monetizedViews: 45200,
        rpm: 29.2,
      },
      {
        month: "Jun",
        revenue: 1450,
        monetizedViews: 48750,
        rpm: 29.7,
      },
    ],
    []
  );

  const streamBreakdown = useMemo(
    () => [
      { name: "Views", value: 54 },
      { name: "Subscribers", value: 21 },
      { name: "Courses", value: 15 },
    ],
    []
  );

  const highPerformers = useMemo(
    () => [
      {
        title: "Arduino Robotics Essentials",
        revenue: "20,000 RFW",
        rpm: "32.60 RWF",
        trendLabel: "+18% vs last 28 days",
      },
      {
        title: "Physics Crash Course: Waves & Optics",
        revenue: "12,000 RWF",
        rpm: "25.10 RWF",
        trendLabel: "+11% vs last 28 days",
      },
      {
        title: "Creative Coding with Scratch",
        revenue: "24,000 RWF",
        rpm: "22.45 RWF",
        trendLabel: "+6% vs last 28 days",
      },
    ],
    []
  );

  const revenueStreams = useMemo<RevenueStream[]>(
    () => [
      {
        label: "AdSense",
        amount: "$1,245",
        delta: "+12.4%",
        trend: "up",
        icon: TrendingUp,
        description:
          "Based on playback-based CPM and premium video watch time.",
      },
      {
        label: "Course marketplace",
        amount: "$620",
        delta: "+4.9%",
        trend: "up",
        icon: PlayCircle,
        description: "Bundles sold directly through featured course listings.",
      },
      {
        label: "Channel memberships",
        amount: "$310",
        delta: "–2.1%",
        trend: "down",
        icon: Wallet,
        description: "Recurring member payments after platform fees.",
      },
      {
        label: "Tips & donations",
        amount: "$188",
        delta: "+7.6%",
        trend: "up",
        icon: PiggyBank,
        description: "One-time boosts from livestreams and study groups.",
      },
    ],
    []
  );

  const upcomingPayouts = useMemo(
    () => [
      {
        label: "June payout",
        amount: "70,180 RWF",
        due: "Arrived June 21",
      },
      {
        label: "July payout",
        amount: "100,080 RWF",
        due: "Arrives July 21",
        note: "Includes Additional Bonus",
      },
      {
        label: "August payout",
        amount: "50,00 RWF",
        due: "Arrives August 18",
      },
    ],
    []
  );

  return (
    <section className="space-y-8 text-white">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-emerald-400/80">
            Earnings overview
          </p>
          <h1 className="mt-1 text-2xl font-bold text-white">
            Monetization & finance insights
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-white/60">
            Track your monthly progress, understand which videos are funding
            your classroom, and discover strategies to grow recurring income.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          {/* <SelectChip label="Last 90 days" /> */}
          <button className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/10">
            <HandCoins className="size-4" />
            Request payout
          </button>
        </div>
      </header>

      <section className="grid gap-4 lg:grid-cols-2">
        <MetricCard
          title="Monetized views"
          value="92,450"
          subtitle="+8.4% vs previous period"
          icon={TrendingUp}
        />
        <MetricCard
          title="Payout ready"
          value="200,180 RWF"
          subtitle="Scheduled for December 21"
          icon={PiggyBank}
        />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <ChartCard
          title="Earnings trend"
          description="Revenue vs monetized views—spot how RPM shifts with seasonality."
          span={2}
        >
          <ResponsiveContainer width="100%" height={280}>
            <ComposedEarningsChart data={earningsTrend} />
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Revenue mix"
          description="Where your income originated in the selected period."
        >
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                dataKey="value"
                data={streamBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={4}
              >
                {streamBreakdown.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={PIE_COLORS[index % PIE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Legend
                verticalAlign="bottom"
                height={32}
                iconType="circle"
                formatter={(value: string) => (
                  <span className="text-xs text-white/70">{value}</span>
                )}
              />
              <Tooltip
                contentStyle={{
                  background: "#0f1117",
                  borderRadius: 12,
                  border: "1px solid rgba(148,163,184,0.25)",
                  color: "#f8fafc",
                }}
                itemStyle={{ color: "#f8fafc" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {/* something here */}
        <ChartCard
          title="Top earning videos"
          description="Focus promos and community posts on proven performers."
        >
          <div className="space-y-4">
            {highPerformers.map((item) => (
              <article
                key={item.title}
                className="rounded-lg border border-white/5 bg-[#101219] p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      {item.trendLabel}
                    </p>
                  </div>
                  <div className="text-right text-sm">
                    <p className="font-semibold text-emerald-300">
                      {item.revenue}
                    </p>
                    <p className="text-xs text-white/50">RPM {item.rpm}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </ChartCard>

        <ChartCard
          title="Upcoming payouts"
          description="Finalize details before automatic transfers trigger."
        >
          <div className="space-y-4">
            {upcomingPayouts.map((item) => (
              <div
                key={item.label}
                className="rounded-lg border border-white/5 bg-[#101219] p-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <p className="font-semibold text-white">{item.label}</p>
                  <span className="text-emerald-300">{item.amount}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-white/50">
                  <span>{item.due}</span>
                  <span>{item.note}</span>
                </div>
              </div>
            ))}
            <button className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-300 transition hover:text-emerald-200">
              View payout history <ArrowRight className="size-4" />
            </button>
          </div>
        </ChartCard>
      </section>
    </section>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: typeof DollarSign;
}) {
  return (
    <article className="flex flex-col justify-between gap-4 rounded-2xl border border-white/5 bg-[#0f1117] p-6 shadow-lg">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-white/50">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-white">{value}</p>
          <p className="mt-1 text-xs text-white/40">{subtitle}</p>
        </div>
        <div className="rounded-full border  p-3 text-emerald-300">
          <Icon className="size-5" />
        </div>
      </div>
    </article>
  );
}

function ChartCard({
  title,
  description,
  children,
  span,
}: {
  title: string;
  description: string;
  children: ReactNode;
  span?: 1 | 2;
}) {
  return (
    <article
      className={`rounded-2xl border border-white/5 bg-[#0f1117] p-6 shadow-lg ${
        span === 2 ? "xl:col-span-2" : ""
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          <p className="mt-1 text-sm text-white/60">{description}</p>
        </div>
        <button className="inline-flex items-center justify-center gap-1 w-[130px] text-xs text-white/60 transition hover:text-white/80">
          <Info className="size-4" />
          Learn more
        </button>
      </header>
      <div className="mt-6">{children}</div>
    </article>
  );
}

function SelectChip({ label }: { label: string }) {
  return (
    <button className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:border-emerald-400/80 hover:bg-emerald-500/20">
      {label}
    </button>
  );
}

function Badge({
  children,
  variant,
}: {
  children: ReactNode;
  variant: "positive" | "neutral";
}) {
  const styles =
    variant === "positive"
      ? "bg-emerald-500/15 text-emerald-300 border-emerald-400/40"
      : "bg-white/10 text-white/70 border-white/15";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium ${styles}`}
    >
      {children}
    </span>
  );
}

function StreamRow({ stream }: { stream: RevenueStream }) {
  const isPositive = stream.trend === "up";
  const isNegative = stream.trend === "down";

  return (
    <div className="flex items-center justify-between gap-4 rounded-lg border border-white/10 bg-[#101219] p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-full border border-white/10 bg-white/5 p-2 text-emerald-300">
          <stream.icon className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-white">{stream.label}</p>
          <p className="text-xs text-white/50">{stream.description}</p>
        </div>
      </div>
      <div className="text-right text-sm">
        <p className="font-semibold text-white">{stream.amount}</p>
        <p
          className={`inline-flex items-center gap-1 text-xs ${
            isPositive
              ? "text-emerald-300"
              : isNegative
              ? "text-rose-300"
              : "text-white/50"
          }`}
        >
          {isNegative ? (
            <ArrowDownRight className="size-4" />
          ) : isPositive ? (
            <ArrowUpRight className="size-4" />
          ) : (
            <ArrowRight className="size-4" />
          )}
          {stream.delta}
        </p>
      </div>
    </div>
  );
}

function ComposedEarningsChart({ data }: { data: EarningsPoint[] }) {
  return (
    <ComposedChart
      data={data}
      margin={{ left: 16, right: 16, top: 8, bottom: 8 }}
    >
      <defs>
        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="10%" stopColor="#34d399" stopOpacity={0.45} />
          <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="4 4" stroke="rgba(148, 163, 184, 0.15)" />
      <XAxis
        dataKey="month"
        tickLine={false}
        axisLine={false}
        tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 12 }}
      />
      <YAxis
        yAxisId="left"
        tickLine={false}
        axisLine={false}
        tick={{ fill: "rgba(226,232,240,0.65)", fontSize: 12 }}
        tickFormatter={(value: number) => `${value.toLocaleString()} RWF`}
      />
      <YAxis
        yAxisId="right"
        orientation="right"
        tickLine={false}
        axisLine={false}
        tick={{ fill: "rgba(226,232,240,0.45)", fontSize: 11 }}
        tickFormatter={(value: number) => `${value} RPM`}
      />
      <Tooltip
        contentStyle={{
          background: "#0f1117",
          borderRadius: 12,
          border: "1px solid rgba(148,163,184,0.25)",
          color: "#f1f5f9",
        }}
        labelStyle={{ color: "#cbd5f5", fontWeight: 600 }}
        formatter={(value: number, name: string) => {
          if (name === "revenue") {
            return [`${value.toLocaleString()} RWF`, "Estimated revenue"];
          }
          if (name === "monetizedViews") {
            return [`${value.toLocaleString()} views`, "Monetized views"];
          }
          return [`${value.toFixed(2)} RWF`, "RPM"];
        }}
      />
      <Legend
        wrapperStyle={{ color: "rgba(226,232,240,0.65)", fontSize: 12 }}
        verticalAlign="top"
        height={32}
      />
      <Bar
        yAxisId="left"
        dataKey="monetizedViews"
        fill="rgba(56, 189, 248, 0.35)"
        stroke="rgba(125, 211, 252, 0.75)"
        radius={[6, 6, 0, 0]}
        name="Monetized views"
      />
      <Area
        yAxisId="left"
        type="monotone"
        dataKey="revenue"
        stroke="#34d399"
        strokeWidth={2}
        fill="url(#revenueGradient)"
        name="Revenue"
      />
      <Line
        yAxisId="right"
        type="monotone"
        dataKey="rpm"
        stroke="#a855f7"
        strokeWidth={2.4}
        dot={{ r: 3, stroke: "#ede9fe", strokeWidth: 1 }}
        activeDot={{ r: 5, stroke: "#f5d0fe", strokeWidth: 1 }}
        name="RPM"
      />
    </ComposedChart>
  );
}

function TipCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <article className="rounded-lg border border-white/5 bg-[#101219] p-4">
      <header className="flex items-center gap-2 text-sm font-semibold text-white">
        <Sparkles className="size-4 text-emerald-300" />
        {title}
      </header>
      <p className="mt-2 text-xs text-white/60">{description}</p>
    </article>
  );
}
