import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ScrollArea } from "@/components/m3e/scroll-area";
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/m3e/item";
import { SearchResult } from "@/components/m3e/search";
import { SearchField, useSearchQuery } from "@/components/search-field";
import { slotId, TimeScale } from "@/components/time-scale";
import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions, type Session } from "@/data-access-layer/sessions";
import { speakersQueryOptions, type Speaker } from "@/data-access-layer/speakers";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect, useRef } from "react";

export function SessionList() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const hash = useRouterState({ select: (state) => state.location.hash });
  const list = useRef<HTMLDivElement>(null);
  const { value, setValue, data, isLoading, isError, isPlaceholderData } = useSearchQuery(
    ["sessions", "list"],
    async (query) => {
      const [sessions, speakers] = await Promise.all([
        client.query({ ...sessionsQueryOptions, staleTime: "static" }),
        client.query({ ...speakersQueryOptions, staleTime: "static" }),
      ]);
      return {
        sessions: sessions.filter((session) => matchesSession(session, query)),
        speakers,
      };
    },
  );

  useEffect(() => {
    if (!hash || !data) return;
    list.current?.querySelector(`#${CSS.escape(hash.replace("#", ""))}`)?.scrollIntoView({
      block: "start",
    });
  }, [hash, data]);

  const sessions = data?.sessions;
  const byId = new Map((data?.speakers ?? []).map((speaker) => [speaker.id, speaker]));

  return (
    <div className="flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <SearchField placeholder="Search sessions" value={value} onValueChange={setValue}>
          {(sessions ?? []).map((session) => (
            <SearchResult
              key={session.id}
              icon="calendar_month"
              onClick={() =>
                void navigate({ to: "/sessions/$sessionId", params: { sessionId: session.id } })
              }
            >
              {session.title}
            </SearchResult>
          ))}
        </SearchField>
      </div>
      <div className="shrink-0">
        {sessions && sessions.length > 0 ? (
          <TimeScale
            sessions={sessions}
            onSelect={(startsAt) => {
              list.current?.querySelector(`#${CSS.escape(slotId(startsAt))}`)?.scrollIntoView({
                block: "start",
              });
            }}
          />
        ) : null}
      </div>
      {isLoading && !sessions ? (
        <div className="flex min-h-0 flex-1">
          <LoadingState label="Loading the programme…" />
        </div>
      ) : null}
      {isError || (!sessions && !isLoading) ? (
        <div className="flex min-h-0 flex-1">
          <EmptyState
            tone="error"
            icon="error"
            title="Programme unavailable"
            description="The programme could not be loaded."
          />
        </div>
      ) : null}
      {sessions && sessions.length === 0 ? (
        <div className="flex min-h-0 flex-1">
          <EmptyState
            description={
              value
                ? "Nothing in the programme matches that search."
                : "Talks will show up here once they are on the programme."
            }
            icon="calendar_month"
            title="No sessions"
          />
        </div>
      ) : null}
      {sessions && sessions.length > 0 ? (
        <ScrollArea ref={list} className="min-h-0 flex-1">
          <SessionRows byId={byId} isPlaceholderData={isPlaceholderData} sessions={sessions} />
        </ScrollArea>
      ) : null}
    </div>
  );
}

function SessionRows({
  sessions,
  byId,
  isPlaceholderData,
}: {
  sessions: Session[];
  byId: Map<string, Speaker>;
  isPlaceholderData: boolean;
}) {
  return (
    <ItemGroup className={isPlaceholderData ? "pb-6 opacity-70" : "pb-6"}>
      {sessions.map((session) => (
        <Item
          key={session.id}
          id={slotId(session.startsAt)}
          variant="muted"
          className="bg-surface-container-low shadow-elevation-1 hover:shadow-elevation-2"
          render={<Link to="/sessions/$sessionId" params={{ sessionId: session.id }} />}
        >
          <ItemMedia>
            <span className="flex -space-x-2">
              {session.speakers.slice(0, 3).map((person) => {
                const speaker = byId.get(person.id);
                return speaker?.profilePicture ? (
                  <img
                    key={person.id}
                    alt=""
                    className="size-10 rounded-full object-cover ring-2 ring-surface"
                    src={speaker.profilePicture}
                  />
                ) : (
                  <span
                    key={person.id}
                    className="bg-secondary-container text-on-secondary-container grid size-10 place-items-center rounded-full text-label-large ring-2 ring-surface"
                  >
                    {person.name.slice(0, 1)}
                  </span>
                );
              })}
            </span>
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="text-title-medium">{session.title}</ItemTitle>
            <ItemDescription>
              {formatSlot(session.startsAt, session.endsAt)}
              {session.room ? ` · ${session.room}` : ""}
              {session.speakers.length
                ? ` · ${session.speakers.map((speaker) => speaker.name).join(", ")}`
                : ""}
            </ItemDescription>
          </ItemContent>
        </Item>
      ))}
    </ItemGroup>
  );
}

function matchesSession(session: Session, query: string) {
  const needle = query.trim().toLowerCase();
  if (!needle) return true;
  return [session.title, session.description, session.room, ...session.speakers.map((s) => s.name)]
    .join(" ")
    .toLowerCase()
    .includes(needle);
}
