"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BadgeCheck,
  Calendar,
  ExternalLink,
  Globe,
  Heart,
  MessageCircle,
  Twitter,
  UserPlus,
  Users,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventCard } from "@/components/events/EventCard";
import { mockCreators, mockEvents } from "@/lib/mock-data";
import { isEventLive, isEventUpcoming } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

export default function CreatorProfilePage() {
  const { username } = useParams<{ username: string }>();
  const { toast } = useToast();

  const creator = mockCreators.find((c) => c.username === username);

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">👤</div>
          <h1 className="text-2xl font-bold mb-2">Creator not found</h1>
          <Link href="/events"><Button variant="gradient">Browse Events</Button></Link>
        </div>
      </div>
    );
  }

  const creatorEvents = mockEvents.filter(
    (e) => e.creator.username === username && e.status === "approved"
  );
  const upcomingEvents = creatorEvents.filter(
    (e) => isEventUpcoming(e.startTime) || isEventLive(e.startTime, e.endTime)
  );
  const pastEvents = creatorEvents.filter(
    (e) => !isEventUpcoming(e.startTime) && !isEventLive(e.startTime, e.endTime)
  );

  const follow = () => {
    toast({ title: "Following!", description: `You're now following ${creator.displayName}` });
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

      {/* Profile Header */}
      <div className="border-b border-border/50 bg-card/30 mb-8">
        <div className="container mx-auto max-w-5xl px-4 py-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row items-start sm:items-center gap-6"
          >
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 border-4 border-primary/20 shadow-xl shadow-primary/10">
                <AvatarImage src={creator.avatar} alt={creator.displayName} />
                <AvatarFallback className="text-2xl">{creator.displayName[0]}</AvatarFallback>
              </Avatar>
              {creator.verified && (
                <div className="absolute -bottom-1 -right-1 bg-primary rounded-full p-1">
                  <BadgeCheck className="h-4 w-4 text-white" />
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap mb-2">
                <h1 className="text-2xl font-bold">{creator.displayName}</h1>
                {creator.verified && (
                  <Badge variant="purple" className="gap-1">
                    <BadgeCheck className="h-3 w-3" /> Verified Creator
                  </Badge>
                )}
              </div>
              <p className="text-muted-foreground text-sm mb-1">@{creator.username}</p>
              <p className="text-sm leading-relaxed max-w-xl mb-4">{creator.bio}</p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {creator.twitterUrl && (
                  <a href={creator.twitterUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Twitter className="h-3.5 w-3.5" />
                    Twitter
                  </a>
                )}
                {creator.discordUrl && (
                  <a href={creator.discordUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <MessageCircle className="h-3.5 w-3.5" />
                    Discord
                  </a>
                )}
                {creator.websiteUrl && (
                  <a href={creator.websiteUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors">
                    <Globe className="h-3.5 w-3.5" />
                    Website
                  </a>
                )}
              </div>
            </div>

            {/* Stats + Actions */}
            <div className="flex flex-col gap-4 sm:items-end">
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <p className="text-xl font-bold">{creator.followersCount.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Followers</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-bold">{creator.eventsCount}</p>
                  <p className="text-xs text-muted-foreground">Events</p>
                </div>
              </div>
              <Button variant="gradient" className="gap-2" onClick={follow}>
                <UserPlus className="h-4 w-4" />
                Follow Creator
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Events */}
      <div className="container mx-auto max-w-5xl px-4 pb-16">
        <Tabs defaultValue="upcoming">
          <TabsList className="mb-6">
            <TabsTrigger value="upcoming" className="gap-2">
              <Calendar className="h-4 w-4" />
              Upcoming ({upcomingEvents.length})
            </TabsTrigger>
            <TabsTrigger value="past" className="gap-2">
              <Zap className="h-4 w-4" />
              Past ({pastEvents.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming">
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📅</div>
                <p className="text-muted-foreground">No upcoming events from this creator</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {upcomingEvents.map((e, i) => (
                  <EventCard key={e.id} event={e} index={i} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="past">
            {pastEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-4xl mb-3">📜</div>
                <p className="text-muted-foreground">No past events yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pastEvents.map((e, i) => (
                  <EventCard key={e.id} event={e} index={i} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
