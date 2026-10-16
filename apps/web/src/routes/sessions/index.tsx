import { SessionList } from "@/components/session-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/")({
  component: SessionsPage,
});

function SessionsPage() {
  return (
    <main className="mx-auto flex h-full max-w-5xl flex-col px-5 py-4">
      <SessionList />
    </main>
  );
}
