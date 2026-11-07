import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { getVehicleBySlug, VEHICLES } from "@/data/vehicles";
import { MARKETS } from "@/data/markets";
import { pageHead } from "@/lib/seo";
import { similarVehicles } from "@/lib/inventory";
import { primarySpecs } from "@/lib/vehicle-specs";
import { Gallery } from "@/components/site/vehicle/Gallery";
import { VehicleTabs } from "@/components/site/vehicle/VehicleTabs";
import { DecisionPanel, InquiryPanel, MobileActionBar } from "@/components/site/vehicle/VehicleActions";
import { SpecStrip } from "@/components/site/SpecStrip";
import { VehicleCard } from "@/components/site/VehicleCard";
import { DemoBadge, MarketBadge, StatusBadge } from "@/components/site/badges";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/car/$slug")({
  loader: ({ params }) => {
    const vehicle = getVehicleBySlug(params.slug);
    if (!vehicle) throw notFound();
    return { vehicle };
  },
  head: ({ loaderData }) =>
    loaderData
      ? pageHead(
          `${loaderData.vehicle.brandAr} ${loaderData.vehicle.modelAr} ${loaderData.vehicle.year ?? ""} — ${loaderData.vehicle.referenceCode}`,
          `${loaderData.vehicle.brandEn} ${loaderData.vehicle.modelEn} ${loaderData.vehicle.year ?? ""} في سوق ${MARKETS[loaderData.vehicle.market].nameAr}. المواصفات وتفاصيل السعر بالريال السعودي.`,
        )
      : pageHead("السيارة غير متوفرة", "السيارة المطلوبة غير موجودة.", { noindex: true }),
  notFoundComponent: () => (
    <div className="container-site flex min-h-[70vh] flex-col items-center justify-center gap-4 pt-24 text-center">
      <h1 className="text-2xl font-bold">السيارة غير موجودة</h1>
      <p className="text-muted-foreground">ربما بيعت السيارة أو تغيّر رابطها.</p>
      <Button asChild variant="hero">
        <Link to="/cars">تصفح كل السيارات</Link>
      </Button>
    </div>
  ),
  component: VehiclePage,
});

function VehiclePage() {
  const { vehicle: v } = Route.useLoaderData();
  const title = `${v.brandAr} ${v.modelAr}`;
  const similar = similarVehicles(VEHICLES, v);
  const market = MARKETS[v.market];

  return (
    <div className="pt-14 md:pt-16">
      {/* THE CUT — showroom stage band with a diagonal lower edge and a thin red edge line */}
      <section aria-labelledby="vehicle-title" className="relative isolate">
        <div aria-hidden className="absolute inset-0 -z-10">
          <div className="cut-edge absolute inset-0 bg-primary" />
          <div className="cut-edge absolute inset-x-0 top-0 bottom-[5px] bg-surface-stage" />
        </div>
        <div className="container-site pb-20 pt-6 md:pb-24 md:pt-8">
          <nav aria-label="مسار التنقل" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">الرئيسية</Link>
            <span aria-hidden>/</span>
            <Link to={market.path} className="hover:text-foreground">
              {market.titleAr}
            </Link>
            <span aria-hidden>/</span>
            <span aria-current="page" className="text-foreground">{title}</span>
          </nav>

          <div className="grid gap-6 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6">
            <header className="reveal-up lg:col-span-4 lg:row-start-1">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <MarketBadge market={v.market} />
                <StatusBadge status={v.status} />
                {v.isDemo && <DemoBadge label="سيارة تجريبية Demo" />}
              </div>
              <h1 id="vehicle-title" className="text-display-md font-bold">
                {title} <span className="ltr-iso text-muted-foreground">{v.year}</span>
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="ltr-iso">{v.brandEn} {v.modelEn}</span>
              </p>
              <p className="mt-3 inline-flex items-center gap-2 rounded-md bg-card/70 px-2.5 py-1 text-xs text-muted-foreground">
                الرقم المرجعي <span className="ltr-iso font-mono text-sm font-semibold text-foreground">{v.referenceCode}</span>
              </p>
            </header>

            <div className="min-w-0 lg:col-span-8 lg:col-start-5 lg:row-span-2 lg:row-start-1">
              <Gallery images={v.gallery} title={title} referenceCode={v.referenceCode} />
            </div>

            <div className="lg:col-span-4 lg:row-start-2 lg:self-start">
              <DecisionPanel v={v} />
            </div>
          </div>
        </div>
      </section>

      <div className="container-site">
        <div className="relative -mt-10 md:-mt-12">
          <h2 className="sr-only">المواصفات الأساسية</h2>
          <SpecStrip items={primarySpecs(v)} />
        </div>

        <div className="mt-12 md:mt-16">
          <VehicleTabs v={v} />
        </div>

        <div className="mt-14 md:mt-20">
          <InquiryPanel v={v} title={title} />
        </div>

        {similar.length > 0 && (
          <section className="mt-20">
            <h2 className="mb-6 text-2xl font-bold">سيارات مشابهة</h2>
            <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {similar.map((s) => (
                <li key={s.id}>
                  <VehicleCard vehicle={s} className="h-full" />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>

      <MobileActionBar v={v} />
    </div>
  );
}
