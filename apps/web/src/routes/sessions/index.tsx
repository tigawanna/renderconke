import { SessionList } from "@/components/session-list";
import { pageHead, siteConfig } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/")({
  head: () =>
    pageHead({
      title: "Programme",
      description: `Sessions at ${siteConfig.name} ${siteConfig.year}, ${siteConfig.dates.displayDate} in ${siteConfig.venue.location}.`,
      path: "/sessions",
    }),
  component: SessionsPage,
});

function SessionsPage() {
  return (
    <main className="mx-auto flex h-full max-w-5xl flex-col px-5 py-4">
      <SessionList />
    </main>
  );
}
