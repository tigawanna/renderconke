import { speakersCollection, type Speaker } from "@/data-access-layer/speakers";
import { eq } from "@tanstack/db";
import { useLiveQuery } from "@tanstack/react-db";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers/$speakerId")({
  component: SpeakerPage,
});

function SpeakerPage() {
  const { speakerId } = Route.useParams();
  const { data, isLoading } = useLiveQuery(
    (q) =>
      q
        .from({ speaker: speakersCollection })
        .where(({ speaker }) => eq(speaker.id, speakerId))
        .findOne(),
    [speakerId],
  );
  const speaker = data as Speaker | undefined;

  return (
    <main className="mx-auto max-w-3xl px-5 pt-8 pb-16">
      <Link to="/speakers" className="text-label-large text-primary no-underline">
        All speakers
      </Link>
      {isLoading ? <p className="text-body-large mt-6">Loading speaker…</p> : null}
      {!isLoading && !speaker ? (
        <p className="text-body-large mt-6">This speaker is not listed.</p>
      ) : null}
      {speaker ? (
        <article className="mt-6 flex flex-col gap-6 sm:flex-row">
          <img alt="" className="size-40 rounded-full object-cover" src={speaker.profilePicture} />
          <div>
            <h1 className="text-display-small text-balance">{speaker.fullName}</h1>
            <p className="text-title-medium text-on-surface-variant mt-1">{speaker.tagLine}</p>
            <p className="text-body-large mt-4 whitespace-pre-wrap">{speaker.bio}</p>
            <ul className="mt-6 flex flex-col gap-2">
              {speaker.sessions.map((session) => (
                <li key={session.id}>
                  <Link
                    to="/sessions/$sessionId"
                    params={{ sessionId: String(session.id) }}
                    className="text-title-medium text-primary no-underline"
                  >
                    {session.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </article>
      ) : null}
    </main>
  );
}
