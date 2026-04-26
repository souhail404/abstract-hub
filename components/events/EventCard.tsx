"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Bell, Calendar, Clock, ExternalLink, Globe, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CountdownTimer } from "./CountdownTimer";
import { Event } from "@/lib/types";
import { cn, EVENT_TYPE_COLORS, formatEventDate, formatEventTime, isEventLive } from "@/lib/utils";

interface EventCardProps {
  event: Event;
  index?: number;
  featured?: boolean;
}

export function EventCard({ event, index = 0, featured = false }: EventCardProps) {
  const live = isEventLive(event.startTime, event.endTime);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={cn("group relative rounded-2xl border border-border bg-card overflow-hidden card-glow-hover transition-all duration-300", featured && "md:col-span-2")}
    >
      {/* Banner */}
      <div className="relative aspect-[16/7] overflow-hidden">
        <Image
          src={event.bannerImage}
          alt={event.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          {live && (
            <Badge variant="live" className="gap-1.5 text-xs px-2.5 py-1">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500" />
              </span>
              LIVE
            </Badge>
          )}
          {event.featured && !live && (
            <Badge variant="purple" className="text-xs px-2.5 py-1">
              ✦ Featured
            </Badge>
          )}
          <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", EVENT_TYPE_COLORS[event.eventType])}>
            {event.eventType}
          </span>
        </div>

        {/* Countdown - top right */}
        <div className="absolute top-3 right-3">
          <div className="glass rounded-xl px-3 py-1.5">
            <CountdownTimer startTime={event.startTime} endTime={event.endTime} compact />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Creator */}
        <div className="flex items-center gap-2 mb-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={event.creator.avatar} alt={event.creator.displayName} />
            <AvatarFallback className="text-xs">{event.creator.displayName[0]}</AvatarFallback>
          </Avatar>
          <Link
            href={`/creators/${event.creator.username}`}
            className="text-xs text-muted-foreground hover:text-primary transition-colors font-medium"
          >
            {event.creator.displayName}
          </Link>
          {event.creator.verified && (
            <span className="text-primary text-xs">✓</span>
          )}
        </div>

        {/* Title */}
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-semibold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
        </Link>

        {/* Date/Time */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatEventDate(event.startTime)}</span>
          <span className="text-border">·</span>
          <Clock className="h-3.5 w-3.5 flex-shrink-0" />
          <span>{formatEventTime(event.startTime)} UTC</span>
        </div>

        {/* Projects */}
        {event.projects.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap mb-3">
            {event.projects.map((p) => (
              <span key={p.id} className="text-xs bg-secondary/80 text-muted-foreground rounded-lg px-2 py-0.5 border border-border/50">
                {p.name}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {event.reminderCount}
            </span>
            <span className="flex items-center gap-1">
              <Globe className="h-3 w-3" />
              {event.language}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            {event.streamLink && (
              <a href={event.streamLink} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-primary">
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
            <Button variant="glow" size="sm" className="h-7 text-xs gap-1">
              <Bell className="h-3 w-3" />
              Remind
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
