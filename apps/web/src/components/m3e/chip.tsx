import type { ReactNode } from "react";
import { Icon } from "@/components/m3e/icon";
import { cn } from "@/lib/m3e/cn";

function Chip({
  icon,
  children,
  className,
}: {
  icon?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      data-slot="chip"
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-surface-container-high py-1.5 pr-3 pl-2 text-label-large text-on-surface",
        className,
      )}
    >
      {icon ? <Icon name={icon} size={18} /> : null}
      {children}
    </span>
  );
}

export { Chip };
