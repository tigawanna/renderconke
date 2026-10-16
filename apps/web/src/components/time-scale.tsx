import { Button } from "@/components/m3e/button";
import { nairobiInstant } from "@/data-access-layer/sessionize";
import type { Session } from "@/data-access-layer/sessions";
import { useEffect, useRef, useState } from "react";

const clock = new Intl.DateTimeFormat("en-KE", {
  hour: "numeric",
  minute: "2-digit",
  timeZone: "Africa/Nairobi",
});

export function TimeScale({
  sessions,
  onSelect,
  resetKey = 0,
  value = null,
}: {
  sessions: Session[];
  onSelect: (startsAt: string) => void;
  /** bump this to snap the marker back to the current time */
  resetKey?: number;
  /** session start to show, for example while the programme is scrolled */
  value?: string | null;
}) {
  const track = useRef<HTMLDivElement>(null);
  const chosen = useRef<string | null>(null);
  const start =
    sessions.length === 0
      ? 0
      : Math.min(...sessions.map((session) => nairobiInstant(session.startsAt).getTime()));
  const end =
    sessions.length === 0
      ? 1
      : Math.max(...sessions.map((session) => nairobiInstant(session.endsAt).getTime()));
  const span = Math.max(end - start, 1);
  const [ratio, setRatio] = useState(() => {
    const now = Date.now();
    if (now <= start) return 0;
    if (now >= end) return 1;
    return (now - start) / span;
  });

  const applyRatio = (next: number) => {
    setRatio(next);
    const match = nearestSession(sessions, start + next * span);
    if (match && match.startsAt !== chosen.current) {
      chosen.current = match.startsAt;
      onSelect(match.startsAt);
    }
  };

  const snapToNow = () => {
    const now = Date.now();
    const next = now <= start ? 0 : now >= end ? 1 : (now - start) / span;
    chosen.current = null;
    applyRatio(next);
  };

  useEffect(() => {
    if (resetKey === 0) return;
    snapToNow();
    // snapToNow closes over the latest sessions; resetKey is the trigger
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  useEffect(() => {
    if (!value || sessions.length === 0) return;
    const time = nairobiInstant(value).getTime();
    const next = time <= start ? 0 : time >= end ? 1 : (time - start) / span;
    chosen.current = value;
    setRatio(next);
  }, [value, start, end, span, sessions.length]);

  if (sessions.length === 0) return null;

  const ticks: number[] = [];
  const hour = 60 * 60 * 1000;
  for (let tick = Math.ceil(start / hour) * hour; tick <= end; tick += hour) ticks.push(tick);

  const moveTo = (clientX: number) => {
    const rect = track.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return;
    const next = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
    applyRatio(next);
  };

  return (
    <div className="flex items-start gap-2 px-1 pt-2 pb-12 md:items-center md:pb-6">
      <div className="relative min-w-0 flex-1">
        <div
          ref={track}
          role="slider"
          aria-label="Programme time"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={Math.round(ratio * 100)}
          tabIndex={0}
          className="relative h-8 cursor-ew-resize touch-none"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            moveTo(event.clientX);
          }}
          onPointerMove={(event) => {
            if (!event.currentTarget.hasPointerCapture(event.pointerId)) return;
            moveTo(event.clientX);
          }}
          onKeyDown={(event) => {
            const step = event.key === "ArrowRight" ? 0.05 : event.key === "ArrowLeft" ? -0.05 : 0;
            if (!step) return;
            event.preventDefault();
            const rect = track.current?.getBoundingClientRect();
            if (!rect) return;
            moveTo(rect.left + Math.min(1, Math.max(0, ratio + step)) * rect.width);
          }}
        >
          <div className="bg-outline-variant absolute inset-x-0 top-3 h-px">
            {ticks.map((tick) => (
              <span
                key={tick}
                className="pointer-events-none absolute top-0 flex -translate-x-1/2 flex-col items-center"
                style={{ left: `${((tick - start) / span) * 100}%` }}
              >
                <span className="bg-outline h-2 w-px" />
                <span className="text-label-small text-on-surface-variant mt-1 block origin-top [writing-mode:vertical-lr] whitespace-nowrap md:[writing-mode:horizontal-tb]">
                  {clock.format(tick)}
                </span>
              </span>
            ))}
            <span
              aria-hidden
              className="border-t-primary pointer-events-none absolute bottom-full -translate-x-1/2 border-x-8 border-t-8 border-x-transparent"
              style={{ left: `${ratio * 100}%` }}
            />
          </div>
        </div>
      </div>
      <Button variant="text" size="sm" className="shrink-0" onClick={snapToNow}>
        Reset
      </Button>
    </div>
  );
}

function nearestSession(sessions: Session[], time: number) {
  return sessions.reduce((closest, session) => {
    const here = Math.abs(nairobiInstant(session.startsAt).getTime() - time);
    const best = Math.abs(nairobiInstant(closest.startsAt).getTime() - time);
    return here < best ? session : closest;
  });
}

export function slotId(startsAt: string) {
  return `slot-${startsAt}`;
}
