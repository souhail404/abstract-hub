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
  Lock,
  Plus,
  RefreshCw,
  Shield,
  Sparkles,
  Star,
  Upload,
  Users,
  XCircle,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatEventDateTime, EVENT_TYPE_COLORS, cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

// ── PIN Gate ──────────────────────────────────────────────────────────────────
const ADMIN_PIN = "2612"; // change this to your secret PIN
const SESSION_KEY = "abstract_admin_auth";

// Shared secret sent with every admin API request so the server can
// authorise the call even if the session doesn't have role="admin" yet.
const ADMIN_HEADERS = {
  "Content-Type": "application/json",
  "x-admin-secret": ADMIN_PIN,
};

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

// ── Banner Uploader ───────────────────────────────────────────────────────────
function BannerUploader({
  value,
  onChange,
}: {
  value: string;
  onChange: (url: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [preview, setPreview] = useState<string>("");

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (e) => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);

    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/upload", {
        method: "POST",
        headers: { "x-admin-secret": ADMIN_PIN },
        body: fd,
      });
      if (!res.ok) throw new Error("Upload failed");
      const { url } = await res.json();
      onChange(url);
    } catch {
      setPreview("");
      onChange("");
      alert("Upload failed — check Supabase storage is set up.");
    } finally {
      setUploading(false);
    }
  };

  const clear = (e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview("");
    onChange("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const displaySrc = preview || value;

  return (
    <div className="space-y-2">
      {/* Drop zone */}
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) handleFile(f);
        }}
        className={`relative cursor-pointer rounded-xl border-2 border-dashed transition-all overflow-hidden ${
          dragOver
            ? "border-primary bg-primary/10"
            : displaySrc
              ? "border-primary/30"
              : "border-border/60 hover:border-primary/40 hover:bg-primary/5"
        }`}
      >
        {displaySrc ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={displaySrc} alt="Banner preview" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <Upload className="h-5 w-5 text-white" />
              <span className="text-white text-sm font-medium">Replace</span>
            </div>
            {uploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <RefreshCw className="h-6 w-6 text-primary animate-spin" />
                <span className="text-white text-sm ml-2">Uploading…</span>
              </div>
            )}
            <button
              type="button"
              onClick={clear}
              className="absolute top-2 right-2 bg-black/70 hover:bg-destructive text-white rounded-full h-7 w-7 flex items-center justify-center text-xs transition-colors"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="py-10 flex flex-col items-center gap-2 text-muted-foreground">
            {uploading ? (
              <>
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <span className="text-sm">Uploading…</span>
              </>
            ) : (
              <>
                <Upload className="h-8 w-8" />
                <span className="text-sm">
                  Drag & drop or <span className="text-primary font-medium">browse</span>
                </span>
                <span className="text-xs">PNG, JPG, WebP, GIF · max 10 MB</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFile(f); }}
      />

      {/* Fallback URL input */}
      <Input
        type="url"
        placeholder="…or paste an image URL"
        value={preview ? "" : value}
        onChange={(e) => { setPreview(""); onChange(e.target.value); }}
        className="h-9 text-xs"
      />
    </div>
  );
}

const EVENT_TYPES_LIST = [
  "AMA", "Tournament", "Stream", "Interview", "Workshop",
  "Community Call", "Education", "Gaming", "Other",
];
const LANGUAGES_LIST = ["English", "Spanish", "Chinese", "Korean", "Japanese", "French", "Portuguese", "German"];
const TIMEZONES_LIST = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Seoul", "Asia/Shanghai"];

const BLANK_FORM = {
  title: "",
  description: "",
  eventType: "",
  language: "English",
  timezone: "UTC",
  startDate: "",
  startTime: "",
  endDate: "",
  endTime: "",
  twitterLink: "",
  streamLink: "",
  externalLink: "",
  abstractPortalLink: "",
  bannerImage: "",
};

export default function AdminDashboard() {
  const { toast } = useToast();
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [pendingEvents, setPendingEvents] = useState<DbEvent[]>([]);
  const [approvedEvents, setApprovedEvents] = useState<DbEvent[]>([]);
  const [loadingData, setLoadingData] = useState(false);

  // ── Create event state ────────────────────────────────────────────────────
  const [newForm, setNewForm] = useState(BLANK_FORM);
  const [newTags, setNewTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [creating, setCreating] = useState(false);

  const updateNew = (field: string, value: string) =>
    setNewForm((prev) => ({ ...prev, [field]: value }));

  const addTag = () => {
    if (tagInput.trim() && !newTags.includes(tagInput.trim()) && newTags.length < 10) {
      setNewTags((p) => [...p, tagInput.trim()]);
      setTagInput("");
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newForm.title || !newForm.eventType || !newForm.startDate || !newForm.startTime) {
      toast({ variant: "destructive", title: "Missing fields", description: "Title, type, start date and time are required." });
      return;
    }
    setCreating(true);
    try {
      const startISO = new Date(`${newForm.startDate}T${newForm.startTime}`).toISOString();
      const endISO = newForm.endDate && newForm.endTime
        ? new Date(`${newForm.endDate}T${newForm.endTime}`).toISOString()
        : new Date(new Date(`${newForm.startDate}T${newForm.startTime}`).getTime() + 3600000).toISOString();

      const res = await fetch("/api/events", {
        method: "POST",
        headers: ADMIN_HEADERS,
        body: JSON.stringify({
          title: newForm.title,
          description: newForm.description,
          eventType: newForm.eventType,
          language: newForm.language,
          timezone: newForm.timezone,
          startTime: startISO,
          endTime: endISO,
          twitterLink: newForm.twitterLink || null,
          streamLink: newForm.streamLink || null,
          externalLink: newForm.externalLink || null,
          abstractPortalLink: newForm.abstractPortalLink || null,
          bannerImage: newForm.bannerImage || null,
          tags: newTags,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Failed to create");
      }

      const created = await res.json();
      toast({ title: "Event published!", description: `"${created.title}" is now live.` });
      setNewForm(BLANK_FORM);
      setNewTags([]);
      setTagInput("");
      // Refresh approved list
      fetch("/api/events?status=approved", { headers: ADMIN_HEADERS })
        .then((r) => r.json())
        .then((data) => setApprovedEvents(Array.isArray(data) ? data : []));
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Error",
        description: err instanceof Error ? err.message : "Could not create event.",
      });
    } finally {
      setCreating(false);
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY) === "1") setAuthed(true);
    setChecking(false);
  }, []);

  // Fetch real events once authenticated
  useEffect(() => {
    if (!authed) return;
    setLoadingData(true);
    Promise.all([
      fetch("/api/events?status=pending", { headers: ADMIN_HEADERS }).then((r) => r.json()),
      fetch("/api/events?status=approved", { headers: ADMIN_HEADERS }).then((r) => r.json()),
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
      headers: ADMIN_HEADERS,
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
      headers: ADMIN_HEADERS,
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
      headers: ADMIN_HEADERS,
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
      headers: ADMIN_HEADERS,
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

        <Tabs defaultValue="create" className="space-y-6">
          <TabsList className="bg-card border border-border">
            <TabsTrigger value="create" className="gap-2">
              <Plus className="h-4 w-4" />
              New Event
            </TabsTrigger>
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
              Live ({approvedEvents.length})
            </TabsTrigger>
            <TabsTrigger value="creators" className="gap-2">
              <Users className="h-4 w-4" />
              Creators
            </TabsTrigger>
          </TabsList>

          {/* ── New Event Tab ─────────────────────────────────────────────── */}
          <TabsContent value="create">
            <div className="rounded-2xl border border-border bg-card p-6">
              <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
                Create New Event
              </h3>
              <form onSubmit={handleCreate} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="ce-title">Title *</Label>
                    <Input
                      id="ce-title"
                      placeholder="Event title"
                      value={newForm.title}
                      onChange={(e) => updateNew("title", e.target.value)}
                      className="h-11"
                      maxLength={120}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Event Type *</Label>
                    <Select value={newForm.eventType} onValueChange={(v) => updateNew("eventType", v)}>
                      <SelectTrigger className="h-11"><SelectValue placeholder="Select type…" /></SelectTrigger>
                      <SelectContent>
                        {EVENT_TYPES_LIST.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Language</Label>
                    <Select value={newForm.language} onValueChange={(v) => updateNew("language", v)}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {LANGUAGES_LIST.map((l) => <SelectItem key={l} value={l}>{l}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <Label htmlFor="ce-desc">Description</Label>
                    <Textarea
                      id="ce-desc"
                      placeholder="Event description…"
                      value={newForm.description}
                      onChange={(e) => updateNew("description", e.target.value)}
                      rows={3}
                      maxLength={2000}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Timezone</Label>
                    <Select value={newForm.timezone} onValueChange={(v) => updateNew("timezone", v)}>
                      <SelectTrigger className="h-11"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        {TIMEZONES_LIST.map((tz) => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <Label>Banner Image</Label>
                    <BannerUploader
                      value={newForm.bannerImage}
                      onChange={(url) => updateNew("bannerImage", url)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ce-sdate">Start Date *</Label>
                    <Input
                      id="ce-sdate"
                      type="date"
                      value={newForm.startDate}
                      onChange={(e) => updateNew("startDate", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ce-stime">Start Time *</Label>
                    <Input
                      id="ce-stime"
                      type="time"
                      value={newForm.startTime}
                      onChange={(e) => updateNew("startTime", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ce-edate">End Date</Label>
                    <Input
                      id="ce-edate"
                      type="date"
                      value={newForm.endDate}
                      onChange={(e) => updateNew("endDate", e.target.value)}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ce-etime">End Time</Label>
                    <Input
                      id="ce-etime"
                      type="time"
                      value={newForm.endTime}
                      onChange={(e) => updateNew("endTime", e.target.value)}
                      className="h-11"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="ce-stream">Stream Link</Label>
                    <Input id="ce-stream" type="url" placeholder="https://twitch.tv/…" value={newForm.streamLink} onChange={(e) => updateNew("streamLink", e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ce-twitter">Twitter / X Link</Label>
                    <Input id="ce-twitter" type="url" placeholder="https://twitter.com/…" value={newForm.twitterLink} onChange={(e) => updateNew("twitterLink", e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ce-ext">External Link</Label>
                    <Input id="ce-ext" type="url" placeholder="https://…" value={newForm.externalLink} onChange={(e) => updateNew("externalLink", e.target.value)} className="h-11" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ce-abs">Abstract Portal Link</Label>
                    <Input id="ce-abs" type="url" placeholder="https://abs.xyz/…" value={newForm.abstractPortalLink} onChange={(e) => updateNew("abstractPortalLink", e.target.value)} className="h-11" />
                  </div>

                  <div className="sm:col-span-2 space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag…"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                        className="h-10"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={addTag} className="h-10 px-4">Add</Button>
                    </div>
                    {newTags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {newTags.map((tag) => (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => setNewTags((p) => p.filter((t) => t !== tag))}
                            className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                          >
                            #{tag} ×
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-2">
                  <Button
                    type="submit"
                    variant="gradient"
                    className="w-full sm:w-auto gap-2"
                    disabled={creating}
                  >
                    {creating ? (
                      <RefreshCw className="h-4 w-4 animate-spin" />
                    ) : (
                      <Zap className="h-4 w-4" />
                    )}
                    {creating ? "Publishing…" : "Publish Event"}
                  </Button>
                </div>
              </form>
            </div>
          </TabsContent>

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
