import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import darkImg from "@/assets/dark-atmosphere.jpg";
import { VEHICLES } from "@/data/vehicles";
import { MARKETS } from "@/data/markets";
import { latestArrivals } from "@/lib/inventory";
import { computeTotal } from "@/lib/pricing";
import { FUEL_LABEL, TRANSMISSION_LABEL, formatKm, formatSAR } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { VehicleImage } from "@/components/site/VehicleImage";
import { StatusBadge } from "@/components/site/badges";

export function FeaturedVehicle() {
  const featured = VEHICLES.find((v) => v.referenceCode === "KR-01003") ?? latestArrivals(VEHICLES, 6)[0];
  if (!featured) return null;
  return (
        <section className="relative isolate overflow-hidden bg-ink py-20 text-ink-foreground">
          <img src={darkImg} alt="" width={1600} height={912} loading="lazy" className="absolute inset-0 -z-10 h-full w-full object-cover opacity-70" />
          <div className="container-site grid items-center gap-10 lg:grid-cols-[1.2fr_1fr]">
            <div className="overflow-hidden rounded-lg shadow-lift">
              <div className="aspect-[16/10]">
                <VehicleImage image={featured.gallery[0]} />
              </div>
            </div>
            <div>
              <p className="font-display text-xs font-semibold uppercase tracking-[0.08em] text-ink-foreground/70">سيارة مختارة · {MARKETS[featured.market].nameAr}</p>
              <h2 className="mt-3 text-3xl font-bold md:text-5xl">
                {featured.brandAr} {featured.modelAr} <span className="ltr-iso text-ink-foreground/60">{featured.year}</span>
              </h2>
              <div className="mt-4 flex flex-wrap gap-2">
                <StatusBadge status={featured.status} className="bg-card text-success" />
                <span className="ltr-iso rounded-md bg-ink-foreground/10 px-2 py-0.5 font-mono text-xs">{featured.referenceCode}</span>
              </div>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-y border-ink-foreground/15 py-6">
                <div>
                  <dt className="text-xs text-ink-foreground/65">الممشى</dt>
                  <dd className="mt-1 font-semibold">{formatKm(featured.mileageKm)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-foreground/65">الوقود</dt>
                  <dd className="mt-1 font-semibold">{featured.fuelType ? FUEL_LABEL[featured.fuelType] : "—"}</dd>
                </div>
                <div>
                  <dt className="text-xs text-ink-foreground/65">ناقل الحركة</dt>
                  <dd className="mt-1 font-semibold">{featured.transmission ? TRANSMISSION_LABEL[featured.transmission] : "—"}</dd>
                </div>
              </dl>
              <p className="mt-6 text-sm text-ink-foreground/70">السعر التقديري</p>
              <p className="font-display text-3xl font-bold">
                <bdi>{formatSAR(computeTotal(featured.pricing).totalSAR)}</bdi>
              </p>
              <Button asChild variant="hero" size="xl" className="mt-6">
                <Link to="/car/$slug" params={{ slug: featured.slug }}>
                  تفاصيل السيارة <ArrowLeft />
                </Link>
              </Button>
            </div>
          </div>
        </section>
  );
}
