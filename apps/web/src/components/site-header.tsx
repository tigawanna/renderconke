import { Button } from "@/components/m3e/button";
import { Icon } from "@/components/m3e/icon";
import { EVENT_CONFIG } from "@/data-access-layer/event-config";
import { siteConfig } from "@/lib/site";
import { Link, useRouterState } from "@tanstack/react-router";

export function SiteHeader({
  themeOpen,
  onOpenTheme,
}: {
  themeOpen: boolean;
  onOpenTheme: () => void;
}) {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const section = pathname.startsWith("/speakers")
    ? "Speakers"
    : pathname.startsWith("/sessions")
      ? "Sessions"
      : null;
  const segments = pathname.split("/").filter(Boolean);
  const parent = segments.length > 1 ? (`/${segments[0]}` as "/sessions" | "/speakers") : null;

  return (
    <header className="sticky top-0 z-10 flex items-start justify-between gap-3 bg-surface/90 px-5 py-4 backdrop-blur-md">
      <div className="flex min-w-0 items-center gap-1">
        {parent ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Back"
            nativeButton={false}
            render={<Link to={parent} />}
          >
            <Icon name="arrow_back" />
          </Button>
        ) : null}
        <div className="min-w-0">
          <Link to="/" className="text-title-large block truncate no-underline">
            {siteConfig.name}
            {section ? <span className="text-on-surface-variant"> · {section}</span> : null}
          </Link>
          <p className="text-body-medium text-on-surface-variant truncate">
            {EVENT_CONFIG.dates.displayDate} · {EVENT_CONFIG.venue.fullAddress}
          </p>
        </div>
      </div>
      <nav className="flex shrink-0 items-center gap-2">
        <a
          href={siteConfig.officialUrl}
          target="_blank"
          rel="noreferrer"
          className="text-label-large text-primary px-2 no-underline"
        >
          rendercon.org
        </a>
        <Button
          aria-expanded={themeOpen}
          aria-label="Theme"
          size="icon"
          variant="tonal"
          onClick={onOpenTheme}
        >
          <Icon name="palette" />
        </Button>
      </nav>
    </header>
  );
}
