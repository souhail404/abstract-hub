"use client";

// No auth session needed — site is browse-only for visitors.
export function Providers({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
