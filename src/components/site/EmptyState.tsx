import type { ReactNode } from "react";
import { SearchX } from "lucide-react";

export function EmptyState({ title, description, action, icon: Icon = SearchX }: { title: string; description?: ReactNode; action?: ReactNode; icon?: typeof SearchX }) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed bg-card/50 px-6 py-14 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-muted">
        <Icon className="size-5 text-muted-foreground" aria-hidden />
      </span>
      <h2 className="text-xl font-semibold">{title}</h2>
      {description && <div className="max-w-md text-sm leading-relaxed text-muted-foreground">{description}</div>}
      {action && <div className="mt-2 flex flex-wrap justify-center gap-2">{action}</div>}
    </div>
  );
}
