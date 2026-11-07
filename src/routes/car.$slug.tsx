import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { MessageSquareText, CalendarCheck, Ban, Clock3, Check } from "lucide-react";
import { getVehicleBySlug, VEHICLES } from "@/data/vehicles";
import { FEATURE_CATALOG, FEATURE_CATEGORY_LABEL } from "@/data/features";
import { MARKETS } from "@/data/markets";
import { pageHead } from "@/lib/seo";
import { computeTotal } from "@/lib/pricing";
import { canBook, similarVehicles } from "@/lib/inventory";
import { BODY_LABEL, FUEL_LABEL, TRANSMISSION_LABEL, formatKm, formatNumber, formatSAR } from "@/lib/format";
import type { FeatureCategory, Vehicle } from "@/lib/types";
import { whatsappLink } from "@/config/site";
import { Gallery } from "@/components/site/vehicle/Gallery";
import { PriceBreakdown } from "@/components/site/vehicle/PriceBreakdown";
import { InspectionReport } from "@/components/site/vehicle/InspectionReport";
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
  const { totalSAR, complete } = computeTotal(v.pricing);
  const title = `${v.brandAr} ${v.modelAr}`;
  const similar = similarVehicles(VEHICLES, v);

  return (
    <div className="pb-28 pt-24 md:pt-28 lg:pb-0">
      <div className="container-site">
        <nav aria-label="مسار التنقل" className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground">الرئيسية</Link>
          <span aria-hidden>/</span>
          <Link to={MARKETS[v.market].path} className="hover:text-foreground">
            {MARKETS[v.market].titleAr}
          </Link>
          <span aria-hidden>/</span>
          <span aria-current="page" className="text-foreground">{title}</span>
        </nav>

        <div className="grid gap-10 lg:grid-cols-[1fr_24rem]">
          <div className="min-w-0">
            <header className="mb-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <MarketBadge market={v.market} />
                <StatusBadge status={v.status} />
                {v.isDemo && <DemoBadge label="سيارة تجريبية Demo" />}
              </div>
              <p className="text-sm text-muted-foreground">
                <span className="ltr-iso">{v.brandEn} {v.modelEn}</span> · الرقم المرجعي <span className="ltr-iso font-mono">{v.referenceCode}</span>
              </p>
              <h1 className="mt-2 text-3xl font-bold md:text-5xl">
                {title} <span className="ltr-iso text-muted-foreground">{v.year}</span>
              </h1>
            </header>

            <Gallery images={v.gallery} title={title} />

            <Section title="المواصفات">
              <Specs v={v} />
            </Section>

            <Section title="السعر">
              <PriceBreakdown vehicle={v} />
            </Section>

            <Section title="التجهيزات والمميزات">
              <Features v={v} />
            </Section>

            <Section title="تقرير الفحص">
              <InspectionReport vehicle={v} />
            </Section>
          </div>

          <aside aria-label="ملخص السيارة" className="hidden lg:block">
            <div className="sticky top-28">
              <Summary v={v} totalSAR={totalSAR} complete={complete} />
            </div>
          </aside>
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

      {/* Mobile sticky summary */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t bg-background/95 p-3 backdrop-blur lg:hidden">
        <div className="container-site flex items-center justify-between gap-3 px-0">
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">{complete ? "السعر" : "السعر التقديري"}</p>
            <p className="font-display text-lg font-bold"><bdi>{formatSAR(totalSAR)}</bdi></p>
          </div>
          <Ctas v={v} compact />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="mb-4 text-xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

function Summary({ v, totalSAR, complete }: { v: Vehicle; totalSAR: number | null; complete: boolean }) {
  return (
    <div className="rounded-lg bg-card p-6 shadow-lift">
      <p className="text-sm text-muted-foreground">{complete ? "السعر النهائي" : "السعر التقديري"}</p>
      <p className="mt-1 font-display text-3xl font-bold"><bdi>{formatSAR(totalSAR)}</bdi></p>
      {!complete && <p className="mt-1 text-xs text-muted-foreground">بعض بنود التكلفة لم تُحدَّد بعد ولم تُحتسب.</p>}
      {v.isDemo && <DemoBadge className="mt-3" label="سعر تجريبي Demo" />}
      <div className="my-5 h-px bg-border" />
      <StatusLine v={v} />
      <div className="mt-5">
        <Ctas v={v} />
      </div>
    </div>
  );
}

function StatusLine({ v }: { v: Vehicle }) {
  if (v.status === "sold")
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-muted-foreground"><Ban className="size-4" aria-hidden /> تم بيع هذه السيارة — الحجز غير متاح.</p>
    );
  if (v.status === "reserved")
    return (
      <p className="flex items-center gap-2 text-sm font-medium text-warning"><Clock3 className="size-4" aria-hidden /> السيارة محجوزة حالياً — يمكنك الاستفسار فقط.</p>
    );
  return <p className="flex items-center gap-2 text-sm font-medium text-success"><Check className="size-4" aria-hidden /> السيارة متاحة للاستفسار والحجز.</p>;
}

function Ctas({ v, compact = false }: { v: Vehicle; compact?: boolean }) {
  const message = `مرحباً، أستفسر عن ${v.brandEn} ${v.modelEn} ${v.year ?? ""} — ${v.referenceCode}`;
  const wa = whatsappLink(message);
  return (
    <div className={compact ? "flex shrink-0 gap-2" : "flex flex-col gap-2"}>
      <Button asChild variant={canBook(v) ? "surface" : "hero"} size={compact ? "default" : "lg"}>
        <Link to="/ask-question" search={{ car: v.referenceCode }}>
          <MessageSquareText /> استفسر{compact ? "" : " عن السيارة"}
        </Link>
      </Button>
      {canBook(v) && (
        <Button asChild variant="hero" size={compact ? "default" : "lg"}>
          <Link to="/request-car" search={{ car: v.referenceCode }}>
            <CalendarCheck /> اطلب حجزاً
          </Link>
        </Button>
      )}
      {wa && !compact && (
        <Button asChild variant="ink" size="lg">
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => {
              const withUrl = whatsappLink(`${message} — ${window.location.href}`);
              if (withUrl) e.currentTarget.href = withUrl;
            }}
          >
            واتساب
          </a>
        </Button>
      )}
    </div>
  );
}

function Specs({ v }: { v: Vehicle }) {
  const rows: [string, string | null][] = [
    ["سنة الصنع", v.year ? String(v.year) : null],
    ["الممشى", v.mileageKm !== null ? formatKm(v.mileageKm) : null],
    ["نوع الوقود", v.fuelType ? FUEL_LABEL[v.fuelType] : null],
    ["ناقل الحركة", v.transmission ? TRANSMISSION_LABEL[v.transmission] : null],
    ["سعة المحرك", v.engineCapacityCc ? `${formatNumber(v.engineCapacityCc)} سي سي` : null],
    ["القوة", v.horsepower ? `${formatNumber(v.horsepower)} حصان` : null],
    ["نظام الدفع", v.drivetrain ?? null],
    ["نوع الهيكل", v.bodyType ? BODY_LABEL[v.bodyType] : null],
    ["المقاعد", v.seats ? String(v.seats) : null],
    ["الأبواب", v.doors ? String(v.doors) : null],
    ["اللون الخارجي", v.exteriorColor ?? null],
    ["اللون الداخلي", v.interiorColor ?? null],
  ];
  const shown = rows.filter((r): r is [string, string] => r[1] !== null);
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border shadow-card sm:grid-cols-3">
      {shown.map(([k, val]) => (
        <div key={k} className="bg-card p-4">
          <dt className="text-xs text-muted-foreground">{k}</dt>
          <dd className="mt-1 font-semibold">{val}</dd>
        </div>
      ))}
    </dl>
  );
}

function Features({ v }: { v: Vehicle }) {
  if (!v.features.length) return <p className="text-sm text-muted-foreground">لم تُسجَّل تجهيزات لهذه السيارة بعد.</p>;
  const groups = new Map<FeatureCategory, string[]>();
  v.features.forEach((k) => {
    const f = FEATURE_CATALOG[k];
    if (!f) return;
    groups.set(f.category, [...(groups.get(f.category) ?? []), f.labelAr]);
  });
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {[...groups.entries()].map(([cat, items]) => (
        <div key={cat} className="rounded-lg bg-card p-5 shadow-card">
          <h3 className="mb-3 text-sm font-semibold text-muted-foreground">{FEATURE_CATEGORY_LABEL[cat]}</h3>
          <ul className="flex flex-col gap-2 text-sm">
            {items.map((i) => (
              <li key={i} className="flex items-center gap-2">
                <Check className="size-4 text-success" aria-hidden /> {i}
              </li>
            ))}
          </ul>
        </div>
      ))}
      {v.isDemo && <p className="text-xs text-muted-foreground sm:col-span-3">قائمة التجهيزات تجريبية وتُؤكَّد عند الاستفسار.</p>}
    </div>
  );
}
