import { SiteHeader } from "@/components/site-header";
import { SiteNav } from "@/components/site-nav";
import { ThemeControls } from "@/components/theme-controls";
import { Outlet, createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/_stage")({
  component: StageLayout,
});

function StageLayout() {
  const [themeOpen, setThemeOpen] = useState(false);

  return (
    <div className="flex h-dvh overflow-hidden">
      <SiteNav />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col pb-16 md:pb-0">
        <SiteHeader themeOpen={themeOpen} onOpenTheme={() => setThemeOpen(true)} />
        <div className="min-h-0 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </div>
      <ThemeControls open={themeOpen} onOpenChange={setThemeOpen} />
    </div>
  );
}
