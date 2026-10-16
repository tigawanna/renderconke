import { EVENT_CONFIG } from "./event-config";

export type SessionizeCategoryItem = {
  id: number;
  name: string;
};

export type SessionizeCategory = {
  id: number;
  name: string;
  categoryItems: SessionizeCategoryItem[];
  sort: number;
};

export type SessionizeQuestionAnswer = {
  id: number;
  question: string;
  questionType: string;
  answer: string;
  sort: number;
  answerExtra: string | null;
};

export async function fetchSessionize<T>(url: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), EVENT_CONFIG.programme.timeoutMilliseconds);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) {
      throw new Error(`Sessionize responded with ${response.status}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function nairobiInstant(wallTime: string) {
  return new Date(`${wallTime}${EVENT_CONFIG.programme.offsetForLocalTimestamps}`);
}

const clock = new Intl.DateTimeFormat("en-KE", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: EVENT_CONFIG.programme.timeZone,
});

export function formatSlot(startsAt: string, endsAt: string) {
  return `${clock.format(nairobiInstant(startsAt))} – ${clock.format(nairobiInstant(endsAt))}`;
}
