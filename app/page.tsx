"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Gamepad2,
  Mic2,
  Radio,
  Sparkles,
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DbEventCard, type DbEvent } from "@/components/events/DbEventCard";
import { isEventLive } from "@/lib/utils";

// ── Category config ──────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All",        value: "All",       icon: Zap },
  { label: "AMAs",       value: "AMA",       icon: Mic2 },
  { label: "Tournaments",value: "Tournament",icon: Trophy },
  { label: "Streams",    value: "Stream",    icon: Radio },
  { label: "Gaming",     value: "Gaming",    icon: Gamepad2 },
  { label: "Workshops",  value: "Workshop",  icon: BookOpen },
];

function getWeekLabel() {
  const now = new Date();
  const day = now.getDay();
  const diffToMon = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMon);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  return `${fmt(monday)} — ${fmt(sunday)}`;
}

// ── Abstract star ────────────────────────────────────────────────────────────
function AbstractStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path d="M20 4L14 16H4L12 24L9 36L20 29L31 36L28 24L36 16H26L20 4Z" fill="currentColor" />
    </svg>
  );
}

// ── Section header ───────────────────────────────────────────────────────────
function SectionHeader({
  icon,
  label,
  color = "text-primary",
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  color?: string;
  accent?: string;
}) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span className={`flex items-center gap-2 font-bold text-lg ${color}`}>
        {icon}
        {label}
      </span>
      <div className={`h-px flex-1 ${accent ?? "bg-gradient-to-r from-primary/30 to-transparent"}`} />
    </div>
  );
}

// ── Loading skeleton ─────────────────────────────────────────────────────────
function EventSkeleton() {
  return (
    <div className="rounded-2xl overflow-hidden glass-card animate-pulse">
      <div className="aspect-[16/7] bg-white/[0.03]" />
      <div className="p-4 space-y-3">
        <div className="h-4 rounded-lg bg-white/[0.04] w-3/4" />
        <div className="h-3 rounded-lg bg-white/[0.03] w-1/2" />
        <div className="h-3 rounded-lg bg-white/[0.03] w-1/3" />
      </div>
    </div>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────
export default function HomePage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  useEffect(() => {
    fetch("/api/events?status=approved")
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();

  const liveEvents = events.filter((e) => isEventLive(e.startTime, e.endTime));

  const featuredEvents = events.filter(
    (e) => e.featured && !isEventLive(e.startTime, e.endTime) && new Date(e.endTime) > now
  );

  const upcoming = events.filter(
    (e) =>
      !e.featured &&
      !isEventLive(e.startTime, e.endTime) &&
      new Date(e.endTime) > now
  );

  const filtered = useMemo(() => {
    const pool = upcoming;
    if (category === "All") return pool.slice(0, 12);
    return pool.filter((e) => e.eventType === category).slice(0, 12);
  }, [upcoming, category]);

  const weekLabel = getWeekLabel();

  return (
    <div className="abstract-grid min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-16 pb-14 px-4">
        {/* Layered glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/6 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute top-24 left-1/3 w-[300px] h-[300px] bg-emerald-400/4 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute top-24 right-1/3 w-[250px] h-[250px] bg-teal-400/3 rounded-full blur-[80px] pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative z-10">
          {/* Logo mark with glow ring */}
          <motion.div
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring" }}
            className="flex justify-center mb-8"
          >
            <div className="relative">
              {/* Outer glow ring */}
              <div className="absolute inset-0 rounded-full bg-primary/15 blur-2xl scale-150" />
              {/* Inner glass circle */}
              <div className="relative h-20 w-20 rounded-full glass-card flex items-center justify-center border-primary/20">
                <AbstractStar className="h-10 w-10 text-primary drop-shadow-[0_0_12px_rgba(74,222,128,0.8)]" />
              </div>
            </div>
          </motion.div>

          {/* 3D Heading */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            <h1 className="font-black leading-none tracking-tight mb-1">
              <span
                className="block text-5xl sm:text-7xl lg:text-8xl text-3d select-none"
                style={{ fontWeight: 900 }}
              >
                This Week&apos;s
              </span>
              <span
                className="block text-6xl sm:text-8xl lg:text-[7rem] text-foreground select-none"
                style={{
                  fontWeight: 900,
                  textShadow: "0 4px 30px rgba(0,0,0,0.5), 0 2px 0 rgba(255,255,255,0.05)",
                  letterSpacing: "-0.02em",
                }}
              >
                Events
              </span>
            </h1>
          </motion.div>

          {/* Week range badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 mb-10 inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card text-sm font-semibold text-primary tracking-widest uppercase"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
            </span>
            {weekLabel}
          </motion.div>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {CATEGORIES.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`
                  flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold
                  transition-all duration-200
                  ${category === value
                    ? "text-primary-foreground shadow-lg shadow-primary/30 scale-105"
                    : "text-muted-foreground hover:text-foreground hover:scale-105"
                  }
                `}
                style={
                  category === value
                    ? {
                        background: "linear-gradient(135deg, #22c55e, #16a34a)",
                        border: "1px solid rgba(74,222,128,0.4)",
                        boxShadow: "0 4px 20px rgba(74,222,128,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
                      }
                    : {
                        background: "linear-gradient(145deg, rgba(74,222,128,0.05), rgba(8,16,10,0.7))",
                        border: "1px solid rgba(74,222,128,0.12)",
                        backdropFilter: "blur(12px)",
                      }
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 pb-20 space-y-14">

        {/* ── HAPPENING NOW ─────────────────────────────────────────────── */}
        {loading ? null : liveEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative section-glow-red"
          >
            <SectionHeader
              icon={
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500" />
                </span>
              }
              label="Happening Now"
              color="text-red-400"
              accent="bg-gradient-to-r from-red-500/40 to-transparent"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {liveEvents.map((event, i) => (
                <DbEventCard key={event.id} event={event} index={i} variant="live" />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── FEATURED EVENTS ───────────────────────────────────────────── */}
        {loading ? null : featuredEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="relative section-glow-amber"
          >
            <SectionHeader
              icon={<Sparkles className="h-5 w-5" />}
              label="Featured Events"
              color="text-amber-400"
              accent="bg-gradient-to-r from-amber-500/30 to-transparent"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {featuredEvents.map((event, i) => (
                <DbEventCard key={event.id} event={event} index={i} variant="featured" />
              ))}
            </div>
          </motion.section>
        )}

        {/* ── UPCOMING EVENTS ───────────────────────────────────────────── */}
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="relative section-glow-green"
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-bold text-lg">
                {category === "All" ? "Upcoming Events" : `${category} Events`}
              </span>
              <div className="h-px w-20 bg-gradient-to-r from-primary/30 to-transparent" />
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium transition-colors"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => <EventSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl glass-card py-20 text-center">
              <AbstractStar className="h-12 w-12 text-primary/20 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {category === "All" ? "No upcoming events" : `No ${category} events scheduled`}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Check back soon — events are added regularly.
              </p>
              {category !== "All" && (
                <Button variant="outline" size="sm" onClick={() => setCategory("All")}>
                  View all categories
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filtered.map((event, i) => (
                <DbEventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )}
        </motion.section>

        {/* ── Calendar CTA ──────────────────────────────────────────────── */}
        {!loading && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="relative rounded-3xl overflow-hidden glass-card p-10 sm:p-14 text-center">
              {/* Top shine line */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-px bg-gradient-to-r from-transparent via-primary/60 to-transparent" />
              {/* Corner glows */}
              <div className="absolute top-0 left-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-primary/5 rounded-full blur-3xl" />

              <div className="relative">
                <AbstractStar className="h-10 w-10 text-primary mx-auto mb-5 drop-shadow-[0_0_12px_rgba(74,222,128,0.6)]" />
                <h2 className="text-2xl sm:text-3xl font-black mb-3 text-3d-sm">
                  Never Miss an Event
                </h2>
                <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm sm:text-base">
                  Browse the full calendar to plan ahead and catch every stream,
                  tournament, and AMA in the Abstract ecosystem.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/calendar">
                    <Button size="lg" variant="gradient" className="gap-2 shadow-lg shadow-primary/20">
                      <Calendar className="h-4 w-4" />
                      Open Calendar
                    </Button>
                  </Link>
                  <Link href="/events">
                    <Button size="lg" variant="outline" className="gap-2 border-primary/20 hover:border-primary/40">
                      Browse All Events
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
