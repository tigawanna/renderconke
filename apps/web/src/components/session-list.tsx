import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsCollection } from "@/data-access-layer/sessions";
import { useLiveQuery } from "@tanstack/react-db";
import { Link } from "@tanstack/react-router";

export function SessionList() {
  const { data, isLoading, isError } = useLiveQuery((q) =>
    q.from({ session: sessionsCollection }).select(({ session }) => ({
      id: session.id,
      title: session.title,
      startsAt: session.startsAt,
      endsAt: session.endsAt,
      room: session.room,
      speakers: session.speakers,
    })),
  );

  if (isLoading)
    return <p className="text-body-large text-on-surface-variant">Loading the programme…</p>;
  if (isError)
    return <p className="text-body-large text-error">The programme could not be loaded.</p>;

  return (
    <ul className="divide-outline-variant divide-y">
      {data.map((session) => (
        <li key={session.id}>
          <Link
            to="/sessions/$sessionId"
            params={{ sessionId: session.id }}
            className="grid gap-1 py-5 no-underline sm:grid-cols-[9rem_1fr]"
          >
            <span className="text-label-large text-primary">
              {formatSlot(session.startsAt, session.endsAt)}
            </span>
            <span>
              <span className="text-title-large block text-balance">{session.title}</span>
              <span className="text-body-medium text-on-surface-variant mt-1 block">
                {session.speakers.map((speaker) => speaker.name).join(", ") || "To be announced"}
                {session.room ? ` · ${session.room}` : ""}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
