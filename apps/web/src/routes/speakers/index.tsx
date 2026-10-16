import { SpeakerList } from "@/components/speaker-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers/")({
  component: SpeakersPage,
});

function SpeakersPage() {
  return (
    <main className="mx-auto flex h-full max-w-5xl flex-col px-5 py-4">
      <SpeakerList />
    </main>
  );
}
