"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Bell,
  BellRing,
  CheckCircle2,
  Chrome,
  MessageCircle,
  Send,
  Settings,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";

interface NotifChannel {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  connected: boolean;
  placeholder?: string;
}

interface NotifTiming {
  id: string;
  label: string;
  description: string;
}

const channels: NotifChannel[] = [
  {
    id: "browser",
    label: "Browser Notifications",
    description: "Get notified directly in your browser",
    icon: Chrome,
    connected: false,
  },
  {
    id: "discord",
    label: "Discord Reminders",
    description: "Receive reminders via Discord DMs",
    icon: MessageCircle,
    connected: false,
    placeholder: "Discord webhook or user ID",
  },
  {
    id: "telegram",
    label: "Telegram Reminders",
    description: "Receive reminders via Telegram bot",
    icon: Send,
    connected: false,
    placeholder: "Your Telegram username or chat ID",
  },
];

const timings: NotifTiming[] = [
  { id: "1h", label: "1 hour before", description: "Get a heads-up an hour ahead" },
  { id: "15m", label: "15 minutes before", description: "Quick reminder before it starts" },
  { id: "start", label: "At event start", description: "Notified the moment it begins" },
];

export default function NotificationsSettingsPage() {
  const { toast } = useToast();
  const [channelStates, setChannelStates] = useState<Record<string, boolean>>({
    browser: false,
    discord: false,
    telegram: false,
  });
  const [timingStates, setTimingStates] = useState<Record<string, boolean>>({
    "1h": true,
    "15m": true,
    start: false,
  });
  const [channelValues, setChannelValues] = useState<Record<string, string>>({
    discord: "",
    telegram: "",
  });
  const [globalEnabled, setGlobalEnabled] = useState(true);

  const toggleChannel = (id: string) => {
    if (id === "browser") {
      if (!channelStates.browser) {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            setChannelStates((prev) => ({ ...prev, browser: true }));
            toast({ title: "Browser notifications enabled!", description: "You'll receive event reminders in your browser." });
          } else {
            toast({ variant: "destructive", title: "Permission denied", description: "Please allow notifications in your browser settings." });
          }
        }).catch(() => {
          setChannelStates((prev) => ({ ...prev, browser: true }));
          toast({ title: "Browser notifications enabled!" });
        });
      } else {
        setChannelStates((prev) => ({ ...prev, browser: false }));
      }
      return;
    }
    setChannelStates((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const saveSettings = () => {
    toast({ title: "Settings saved!", description: "Your notification preferences have been updated." });
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="border-b border-border/50 bg-card/30 px-4 py-8">
        <div className="container mx-auto max-w-3xl">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <div className="flex items-center gap-2.5 mb-2">
              <Bell className="h-6 w-6 text-primary" />
              <h1 className="text-2xl font-bold">Notification Settings</h1>
            </div>
            <p className="text-muted-foreground text-sm">
              Configure how and when you get notified about Abstract events
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto max-w-3xl px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          {/* Global Toggle */}
          <div className="flex items-center justify-between p-5 rounded-2xl border border-border bg-card">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <BellRing className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-semibold">All Notifications</p>
                <p className="text-sm text-muted-foreground">Master switch for all event reminders</p>
              </div>
            </div>
            <Switch checked={globalEnabled} onCheckedChange={setGlobalEnabled} />
          </div>

          {/* Channels */}
          <section>
            <h2 className="font-semibold mb-1 text-lg">Notification Channels</h2>
            <p className="text-sm text-muted-foreground mb-4">Choose where to receive your reminders</p>

            <div className="space-y-3">
              {channels.map((channel, i) => (
                <motion.div
                  key={channel.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className={`rounded-2xl border bg-card transition-all duration-300 ${
                    channelStates[channel.id] && globalEnabled
                      ? "border-primary/30 shadow-sm shadow-primary/5"
                      : "border-border"
                  }`}
                >
                  <div className="flex items-center justify-between p-5">
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-colors ${
                        channelStates[channel.id] ? "bg-primary/15" : "bg-secondary/80"
                      }`}>
                        <channel.icon className={`h-5 w-5 ${channelStates[channel.id] ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{channel.label}</p>
                          {channelStates[channel.id] && (
                            <Badge variant="success" className="text-xs px-1.5 py-0 gap-1">
                              <CheckCircle2 className="h-3 w-3" /> Active
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{channel.description}</p>
                      </div>
                    </div>
                    <Switch
                      checked={channelStates[channel.id]}
                      onCheckedChange={() => toggleChannel(channel.id)}
                      disabled={!globalEnabled}
                    />
                  </div>

                  {channelStates[channel.id] && channel.placeholder && (
                    <div className="px-5 pb-5">
                      <Separator className="mb-4" />
                      <Label className="text-xs text-muted-foreground mb-2 block">
                        {channel.id === "discord" ? "Discord Webhook URL or User ID" : "Telegram Chat ID or Username"}
                      </Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder={channel.placeholder}
                          value={channelValues[channel.id]}
                          onChange={(e) => setChannelValues((prev) => ({ ...prev, [channel.id]: e.target.value }))}
                          className="h-9 text-sm flex-1"
                        />
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs"
                          onClick={() => toast({ title: "Test notification sent!" })}
                        >
                          Test
                        </Button>
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Timing */}
          <section>
            <h2 className="font-semibold mb-1 text-lg">Reminder Timing</h2>
            <p className="text-sm text-muted-foreground mb-4">When should we send you reminders?</p>

            <div className="space-y-3">
              {timings.map((timing, i) => (
                <motion.div
                  key={timing.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.08 }}
                  className={`flex items-center justify-between p-4 rounded-xl border bg-card transition-all ${
                    timingStates[timing.id] && globalEnabled ? "border-primary/20" : "border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-2 w-2 rounded-full ${timingStates[timing.id] ? "bg-primary" : "bg-border"}`} />
                    <div>
                      <p className="font-medium text-sm">{timing.label}</p>
                      <p className="text-xs text-muted-foreground">{timing.description}</p>
                    </div>
                  </div>
                  <Switch
                    checked={timingStates[timing.id]}
                    onCheckedChange={() =>
                      setTimingStates((prev) => ({ ...prev, [timing.id]: !prev[timing.id] }))
                    }
                    disabled={!globalEnabled}
                  />
                </motion.div>
              ))}
            </div>
          </section>

          <Separator />

          {/* Save */}
          <Button variant="gradient" size="lg" className="w-full gap-2" onClick={saveSettings}>
            <Zap className="h-4 w-4" />
            Save Notification Settings
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
