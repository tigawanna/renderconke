import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { CarouselSlide, ExpressiveCarousel } from "@/components/m3e/expressive-carousel";
import { formatSlot, nairobiInstant } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions, type Session } from "@/data-access-layer/sessions";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Component, Suspense, type ReactNode } from "react";

export function SessionSpotlight() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <SpotlightErrorBoundary onReset={reset}>
          <Suspense fallback={<LoadingState label="Loading the programme…" />}>
            <SpotlightContent />
          </Suspense>
        </SpotlightErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function SpotlightContent() {
  const { data } = useSuspenseQuery(sessionsQueryOptions);
  const slides = neighbouringSessions(data);

  if (slides.length === 0) {
    return (
      <EmptyState
        description="The next, current, and previous talks will show up here."
        icon="calendar_month"
        title="No sessions"
      />
    );
  }

  return (
    <ExpressiveCarousel variant="hero" height={220}>
      {slides.map((slide) => (
        <CarouselSlide
          key={slide.session.id}
          className="bg-primary-container text-on-primary-container"
        >
          <Link
            to="/sessions/$sessionId"
            params={{ sessionId: slide.session.id }}
            className="flex h-full flex-col justify-end gap-2 p-5 no-underline"
          >
            <span className="text-label-large">{slide.label}</span>
            <span className="text-title-large text-balance">{slide.session.title}</span>
            <span className="text-body-medium">
              {formatSlot(slide.session.startsAt, slide.session.endsAt)}
              {slide.session.room ? ` · ${slide.session.room}` : ""}
            </span>
          </Link>
        </CarouselSlide>
      ))}
    </ExpressiveCarousel>
  );
}

function neighbouringSessions(sessions: Session[]) {
  if (sessions.length === 0) return [];
  const now = Date.now();
  const current = sessions.findIndex((session) => {
    const start = nairobiInstant(session.startsAt).getTime();
    const end = nairobiInstant(session.endsAt).getTime();
    return now >= start && now < end;
  });
  const upcoming = sessions.findIndex(
    (session) => nairobiInstant(session.startsAt).getTime() > now,
  );
  const focus = current >= 0 ? current : upcoming >= 0 ? upcoming : sessions.length - 1;
  const labels = ["Previous", "Now", "Next"] as const;

  return [focus - 1, focus, focus + 1]
    .map((index, offset) => {
      const session = sessions[index];
      if (!session) return null;
      const label = current >= 0 ? labels[offset] : offset === 1 ? "Next" : labels[offset];
      return { session, label: label ?? "Session" };
    })
    .filter((slide) => slide !== null);
}

class SpotlightErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;
    return <p className="text-body-large text-error">The programme could not be loaded.</p>;
  }
}
