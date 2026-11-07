import { Link } from "@tanstack/react-router";
import { ArrowUpLeft, Fuel, Gauge, Settings2, CalendarDays } from "lucide-react";
import type { Vehicle } from "@/lib/types";
import { FUEL_LABEL, TRANSMISSION_LABEL, formatKm, formatSAR } from "@/lib/format";
import { computeTotal } from "@/lib/pricing";
import { VehicleImage } from "./VehicleImage";
import { DemoBadge, MarketBadge, StatusBadge } from "./badges";
import { cn } from "@/lib/utils";

export function VehicleCard({ vehicle, className }: { vehicle: Vehicle; className?: string | undefined }) {
  const { totalSAR, complete } = computeTotal(vehicle.pricing);
  const sold = vehicle.status === "sold";
  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-lg bg-card text-card-foreground shadow-card transition-shadow duration-300 hover:shadow-lift focus-within:shadow-lift",
        className,
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <VehicleImage image={vehicle.gallery[0]} className={cn("transition-transform duration-500 group-hover:scale-[1.03]", sold && "opacity-70")} />
        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          <MarketBadge market={vehicle.market} />
          <StatusBadge status={vehicle.status} className="bg-card/90 backdrop-blur" />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-muted-foreground">
              {vehicle.brandAr} · <span className="ltr-iso">{vehicle.brandEn}</span>
            </p>
            <h3 className="mt-1 truncate text-lg font-semibold">
              <Link
                to="/car/$slug"
                params={{ slug: vehicle.slug }}
                className="after:absolute after:inset-0 focus-visible:outline-none"
              >
                {vehicle.modelAr} <span className="ltr-iso text-muted-foreground">{vehicle.year}</span>
              </Link>
            </h3>
          </div>
          <span className="ltr-iso shrink-0 rounded-sm bg-muted px-2 py-1 font-mono text-[0.7rem] text-muted-foreground">
            {vehicle.referenceCode}
          </span>
        </div>

        <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm text-muted-foreground">
          <Spec icon={CalendarDays} label="سنة الصنع" value={vehicle.year ? String(vehicle.year) : "غير محدد"} />
          <Spec icon={Gauge} label="الممشى" value={formatKm(vehicle.mileageKm)} />
          <Spec icon={Fuel} label="الوقود" value={vehicle.fuelType ? FUEL_LABEL[vehicle.fuelType] : "غير محدد"} />
          <Spec icon={Settings2} label="ناقل الحركة" value={vehicle.transmission ? TRANSMISSION_LABEL[vehicle.transmission] : "غير محدد"} />
        </dl>

        <div className="mt-auto flex items-end justify-between gap-3 border-t pt-4">
          <div>
            <p className="text-xs text-muted-foreground">{complete ? "السعر" : "السعر التقديري"}</p>
            <p className={cn("font-display text-xl font-bold", sold && "text-muted-foreground")}>
              <bdi>{formatSAR(totalSAR)}</bdi>
            </p>
          </div>
          <div className="flex items-center gap-2">
            {vehicle.isDemo && <DemoBadge />}
            <span
              aria-hidden
              className="flex size-9 items-center justify-center rounded-full bg-secondary text-secondary-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground"
            >
              <ArrowUpLeft className="size-4" />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

function Spec({ icon: Icon, label, value }: { icon: typeof Fuel; label: string; value: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <Icon className="size-4 shrink-0" aria-hidden />
      <dt className="sr-only">{label}</dt>
      <dd className="truncate text-foreground/85">{value}</dd>
    </div>
  );
}
