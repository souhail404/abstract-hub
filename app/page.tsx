"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  ChevronRight,
  Flame,
  Globe,
  LayoutGrid,
  Radio,
  Sparkles,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { EventCard } from "@/components/events/EventCard";
import { LiveNowSection } from "@/components/events/LiveNowSection";
import { CountdownTimer } from "@/components/events/CountdownTimer";
import { mockEvents, mockCreators } from "@/lib/mock-data";
import { isEventLive, formatEventDate, formatEventTime, EVENT_TYPE_COLORS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const _now = new Date();
const liveEvents = mockEvents.filter((e) => isEventLive(e.startTime, e.endTime));
const upcomingEvents = mockEvents
  .filter((e) => !isEventLive(e.startTime, e.endTime) && new Date(e.startTime) > _now)
  .slice(0, 6);
const featuredEvent = mockEvents.find(
  (e) => e.featured && !isEventLive(e.startTime, e.endTime) && new Date(e.startTime) > _now
);

const stats = [
  { label: "Events This Month", value: "48", icon: Calendar },
  { label: "Active Creators", value: "120+", icon: Users },
  { label: "Projects Featured", value: "35+", icon: Sparkles },
  { label: "Community Members", value: "24K+", icon: Globe },
];

export default function HomePage() {
  return (
    <div className="abstract-grid min-h-screen">
      {/* Hero */}
      <section className="relative overflow-hidden pt-20 pb-16 px-4">
        {/* Background effects */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-600/8 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 left-1/4 w-[300px] h-[300px] bg-teal-600/6 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto max-w-6xl text-center relative">
          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
            </span>
            <span className="text-sm text-primary font-medium">The Abstract Ecosystem Hub</span>
          </motion.div>

          {/* Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-none"
          >
            Never Miss an{" "}
            <span className="gradient-text">Abstract</span>
            <br />
            Event Again
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Your central hub for tournaments, AMAs, streams, workshops, and community events across
            the entire Abstract ecosystem. Discover what's live, what's next, and who to follow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Link href="/events">
              <Button size="xl" variant="gradient" className="gap-2 shadow-2xl shadow-emerald-500/20">
                <LayoutGrid className="h-5 w-5" />
                Browse Events
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/submit">
              <Button size="xl" variant="outline" className="gap-2">
                <Zap className="h-5 w-5" />
                Submit Your Event
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto"
          >
            {stats.map(({ label, value, icon: Icon }, i) => (
              <div
                key={label}
                className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-card/60 border border-border/60 backdrop-blur-sm"
              >
                <Icon className="h-5 w-5 text-primary" />
                <span className="text-2xl font-bold gradient-text">{value}</span>
                <span className="text-xs text-muted-foreground text-center">{label}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="container mx-auto max-w-7xl px-4">
        {/* Live Now */}
        {liveEvents.length > 0 && <LiveNowSection events={liveEvents} />}

        {/* Featured Event */}
        {featuredEvent && (
          <section className="mb-10">
            <div className="flex items-center gap-3 mb-5">
              <Flame className="h-5 w-5 text-orange-400" />
              <h2 className="text-xl font-bold">Featured Event</h2>
              <div className="h-px flex-1 bg-gradient-to-r from-orange-500/30 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative rounded-2xl overflow-hidden border border-border bg-card card-glow-hover group cursor-pointer"
            >
              <div className="relative aspect-[21/7] overflow-hidden">
                <Image
                  src={featuredEvent.bannerImage}
                  alt={featuredEvent.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="100vw"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-r from-card via-card/60 to-transparent" />
              </div>
              <div className="absolute inset-0 flex items-center px-8 md:px-12">
                <div className="max-w-lg">
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="purple" className="px-3 py-1">✦ Featured</Badge>
                    <span className={cn("text-xs px-2.5 py-1 rounded-full border font-medium", EVENT_TYPE_COLORS[featuredEvent.eventType])}>
                      {featuredEvent.eventType}
                    </span>
                  </div>
                  <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3 leading-tight">
                    {featuredEvent.title}
                  </h2>
                  <div className="flex items-center gap-3 mb-4">
                    <Avatar className="h-7 w-7">
                      <AvatarImage src={featuredEvent.creator.avatar} />
                      <AvatarFallback>{featuredEvent.creator.displayName[0]}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-muted-foreground">{featuredEvent.creator.displayName}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-sm text-muted-foreground">
                      {formatEventDate(featuredEvent.startTime)} · {formatEventTime(featuredEvent.startTime)} UTC
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mb-5">
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <span>Starts in:</span>
                      <CountdownTimer startTime={featuredEvent.startTime} endTime={featuredEvent.endTime} />
                    </div>
                  </div>
                  <Link href={`/events/${featuredEvent.slug}`}>
                    <Button variant="gradient" className="gap-2">
                      View Event <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* Upcoming Events */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-primary" />
              <h2 className="text-xl font-bold">Upcoming Events</h2>
            </div>
            <Link href="/events" className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 transition-colors font-medium">
              View all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {upcomingEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        </section>

        {/* Top Creators */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <Trophy className="h-5 w-5 text-amber-400" />
              <h2 className="text-xl font-bold">Top Creators</h2>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {mockCreators.map((creator, i) => (
              <motion.div
                key={creator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Link href={`/creators/${creator.username}`}>
                  <div className="group p-5 rounded-2xl border border-border bg-card hover:border-primary/30 hover:bg-card/80 transition-all duration-300 cursor-pointer">
                    <div className="flex items-center gap-3 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={creator.avatar} />
                        <AvatarFallback>{creator.displayName[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-sm group-hover:text-primary transition-colors">
                            {creator.displayName}
                          </span>
                          {creator.verified && <span className="text-primary text-xs">✓</span>}
                        </div>
                        <span className="text-xs text-muted-foreground">@{creator.username}</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>{creator.followersCount.toLocaleString()} followers</span>
                      <span>{creator.eventsCount} events</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden border border-primary/20 bg-gradient-to-br from-emerald-950/60 via-card to-teal-950/40 p-12 text-center"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/5 to-teal-600/5 pointer-events-none" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
            <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold mb-3">Host an Event on Abstract</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Reach thousands of Abstract ecosystem participants. Submit your event and get featured in front of the community.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/submit">
                <Button size="lg" variant="gradient" className="gap-2">
                  <Zap className="h-4 w-4" />
                  Submit Your Event
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="gap-2">
                  Create Creator Account
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>
      </div>
    </div>
  );
}
