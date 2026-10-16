import { SessionList } from "@/components/session-list";
import { EVENT_CONFIG } from "@/data-access-layer/event-config";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-16">
      <p className="text-label-large text-primary">{EVENT_CONFIG.metadata.title}</p>
      <h1 className="text-display-small mt-2 text-balance">Sessions</h1>
      <p className="text-body-large text-on-surface-variant mt-3 max-w-2xl">
        {EVENT_CONFIG.metadata.description}
      </p>
      <div className="mt-8">
        <SessionList />
      </div>
    </main>
  );
}
