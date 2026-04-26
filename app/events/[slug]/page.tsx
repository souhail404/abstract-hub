"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Bell,
  Calendar,
  CalendarPlus,
  Clock,
  ExternalLink,
  Globe,
  Heart,
  Link2,
  MessageSquare,
  Play,
  RefreshCw,
  Share2,
  Tag,
  Twitter,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { CountdownTimer } from "@/components/events/CountdownTimer";
import { EventCard } from "@/components/events/EventCard";
import { mockEvents } from "@/lib/mock-data";
import {
  addToGoogleCalendar,
  EVENT_TYPE_COLORS,
  formatEventDateTime,
  formatInUserTimezone,
  isEventLive,
  cn,
} from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

export default function EventDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();
  const [calendarUrl, setCalendarUrl] = useState("");

  const event = mockEvents.find((e) => e.slug === slug);

  useEffect(() => {
    if (!event) return;
    setCalendarUrl(addToGoogleCalendar({
      title: event.title,
      description: event.description,
      startTime: event.startTime,
      endTime: event.endTime,
      location: event.streamLink,
    }));
  }, [event]);

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold mb-2">Event not found</h1>
          <p className="text-muted-foreground mb-6">This event may have been removed or the link is incorrect.</p>
          <Link href="/events">
            <Button variant="gradient">Browse Events</Button>
          </Link>
        </div>
      </div>
    );
  }

  const live = isEventLive(event.startTime, event.endTime);
  const relatedEvents = mockEvents
    .filter((e) => e.id !== event.id && e.status === "approved" && (e.eventType === event.eventType || e.category.id === event.category.id))
    .slice(0, 3);

  const shareEvent = async () => {
    const url = window.location.href;
    if (navigator.share) {
      await navigator.share({ title: event.title, url });
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!", description: "Event link copied to clipboard." });
    }
  };

  const setReminder = () => {
    toast({ title: "Reminder set! 🔔", description: "We'll notify you before the event starts." });
  };

  return (
    <div className="min-h-screen">
      {/* Back */}
      <div className="container mx-auto max-w-5xl px-4 pt-6 mb-6">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" />
          Back to Events
        </Link>
      </div>

      {/* Banner */}
      <div className="relative aspect-[21/7] max-h-[420px] overflow-hidden">
        <Image src={event.bannerImage} alt={event.title} fill className="object-cover" sizes="100vw" priority />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

        {/* Live badge */}
        {live && (
          <div className="absolute top-6 left-6">
            <Badge variant="live" className="gap-2 px-4 py-2 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
              </span>
              LIVE NOW
            </Badge>
          </div>
        )}
      </div>

      <div className="container mx-auto max-w-5xl px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-2 flex-wrap">
                <span className={cn("text-xs px-3 py-1 rounded-full border font-medium", EVENT_TYPE_COLORS[event.eventType])}>
                  {event.eventType}
                </span>
                <span className="text-xs text-muted-foreground bg-secondary/80 px-3 py-1 rounded-full border border-border/50">
                  {event.category.icon} {event.category.name}
                </span>
                {event.featured && <Badge variant="purple">✦ Featured</Badge>}
                {event.recurrence.type !== "none" && (
                  <Badge variant="info" className="gap-1">
                    <RefreshCw className="h-3 w-3" />
                    Recurring
                  </Badge>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-bold leading-tight">{event.title}</h1>

              {/* Creator */}
              <Link href={`/creators/${event.creator.username}`} className="inline-flex items-center gap-3 group">
                <Avatar className="h-10 w-10 border-2 border-primary/20">
                  <AvatarImage src={event.creator.avatar} />
                  <AvatarFallback>{event.creator.displayName[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                      {event.creator.displayName}
                    </span>
                    {event.creator.verified && <span className="text-primary text-xs">✓</span>}
                  </div>
                  <span className="text-xs text-muted-foreground">@{event.creator.username}</span>
                </div>
              </Link>
            </motion.div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="font-semibold mb-3 text-lg">About This Event</h2>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{event.description}</p>
            </div>

            {/* Tags */}
            {event.tags.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Tags</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span key={tag} className="text-xs bg-secondary/80 border border-border/50 rounded-lg px-3 py-1 text-muted-foreground">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Projects */}
            {event.projects.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Related Projects</h3>
                <div className="flex flex-wrap gap-3">
                  {event.projects.map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5 bg-secondary/50 border border-border rounded-xl px-3 py-2">
                      <div className="relative h-7 w-7 rounded-lg overflow-hidden">
                        <Image src={p.logo} alt={p.name} fill className="object-cover" />
                      </div>
                      <span className="text-sm font-medium">{p.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Related Events */}
            {relatedEvents.length > 0 && (
              <div>
                <h2 className="font-semibold mb-4 text-lg">Related Events</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {relatedEvents.slice(0, 2).map((e, i) => (
                    <EventCard key={e.id} event={e} index={i} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Countdown Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="rounded-2xl border border-border bg-card p-5 space-y-4 sticky top-20"
            >
              {/* Timer */}
              <div className="text-center">
                {live ? (
                  <div className="space-y-2">
                    <Badge variant="live" className="gap-2 px-4 py-2 text-sm mx-auto">
                      <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                      </span>
                      LIVE NOW
                    </Badge>
                    <p className="text-sm text-muted-foreground">Event is happening right now</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">Starts in</p>
                    <CountdownTimer startTime={event.startTime} endTime={event.endTime} className="justify-center" />
                  </div>
                )}
              </div>

              <Separator />

              {/* Date/Time */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Date & Time (UTC)</p>
                    <p className="text-sm font-medium">{formatEventDateTime(event.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Globe className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Your Local Time</p>
                    <p className="text-sm font-medium">{formatInUserTimezone(event.startTime)}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Language</p>
                    <p className="text-sm font-medium">{event.language}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Interested</p>
                    <p className="text-sm font-medium">{event.reminderCount} people</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Actions */}
              <div className="space-y-2.5">
                {live && event.streamLink && (
                  <a href={event.streamLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="gradient" className="w-full gap-2">
                      <Play className="h-4 w-4" fill="white" />
                      Watch Live Now
                    </Button>
                  </a>
                )}
                {!live && event.streamLink && (
                  <a href={event.streamLink} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" className="w-full gap-2">
                      <ExternalLink className="h-4 w-4" />
                      Event Link
                    </Button>
                  </a>
                )}
                <Button variant="glow" className="w-full gap-2" onClick={setReminder}>
                  <Bell className="h-4 w-4" />
                  Set Reminder
                </Button>
                <a href={calendarUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="w-full gap-2">
                    <CalendarPlus className="h-4 w-4" />
                    Add to Calendar
                  </Button>
                </a>
                <Button variant="ghost" className="w-full gap-2" onClick={shareEvent}>
                  <Share2 className="h-4 w-4" />
                  Share Event
                </Button>
              </div>

              {/* Social Links */}
              {(event.twitterLink || event.externalLink) && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <p className="text-xs text-muted-foreground font-medium">Links</p>
                    {event.twitterLink && (
                      <a href={event.twitterLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Twitter className="h-4 w-4" />
                        Twitter / X
                      </a>
                    )}
                    {event.abstractPortalLink && (
                      <a href={event.abstractPortalLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <Link2 className="h-4 w-4" />
                        Abstract Portal
                      </a>
                    )}
                    {event.externalLink && (
                      <a href={event.externalLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
                        <ExternalLink className="h-4 w-4" />
                        Event Website
                      </a>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
