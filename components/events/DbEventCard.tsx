"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Calendar, Clock, ExternalLink, Zap } from "lucide-react";
import { cn, EVENT_TYPE_COLORS, formatEventDate, formatEventTime, isEventLive } from "@/lib/utils";
import { CountdownTimer } from "./CountdownTimer";
import { Button } from "@/components/ui/button";

export interface DbEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage: string | null;
  eventType: string;
  language: string;
  startTime: string;
  endTime: string;
  tags: string[];
  featured: boolean;
  viewCount: number;
  twitterLink?: string | null;
  streamLink?: string | null;
  externalLink?: string | null;
  abstractPortalLink?: string | null;
  creator: {
    displayName?: string | null;
    name?: string | null;
    image?: string | null;
    username?: string | null;
  };
}

interface DbEventCardProps {
  event: DbEvent;
  index?: number;
}

export function DbEventCard({ event, index = 0 }: DbEventCardProps) {
  const live = isEventLive(event.startTime, event.endTime);
  const link =
    event.streamLink || event.twitterLink || event.externalLink || event.abstractPortalLink;
  const creatorName = event.creator.displayName || event.creator.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="group relative rounded-2xl border border-border bg-card overflow-hidden card-glow-hover"
    >
      {/* Banner */}
      <div className="relative aspect-[16/7] overflow-hidden bg-card">
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/15 via-card to-card flex items-center justify-center">
            <Zap className="h-10 w-10 text-primary/20" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-card/80 via-card/10 to-transparent" />

        {/* Top badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          {live && (
            <span className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-sm text-white text-xs font-bold px-2.5 py-1 rounded-full">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              LIVE
            </span>
          )}
          {event.featured && !live && (
            <span className="bg-amber-500/20 backdrop-blur-sm text-amber-400 border border-amber-500/30 text-xs font-medium px-2.5 py-1 rounded-full">
              ✦ Featured
            </span>
          )}
          <span
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-medium backdrop-blur-sm",
              EVENT_TYPE_COLORS[event.eventType]
            )}
          >
            {event.eventType}
          </span>
        </div>

        {/* Countdown top right */}
        {!live && (
          <div className="absolute top-3 right-3">
            <div className="glass rounded-xl px-3 py-1.5">
              <CountdownTimer startTime={event.startTime} endTime={event.endTime} compact />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
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

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary/80 text-muted-foreground rounded-md px-2 py-0.5"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          {creatorName ? (
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {creatorName}
            </span>
          ) : (
            <span />
          )}
          <div className="flex items-center gap-1.5">
            {link && (
              <a href={link} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-primary"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </Button>
              </a>
            )}
            <Link href={`/events/${event.slug}`}>
              <Button variant="glow" size="sm" className="h-7 text-xs gap-1">
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
