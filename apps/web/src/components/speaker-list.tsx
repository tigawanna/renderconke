import { speakersCollection } from "@/data-access-layer/speakers";
import { useLiveQuery } from "@tanstack/react-db";
import { Link } from "@tanstack/react-router";

export function SpeakerList() {
  const { data, isLoading, isError } = useLiveQuery((q) =>
    q.from({ speaker: speakersCollection }).select(({ speaker }) => ({
      id: speaker.id,
      fullName: speaker.fullName,
      tagLine: speaker.tagLine,
      profilePicture: speaker.profilePicture,
    })),
  );

  if (isLoading)
    return <p className="text-body-large text-on-surface-variant">Loading speakers…</p>;
  if (isError) return <p className="text-body-large text-error">Speakers could not be loaded.</p>;

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {data.map((speaker) => (
        <li key={speaker.id}>
          <Link
            to="/speakers/$speakerId"
            params={{ speakerId: speaker.id }}
            className="flex gap-4 no-underline"
          >
            <img
              alt=""
              className="size-20 rounded-full object-cover"
              src={speaker.profilePicture}
            />
            <span>
              <span className="text-title-large block">{speaker.fullName}</span>
              <span className="text-body-medium text-on-surface-variant block">
                {speaker.tagLine}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
