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
  const [resetKey, setResetKey] = useState(0);
  const [nowLabel, setNowLabel] = useState(() =>
    new Intl.DateTimeFormat("en-KE", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Africa/Nairobi",
    }).format(new Date()),
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setNowLabel(
        new Intl.DateTimeFormat("en-KE", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "Africa/Nairobi",
        }).format(new Date()),
      );
    }, 30_000);
    return () => clearInterval(timer);
  }, []);

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
            sessions={programme.data?.sessions ?? []}
            onSelect={(startsAt) => {
              list.current?.querySelector(`#${CSS.escape(slotId(startsAt))}`)?.scrollIntoView({
                block: "center",
              });
            }}
          />
        ) : null}
      </div>
      {programme.isLoading && !programme.data ? (
        <LoadingState label="Loading the programme…" />
      ) : null}
      {programme.isError ? (
        <p className="text-body-large text-error">The programme could not be loaded.</p>
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
          <SlotScroller rows={rows} speakers={programme.data?.speakers ?? []} liveKey={liveKey} />
        </ScrollArea>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center md:bottom-3">
        <div className="bg-surface-container-high text-on-surface pointer-events-auto flex max-w-[calc(100%-1.5rem)] items-center gap-1 rounded-full py-1 pr-1 pl-3 shadow-elevation-2">
          <span className="text-label-large shrink-0 pr-1">{nowLabel}</span>
          <Button size="sm" variant="tonal" onClick={() => setResetKey((key) => key + 1)}>
            Now
          </Button>
          <Button size="sm" variant="text" render={<Link to="/sessions" />}>
            <span className="md:hidden">Talks</span>
            <span className="hidden md:inline">Sessions</span>
          </Button>
          <Button size="sm" variant="text" render={<Link to="/speakers" />}>
            <span className="md:hidden">People</span>
            <span className="hidden md:inline">Speakers</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function SlotScroller({
  rows,
  speakers,
  liveKey,
}: {
  rows: SessionRow[];
  speakers: Speaker[];
  liveKey: string | null;
}) {
  const scroller = useRef<HTMLDivElement>(null);
  const [activeKey, setActiveKey] = useState(liveKey ?? rows[0]?.key ?? null);
  const byId = new Map(speakers.map((speaker) => [speaker.id, speaker]));
  const activeIndex = Math.max(
    0,
    rows.findIndex((row) => row.key === activeKey),
  );

  useEffect(() => {
    if (!liveKey) return;
    scroller.current?.querySelector(`#${CSS.escape(slotId(liveKey))}`)?.scrollIntoView({
      block: "center",
    });
  }, [liveKey]);

  useEffect(() => {
    const root = scroller.current?.closest<HTMLElement>("[data-slot=scroll-area-viewport]");
    if (!root || !scroller.current) return;
    const nodes = [...scroller.current.querySelectorAll<HTMLElement>("[data-slot-row]")];
    const observer = new IntersectionObserver(
      (entries) => {
        const best = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        const key = best?.target instanceof HTMLElement ? best.target.dataset.slotRow : null;
        if (key) setActiveKey(key);
      },
      { root, threshold: [0.45, 0.7] },
    );
    for (const node of nodes) observer.observe(node);
    return () => observer.disconnect();
  }, [rows]);

  return (
    <div ref={scroller} className="flex flex-col gap-3 pb-20 md:gap-4 md:pb-24">
      {rows.map((row, index) => {
        const live = row.sessions.some(isLive);
        const active = index === activeIndex;
        const beside = Math.abs(index - activeIndex) === 1;
        return (
          <section
            key={row.key}
            id={slotId(row.key)}
            data-slot-row={row.key}
            className={[
              "origin-center gap-3 transition-[transform,filter] motion-spatial-default",
              row.sessions.length > 1
                ? "flex snap-x snap-mandatory overflow-x-auto md:grid md:snap-none md:grid-cols-2 md:overflow-visible"
                : "grid grid-cols-1",
              active
                ? "scale-100 blur-none"
                : beside
                  ? "md:scale-[0.86] md:blur-[1.5px]"
                  : "opacity-80 md:scale-[0.8] md:blur-sm md:opacity-100",
            ].join(" ")}
          >
            {row.sessions.map((session) => (
              <Link
                key={session.id}
                to="/sessions/$sessionId"
                params={{ sessionId: session.id }}
                className={[
                  "flex min-h-36 w-[88%] shrink-0 snap-center flex-col justify-between gap-3 rounded-xl p-4 no-underline md:min-h-44 md:w-auto md:gap-4 md:p-5",
                  live
                    ? "bg-tertiary-container text-on-tertiary-container"
                    : "bg-surface-container text-on-surface",
                ].join(" ")}
              >
                <span>
                  <span className="text-label-large block">
                    {live ? "Now" : formatSlot(session.startsAt, session.endsAt)}
                    {session.room ? ` · ${session.room}` : ""}
                  </span>
                  <span className="text-title-large md:text-headline-small mt-2 block text-balance">
                    {session.title}
                  </span>
                </span>
                <span className="flex flex-wrap gap-2">
                  {session.speakers.map((person) => {
                    const speaker = byId.get(person.id);
                    return (
                      <span
                        key={person.id}
                        className="inline-flex max-w-full items-center gap-2 rounded-full bg-surface-container-lowest py-1 pr-3 pl-1 text-on-surface"
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
                      </span>
                    );
                  })}
                </span>
              </Link>
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

function isLive(session: Session) {
  const now = Date.now();
  const start = nairobiInstant(session.startsAt).getTime();
  const end = nairobiInstant(session.endsAt).getTime();
  return now >= start && now < end;
}
