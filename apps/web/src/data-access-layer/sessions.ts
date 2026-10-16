import { queryOptions } from "@tanstack/react-query";
import { EVENT_CONFIG } from "./event-config";
import {
  fetchSessionize,
  type SessionizeCategory,
  type SessionizeQuestionAnswer,
} from "./sessionize";

export type SessionSpeaker = {
  id: string;
  name: string;
};

export type Session = {
  id: string;
  title: string;
  description: string;
  startsAt: string;
  endsAt: string;
  room: string;
  roomId: number;
  speakers: SessionSpeaker[];
  categories: SessionizeCategory[];
  questionAnswers: SessionizeQuestionAnswer[];
  isServiceSession: boolean;
  isPlenumSession: boolean;
  isConfirmed: boolean;
  isInformed: boolean;
  status: string;
  liveUrl: string | null;
  recordingUrl: string | null;
};

type SessionGroup = {
  groupId: number | null;
  groupName: string;
  isDefault: boolean;
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
