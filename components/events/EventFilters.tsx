"use client";

import { useState } from "react";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EventFilters, EventType } from "@/lib/types";
import { cn } from "@/lib/utils";

const EVENT_TYPES: EventType[] = [
  "AMA", "Tournament", "Stream", "Interview", "Workshop", "Community Call", "Education", "Gaming",
];

const QUICK_FILTERS = [
  { key: "liveNow", label: "🔴 Live Now" },
  { key: "today", label: "📅 Today" },
  { key: "thisWeek", label: "📆 This Week" },
];

interface EventFiltersProps {
  filters: EventFilters;
  onChange: (filters: EventFilters) => void;
  totalCount?: number;
}

export function EventFiltersBar({ filters, onChange, totalCount }: EventFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const activeFilterCount = [
    filters.liveNow,
    filters.today,
    filters.thisWeek,
    filters.eventType,
    filters.language,
    filters.category,
  ].filter(Boolean).length;

  const clearAll = () => {
    onChange({ search: filters.search });
  };

  return (
    <div className="space-y-3">
      {/* Search + Toggle */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search events, creators, projects…"
            value={filters.search || ""}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            className="pl-10 h-11"
          />
          {filters.search && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => onChange({ ...filters, search: "" })}
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button
          variant={showAdvanced ? "glow" : "outline"}
          className="h-11 gap-2 shrink-0"
          onClick={() => setShowAdvanced(!showAdvanced)}
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className="bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-2 flex-wrap">
        {QUICK_FILTERS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => onChange({ ...filters, [key]: !filters[key as keyof EventFilters] })}
            className={cn(
              "px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
              filters[key as keyof EventFilters]
                ? "bg-primary/15 text-primary border-primary/30"
                : "bg-secondary/50 text-muted-foreground border-border hover:border-primary/30 hover:text-foreground"
            )}
          >
            {label}
          </button>
        ))}

        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium text-muted-foreground hover:text-foreground transition-colors ml-1"
          >
            <X className="h-3 w-3" />
            Clear
          </button>
        )}

        {totalCount !== undefined && (
          <span className="ml-auto text-xs text-muted-foreground">
            {totalCount} events
          </span>
        )}
      </div>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl border border-border bg-card/50">
          <Select
            value={filters.eventType || "_all"}
            onValueChange={(v) => onChange({ ...filters, eventType: (v === "_all" ? undefined : v) as EventType | undefined })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Event Type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Types</SelectItem>
              {EVENT_TYPES.map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={filters.language || "_all"}
            onValueChange={(v) => onChange({ ...filters, language: v === "_all" ? undefined : v })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Languages</SelectItem>
              <SelectItem value="English">English</SelectItem>
              <SelectItem value="Spanish">Spanish</SelectItem>
              <SelectItem value="Chinese">Chinese</SelectItem>
              <SelectItem value="Korean">Korean</SelectItem>
              <SelectItem value="Japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.category || "_all"}
            onValueChange={(v) => onChange({ ...filters, category: v === "_all" ? undefined : v })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Categories</SelectItem>
              <SelectItem value="gaming">Gaming</SelectItem>
              <SelectItem value="defi">DeFi</SelectItem>
              <SelectItem value="nft">NFT</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="community">Community</SelectItem>
              <SelectItem value="development">Development</SelectItem>
            </SelectContent>
          </Select>

          <Select
            value={filters.creator || "_all"}
            onValueChange={(v) => onChange({ ...filters, creator: v === "_all" ? undefined : v })}
          >
            <SelectTrigger className="h-9 text-xs">
              <SelectValue placeholder="Creator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="_all">All Creators</SelectItem>
              <SelectItem value="abstractlabs">Abstract Labs</SelectItem>
              <SelectItem value="cryptosage">CryptoSage</SelectItem>
              <SelectItem value="0xgamer">0xGamer</SelectItem>
              <SelectItem value="nftwhisperer">NFT Whisperer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
