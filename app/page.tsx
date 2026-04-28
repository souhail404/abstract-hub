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
  Trophy,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DbEventCard, type DbEvent } from "@/components/events/DbEventCard";
import { isEventLive } from "@/lib/utils";

// ── Category filters ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { label: "All", value: "All", icon: Zap },
  { label: "AMAs", value: "AMA", icon: Mic2 },
  { label: "Tournaments", value: "Tournament", icon: Trophy },
  { label: "Streams", value: "Stream", icon: Radio },
  { label: "Gaming", value: "Gaming", icon: Gamepad2 },
  { label: "Workshops", value: "Workshop", icon: BookOpen },
];

// ── Week range label ─────────────────────────────────────────────────────────
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

// ── Abstract star logo ───────────────────────────────────────────────────────
function AbstractStar({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M20 4L14 16H4L12 24L9 36L20 29L31 36L28 24L36 16H26L20 4Z"
        fill="currentColor"
      />
    </svg>
  );
}

// ── Event skeleton ────────────────────────────────────────────────────────────
function EventSkeleton() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden animate-pulse">
      <div className="aspect-[16/7] bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/3" />
      </div>
    </div>
  );
}

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
  const upcoming = events.filter(
    (e) => new Date(e.endTime) > now && !isEventLive(e.startTime, e.endTime)
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
      <section className="relative overflow-hidden pt-16 pb-12 px-4">
        {/* Glow blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-primary/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 left-1/4 w-[250px] h-[250px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-16 right-1/4 w-[200px] h-[200px] bg-emerald-400/4 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-5xl text-center relative">
          {/* Logo mark */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-6"
          >
            <div className="relative">
              <AbstractStar className="h-14 w-14 text-primary drop-shadow-[0_0_20px_rgba(74,222,128,0.5)]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="h-14 w-14 rounded-full bg-primary/10 blur-xl" />
              </div>
            </div>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-black tracking-tight mb-4 leading-none"
          >
            <span className="gradient-text-hero">This Week&apos;s</span>
            <br />
            <span className="text-foreground">Events</span>
          </motion.h1>

          {/* Week range */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg sm:text-xl text-muted-foreground font-medium mb-10 tracking-wide"
          >
            {weekLabel}
          </motion.p>

          {/* Category pills */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-4"
          >
            {CATEGORIES.map(({ label, value, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setCategory(value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl border text-sm font-semibold transition-all duration-200 ${
                  category === value
                    ? "bg-primary text-primary-foreground border-primary shadow-lg shadow-primary/30"
                    : "bg-card/60 text-muted-foreground border-border hover:border-primary/40 hover:text-foreground hover:bg-card"
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="container mx-auto max-w-7xl px-4 pb-16">
        {/* Live now banner */}
        {liveEvents.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-10"
          >
            <div className="flex items-center gap-3 mb-4">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
              </span>
              <h2 className="text-lg font-bold text-red-400">Live Right Now</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {liveEvents.map((event, i) => (
                <DbEventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          </motion.section>
        )}

        {/* Events grid */}
        <section>
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">
                {category === "All" ? "Upcoming Events" : `${category} Events`}
              </h2>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium"
            >
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <EventSkeleton key={i} />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-border/60 py-20 text-center">
              <AbstractStar className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                {category === "All"
                  ? "No upcoming events"
                  : `No ${category} events scheduled`}
              </h3>
              <p className="text-sm text-muted-foreground mb-6">
                Check back soon — new events are added regularly.
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
        </section>

        {/* Calendar CTA */}
        {!loading && events.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <div className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-emerald-950/60 via-card to-teal-950/40 p-10 sm:p-14 text-center">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent" />
              <AbstractStar className="h-10 w-10 text-primary mx-auto mb-5" />
              <h2 className="text-2xl sm:text-3xl font-bold mb-3">
                Never Miss an Event
              </h2>
              <p className="text-muted-foreground max-w-sm mx-auto mb-8 text-sm sm:text-base">
                Browse the full calendar to plan ahead and catch every stream,
                tournament, and AMA in the Abstract ecosystem.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/calendar">
                  <Button size="lg" variant="gradient" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Open Calendar
                  </Button>
                </Link>
                <Link href="/events">
                  <Button size="lg" variant="outline" className="gap-2">
                    Browse All Events
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </div>
  );
}
