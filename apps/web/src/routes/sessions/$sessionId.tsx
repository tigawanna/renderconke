import { EmptyState } from "@/components/empty-state";
import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions } from "@/data-access-layer/sessions";
import { speakersQueryOptions } from "@/data-access-layer/speakers";
import { pageHead } from "@/lib/site";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$sessionId")({
  loader: async ({ context, params }) => {
    const sessions = await context.queryClient.ensureQueryData(sessionsQueryOptions);
    return sessions.find((session) => session.id === params.sessionId) ?? null;
  },
  head: ({ loaderData, params }) =>
    pageHead({
      title: loaderData?.title ?? "Session",
      description: loaderData?.description,
      path: `/sessions/${params.sessionId}`,
    }),
  component: SessionPage,
});

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

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      {isError ? (
        <EmptyState
          tone="error"
          icon="error"
          title="Session unavailable"
          description="This session could not be loaded."
        />
      ) : null}
      {isLoading ? <p className="text-body-large mt-6">Loading session…</p> : null}
      {!isLoading && !session ? (
        <p className="text-body-large mt-6">This session is not on the programme.</p>
      ) : null}
      {session ? (
        <>
          <p className="text-label-large text-primary mt-6">
            {formatSlot(session.startsAt, session.endsAt)}
            {session.room ? ` · ${session.room}` : ""}
          </p>
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
        </>
      ) : null}
    </main>
  );
}
