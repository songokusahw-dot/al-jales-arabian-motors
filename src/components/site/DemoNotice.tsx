import { Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function DemoNotice({ children, className }: { children: ReactNode; className?: string | undefined }) {
  return (
    <div
      role="note"
      className={cn("flex items-start gap-3 rounded-md border border-dashed border-muted-foreground/50 bg-muted/50 p-4 text-sm leading-relaxed", className)}
    >
      <Info className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />
      <div>{children}</div>
    </div>
  );
}
