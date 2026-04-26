export type EventStatus = "pending" | "approved" | "rejected" | "archived";
export type EventType =
  | "AMA"
  | "Tournament"
  | "Stream"
  | "Interview"
  | "Workshop"
  | "Community Call"
  | "Education"
  | "Gaming"
  | "Other";
export type RecurrenceType = "none" | "weekly" | "daily" | "custom";
export type UserRole = "guest" | "user" | "creator" | "admin";

export interface Creator {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  twitterUrl?: string;
  discordUrl?: string;
  websiteUrl?: string;
  followersCount: number;
  eventsCount: number;
  verified: boolean;
  joinedAt: string;
}

export interface Project {
  id: string;
  name: string;
  slug: string;
  logo: string;
  description?: string;
  category: string;
  websiteUrl?: string;
  twitterUrl?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  color: string;
  icon: string;
}

export interface RecurrenceSettings {
  type: RecurrenceType;
  daysOfWeek?: number[];
  endDate?: string;
  interval?: number;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string;
  bannerImage: string;
  eventType: EventType;
  creator: Creator;
  projects: Project[];
  category: Category;
  language: string;
  timezone: string;
  startTime: string;
  endTime: string;
  recurrence: RecurrenceSettings;
  externalLink?: string;
  twitterLink?: string;
  streamLink?: string;
  abstractPortalLink?: string;
  tags: string[];
  status: EventStatus;
  featured: boolean;
  viewCount: number;
  reminderCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface EventFilters {
  search?: string;
  creator?: string;
  project?: string;
  language?: string;
  category?: string;
  eventType?: EventType;
  liveNow?: boolean;
  today?: boolean;
  thisWeek?: boolean;
  status?: EventStatus;
}

export interface Reminder {
  id: string;
  userId: string;
  eventId: string;
  timing: "1h" | "15m" | "start";
  method: "browser" | "discord" | "telegram";
  enabled: boolean;
}

export interface User {
  id: string;
  email: string;
  username: string;
  displayName: string;
  avatar?: string;
  role: UserRole;
  followedCreators: string[];
  savedEvents: string[];
  createdAt: string;
}
