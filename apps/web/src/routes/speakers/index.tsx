import { SpeakerList } from "@/components/speaker-list";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers/")({
  component: SpeakersPage,
});

function SpeakersPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-16">
      <h1 className="text-display-small">Speakers</h1>
      <div className="mt-8">
        <SpeakerList />
      </div>
    </main>
  );
}
