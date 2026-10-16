import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsCollection, type Session } from "@/data-access-layer/sessions";
import { eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/sessions/$sessionId")({
  component: SessionPage,
});

function SessionPage() {
  const { sessionId } = Route.useParams();
  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ session: sessionsCollection })
        .where(({ session }) => eq(session.id, sessionId))
        .findOne(),
    [sessionId],
  );
  const session = data as Session | undefined;

  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-16">
      <Link to="/" className="text-label-large text-primary no-underline">
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
