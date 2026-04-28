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

type CardVariant = "default" | "featured" | "live";

interface DbEventCardProps {
  event: DbEvent;
  index?: number;
  variant?: CardVariant;
}

// Per-variant glass class and accent colours
const VARIANT_CLASS: Record<CardVariant, string> = {
  default:  "glass-card",
  featured: "glass-card-featured",
  live:     "glass-card-live",
};

const VARIANT_HOVER: Record<CardVariant, string> = {
  default:
    "hover:border-primary/30 hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_4px_16px_rgba(74,222,128,0.12)] hover:-translate-y-1",
  featured:
    "hover:border-amber-400/35 hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_4px_20px_rgba(251,191,36,0.14)] hover:-translate-y-1",
  live:
    "hover:border-red-400/35 hover:shadow-[0_12px_48px_rgba(0,0,0,0.6),0_4px_20px_rgba(239,68,68,0.14)] hover:-translate-y-1",
};

export function DbEventCard({ event, index = 0, variant = "default" }: DbEventCardProps) {
  const live = isEventLive(event.startTime, event.endTime);
  const effectiveVariant: CardVariant = live ? "live" : variant;
  const link =
    event.streamLink || event.twitterLink || event.externalLink || event.abstractPortalLink;
  const creatorName = event.creator.displayName || event.creator.name;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.07 }}
      className={cn(
        "group relative rounded-2xl overflow-hidden transition-all duration-300",
        VARIANT_CLASS[effectiveVariant],
        VARIANT_HOVER[effectiveVariant]
      )}
    >
      {/* Banner */}
      <div className="relative aspect-[16/7] overflow-hidden">
        {event.bannerImage ? (
          <Image
            src={event.bannerImage}
            alt={event.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          /* Placeholder: animated green gradient */
          <div className="absolute inset-0 flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, rgba(74,222,128,0.08) 0%, rgba(8,16,10,0.9) 100%)",
            }}
          >
            <Zap className="h-10 w-10 text-primary/20" />
          </div>
        )}

        {/* Gradient overlay: hard at bottom for readability */}
        <div className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(4,10,6,0.85) 0%, rgba(4,10,6,0.2) 50%, transparent 100%)",
          }}
        />

        {/* Top-left badges */}
        <div className="absolute top-3 left-3 flex items-center gap-2 flex-wrap">
          {live && (
            <span className="flex items-center gap-1.5 bg-red-500/90 backdrop-blur-md text-white text-xs font-black px-2.5 py-1 rounded-full tracking-wide shadow-lg shadow-red-500/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-80" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-white" />
              </span>
              LIVE
            </span>
          )}
          {event.featured && !live && (
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full tracking-wide shadow-lg"
              style={{
                background: "linear-gradient(135deg, rgba(251,191,36,0.2), rgba(217,119,6,0.15))",
                border: "1px solid rgba(251,191,36,0.35)",
                color: "#fbbf24",
                backdropFilter: "blur(10px)",
                boxShadow: "0 2px 12px rgba(251,191,36,0.2)",
              }}
            >
              ✦ Featured
            </span>
          )}
          <span
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border font-semibold backdrop-blur-md",
              EVENT_TYPE_COLORS[event.eventType]
            )}
          >
            {event.eventType}
          </span>
        </div>

        {/* Countdown — top right */}
        {!live && (
          <div className="absolute top-3 right-3">
            <div
              className="rounded-xl px-3 py-1.5 text-xs font-medium"
              style={{
                background: "rgba(4,10,6,0.75)",
                border: "1px solid rgba(74,222,128,0.15)",
                backdropFilter: "blur(12px)",
              }}
            >
              <CountdownTimer startTime={event.startTime} endTime={event.endTime} compact />
            </div>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Title */}
        <Link href={`/events/${event.slug}`}>
          <h3 className="font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-primary transition-colors duration-200">
            {event.title}
          </h3>
        </Link>

        {/* Date/Time */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-3">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{formatEventDate(event.startTime)}</span>
          <span className="opacity-40">·</span>
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{formatEventTime(event.startTime)} UTC</span>
        </div>

        {/* Tags */}
        {event.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {event.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs rounded-lg px-2 py-0.5"
                style={{
                  background: "rgba(74,222,128,0.07)",
                  border: "1px solid rgba(74,222,128,0.12)",
                  color: "rgba(134,239,172,0.8)",
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          className="flex items-center justify-between pt-3"
          style={{ borderTop: "1px solid rgba(74,222,128,0.08)" }}
        >
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
              <Button
                variant="glow"
                size="sm"
                className="h-7 text-xs gap-1 font-semibold"
              >
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
