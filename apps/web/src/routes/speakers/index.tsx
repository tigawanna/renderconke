import { SpeakerList } from "@/components/speaker-list";
import { pageHead, siteConfig } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers/")({
  head: () =>
    pageHead({
      title: "Speakers",
      description: `Speakers at ${siteConfig.name} ${siteConfig.year} in ${siteConfig.venue.location}.`,
      path: "/speakers",
    }),
  component: SpeakersPage,
});

function SpeakersPage() {
  return (
    <main className="mx-auto flex h-full max-w-5xl flex-col px-5 py-4">
      <SpeakerList />
    </main>
  );
}
