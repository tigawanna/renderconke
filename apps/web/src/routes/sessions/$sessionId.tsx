import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Chip } from "@/components/m3e/chip";
import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions } from "@/data-access-layer/sessions";
import { speakersQueryOptions } from "@/data-access-layer/speakers";
import { pageHead, sessionJsonLd } from "@/lib/site";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$sessionId")({
  loader: async ({ context, params }) => {
    const sessions = await context.queryClient.query({
      ...sessionsQueryOptions,
      staleTime: "static",
    });
    return sessions.find((session) => session.id === params.sessionId) ?? null;
  },
  head: ({ loaderData, params }) => {
    const seo = pageHead({
      title: loaderData?.title ?? "Session",
      description: loaderData?.description,
      path: `/sessions/${params.sessionId}`,
    });
    if (!loaderData) return seo;
    return {
      ...seo,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(sessionJsonLd(loaderData)),
        },
      ],
    };
  },
  component: SessionPage,
});

// @icons schedule location_on
function SessionPage() {
  const { sessionId } = Route.useParams();
  const {
    data: session,
    isLoading,
    isError,
  } = useQuery({
    ...sessionsQueryOptions,
    select: (sessions) => sessions.find((session) => session.id === sessionId),
  });
  const { data: speakers } = useQuery(speakersQueryOptions);
  const byId = new Map((speakers ?? []).map((speaker) => [speaker.id, speaker]));

  if (isLoading) {
    return (
      <main className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8">
        <LoadingState label="Loading session…" />
      </main>
    );
  }
  if (isError) {
    return (
      <main className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8">
        <EmptyState
          tone="error"
          icon="error"
          title="Session unavailable"
          description="This session could not be loaded."
        />
      </main>
    );
  }
  if (!session) {
    return (
      <main className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8">
        <EmptyState
          icon="calendar_month"
          title="Session not listed"
          description="This session is not on the programme."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <div className="mt-6 flex flex-wrap gap-2">
        <Chip icon="schedule">{formatSlot(session.startsAt, session.endsAt)}</Chip>
        {session.room ? <Chip icon="location_on">{session.room}</Chip> : null}
      </div>
      <h1 className="text-display-small mt-2 text-balance">{session.title}</h1>
      <ul className="mt-4 flex flex-wrap gap-2">
        {session.speakers.map((person) => {
          const speaker = byId.get(person.id);
          return (
            <li key={person.id}>
              <Link
                to="/speakers/$speakerId"
                params={{ speakerId: person.id }}
                className="inline-flex max-w-full items-center gap-2 rounded-full bg-surface-container py-1 pr-3 pl-1 text-on-surface no-underline"
              >
                {speaker?.profilePicture ? (
                  <img
                    alt=""
                    className="size-8 rounded-full object-cover"
                    src={speaker.profilePicture}
                  />
                ) : null}
                <span className="min-w-0">
                  <span className="text-label-large block truncate">
                    {speaker?.fullName ?? person.name}
                  </span>
                  {speaker?.tagLine ? (
                    <span className="text-label-medium text-on-surface-variant block truncate">
                      {speaker.tagLine}
                    </span>
                  ) : null}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
      <p className="text-body-large mt-6 whitespace-pre-wrap">{session.description}</p>
    </main>
  );
}
