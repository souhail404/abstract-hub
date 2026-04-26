"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  Clock,
  Plus,
  XCircle,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DbEvent {
  id: string;
  title: string;
  eventType: string;
  startTime: string;
  status: string;
  viewCount: number;
  reminderCount: number;
  rejectionReason?: string;
}

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  approved: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  archived: "bg-muted/10 text-muted-foreground border-muted/20",
};

const STATUS_ICON: Record<string, React.ReactNode> = {
  pending: <Clock className="h-3.5 w-3.5" />,
  approved: <CheckCircle2 className="h-3.5 w-3.5" />,
  rejected: <XCircle className="h-3.5 w-3.5" />,
};

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "loading") return; // still resolving
    if (!session?.user?.id) {
      setLoading(false);
      return;
    }
    fetch(`/api/events?creatorId=${session.user.id}`)
      .then((r) => r.json())
      .then((data) => setEvents(Array.isArray(data) ? data : []))
      .catch(() => setEvents([]))
      .finally(() => setLoading(false));
  }, [session?.user?.id, status]);

  const stats = {
    total: events.length,
    approved: events.filter((e) => e.status === "approved").length,
    pending: events.filter((e) => e.status === "pending").length,
    rejected: events.filter((e) => e.status === "rejected").length,
  };

  return (
    <div className="container mx-auto max-w-4xl px-4 py-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage src={session?.user?.image ?? ""} />
            <AvatarFallback>{(session?.user?.name ?? "U")[0]}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{session?.user?.name}</h1>
            <p className="text-sm text-muted-foreground">Creator Dashboard</p>
          </div>
        </div>
        <Link href="/submit">
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total", value: stats.total },
          { label: "Approved", value: stats.approved },
          { label: "Pending", value: stats.pending },
          { label: "Rejected", value: stats.rejected },
        ].map(({ label, value }) => (
          <div
            key={label}
            className="rounded-xl border border-border bg-card p-4 text-center"
          >
            <div className="text-2xl font-bold">{value}</div>
            <div className="text-xs text-muted-foreground mt-1">{label}</div>
          </div>
        ))}
      </div>

      {/* Events list */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Your Events
        </h2>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 rounded-xl bg-card animate-pulse" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border p-12 text-center">
            <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">No events yet.</p>
            <Link href="/submit" className="mt-4 inline-block">
              <Button variant="gradient" size="sm" className="gap-2 mt-4">
                <Plus className="h-4 w-4" />
                Submit your first event
              </Button>
            </Link>
          </div>
        ) : (
          events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-xl border border-border bg-card px-5 py-4 hover:border-primary/20 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{event.title}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {event.eventType} ·{" "}
                  {new Date(event.startTime).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </p>
                {event.status === "rejected" && event.rejectionReason && (
                  <p className="text-xs text-red-400 mt-1">
                    Reason: {event.rejectionReason}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-3 ml-4 shrink-0">
                <span className="text-xs text-muted-foreground hidden sm:block">
                  {event.viewCount} views
                </span>
                <span
                  className={cn(
                    "flex items-center gap-1 text-xs px-2.5 py-1 rounded-full border font-medium capitalize",
                    STATUS_STYLES[event.status]
                  )}
                >
                  {STATUS_ICON[event.status]}
                  {event.status}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
