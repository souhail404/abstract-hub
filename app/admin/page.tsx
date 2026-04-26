"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Archive,
  BarChart3,
  Calendar,
  CheckCircle2,
  Clock,
  Eye,
  Flame,
  LayoutDashboard,
  Lock,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  Trash2,
  TrendingUp,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatEventDateTime, EVENT_TYPE_COLORS, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// ── PIN Gate ──────────────────────────────────────────────────────────────────
const ADMIN_PIN = "2612"; // change this to your secret PIN
const SESSION_KEY = "abstract_admin_auth";

function PinGate({ onUnlock }: { onUnlock: () => void }) {
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);
  const inputRefs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  const handleKey = (i: number, val: string) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError(false);
    if (val && i < 3) inputRefs[i + 1].current?.focus();
    if (next.every((d) => d !== "")) {
      const pin = next.join("");
      if (pin === ADMIN_PIN) {
        sessionStorage.setItem(SESSION_KEY, "1");
        onUnlock();
      } else {
        setShake(true);
        setError(true);
        setTimeout(() => {
          setDigits(["", "", "", ""]);
          setShake(false);
          inputRefs[0].current?.focus();
        }, 600);
      }
    }
  };

  const handleKeyDown = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputRefs[i - 1].current?.focus();
    }
  };

  useEffect(() => {
    inputRefs[0].current?.focus();
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 abstract-grid">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-emerald-600/6 rounded-full blur-3xl pointer-events-none" />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, type: "spring" }}
        className="relative w-full max-w-sm"
      >
        <div className="rounded-3xl border border-border bg-card p-10 text-center shadow-2xl shadow-black/40">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <Lock className="h-7 w-7 text-primary" />
          </div>
          <h1 className="text-xl font-bold mb-1">Admin Access</h1>
          <p className="text-sm text-muted-foreground mb-8">Enter your 4-digit PIN to continue</p>

          <motion.div
            animate={shake ? { x: [-8, 8, -6, 6, -4, 4, 0] } : {}}
            transition={{ duration: 0.4 }}
            className="flex justify-center gap-3 mb-6"
          >
            {digits.map((d, i) => (
              <input
                key={i}
                ref={inputRefs[i]}
                type="password"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleKey(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className={cn(
                  "h-14 w-12 rounded-xl border text-center text-xl font-bold bg-background outline-none transition-all duration-200",
                  "focus:border-primary focus:ring-2 focus:ring-primary/20",
                  error
                    ? "border-destructive text-destructive"
                    : d
                    ? "border-primary text-foreground"
                    : "border-border text-foreground"
                )}
              />
            ))}
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-destructive font-medium"
              >
                Incorrect PIN — try again
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────

interface DbEvent {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage?: string;
  eventType: string;
  startTime: string;
  endTime: string;
  status: string;
  featured: boolean;
  viewCount: number;
  reminderCount: number;
  creator: { id: string; displayName?: string; name?: string; image?: string };
  tags: string[];
}

export default function AdminDashboard() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pendingEvents, setPendingEvents] = useState<DbEvent[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<DbEvent[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
    setChecking(false);
  }, []);

  // Fetch real events once authenticated
  useEffect(() => {
    if (!authed) return;
    setLoadingData(true);
    Promise.all([
      fetch("/api/events?status=pending").then((r) => r.json()),
      fetch("/api/events?status=approved").then((r) => r.json()),
    ])
      .then(([pending, approved]) => {
        setPendingEvents(Array.isArray(pending) ? pending : []);
        setApprovedEvents(Array.isArray(approved) ? approved : []);
      })
      .finally(() => setLoadingData(false));
  }, [authed]);

  if (checking) return null;
  if (!authed) return <PinGate onUnlock={() => setAuthed(true)} />;

  const approve = async (id: string) => {
    const event = pendingEvents.find((e) => e.id === id);
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "approved" }),
    });
    if (res.ok) {
      setPendingEvents((prev) => prev.filter((e) => e.id !== id));
      setApprovedEvents((prev) => [{ ...event!, status: "approved" }, ...prev]);
      toast({ title: "Event approved!", description: `"${event?.title}" is now live.` });
    }
  };

  const reject = async (id: string) => {
    const event = pendingEvents.find((e) => e.id === id);
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "rejected" }),
    });
    if (res.ok) {
      setPendingEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ variant: "destructive", title: "Event rejected", description: `"${event?.title}" has been rejected.` });
    }
  };

  const toggleFeatured = async (id: string) => {
    const event = approvedEvents.find((e) => e.id === id);
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ featured: !event?.featured }),
    });
    if (res.ok) {
      setApprovedEvents((prev) =>
        prev.map((e) => (e.id === id ? { ...e, featured: !e.featured } : e))
      );
      toast({ title: event?.featured ? "Unfeatured" : "Featured!", description: `"${event?.title}" updated.` });
    }
  };

  const archive = async (id: string) => {
    const event = approvedEvents.find((e) => e.id === id);
    const res = await fetch(`/api/events/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "archived" }),
    });
    if (res.ok) {
      setApprovedEvents((prev) => prev.filter((e) => e.id !== id));
      toast({ title: "Archived", description: `"${event?.title}" has been archived.` });
    }
  };

  const stats = [
    { label: "Total Events", value: String(pendingEvents.length + approvedEvents.length), change: "all time", icon: Calendar, color: "text-emerald-400" },
    { label: "Pending Review", value: String(pendingEvents.length), change: pendingEvents.length > 0 ? "Needs action" : "All clear", icon: Clock, color: "text-amber-400" },
    { label: "Live Events", value: String(approvedEvents.length), change: "approved", icon: BarChart3, color: "text-emerald-400" },
    { label: "Featured", value: String(approvedEvents.filter((e) => e.featured).length), change: "on homepage", icon: Sparkles, color: "text-blue-400" },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-7xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2.5 mb-2">
              <Shield className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground text-sm">Manage events, creators, and platform settings</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-7xl px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {stats.map(({ label, value, change, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-2xl border border-border bg-card p-5"
            >
              <div className="flex items-center justify-between mb-4">
                <Icon className={cn("h-5 w-5", color)} />
                <span className={cn("text-xs font-medium", change.includes("+") ? "text-emerald-400" : "text-amber-400")}>
                  {change}
                </span>
              </div>
              <p className="text-2xl font-bold mb-1">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </motion.div>
          ))}
        </div>

        <Tabs defaultValue="pending" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="pending" className="gap-2">
              <Clock className="h-4 w-4" />
              Pending
              {pendingEvents.length > 0 && (
                <span className="bg-amber-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {pendingEvents.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved" className="gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Approved ({approvedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="creators" className="gap-2">
              <Users className="h-4 w-4" />
              Creators
            </TabsTrigger>
          </TabsList>

          {/* Pending Tab */}
          <TabsContent value="pending">
            {pendingEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-5xl mb-4">✅</div>
                <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                <p className="text-muted-foreground text-sm">No events pending review</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingEvents.map((event, i) => (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: i * 0.08 }}
                    className="rounded-2xl border border-amber-500/20 bg-card p-5"
                  >
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Banner thumb */}
                      {event.bannerImage ? (
                        <div className="relative h-24 w-40 rounded-xl overflow-hidden shrink-0">
                          <Image src={event.bannerImage} alt={event.title} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="h-24 w-40 rounded-xl bg-muted shrink-0 flex items-center justify-center text-muted-foreground text-xs">No image</div>
                      )}

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div>
                            <h3 className="font-semibold line-clamp-1">{event.title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={event.creator.image ?? ""} />
                                <AvatarFallback>{(event.creator.displayName ?? event.creator.name ?? "U")[0]}</AvatarFallback>
                              </Avatar>
                              <span className="text-xs text-muted-foreground">{event.creator.displayName ?? event.creator.name}</span>
                            </div>
                          </div>
                          <Badge variant="warning" className="shrink-0">Pending</Badge>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{event.description}</p>

                        <div className="flex items-center gap-3 flex-wrap">
                          <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", EVENT_TYPE_COLORS[event.eventType])}>
                            {event.eventType}
                          </span>
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatEventDateTime(event.startTime)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex flex-row md:flex-col gap-2 shrink-0">
                        <Button
                          variant="default"
                          size="sm"
                          className="gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white flex-1 md:flex-none"
                          onClick={() => approve(event.id)}
                        >
                          <CheckCircle2 className="h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          className="gap-1.5 flex-1 md:flex-none"
                          onClick={() => reject(event.id)}
                        >
                          <XCircle className="h-4 w-4" />
                          Reject
                        </Button>
                        <Link href={`/events/${event.slug}`}>
                          <Button variant="outline" size="sm" className="gap-1.5">
                            <Eye className="h-4 w-4" />
                            Preview
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Approved Tab */}
          <TabsContent value="approved">
            <div className="space-y-3">
              {approvedEvents.map((event, i) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.04 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card hover:bg-card/80 transition-all"
                >
                  {event.bannerImage ? (
                    <div className="relative h-12 w-20 rounded-lg overflow-hidden shrink-0">
                      <Image src={event.bannerImage} alt={event.title} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="h-12 w-20 rounded-lg bg-muted shrink-0" />
                  )}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm truncate">{event.title}</span>
                      {event.featured && <Star className="h-3.5 w-3.5 text-amber-400 shrink-0" fill="currentColor" />}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{event.creator.displayName ?? event.creator.name}</span>
                      <span>·</span>
                      <span className={cn("px-1.5 py-0.5 rounded border font-medium", EVENT_TYPE_COLORS[event.eventType])}>
                        {event.eventType}
                      </span>
                      <span>·</span>
                      <span>{formatEventDateTime(event.startTime)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-xs text-muted-foreground">{event.viewCount} views</span>
                    <Separator orientation="vertical" className="h-4" />
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn("h-8 w-8", event.featured && "text-amber-400")}
                      onClick={() => toggleFeatured(event.id)}
                      title={event.featured ? "Unfeature" : "Feature"}
                    >
                      <Star className="h-4 w-4" fill={event.featured ? "currentColor" : "none"} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-destructive"
                      onClick={() => archive(event.id)}
                      title="Archive"
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Link href={`/events/${event.slug}`}>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Creators Tab */}
          <TabsContent value="creators">
            <div className="space-y-3">
              {/* Unique creators extracted from approved events */}
              {Array.from(
                new Map(approvedEvents.map((e) => [e.creator.id, e.creator])).values()
              ).map((creator, i) => (
                <motion.div
                  key={creator.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.06 }}
                  className="flex items-center gap-4 p-4 rounded-xl border border-border bg-card"
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={creator.image ?? ""} />
                    <AvatarFallback>{(creator.displayName ?? creator.name ?? "U")[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm">{creator.displayName ?? creator.name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>{approvedEvents.filter((e) => e.creator.id === creator.id).length} approved events</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      size="sm"
                      className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500"
                      onClick={() => toast({ title: "Feature coming soon", description: "Creator verification will be in the next update." })}
                    >
                      <Zap className="h-3.5 w-3.5" />
                      Verify
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
