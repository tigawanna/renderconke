import { LoadingIndicator } from "@/components/m3e/loading-indicator";

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex flex-1 items-center justify-center gap-4 py-8">
      <LoadingIndicator />
      <p className="text-body-large text-on-surface-variant">{label}</p>
    </div>
  );
}
