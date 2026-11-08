import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { VEHICLES } from "@/data/vehicles";
import { latestArrivals } from "@/lib/inventory";
import { primarySpecs } from "@/lib/vehicle-specs";
import type { Vehicle } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { VehicleImage } from "@/components/site/VehicleImage";
import { SpecStrip } from "@/components/site/SpecStrip";
import { PriceTag } from "@/components/site/PriceTag";
import { DemoBadge, MarketBadge, StatusBadge } from "@/components/site/badges";

/** Featured vehicle shown on the hero stage (was the standalone FeaturedVehicle section). */
const FEATURED_REF = "KR-01003";

const FACTS = [
  { t: "ثلاثة أسواق", d: "كوريا للاستيراد، والسعودية واليمن معارض محلية." },
  { t: "عملة موحدة SAR", d: "كل الأسعار المعروضة بالريال السعودي." },
  { t: "شفافية في البيانات", d: "لا نعرض سعراً أو فحصاً غير مؤكد." },
];

export function HomeHero() {
  const featured = VEHICLES.find((v) => v.referenceCode === FEATURED_REF) ?? latestArrivals(VEHICLES, 6)[0];
  return (
    <section aria-labelledby="hero-title" className="relative isolate overflow-hidden pt-14 md:pt-16">
      {/* THE CUT — desktop stage panel with a slanted inner edge and a thin red edge line */}
      <div aria-hidden className="cut-reveal pointer-events-none absolute bottom-0 end-0 top-16 -z-10 hidden w-[48%] xl:block">
        <div className="cut-slant absolute inset-0 bg-primary" />
        <div className="cut-slant absolute inset-y-0 start-[4px] end-0 bg-surface-stage" />
      </div>

      <div className="container-site grid gap-y-8 pt-7 md:pt-12 xl:min-h-[min(86svh,50rem)] xl:grid-cols-12 xl:items-center xl:gap-x-8 xl:py-16">
        <div className="xl:col-span-7 xl:pe-10">
          <p className="eyebrow reveal-up">AL-JALES AUTOMOTIVE · كوريا · السعودية · اليمن</p>
          <h1 id="hero-title" className="mt-4 text-display-xl font-bold">
            <span className="reveal-up block [animation-delay:80ms]">سيارتك القادمة،</span>
            <span className="reveal-up block [animation-delay:170ms]">من المصدر</span>
            <span className="reveal-up block [animation-delay:260ms]">إلى بابك.</span>
          </h1>
          <p className="reveal-up mt-5 max-w-xl text-base leading-relaxed text-muted-foreground [animation-delay:340ms] md:text-lg">
            نختار السيارات من السوق الكوري ونعرضها مع سيارات معرضي السعودية واليمن، بأسعار واضحة بالريال السعودي.
          </p>
          <div className="reveal-up mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 [animation-delay:400ms]">
            <Button asChild variant="hero" size="xl" className="transition-[background-color,transform] active:scale-[0.98]">
              <Link to="/cars">
                تصفح السيارات <ArrowLeft />
              </Link>
            </Button>
            <Link
              to="/korea/showrooms"
              className="group inline-flex items-center gap-1.5 font-display text-sm font-semibold text-foreground underline-offset-[6px] hover:underline"
            >
              المعارض الكورية والمزادات
              <ArrowLeft className="size-4 text-accent-text transition-transform group-hover:-translate-x-1" aria-hidden />
            </Link>
          </div>
          <dl className="reveal-up mt-10 hidden max-w-xl grid-cols-3 gap-6 border-t pt-6 [animation-delay:500ms] sm:grid">
            {FACTS.map((f) => (
              <div key={f.t}>
                <dt className="font-display text-sm font-semibold">{f.t}</dt>
                <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{f.d}</dd>
              </div>
            ))}
          </dl>
        </div>

        {featured && <HeroStage v={featured} />}
      </div>
    </section>
  );
}

function HeroStage({ v }: { v: Vehicle }) {
  const title = `${v.brandAr} ${v.modelAr}`;
  const facts = primarySpecs(v).filter((s) => s.key === "mileage" || s.key === "fuel" || s.key === "transmission");
  return (
    <div className="relative -mx-5 px-5 pb-12 pt-12 md:-mx-8 md:px-8 md:pb-14 md:pt-20 xl:col-span-5 xl:mx-0 xl:px-0 xl:py-0">
      {/* Mobile/tablet: the same cut becomes a diagonal top edge */}
      <div aria-hidden className="absolute inset-0 -z-10 xl:hidden">
        <div className="cut-edge-top absolute inset-0 bg-primary" />
        <div className="cut-edge-top absolute inset-x-0 bottom-0 top-[5px] bg-surface-stage" />
      </div>

      <figure className="relative md:grid md:grid-cols-2 md:items-center md:gap-8 xl:block">
        <div className="@container relative">
          <span aria-hidden className="stage-code fade-soft absolute inset-x-0 top-1/2 -translate-y-1/2 text-center [animation-delay:500ms]">
            {v.referenceCode}
          </span>
          <div className="stage-in relative mx-auto aspect-[16/9] max-w-xl">
            <VehicleImage image={v.gallery[0]} eager fit="contain" className="bg-transparent" sizes="(min-width: 1280px) 40vw, (min-width: 768px) 50vw, 100vw" />
          </div>
        </div>

        <figcaption className="reveal-up relative mx-auto -mt-2 w-full max-w-xl md:mt-0 xl:-mt-4 rounded-lg bg-card p-5 shadow-lift [animation-delay:550ms]">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="eyebrow">سيارة مختارة</p>
            <div className="flex flex-wrap items-center gap-1.5">
              <MarketBadge market={v.market} />
              <StatusBadge status={v.status} />
              {v.isDemo && <DemoBadge />}
            </div>
          </div>
          <p className="mt-3 font-display text-xl font-bold md:text-2xl">
            {title} <span className="ltr-iso text-muted-foreground">{v.year}</span>
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            <span className="ltr-iso">{v.brandEn} {v.modelEn}</span> · الرقم المرجعي <span className="ltr-iso font-mono">{v.referenceCode}</span>
          </p>
          <SpecStrip items={facts} variant="plain" className="mt-4" />
          <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
            <PriceTag vehicle={v} size="md" showNote={false} />
            <Button asChild variant="surface" className="transition-[background-color,transform] active:scale-[0.98]">
              <Link to="/car/$slug" params={{ slug: v.slug }}>
                تفاصيل السيارة <ArrowLeft />
              </Link>
            </Button>
          </div>
        </figcaption>
      </figure>
    </div>
  );
}
