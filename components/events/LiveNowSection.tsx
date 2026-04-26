"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ExternalLink, Play, Radio } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Event } from "@/lib/types";
import { EVENT_TYPE_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface LiveNowSectionProps {
  events: Event[];
}

export function LiveNowSection({ events }: LiveNowSectionProps) {
  if (events.length === 0) return null;

  return (
    <section className="mb-10">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Radio className="h-5 w-5 text-red-400" />
            <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          </div>
          <h2 className="text-xl font-bold text-foreground">Live Now</h2>
        </div>
        <div className="h-px flex-1 bg-gradient-to-r from-red-500/30 to-transparent" />
        <Badge variant="live" className="px-3 py-1">
          {events.length} active
        </Badge>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event, i) => (
          <LiveEventCard key={event.id} event={event} index={i} />
        ))}
      </div>
    </section>
  );
}

function LiveEventCard({ event, index }: { event: Event; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      className="group relative rounded-2xl overflow-hidden border border-red-500/20 bg-card shine-border"
    >
      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />

      {/* Banner */}
      <div className="relative aspect-[16/6] overflow-hidden">
        <Image src={event.bannerImage} alt={event.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 50vw" />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-black/20" />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge variant="live" className="gap-1.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
            </span>
            LIVE
          </Badge>
          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", EVENT_TYPE_COLORS[event.eventType])}>
            {event.eventType}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-2 mb-2">
          <Avatar className="h-5 w-5">
            <AvatarImage src={event.creator.avatar} />
            <AvatarFallback className="text-xs">{event.creator.displayName[0]}</AvatarFallback>
          </Avatar>
          <span className="text-xs text-muted-foreground">{event.creator.displayName}</span>
        </div>

        <Link href={`/events/${event.slug}`}>
          <h3 className="font-semibold text-foreground line-clamp-1 hover:text-primary transition-colors mb-3">
            {event.title}
          </h3>
        </Link>

        <div className="flex gap-2">
          {event.streamLink && (
            <a href={event.streamLink} target="_blank" rel="noopener noreferrer" className="flex-1">
              <Button variant="gradient" size="sm" className="w-full gap-1.5 text-xs">
                <Play className="h-3.5 w-3.5" fill="white" />
                Watch Live
              </Button>
            </a>
          )}
          <Link href={`/events/${event.slug}`}>
            <Button variant="outline" size="sm" className="gap-1.5 text-xs">
              <ExternalLink className="h-3.5 w-3.5" />
              Details
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
