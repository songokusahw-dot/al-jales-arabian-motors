import { CalendarDays, Cog, Fuel, Gauge, Zap, type LucideIcon } from "lucide-react";
import type { SpecItem, SpecKey } from "@/lib/vehicle-specs";
import { cn } from "@/lib/utils";

const ICON: Partial<Record<SpecKey, LucideIcon>> = {
  year: CalendarDays,
  mileage: Gauge,
  fuel: Fuel,
  transmission: Cog,
  engine: Zap,
};

/** Shared key-facts strip (home hero placard + vehicle specs bar). Renders only the items it is given. */
export function SpecStrip({
  items,
  variant = "card",
  className,
}: {
  items: SpecItem[];
  variant?: "card" | "plain" | undefined;
  className?: string | undefined;
}) {
  if (!items.length) return null;
  if (variant === "plain") {
    return (
      <dl className={cn("grid grid-cols-[repeat(auto-fit,minmax(5.5rem,1fr))] gap-3 border-y py-4", className)}>
        {items.map((it) => (
          <div key={it.key} className="min-w-0">
            <dt className="text-xs text-muted-foreground">{it.label}</dt>
            <dd className="mt-1 truncate font-display text-sm font-semibold">{it.ltr ? <span className="ltr-iso">{it.value}</span> : it.value}</dd>
          </div>
        ))}
      </dl>
    );
  }
  return (
    <dl className={cn("flex flex-wrap gap-px overflow-hidden rounded-lg bg-border shadow-card", className)}>
      {items.map((it) => {
        const Icon = ICON[it.key];
        return (
          <div key={it.key} className="flex min-w-0 grow basis-[calc(50%-1px)] items-start gap-3 bg-card px-4 py-4 sm:basis-[calc(33.333%-1px)] lg:basis-0 lg:px-5">
            {Icon && <Icon className="mt-0.5 size-4 shrink-0 text-accent-text" aria-hidden />}
            <div className="min-w-0">
              <dt className="text-xs text-muted-foreground">{it.label}</dt>
              <dd className="mt-1 font-display text-sm font-semibold md:text-base">{it.ltr ? <span className="ltr-iso">{it.value}</span> : it.value}</dd>
            </div>
          </div>
        );
      })}
    </dl>
  );
}
