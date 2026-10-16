import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { formatSlot } from "@/data-access-layer/sessionize";
import { sessionsQueryOptions } from "@/data-access-layer/sessions";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Component, Suspense, type ReactNode } from "react";

export function SessionList() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <SessionListErrorBoundary onReset={reset}>
          <Suspense fallback={<LoadingState label="Loading the programme…" />}>
            <SessionListContent />
          </Suspense>
        </SessionListErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function SessionListContent() {
  const { data } = useSuspenseQuery(sessionsQueryOptions);

  if (data.length === 0) {
    return (
      <EmptyState
        description="Talks will show up here once they are on the programme."
        icon="calendar_month"
        title="No sessions"
      />
    );
  }

  return (
    <ul className="divide-outline-variant divide-y">
      {data.map((session) => (
        <li key={session.id}>
          <Link
            to="/sessions/$sessionId"
            params={{ sessionId: session.id }}
            className="grid gap-1 py-5 no-underline sm:grid-cols-[9rem_1fr]"
          >
            <span className="text-label-large text-primary">
              {formatSlot(session.startsAt, session.endsAt)}
            </span>
            <span>
              <span className="text-title-large block text-balance">{session.title}</span>
              <span className="text-body-medium text-on-surface-variant mt-1 block">
                {session.speakers.map((speaker) => speaker.name).join(", ") || "To be announced"}
                {session.room ? ` · ${session.room}` : ""}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

class SessionListErrorBoundary extends Component<
  { children: ReactNode; onReset: () => void },
  { hasError: boolean }
> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex flex-col items-start gap-3">
        <p className="text-body-large text-error">The programme could not be loaded.</p>
        <button
          className="text-label-large text-primary"
          type="button"
          onClick={() => {
            this.props.onReset();
            this.setState({ hasError: false });
          }}
        >
          Try again
        </button>
      </div>
    );
  }
}
