import { EmptyState } from "@/components/empty-state";
import { LoadingState } from "@/components/loading-state";
import { speakersQueryOptions } from "@/data-access-layer/speakers";
import { QueryErrorResetBoundary, useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Component, Suspense, type ReactNode } from "react";

export function SpeakerList() {
  return (
    <QueryErrorResetBoundary>
      {({ reset }) => (
        <SpeakerListErrorBoundary onReset={reset}>
          <Suspense fallback={<LoadingState label="Loading speakers…" />}>
            <SpeakerListContent />
          </Suspense>
        </SpeakerListErrorBoundary>
      )}
    </QueryErrorResetBoundary>
  );
}

function SpeakerListContent() {
  const { data } = useSuspenseQuery(speakersQueryOptions);

  if (data.length === 0) {
    return (
      <EmptyState
        description="Speakers will show up here once they are announced."
        icon="groups"
        title="No speakers"
      />
    );
  }

  return (
    <ul className="grid gap-6 sm:grid-cols-2">
      {data.map((speaker) => (
        <li key={speaker.id}>
          <Link
            to="/speakers/$speakerId"
            params={{ speakerId: speaker.id }}
            className="flex gap-4 no-underline"
          >
            <img
              alt=""
              className="size-20 rounded-full object-cover"
              src={speaker.profilePicture}
            />
            <span>
              <span className="text-title-large block">{speaker.fullName}</span>
              <span className="text-body-medium text-on-surface-variant block">
                {speaker.tagLine}
              </span>
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

class SpeakerListErrorBoundary extends Component<
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
        <p className="text-body-large text-error">Speakers could not be loaded.</p>
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
