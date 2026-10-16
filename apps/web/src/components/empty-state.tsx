import { Icon } from "@/components/m3e/icon";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/m3e/empty";

export function EmptyState({
  icon,
  title,
  description,
  tone = "default",
}: {
  icon: string;
  title: string;
  description: string;
  tone?: "default" | "error";
}) {
  const error = tone === "error";
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia
          variant="icon"
          className={error ? "bg-error-container text-on-error-container" : undefined}
        >
          <Icon name={icon} />
        </EmptyMedia>
        <EmptyTitle className={error ? "text-error" : undefined}>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
