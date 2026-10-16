import { queryOptions } from "@tanstack/react-query";
import { EVENT_CONFIG } from "./event-config";
import {
  fetchSessionize,
  type SessionizeCategory,
  type SessionizeQuestionAnswer,
} from "./sessionize";

export type SpeakerSession = {
  id: number;
  name: string;
};

export type SpeakerLink = {
  title: string;
  url: string;
  linkType: string;
};

export type Speaker = {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  bio: string;
  tagLine: string;
  profilePicture: string;
  sessions: SpeakerSession[];
  isTopSpeaker: boolean;
  links: SpeakerLink[];
  questionAnswers: SessionizeQuestionAnswer[];
  categories: SessionizeCategory[];
};

export const speakersQueryOptions = queryOptions({
  queryKey: ["speakers", EVENT_CONFIG.year] as const,
  staleTime: EVENT_CONFIG.programme.revalidateSeconds * 1000,
  queryFn: async () => {
    return fetchSessionize<Speaker[]>(EVENT_CONFIG.api.sessionize.speakers);
  },
});
