import { ProgrammeBoard } from "@/components/programme-board";
import { eventJsonLd, pageHead } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  head: () => {
    const seo = pageHead();
    return {
      meta: seo.meta,
      links: seo.links,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(eventJsonLd()),
        },
      ],
    };
  },
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col px-3 pt-1 md:px-5">
      <ProgrammeBoard />
    </main>
  );
}
