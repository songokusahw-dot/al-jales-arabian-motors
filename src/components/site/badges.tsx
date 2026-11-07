import { CheckCircle2, Clock3, Ban } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { STATUS_LABEL } from "@/lib/format";
import type { MarketCode, VehicleStatus } from "@/lib/types";
import { MARKETS } from "@/data/markets";
import { cn } from "@/lib/utils";

export function DemoBadge({ className, label = "Demo" }: { className?: string; label?: string }) {
  return (
    <Badge variant="demo" className={cn("ltr-iso", className)} title="بيانات تجريبية">
      {label}
    </Badge>
  );
}

const STATUS_ICON = { available: CheckCircle2, reserved: Clock3, sold: Ban } as const;

export function StatusBadge({ status, className }: { status: VehicleStatus; className?: string }) {
  const Icon = STATUS_ICON[status];
  return (
    <Badge variant={status} className={cn("gap-1", className)}>
      <Icon className="size-3.5" aria-hidden />
      {STATUS_LABEL[status]}
    </Badge>
  );
}

export function MarketBadge({ market, className }: { market: MarketCode; className?: string }) {
  return (
    <Badge variant="market" className={cn("gap-1.5", className)}>
      <span className="ltr-iso text-[0.65rem] opacity-80">{market}</span>
      {MARKETS[market].nameAr}
    </Badge>
  );
}
