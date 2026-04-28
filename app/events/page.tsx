"use client";

import { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { LayoutGrid, Radio, Search, X } from "lucide-react";
import { DbEventCard, type DbEvent } from "@/components/events/DbEventCard";
import { isEventLive } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const EVENT_TYPES = [
  "All",
  "AMA",
  "Tournament",
  "Stream",
  "Interview",
  "Workshop",
  "Community Call",
  "Gaming",
  "Education",
  "Other",
];

const TIME_FILTERS = [
  { label: "Upcoming", value: "upcoming" },
  { label: "Today", value: "today" },
  { label: "This Week", value: "week" },
];

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

export default function EventsPage() {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [eventType, setEventType] = useState("All");
  const [timeFilter, setTimeFilter] = useState("upcoming");

  useEffect(() => {
    fetch("/api/events?status=approved")
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, []);

  const now = new Date();
  const todayEnd = new Date(now);
  todayEnd.setHours(23, 59, 59, 999);
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);

  const filtered = useMemo(() => {
    let list = events;

    // Time filter
    if (timeFilter === "upcoming") {
      list = list.filter((e) => new Date(e.endTime) > now);
    } else if (timeFilter === "today") {
      list = list.filter(
        (e) => new Date(e.startTime) <= todayEnd && new Date(e.endTime) >= now
      );
    } else if (timeFilter === "week") {
      list = list.filter(
        (e) => new Date(e.startTime) <= weekEnd && new Date(e.endTime) >= now
      );
    }

    // Type filter
    if (eventType !== "All") {
      list = list.filter((e) => e.eventType === eventType);
    }

    // Search
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.description.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          (e.creator.displayName ?? e.creator.name ?? "")
            .toLowerCase()
            .includes(q)
      );
    }

    return list.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, search, eventType, timeFilter]);

  const liveEvents = filtered.filter((e) => isEventLive(e.startTime, e.endTime));
  const upcomingEvents = filtered.filter(
    (e) => !isEventLive(e.startTime, e.endTime)
  );

  return (
    <div className="min-h-screen">
      {/* Page header */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <LayoutGrid className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Events</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Discover all events happening across the Abstract ecosystem
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="space-y-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search events, tags, creators…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-11"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Type + time filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Time filter */}
            <div className="flex items-center gap-2">
              {TIME_FILTERS.map((f) => (
                <button
                  key={f.value}
                  onClick={() => setTimeFilter(f.value)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all",
                    timeFilter === f.value
                      ? "bg-primary/10 text-primary border-primary/30"
                      : "text-muted-foreground border-border hover:border-primary/20 hover:text-foreground"
                  )}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Type filter scroll */}
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {EVENT_TYPES.map((t) => (
                <button
                  key={t}
                  onClick={() => setEventType(t)}
                  className={cn(
                    "px-3 py-1.5 rounded-xl text-xs font-medium border whitespace-nowrap transition-all",
                    eventType === t
                      ? "bg-primary text-primary-foreground border-primary"
                      : "text-muted-foreground border-border hover:border-primary/20 hover:text-foreground"
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Result count */}
          {!loading && (
            <p className="text-xs text-muted-foreground">
              {filtered.length} event{filtered.length !== 1 ? "s" : ""} found
            </p>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <EventSkeleton key={i} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-3xl glass-card py-20 text-center">
            <LayoutGrid className="h-10 w-10 text-primary/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-muted-foreground mb-2">
              No events found
            </h3>
            <p className="text-sm text-muted-foreground mb-5">
              Try adjusting your filters or check back soon.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearch("");
                setEventType("All");
                setTimeFilter("upcoming");
              }}
            >
              Clear filters
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Live */}
            {liveEvents.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-4">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                  </span>
                  <h2 className="text-base font-bold text-red-400">Live Now</h2>
                  <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {liveEvents.map((event, i) => (
                    <DbEventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <section>
                {liveEvents.length > 0 && (
                  <div className="flex items-center gap-3 mb-4">
                    <Radio className="h-4 w-4 text-primary" />
                    <h2 className="text-base font-bold">Upcoming</h2>
                    <div className="h-px flex-1 bg-gradient-to-r from-primary/20 to-transparent" />
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {upcomingEvents.map((event, i) => (
                    <DbEventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
