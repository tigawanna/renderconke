import { SessionList } from "@/components/session-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/")({
  component: SessionsPage,
});

function SessionsPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-16">
      <h1 className="text-display-small">Sessions</h1>
      <div className="mt-8">
        <SessionList />
      </div>
    </main>
  );
}
