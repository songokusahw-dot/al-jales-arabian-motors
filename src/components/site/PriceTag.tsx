import type { Vehicle } from "@/lib/types";
import { computeTotal } from "@/lib/pricing";
import { formatSAR } from "@/lib/format";
import { DemoBadge } from "./badges";
import { cn } from "@/lib/utils";

/** Customer-facing price, always from computeTotal(). Incomplete totals are labelled estimates, never final. */
export function PriceTag({
  vehicle,
  size = "md",
  showNote = true,
  className,
}: {
  vehicle: Vehicle;
  size?: "sm" | "md" | "lg" | undefined;
  showNote?: boolean | undefined;
  className?: string | undefined;
}) {
  const { totalSAR, complete } = computeTotal(vehicle.pricing);
  return (
    <div className={cn("min-w-0", className)}>
      <p className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        {complete ? "سعر البيع" : "السعر التقديري — غير نهائي"}
        {vehicle.pricing.isDemo && size !== "sm" && <DemoBadge label="سعر تجريبي Demo" />}
      </p>
      <p
        className={cn(
          "font-display font-bold",
          size === "sm" && "text-base",
          size === "md" && "mt-0.5 text-2xl",
          size === "lg" && "mt-1 text-3xl md:text-[2.125rem]",
        )}
      >
        <bdi>{formatSAR(totalSAR)}</bdi>
      </p>
      {showNote && size !== "sm" && !complete && (
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          {vehicle.pricing.noteAr ?? "بعض بنود التكلفة لم تُحدَّد بعد ولم تُحتسب."}
        </p>
      )}
    </div>
  );
}
