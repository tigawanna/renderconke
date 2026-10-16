import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { Chip } from "@/components/m3e/chip";
import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions } from "@/data-access-layer/sessions";
import { speakersQueryOptions } from "@/data-access-layer/speakers";
import { pageHead, speakerJsonLd } from "@/lib/site";
import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/speakers/$speakerId")({
  loader: async ({ context, params }) => {
    const speakers = await context.queryClient.query({
      ...speakersQueryOptions,
      staleTime: "static",
    });
    return speakers.find((speaker) => speaker.id === params.speakerId) ?? null;
  },
  head: ({ loaderData, params }) => {
    const seo = pageHead({
      title: loaderData?.fullName ?? "Speaker",
      description: loaderData?.bio || loaderData?.tagLine,
      path: `/speakers/${params.speakerId}`,
    });
    if (!loaderData) return seo;
    return {
      ...seo,
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(speakerJsonLd(loaderData)),
        },
      ],
    };
  },
  component: SpeakerPage,
});

// @icons link work article language photo_camera tag group event
function linkIcon(linkType: string) {
  switch (linkType) {
    case "LinkedIn":
      return "work";
    case "Blog":
      return "article";
    case "Company_Website":
      return "language";
    case "Instagram":
      return "photo_camera";
    case "Twitter":
      return "tag";
    case "Facebook":
      return "group";
    case "Sessionize":
      return "event";
    default:
      return "link";
  }
}

function SpeakerPage() {
  const { speakerId } = Route.useParams();
  const {
    data: speaker,
    isLoading,
    isError,
  } = useQuery({
    ...speakersQueryOptions,
    select: (speakers) => speakers.find((speaker) => speaker.id === speakerId),
  });
  const { data: sessions } = useQuery(sessionsQueryOptions);
  const talks = new Map((sessions ?? []).map((session) => [session.id, session]));

  if (isLoading) {
    return (
      <main className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8">
        <LoadingState label="Loading speaker…" />
      </main>
    );
  }
  if (isError) {
    return (
      <main className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8">
        <EmptyState
          tone="error"
          icon="error"
          title="Speaker unavailable"
          description="This speaker could not be loaded."
        />
      </main>
    );
  }
  if (!speaker) {
    return (
      <main className="mx-auto flex h-full max-w-3xl flex-col px-5 py-8">
        <EmptyState
          icon="person"
          title="Speaker not listed"
          description="This speaker is not listed."
        />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-5 py-8">
      <article className="mt-6 flex flex-col gap-6 sm:flex-row">
        <img alt="" className="size-40 rounded-full object-cover" src={speaker.profilePicture} />
        <div>
          <h1 className="text-display-small text-balance">{speaker.fullName}</h1>
          <p className="text-title-medium text-on-surface-variant mt-1">{speaker.tagLine}</p>
          {speaker.links.length > 0 ? (
            <ul className="mt-3 flex flex-wrap gap-2">
              {speaker.links.map((link) => {
                const label = link.title || link.linkType.replaceAll("_", " ");
                return (
                  <li key={link.url}>
                    <a href={link.url} target="_blank" rel="noreferrer" className="no-underline">
                      <Chip icon={linkIcon(link.linkType)}>{label}</Chip>
                    </a>
                  </li>
                );
              })}
            </ul>
          ) : null}
          <p className="text-body-large mt-4 whitespace-pre-wrap">{speaker.bio}</p>
          <ul className="mt-6 flex flex-col gap-3">
            {speaker.sessions.map((session) => {
              const talk = talks.get(String(session.id));
              return (
                <li key={session.id}>
                  <Link
                    to="/sessions/$sessionId"
                    params={{ sessionId: String(session.id) }}
                    className="bg-surface-container block rounded-xl p-4 no-underline"
                  >
                    <span className="text-label-medium text-primary block">
                      Talk
                      {talk ? ` · ${formatSlot(talk.startsAt, talk.endsAt)}` : ""}
                      {talk?.room ? ` · ${talk.room}` : ""}
                    </span>
                    <span className="text-title-medium text-on-surface mt-1 block">
                      {session.name}
                    </span>
                    {talk?.description ? (
                      <span
                        className="text-body-medium text-on-surface-variant mt-1 block overflow-hidden"
                        style={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                        }}
                      >
                        {talk.description}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </article>
    </main>
  );
}
