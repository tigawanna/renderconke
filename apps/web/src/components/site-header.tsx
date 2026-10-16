import { Button } from "@/components/m3e/button";
import { Icon } from "@/components/m3e/icon";
import { EVENT_CONFIG } from "@/data-access-layer/event-config";
import { Link } from "@tanstack/react-router";

export function SiteHeader({
  themeOpen,
  onOpenTheme,
}: {
  themeOpen: boolean;
  onOpenTheme: () => void;
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-4 bg-surface/90 px-5 py-4 backdrop-blur-md">
      <div>
        <Link to="/" className="text-title-large no-underline">
          RenderCon {EVENT_CONFIG.year}
        </Link>
        <p className="text-body-medium text-on-surface-variant">
          {EVENT_CONFIG.dates.displayDate} · {EVENT_CONFIG.venue.fullAddress}
        </p>
      </div>
      <nav className="flex items-center gap-4">
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
