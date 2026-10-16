import { LoadingIndicator } from "@/components/m3e/loading-indicator";

export function LoadingState({ label }: { label: string }) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col items-center justify-center gap-5">
      <LoadingIndicator size={72} />
      <p className="text-body-large text-on-surface-variant">{label}</p>
    </div>
  );
}
