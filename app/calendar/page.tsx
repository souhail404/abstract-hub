"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  ExternalLink,
  Radio,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { mockEvents } from "@/lib/mock-data";
import { isEventLive, isEventUpcoming, cn } from "@/lib/utils";
import { Event } from "@/lib/types";

// ── constants ─────────────────────────────────────────────────────────────────
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const TYPE_COLORS: Record<string, string> = {
  AMA: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Tournament: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Stream: "bg-red-500/20 text-red-300 border-red-500/30",
  Interview: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Workshop: "bg-teal-500/20 text-teal-300 border-teal-500/30",
  "Community Call": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Education: "bg-green-500/20 text-green-300 border-green-500/30",
  Gaming: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Other: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

// ── helpers ───────────────────────────────────────────────────────────────────
function getWeekDays(base: Date): Date[] {
  const start = new Date(base);
  const day = start.getDay();
  // Shift to Monday: Sunday(0) → -6, else → -(day-1)
  start.setDate(start.getDate() + (day === 0 ? -6 : 1 - day));
  start.setHours(0, 0, 0, 0);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return d;
  });
}

function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function eventsForDay(events: Event[], day: Date) {
  return events.filter((e) => sameDay(new Date(e.startTime), day));
}

function fmtTime(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric", minute: "2-digit", hour12: true,
  });
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });
}

// ── Event detail modal ────────────────────────────────────────────────────────
function EventModal({ event, onClose }: { event: Event; onClose: () => void }) {
  const live = isEventLive(event.startTime, event.endTime);
  const upcoming = isEventUpcoming(event.startTime);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 12 }}
        transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 25 }}
        className="w-full max-w-md rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Banner */}
        <div className="relative h-44 w-full">
          <Image src={event.bannerImage} alt={event.title} fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
          <button
            onClick={onClose}
            className="absolute top-3 right-3 h-8 w-8 rounded-full bg-black/50 flex items-center justify-center hover:bg-black/70 transition-colors"
          >
            <X className="h-4 w-4 text-white" />
          </button>
          {live && (
            <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              LIVE
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-5">
          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap mb-3">
            <span className={cn("text-xs px-2.5 py-0.5 rounded-full border font-medium", TYPE_COLORS[event.eventType])}>
              {event.eventType}
            </span>
            {upcoming && !live && (
              <span className="text-xs px-2.5 py-0.5 rounded-full border font-medium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                Upcoming
              </span>
            )}
            {event.tags?.slice(0, 2).map((tag) => (
              <span key={tag} className="text-xs px-2.5 py-0.5 rounded-full border font-medium bg-primary/10 text-primary border-primary/20">
                #{tag}
              </span>
            ))}
          </div>

          <h2 className="text-lg font-bold mb-3 leading-tight">{event.title}</h2>

          {/* Creator */}
          <div className="flex items-center gap-2 mb-3">
            <Avatar className="h-6 w-6">
              <AvatarImage src={event.creator.avatar} />
              <AvatarFallback>{event.creator.displayName[0]}</AvatarFallback>
            </Avatar>
            <span className="text-sm text-muted-foreground">{event.creator.displayName}</span>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Clock className="h-4 w-4 shrink-0 text-primary" />
            <span>{fmtDate(event.startTime)} · {fmtTime(event.startTime)} UTC</span>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-3 mb-5 leading-relaxed">
            {event.description}
          </p>

          <Link href={`/events/${event.slug}`} onClick={onClose}>
            <Button variant="gradient" className="w-full gap-2">
              View Full Details
              <ExternalLink className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function CalendarPage() {
  const [today] = useState(() => new Date());
  const [current, setCurrent] = useState(() => new Date());
  const [view, setView] = useState<"week" | "day">("week");
  const [selected, setSelected] = useState<Event | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    if (window.innerWidth < 768) setView("day");
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Scroll so today is centered when entering week view on mobile
  useEffect(() => {
    if (view !== "week" || !isMobile || !scrollRef.current) return;
    const todayIndex = weekDays.findIndex((d) => sameDay(d, today));
    if (todayIndex < 0) return;
    const COL = 140;
    const containerWidth = scrollRef.current.clientWidth;
    const target = todayIndex * COL - containerWidth / 2 + COL / 2;
    setTimeout(() => {
      scrollRef.current?.scrollTo({ left: Math.max(0, target), behavior: "smooth" });
    }, 80);
  }, [view, current, isMobile]);

  const approved = mockEvents.filter((e) => e.status === "approved");
  const weekDays = getWeekDays(current);
  const displayDays = view === "week" ? weekDays : [current];

  const navigate = (dir: "prev" | "next" | "today") => {
    if (dir === "today") return setCurrent(new Date());
    const d = new Date(current);
    d.setDate(d.getDate() + (dir === "next" ? 1 : -1) * (view === "week" ? 7 : 1));
    setCurrent(d);
  };

  const rangeLabel = (() => {
    if (view === "day") {
      return `${current.getDate()} ${MONTHS[current.getMonth()]} ${current.getFullYear()}`;
    }
    const first = weekDays[0], last = weekDays[6];
    if (first.getMonth() === last.getMonth()) {
      return `${first.getDate()} – ${last.getDate()} ${MONTHS[last.getMonth()]} ${last.getFullYear()}`;
    }
    return `${first.getDate()} ${MONTHS[first.getMonth()]} – ${last.getDate()} ${MONTHS[last.getMonth()]} ${last.getFullYear()}`;
  })();

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex items-center gap-2.5 mb-2">
              <Calendar className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Calendar</h1>
            </div>
            <p className="text-muted-foreground text-sm">Browse all Abstract ecosystem events by date</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate("prev")}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={() => navigate("today")} className="text-xs px-3">
                {view === "week" ? "This Week" : "Today"}
              </Button>
              <Button variant="outline" size="icon" className="h-9 w-9" onClick={() => navigate("next")}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <span className="text-base font-semibold">{rangeLabel}</span>
          </div>

          <div className="flex items-center gap-1 bg-secondary/50 rounded-xl p-1 border border-border">
            {(["week", "day"] as const).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-xs font-medium transition-all",
                  view === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v === "day" ? "Today" : "Week"}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-2xl border border-border bg-card overflow-hidden"
        >
          {/* Scroll container — snap per column on mobile only */}
          <div
            ref={scrollRef}
            className={cn(isMobile && view === "week" ? "overflow-x-auto" : "")}
            style={isMobile && view === "week" ? {
              scrollSnapType: "x mandatory",
              WebkitOverflowScrolling: "touch",
            } : undefined}
          >
            {/* Flex row — one child per day */}
            <div className={cn(view === "week" ? "flex" : "grid grid-cols-1")}>
              {displayDays.map((day) => {
                const dayEvents = eventsForDay(approved, day);
                const isToday = sameDay(day, today);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "border-r border-border last:border-r-0",
                      view === "week" && (isMobile ? "flex-shrink-0" : "flex-1 min-w-0"),
                      isToday && "bg-primary/[0.02]"
                    )}
                    style={isMobile && view === "week" ? { width: 140, scrollSnapAlign: "start" } : undefined}
                  >
                    {/* Day header */}
                    <div className={cn(
                      "px-3 py-3 text-center border-b border-border",
                      isToday && "bg-primary/8"
                    )}>
                      <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                        {DAYS[day.getDay()]}
                      </p>
                      <p className={cn("text-sm font-bold mt-0.5", isToday ? "text-primary" : "text-foreground")}>
                        {MONTHS[day.getMonth()]} {day.getDate()}
                      </p>
                    </div>

                    {/* Events */}
                    <div className="p-2 min-h-[140px]">
                      {dayEvents.length === 0 ? (
                        <div className="h-full min-h-[120px] flex items-center justify-center">
                          <span className="text-xs text-muted-foreground/25">—</span>
                        </div>
                      ) : (
                        <div className="flex flex-col gap-1.5">
                          {dayEvents.map((event) => {
                            const live = isEventLive(event.startTime, event.endTime);
                            return (
                              <motion.button
                                key={event.id}
                                whileHover={{ scale: 1.015 }}
                                whileTap={{ scale: 0.985 }}
                                onClick={() => setSelected(event)}
                                className="w-full text-left p-2.5 rounded-xl border border-border/50 bg-background/40 hover:bg-card hover:border-primary/30 hover:shadow-sm transition-all group"
                              >
                                <p className="text-xs font-semibold text-foreground leading-snug line-clamp-2 mb-2 group-hover:text-primary transition-colors">
                                  {event.title}
                                </p>
                                <div className="flex flex-wrap gap-1 mb-2">
                                  <span className={cn(
                                    "text-[10px] px-1.5 py-0.5 rounded-full border font-medium leading-none",
                                    TYPE_COLORS[event.eventType]
                                  )}>
                                    {event.eventType}
                                  </span>
                                  {live && (
                                    <span className="text-[10px] px-1.5 py-0.5 rounded-full border font-medium leading-none bg-red-500/20 text-red-300 border-red-500/30 flex items-center gap-0.5">
                                      <Radio className="h-2.5 w-2.5" /> Live
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center justify-between gap-1">
                                  <div className="flex items-center gap-1 min-w-0">
                                    <Avatar className="h-3.5 w-3.5 shrink-0">
                                      <AvatarImage src={event.creator.avatar} />
                                      <AvatarFallback className="text-[7px]">
                                        {event.creator.displayName[0]}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-[10px] text-muted-foreground truncate">
                                      {event.creator.displayName}
                                    </span>
                                  </div>
                                  <span className="text-[10px] text-muted-foreground shrink-0">
                                    {fmtTime(event.startTime)}
                                  </span>
                                </div>
                              </motion.button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detail modal */}
      <AnimatePresence>
        {selected && <EventModal event={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </div>
  );
}
