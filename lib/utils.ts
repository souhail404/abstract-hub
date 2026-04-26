import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow, isPast, isFuture, isToday, differenceInSeconds } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEventDate(dateString: string, timezone?: string): string {
  const date = new Date(dateString);
  return format(date, "MMM d, yyyy");
}

export function formatEventTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "h:mm a");
}

export function formatEventDateTime(dateString: string): string {
  const date = new Date(dateString);
  return format(date, "EEE, MMM d · h:mm a");
}

export function getCountdown(startTime: string): string {
  const start = new Date(startTime);
  const now = new Date();

  if (isPast(start)) return "Started";

  const diff = differenceInSeconds(start, now);

  if (diff < 60) return `Starts in ${diff}s`;
  if (diff < 3600) return `Starts in ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `Starts in ${Math.floor(diff / 3600)}h ${Math.floor((diff % 3600) / 60)}m`;

  return formatDistanceToNow(start, { addSuffix: true });
}

export function isEventLive(startTime: string, endTime: string): boolean {
  const now = new Date();
  return new Date(startTime) <= now && new Date(endTime) >= now;
}

export function isEventUpcoming(startTime: string): boolean {
  return isFuture(new Date(startTime));
}

export function isEventToday(startTime: string): boolean {
  return isToday(new Date(startTime));
}

export function isEventThisWeek(startTime: string): boolean {
  const start = new Date(startTime);
  const now = new Date();
  const weekEnd = new Date(now);
  weekEnd.setDate(now.getDate() + 7);
  return start >= now && start <= weekEnd;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.slice(0, length) + "…";
}

export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}

export function formatInUserTimezone(dateString: string): string {
  const date = new Date(dateString);
  const userTz = getUserTimezone();

  return new Intl.DateTimeFormat("en-US", {
    timeZone: userTz,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

export const EVENT_TYPE_COLORS: Record<string, string> = {
  AMA: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Tournament: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  Stream: "bg-red-500/20 text-red-300 border-red-500/30",
  Interview: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Workshop: "bg-green-500/20 text-green-300 border-green-500/30",
  "Community Call": "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Education: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Gaming: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Other: "bg-slate-500/20 text-slate-300 border-slate-500/30",
};

export function addToGoogleCalendar(event: {
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
}): string {
  const format = (d: string) =>
    new Date(d).toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    dates: `${format(event.startTime)}/${format(event.endTime)}`,
    ...(event.location && { location: event.location }),
  });

  return `https://calendar.google.com/calendar/render?${params}`;
}
