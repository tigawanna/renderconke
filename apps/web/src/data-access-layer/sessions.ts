import { queryClient } from "@/lib/query-client";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryOptions } from "@tanstack/react-query";
import { EVENT_CONFIG } from "./event-config";
import { fetchSessionize } from "./sessionize";

export type SessionSpeaker = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  room: string | null;
  speakers: SessionSpeaker[];
  isServiceSession: boolean;
};

type SessionGroup = {
  sessions: Session[];
};

export const sessionsQueryOptions = queryOptions({
  queryKey: ["sessions", EVENT_CONFIG.year] as const,
  staleTime: EVENT_CONFIG.programme.revalidateSeconds * 1000,
  queryFn: async () => {
    const groups = await fetchSessionize<SessionGroup[]>(EVENT_CONFIG.api.sessionize.sessions);
    return groups
      .flatMap((group) => group.sessions)
      .filter((session) => !session.isServiceSession)
      .sort((a, b) => a.startsAt.localeCompare(b.startsAt));
  },
});

export const sessionsCollection = createCollection(
  queryCollectionOptions({
    id: "sessions",
    queryKey: sessionsQueryOptions.queryKey,
    queryFn: () => queryClient.fetchQuery(sessionsQueryOptions),
    getKey: (session) => session.id,
    queryClient,
    staleTime: EVENT_CONFIG.programme.revalidateSeconds * 1000,
  }),
);
