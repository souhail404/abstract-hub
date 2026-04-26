import Link from "next/link";
import { Zap, Twitter, Github, MessageCircle } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                <Zap className="h-4 w-4 text-white" fill="white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold">Abstract</span>
                <span className="text-xs font-semibold text-primary">Events</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The central discovery hub for all events in the Abstract ecosystem.
            </p>
            <div className="flex gap-3 mt-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <MessageCircle className="h-4 w-4" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Discover */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Discover</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/events", label: "Upcoming Events" },
                { href: "/calendar", label: "Calendar View" },
                { href: "/events?filter=live", label: "Live Now" },
                { href: "/events?filter=today", label: "Today" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Creators */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Creators</h4>
            <ul className="space-y-2.5">
              {[
                { href: "/submit", label: "Submit Event" },
                { href: "/login", label: "Creator Login" },
                { href: "/settings/notifications", label: "Notifications" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: "#", label: "Abstract Chain" },
                { href: "#", label: "Documentation" },
                { href: "#", label: "API" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Abstract Events. Built for the Abstract ecosystem.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Powered by</span>
            <span className="text-primary font-semibold">Abstract Chain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
