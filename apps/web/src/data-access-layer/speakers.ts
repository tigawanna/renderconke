import { queryClient } from "@/lib/query-client";
import { createCollection } from "@tanstack/db";
import { queryCollectionOptions } from "@tanstack/query-db-collection";
import { queryOptions } from "@tanstack/react-query";
import { EVENT_CONFIG } from "./event-config";
import { fetchSessionize } from "./sessionize";

export type SpeakerSession = {
  id: number;
  name: string;
};

export type Speaker = {
  id: string;
  fullName: string;
  tagLine: string;
  bio: string;
  profilePicture: string;
  sessions: SpeakerSession[];
};

export const speakersQueryOptions = queryOptions({
  queryKey: ["speakers", EVENT_CONFIG.year] as const,
  staleTime: EVENT_CONFIG.programme.revalidateSeconds * 1000,
  queryFn: async () => {
    const speakers = await fetchSessionize<Speaker[]>(EVENT_CONFIG.api.sessionize.speakers);
    return speakers.sort((a, b) => a.fullName.localeCompare(b.fullName));
  },
});

export const speakersCollection = createCollection(
  queryCollectionOptions({
    id: "speakers",
    queryKey: speakersQueryOptions.queryKey,
    queryFn: () => queryClient.fetchQuery(speakersQueryOptions),
    getKey: (speaker) => speaker.id,
    queryClient,
    staleTime: EVENT_CONFIG.programme.revalidateSeconds * 1000,
  }),
);
