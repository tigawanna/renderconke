import { ProgrammeBoard } from "@/components/programme-board";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <main className="mx-auto flex h-full max-w-3xl flex-col px-3 pt-3 md:px-5 md:pt-4">
      <ProgrammeBoard />
    </main>
  );
}
