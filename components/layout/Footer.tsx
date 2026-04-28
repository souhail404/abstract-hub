import Link from "next/link";
import { Twitter, MessageCircle, Globe } from "lucide-react";

function AbstractLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" fill="none" className={className}>
      <path
        d="M20 4L14 16H4L12 24L9 36L20 29L31 36L28 24L36 16H26L20 4Z"
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/30 mt-16">
      <div className="container mx-auto max-w-7xl px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <AbstractLogo className="h-7 w-7" />
              <div className="flex flex-col leading-none">
                <span className="text-sm font-bold">Abstract</span>
                <span className="text-xs font-semibold text-primary">Hub</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The central discovery hub for all events in the Abstract ecosystem.
            </p>
            <div className="flex gap-3 mt-4">
              <a
                href="https://twitter.com/AbstractChain"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-4 w-4" />
              </a>
              <a
                href="https://discord.gg/abstract"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
              </a>
              <a
                href="https://abs.xyz"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Globe className="h-4 w-4" />
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

          {/* Platform */}
          <div>
            <h4 className="text-sm font-semibold mb-4">Platform</h4>
            <ul className="space-y-2.5">
              {[
                { href: "https://abs.xyz", label: "Abstract Chain" },
                { href: "https://portal.abs.xyz/stream", label: "Abstract Portal" },
                { href: "https://docs.abs.xyz", label: "Documentation" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-border/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Abstract Hub. Built for the Abstract ecosystem.
          </p>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Powered by</span>
            <span className="text-primary font-semibold ml-1">Abstract Chain</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
