import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions } from "@/data-access-layer/sessions";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$sessionId")({
  component: SessionPage,
});

function SessionPage() {
  const { sessionId } = Route.useParams();
  const { data: session, isLoading } = useQuery({
    ...sessionsQueryOptions,
    select: (sessions) => sessions.find((session) => session.id === sessionId),
  });

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <Link to="/sessions" className="text-label-large text-primary no-underline">
        All sessions
      </Link>
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
          <p className="text-body-large mt-4 whitespace-pre-wrap">{session.description}</p>
          <ul className="mt-6 flex flex-wrap gap-3">
            {session.speakers.map((speaker) => (
              <li key={speaker.id}>
                <Link
                  to="/speakers/$speakerId"
                  params={{ speakerId: speaker.id }}
                  className="text-title-medium bg-primary-container text-on-primary-container rounded-full px-4 py-2 no-underline"
                >
                  {speaker.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}
    </main>
  );
}
