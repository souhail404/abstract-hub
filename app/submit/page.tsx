"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  Globe,
  Image,
  Link,
  Plus,
  RefreshCw,
  Tag,
  Type,
  Upload,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { EventType } from "@/lib/types";

const EVENT_TYPES: EventType[] = [
  "AMA", "Tournament", "Stream", "Interview", "Workshop", "Community Call", "Education", "Gaming", "Other",
];

const LANGUAGES = ["English", "Spanish", "Chinese", "Korean", "Japanese", "French", "Portuguese", "German"];
const TIMEZONES = ["UTC", "America/New_York", "America/Los_Angeles", "Europe/London", "Europe/Berlin", "Asia/Tokyo", "Asia/Seoul", "Asia/Shanghai"];

export default function SubmitEventPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") router.replace("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return <div className="min-h-screen flex items-center justify-center"><div className="h-8 w-8 rounded-full border-2 border-primary border-t-transparent animate-spin" /></div>;
  }
  const [submitted, setSubmitted] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    eventType: "" as EventType | "",
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
    bannerUrl: "",
    recurrenceType: "none",
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const updateForm = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleBannerFile = (file: File) => {
    if (!file.type.startsWith("image/")) return;
    setBannerFile(file);
    const reader = new FileReader();
    reader.onload = (e) => setBannerPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags((prev) => [...prev, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags((prev) => prev.filter((t) => t !== tag));

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.eventType || !form.startDate || !form.startTime) {
      toast({
        variant: "destructive",
        title: "Missing required fields",
        description: "Please fill in the title, event type, and start date/time.",
      });
      return;
    }

    setSubmitting(true);
    try {
      // 1. Upload banner if a file was selected
      let bannerImage = form.bannerUrl || null;
      if (bannerFile) {
        const fd = new FormData();
        fd.append("file", bannerFile);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: fd });
        if (uploadRes.ok) {
          const { url } = await uploadRes.json();
          bannerImage = url;
        }
      }

      // 2. Build ISO date strings
      const startTime = new Date(`${form.startDate}T${form.startTime}`).toISOString();
      const endTime = form.endDate && form.endTime
        ? new Date(`${form.endDate}T${form.endTime}`).toISOString()
        : new Date(new Date(`${form.startDate}T${form.startTime}`).getTime() + 3600000).toISOString();

      // 3. Submit event
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          bannerImage,
          eventType: form.eventType,
          language: form.language,
          timezone: form.timezone,
          startTime,
          endTime,
          twitterLink: form.twitterLink || null,
          streamLink: form.streamLink || null,
          externalLink: form.externalLink || null,
          abstractPortalLink: form.abstractPortalLink || null,
          tags,
          recurrenceType: isRecurring ? form.recurrenceType : "none",
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Submission failed");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      toast({
        variant: "destructive",
        title: "Submission failed",
        description: err instanceof Error ? err.message : "Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="max-w-md w-full text-center p-10 rounded-3xl border border-border bg-card"
        >
          <div className="h-20 w-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Event Submitted!</h2>
          <p className="text-muted-foreground mb-2">
            <strong className="text-foreground">{form.title}</strong> has been submitted for review.
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            Our team will review your event and approve it within 24 hours. You'll be notified once it goes live.
          </p>
          <div className="flex flex-col gap-3">
            <Button variant="gradient" onClick={() => router.push("/events")} className="gap-2">
              <Zap className="h-4 w-4" />
              Browse Events
            </Button>
            <Button variant="outline" onClick={() => { setSubmitted(false); setForm({ title: "", description: "", eventType: "", language: "English", timezone: "UTC", startDate: "", startTime: "", endDate: "", endTime: "", twitterLink: "", streamLink: "", externalLink: "", abstractPortalLink: "", bannerUrl: "", recurrenceType: "none" }); setTags([]); }}>
              Submit Another Event
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2.5 mb-2">
              <Zap className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Submit an Event</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Share your event with the Abstract ecosystem. Events are reviewed and approved by our team.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          onSubmit={handleSubmit}
          className="space-y-8"
        >
          {/* Basic Info */}
          <section className="space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Type className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Basic Information</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Event Title <span className="text-destructive">*</span></Label>
              <Input
                id="title"
                placeholder="e.g. Abstract Community AMA — Q2 2026"
                value={form.title}
                onChange={(e) => updateForm("title", e.target.value)}
                className="h-12 text-base"
                maxLength={120}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
              <Textarea
                id="description"
                placeholder="Describe your event — what it's about, who should attend, what to expect…"
                value={form.description}
                onChange={(e) => updateForm("description", e.target.value)}
                rows={5}
                maxLength={2000}
              />
              <p className="text-xs text-muted-foreground text-right">{form.description.length}/2000</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Event Type <span className="text-destructive">*</span></Label>
                <Select value={form.eventType} onValueChange={(v) => updateForm("eventType", v)}>
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {EVENT_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Language</Label>
                <Select value={form.language} onValueChange={(v) => updateForm("language", v)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l} value={l}>{l}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </section>

          <Separator />

          {/* Date & Time */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Date & Time</h2>
            </div>

            <div className="space-y-2">
              <Label>Timezone</Label>
              <Select value={form.timezone} onValueChange={(v) => updateForm("timezone", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>{tz}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date <span className="text-destructive">*</span></Label>
                <Input
                  id="startDate"
                  type="date"
                  value={form.startDate}
                  onChange={(e) => updateForm("startDate", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="startTime">Start Time <span className="text-destructive">*</span></Label>
                <Input
                  id="startTime"
                  type="time"
                  value={form.startTime}
                  onChange={(e) => updateForm("startTime", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={form.endDate}
                  onChange={(e) => updateForm("endDate", e.target.value)}
                  className="h-11"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endTime">End Time</Label>
                <Input
                  id="endTime"
                  type="time"
                  value={form.endTime}
                  onChange={(e) => updateForm("endTime", e.target.value)}
                  className="h-11"
                />
              </div>
            </div>

            {/* Recurring */}
            <div className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/50">
              <div className="flex items-center gap-3">
                <RefreshCw className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Recurring Event</p>
                  <p className="text-xs text-muted-foreground">Set this event to repeat automatically</p>
                </div>
              </div>
              <Switch checked={isRecurring} onCheckedChange={setIsRecurring} />
            </div>

            {isRecurring && (
              <div className="space-y-2">
                <Label>Recurrence Pattern</Label>
                <Select value={form.recurrenceType} onValueChange={(v) => updateForm("recurrenceType", v)}>
                  <SelectTrigger className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="daily">Daily</SelectItem>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="custom">Custom (select days)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </section>

          <Separator />

          {/* Links */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <Link className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Event Links</h2>
            </div>

            <div className="space-y-4">
              {[
                { field: "streamLink", label: "Stream Link (Twitch/YouTube)", placeholder: "https://twitch.tv/yourchannel" },
                { field: "twitterLink", label: "Twitter / X Link", placeholder: "https://twitter.com/..." },
                { field: "externalLink", label: "External Event Link", placeholder: "https://..." },
                { field: "abstractPortalLink", label: "Abstract Portal Link", placeholder: "https://abs.xyz/..." },
              ].map(({ field, label, placeholder }) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={field}>{label}</Label>
                  <Input
                    id={field}
                    type="url"
                    placeholder={placeholder}
                    value={form[field as keyof typeof form]}
                    onChange={(e) => updateForm(field, e.target.value)}
                    className="h-11"
                  />
                </div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Media */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <Image className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Banner Image</h2>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bannerUrl">Banner Image URL</Label>
              <Input
                id="bannerUrl"
                type="url"
                placeholder="https://... (1200×630px recommended)"
                value={form.bannerUrl}
                onChange={(e) => updateForm("bannerUrl", e.target.value)}
                className="h-11"
              />
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleBannerFile(file);
              }}
            />
            <div
              className={`border-2 border-dashed rounded-xl transition-all cursor-pointer overflow-hidden ${
                dragOver
                  ? "border-primary bg-primary/5"
                  : "border-border/60 hover:border-primary/40"
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                const file = e.dataTransfer.files?.[0];
                if (file) handleBannerFile(file);
              }}
            >
              {bannerPreview ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bannerPreview}
                    alt="Banner preview"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Upload className="h-5 w-5 text-white" />
                    <span className="text-white text-sm font-medium">Replace image</span>
                  </div>
                  <div className="px-4 py-2 flex items-center gap-2 bg-card/80 border-t border-border">
                    <span className="text-xs text-muted-foreground truncate flex-1">{bannerFile?.name}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setBannerFile(null);
                        setBannerPreview("");
                        if (fileInputRef.current) fileInputRef.current.value = "";
                      }}
                      className="text-xs text-destructive hover:underline shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ) : (
                <div className="p-8 text-center">
                  <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">
                    Drag & drop or{" "}
                    <span className="text-primary font-medium">browse</span>{" "}
                    to upload a banner
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              )}
            </div>
          </section>

          <Separator />

          {/* Tags */}
          <section className="space-y-5">
            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 text-primary" />
              <h2 className="font-semibold">Tags</h2>
            </div>

            <div className="flex gap-2">
              <Input
                placeholder="Add a tag (e.g. DeFi, gaming, AMA)…"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addTag(); } }}
                className="h-11 flex-1"
              />
              <Button type="button" variant="outline" onClick={addTag} className="h-11 gap-1.5">
                <Plus className="h-4 w-4" />
                Add
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="flex items-center gap-1.5 text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-3 py-1 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20 transition-colors"
                  >
                    #{tag} ×
                  </button>
                ))}
              </div>
            )}
          </section>

          <Separator />

          {/* Guidelines */}
          <div className="p-4 rounded-xl bg-primary/5 border border-primary/15 text-sm">
            <p className="font-medium text-primary mb-2">Submission Guidelines</p>
            <ul className="text-muted-foreground space-y-1 text-xs">
              <li>• Events must be related to the Abstract ecosystem</li>
              <li>• All submissions are reviewed within 24 hours</li>
              <li>• Provide accurate date/time and timezone information</li>
              <li>• Include at least one event link (stream, Twitter, or external)</li>
            </ul>
          </div>

          {/* Submit */}
          <Button type="submit" variant="gradient" size="xl" className="w-full gap-2 shadow-lg shadow-emerald-500/20" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for Review"}
            {!submitting && <ChevronRight className="h-5 w-5" />}
          </Button>
        </motion.form>
      </div>
    </div>
  );
}
