import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { ScrollArea } from "@/components/m3e/scroll-area";
import { SearchField, useSearchQuery } from "@/components/search-field";
import { slotId, TimeScale } from "@/components/time-scale";
import { SearchResult } from "@/components/m3e/search";
import { formatSlot, nairobiInstant } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions, type Session } from "@/data-access-layer/sessions";
import { speakersQueryOptions, type Speaker } from "@/data-access-layer/speakers";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/m3e/button";

const clock = new Intl.DateTimeFormat("en-KE", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Nairobi",
});

export function ProgrammeBoard() {
  const client = useQueryClient();
  const navigate = useNavigate();
  const search = useSearchQuery(["home", "search"], async (query) => {
    const needle = query.trim().toLowerCase();
    const [sessions, speakers] = await Promise.all([
      client.ensureQueryData(sessionsQueryOptions),
      client.ensureQueryData(speakersQueryOptions),
    ]);
    if (!needle) return { sessions: [], speakers: [] };
    return {
      sessions: sessions.filter((session) =>
        [session.title, session.room, ...session.speakers.map((speaker) => speaker.name)]
          .join(" ")
          .toLowerCase()
          .includes(needle),
      ),
      speakers: speakers.filter((speaker) =>
        [speaker.fullName, speaker.tagLine].join(" ").toLowerCase().includes(needle),
      ),
    };
  });
  const programme = useSearchQuery(["home", "programme"], async () => {
    const [sessions, speakers] = await Promise.all([
      client.ensureQueryData(sessionsQueryOptions),
      client.ensureQueryData(speakersQueryOptions),
    ]);
    return { sessions, speakers };
  });

  const hits = search.data;
  const rows = groupByStart(programme.data?.sessions ?? []);
  const liveKey = rows.find((row) => row.sessions.some(isLive))?.key ?? null;

  const list = useRef<HTMLDivElement>(null);
  const fromSlider = useRef(false);
  const [resetKey, setResetKey] = useState(0);
  const [focusKey, setFocusKey] = useState<string | null>(null);
  const highlighted = focusKey ?? liveKey ?? nearestKey(rows);
  const timeLabel = highlighted
    ? clock.format(nairobiInstant(highlighted))
    : clock.format(new Date());

  useEffect(() => {
    const viewport = list.current?.querySelector<HTMLElement>("[data-slot=scroll-area-viewport]");
    if (!viewport) return;
    let frame = 0;
    const onScroll = () => {
      if (fromSlider.current) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const root = viewport.getBoundingClientRect();
        const anchor = root.top + Math.min(96, root.height * 0.28);
        let best: HTMLElement | null = null;
        let bestDistance = Infinity;
        for (const node of viewport.querySelectorAll<HTMLElement>("[data-slot-row]")) {
          const box = node.getBoundingClientRect();
          if (box.bottom < root.top || box.top > root.bottom) continue;
          const distance = Math.abs(box.top - anchor);
          if (distance < bestDistance) {
            best = node;
            bestDistance = distance;
          }
        }
        const key = best?.dataset.slotRow;
        if (key) setFocusKey((current) => (current === key ? current : key));
      });
    };
    viewport.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      viewport.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [rows.length]);

  return (
    <div className="relative flex h-full min-h-0 flex-col gap-4">
      <div className="shrink-0">
        <SearchField
          placeholder="Search sessions and speakers"
          value={search.value}
          onValueChange={search.setValue}
        >
          {hits?.sessions.map((session) => (
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
          {hits?.speakers.map((speaker) => (
            <SearchResult
              key={speaker.id}
              icon="person"
              onClick={() =>
                void navigate({ to: "/speakers/$speakerId", params: { speakerId: speaker.id } })
              }
            >
              {speaker.fullName}
            </SearchResult>
          ))}
          {search.value && hits && hits.sessions.length + hits.speakers.length === 0 ? (
            <p className="text-body-medium text-on-surface-variant px-4 py-3">No matches</p>
          ) : null}
        </SearchField>
        {rows.length > 0 ? (
          <TimeScale
            resetKey={resetKey}
            value={highlighted}
            sessions={programme.data?.sessions ?? []}
            onSelect={(startsAt) => {
              fromSlider.current = true;
              setFocusKey(startsAt);
              list.current
                ?.querySelector(`#${CSS.escape(slotId(startsAt))}`)
                ?.scrollIntoView({ block: "center" });
              window.setTimeout(() => {
                fromSlider.current = false;
              }, 500);
            }}
          />
        ) : null}
      </div>
      {programme.isLoading && !programme.data ? (
        <LoadingState label="Loading the programme…" />
      ) : null}
      {programme.isError ? (
        <EmptyState
          tone="error"
          icon="error"
          title="Programme unavailable"
          description="The programme could not be loaded."
        />
      ) : null}
      {programme.data && rows.length === 0 ? (
        <EmptyState
          description="Talks will show up here once they are on the programme."
          icon="calendar_month"
          title="No sessions"
        />
      ) : null}
      {rows.length > 0 ? (
        <ScrollArea ref={list} className="min-h-0 flex-1">
          <SlotScroller
            rows={rows}
            speakers={programme.data?.speakers ?? []}
            focusKey={highlighted}
          />
        </ScrollArea>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-3">
        <div className="bg-surface-container-high text-on-surface pointer-events-auto flex max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full py-1 pr-1 pl-3 shadow-elevation-2">
          <span className="text-label-large shrink-0 pr-1">{timeLabel}</span>
          <Button
            size="sm"
            variant="tonal"
            onClick={() => {
              setFocusKey(null);
              setResetKey((key) => key + 1);
            }}
          >
            Now
          </Button>
          <Button
            size="sm"
            variant="text"
            className="hidden md:inline-flex"
            nativeButton={false}
            render={<Link to="/sessions" />}
          >
            Sessions
          </Button>
          <Button
            size="sm"
            variant="text"
            className="hidden md:inline-flex"
            nativeButton={false}
            render={<Link to="/speakers" />}
          >
            Speakers
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlotScroller({
  rows,
  speakers,
  focusKey,
}: {
  rows: SessionRow[];
  speakers: Speaker[];
  focusKey: string | null;
}) {
  const byId = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const activeIndex = Math.max(
    0,
    rows.findIndex((row) => row.key === focusKey),
  );

  return (
    <div className="flex flex-col gap-3 pb-20 md:gap-4 md:pb-24">
      {rows.map((row, index) => {
        const live = row.sessions.some(isLive);
        const active = index === activeIndex;
        const beside = Math.abs(index - activeIndex) === 1;
        const paired = row.sessions.length > 1;
        const slotLabel = live
          ? "Now"
          : formatSlot(row.sessions[0].startsAt, row.sessions[0].endsAt);
        return (
          <section
            key={row.key}
            id={slotId(row.key)}
            data-slot-row={row.key}
            style={{
              transform: active ? "scale(1)" : beside ? "scale(0.94)" : "scale(0.9)",
            }}
            className={[
              "origin-center transition-[transform,filter] motion-spatial-default",
              paired
                ? "flex flex-col overflow-hidden rounded-xl md:grid md:grid-cols-2 md:gap-3 md:overflow-visible md:rounded-none md:bg-transparent"
                : "grid grid-cols-1",
              paired
                ? live
                  ? "bg-tertiary-container text-on-tertiary-container"
                  : "bg-surface-container text-on-surface"
                : "",
              active ? "z-1 blur-none" : beside ? "blur-[1.5px]" : "opacity-80 blur-sm",
            ].join(" ")}
          >
            {paired ? (
              <p className="text-label-medium px-4 pt-3 text-right md:hidden">{slotLabel}</p>
            ) : null}
            {row.sessions.map((session, sessionIndex) => (
              <div
                key={session.id}
                className={[
                  "relative flex min-h-24 flex-col justify-between gap-3 p-4 md:min-h-44 md:gap-4 md:rounded-xl md:p-5",
                  paired && sessionIndex > 0 ? "border-outline border-t-2 md:border-t-0" : "",
                  paired ? "" : "rounded-xl",
                  live
                    ? "md:bg-tertiary-container md:text-on-tertiary-container"
                    : "md:bg-surface-container md:text-on-surface",
                  paired
                    ? ""
                    : live
                      ? "bg-tertiary-container text-on-tertiary-container"
                      : "bg-surface-container text-on-surface",
                ].join(" ")}
              >
                <Link
                  to="/sessions/$sessionId"
                  params={{ sessionId: session.id }}
                  aria-label={session.title}
                  className="absolute inset-0 rounded-[inherit]"
                />
                <span className="pointer-events-none relative flex items-center gap-3 md:block">
                  <span className="flex shrink-0 -space-x-2 md:hidden">
                    {session.speakers.map((person) => {
                      const speaker = byId.get(person.id);
                      return speaker?.profilePicture ? (
                        <img
                          key={person.id}
                          alt=""
                          className="size-10 rounded-full object-cover ring-2 ring-surface-container"
                          src={speaker.profilePicture}
                        />
                      ) : null;
                    })}
                  </span>
                  <span className="min-w-0">
                    <span className="text-label-medium md:text-label-large block">
                      {paired ? (
                        <>
                          <span className="hidden md:inline">
                            {slotLabel}
                            {session.room ? " · " : ""}
                          </span>
                          {session.room}
                        </>
                      ) : (
                        <>
                          {slotLabel}
                          {session.room ? ` · ${session.room}` : ""}
                        </>
                      )}
                    </span>
                    <span className="text-title-medium md:text-headline-small mt-1 block text-balance md:mt-2">
                      {session.title}
                    </span>
                  </span>
                </span>
                <span className="relative z-1 hidden flex-wrap gap-2 md:flex">
                  {session.speakers.map((person) => {
                    const speaker = byId.get(person.id);
                    return (
                      <Link
                        key={person.id}
                        to="/speakers/$speakerId"
                        params={{ speakerId: person.id }}
                        className="inline-flex max-w-full items-center gap-2 rounded-full bg-surface-container-lowest py-1 pr-3 pl-1 text-on-surface no-underline"
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
                    );
                  })}
                </span>
              </div>
            ))}
          </section>
        );
      })}
    </div>
  );
}

type SessionRow = { key: string; sessions: Session[] };

function groupByStart(sessions: Session[]): SessionRow[] {
  const groups = new Map<string, Session[]>();
  for (const session of sessions) {
    const group = groups.get(session.startsAt) ?? [];
    group.push(session);
    groups.set(session.startsAt, group);
  }
  return [...groups.entries()].map(([key, group]) => ({ key, sessions: group }));
}

function nearestKey(rows: SessionRow[]) {
  const now = Date.now();
  let best: SessionRow | undefined;
  let bestDistance = Infinity;
  for (const row of rows) {
    const distance = Math.abs(nairobiInstant(row.key).getTime() - now);
    if (distance < bestDistance) {
      best = row;
      bestDistance = distance;
    }
  }
  return best?.key ?? null;
}

function isLive(session: Session) {
  const now = Date.now();
  const start = nairobiInstant(session.startsAt).getTime();
  const end = nairobiInstant(session.endsAt).getTime();
  return now >= start && now < end;
}
