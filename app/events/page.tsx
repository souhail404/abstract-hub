"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { LayoutGrid } from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { LiveNowSection } from "@/components/events/LiveNowSection";
import { EventFiltersBar } from "@/components/events/EventFilters";
import { mockEvents } from "@/lib/mock-data";
import { EventFilters } from "@/lib/types";
import { isEventLive, isEventToday, isEventThisWeek, isEventUpcoming } from "@/lib/utils";

export default function EventsPage() {
  const [filters, setFilters] = useState<EventFilters>({});

  const approvedEvents = mockEvents.filter((e) => e.status === "approved");
  const liveEvents = approvedEvents.filter((e) => isEventLive(e.startTime, e.endTime));

  const filteredEvents = useMemo(() => {
    let events = approvedEvents;

    if (filters.liveNow) {
      events = events.filter((e) => isEventLive(e.startTime, e.endTime));
    } else if (filters.today) {
      events = events.filter((e) => isEventToday(e.startTime));
    } else if (filters.thisWeek) {
      events = events.filter((e) => isEventThisWeek(e.startTime));
    } else {
      events = events.filter((e) => isEventUpcoming(e.startTime) || isEventLive(e.startTime, e.endTime));
    }

    if (filters.search) {
      const q = filters.search.toLowerCase();
      events = events.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.creator.displayName.toLowerCase().includes(q) ||
          e.tags.some((t) => t.toLowerCase().includes(q)) ||
          e.projects.some((p) => p.name.toLowerCase().includes(q))
      );
    }

    if (filters.eventType) {
      events = events.filter((e) => e.eventType === filters.eventType);
    }

    if (filters.language) {
      events = events.filter((e) => e.language === filters.language);
    }

    if (filters.category) {
      events = events.filter((e) => e.category.slug === filters.category);
    }

    if (filters.creator) {
      events = events.filter((e) => e.creator.username === filters.creator);
    }

    return events.sort(
      (a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    );
  }, [filters]);

  const upcomingFiltered = filteredEvents.filter((e) => !isEventLive(e.startTime, e.endTime));
  const liveFiltered = filteredEvents.filter((e) => isEventLive(e.startTime, e.endTime));

  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center gap-2.5 mb-2">
              <LayoutGrid className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Upcoming Events</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Discover all events happening across the Abstract ecosystem
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8">
        {/* Filters */}
        <div className="mb-8">
          <EventFiltersBar
            filters={filters}
            onChange={setFilters}
            totalCount={filteredEvents.length}
          />
        </div>

        {/* Live Section */}
        {liveFiltered.length > 0 && !filters.liveNow && (
          <LiveNowSection events={liveFiltered} />
        )}

        {filters.liveNow && liveFiltered.length > 0 && (
          <LiveNowSection events={liveFiltered} />
        )}

        {/* Upcoming Grid */}
        {upcomingFiltered.length === 0 && liveFiltered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="text-5xl mb-4">📅</div>
            <h3 className="text-lg font-semibold mb-2">No events found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your filters or check back later
            </p>
          </motion.div>
        ) : (
          upcomingFiltered.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {upcomingFiltered.map((event, i) => (
                <EventCard key={event.id} event={event} index={i} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
}
