import type { ReactNode } from "react";

export function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: ReactNode | undefined }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2 className="mt-2 text-3xl font-bold md:text-4xl">{title}</h2>
      </div>
      {action && <div className="text-sm font-semibold text-accent-text underline-offset-4 hover:underline">{action}</div>}
    </div>
  );
}
