"use client";

import { useState, useEffect } from "react";
import { differenceInSeconds } from "date-fns";
import { cn } from "@/lib/utils";

interface CountdownTimerProps {
  startTime: string;
  endTime: string;
  className?: string;
  compact?: boolean;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

function getTimeLeft(startTime: string): TimeLeft {
  const total = differenceInSeconds(new Date(startTime), new Date());
  if (total <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0, total };

  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;

  return { days, hours, minutes, seconds, total };
}

export function CountdownTimer({ startTime, endTime, className, compact = false }: CountdownTimerProps) {
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 });
  const [isLive, setIsLive] = useState(false);
  const [isEnded, setIsEnded] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getTimeLeft(startTime));
  }, [startTime]);

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const start = new Date(startTime);
      const end = new Date(endTime);

      if (now >= start && now <= end) {
        setIsLive(true);
        setIsEnded(false);
      } else if (now > end) {
        setIsEnded(true);
        setIsLive(false);
      } else {
        setIsLive(false);
        setIsEnded(false);
        setTimeLeft(getTimeLeft(startTime));
      }
    };

    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [startTime, endTime]);

  if (!mounted) {
    return <span className={cn("text-muted-foreground text-xs", className)}>Loading…</span>;
  }

  if (isEnded) {
    return (
      <span className={cn("text-muted-foreground text-xs", className)}>Ended</span>
    );
  }

  if (isLive) {
    return (
      <span className={cn("flex items-center gap-1.5 text-red-400 text-xs font-semibold", className)}>
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
        </span>
        LIVE NOW
      </span>
    );
  }

  if (compact) {
    if (timeLeft.days > 0) return <span className={cn("text-muted-foreground text-xs", className)}>in {timeLeft.days}d {timeLeft.hours}h</span>;
    if (timeLeft.hours > 0) return <span className={cn("text-amber-400 text-xs font-medium", className)}>in {timeLeft.hours}h {timeLeft.minutes}m</span>;
    return <span className={cn("text-emerald-400 text-xs font-semibold", className)}>in {timeLeft.minutes}m {timeLeft.seconds}s</span>;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {timeLeft.days > 0 && (
        <TimeUnit value={timeLeft.days} label="d" />
      )}
      <TimeUnit value={timeLeft.hours} label="h" />
      <TimeUnit value={timeLeft.minutes} label="m" />
      <TimeUnit value={timeLeft.seconds} label="s" />
    </div>
  );
}

function TimeUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex items-center gap-0.5">
      <span className="font-mono text-sm font-bold text-foreground tabular-nums">
        {String(value).padStart(2, "0")}
      </span>
      <span className="text-xs text-muted-foreground">{label}</span>
    </div>
  );
}
