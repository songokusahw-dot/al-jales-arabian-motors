import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Building2, Gavel, Car, ShieldCheck, Coins, Globe2 } from "lucide-react";
import heroImg from "@/assets/hero-atmosphere.jpg";
import darkImg from "@/assets/dark-atmosphere.jpg";
import { VEHICLES } from "@/data/vehicles";
import { MARKETS, MARKET_LIST } from "@/data/markets";
import { latestArrivals } from "@/lib/inventory";
import { computeTotal, DEMO_KRW_TO_SAR, krwToSarDemo } from "@/lib/pricing";
import { FUEL_LABEL, TRANSMISSION_LABEL, formatKm, formatNumber, formatSAR } from "@/lib/format";
import { pageHead } from "@/lib/seo";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/site/VehicleCard";
import { VehicleImage } from "@/components/site/VehicleImage";
import { BrandMarquee } from "@/components/site/BrandMarquee";
import { ImportJourney } from "@/components/site/ImportJourney";
import { DemoBadge, StatusBadge } from "@/components/site/badges";

export const Route = createFileRoute("/")({
  head: () =>
    pageHead(
      "سيارات من كوريا والسعودية واليمن",
      "الجالس للسيارات: اختر سيارتك من مصادر كوريا أو معرضي السعودية واليمن، بأسعار واضحة بالريال السعودي ورحلة استيراد شفافة.",
    ),
  component: HomePage,
});

const PORTAL_ICON = { KR: Globe2, SA: Building2, YE: Building2 } as const;

function HomePage() {
  const latest = latestArrivals(VEHICLES, 6);
  const featured = VEHICLES.find((v) => v.referenceCode === "KR-01003") ?? latest[0];
  const sample = VEHICLES.find((v) => v.referenceCode === "KR-01001");
  const sampleKrw = sample?.pricing.sourcePriceKRW ?? 0;

  return (
    <>
      {/* HERO */}
      <section className="relative isolate flex min-h-[min(92svh,60rem)] items-end overflow-hidden pb-14 pt-28 md:items-center md:pb-20">
        <img src={heroImg} alt="" width={1920} height={1088} fetchPriority="high" className="absolute inset-0 -z-20 h-full w-full object-cover" />
        <div className="scrim-hero absolute inset-0 -z-10" aria-hidden />
        <div className="container-site">
          <div className="max-w-2xl">
            <p className="eyebrow reveal-up">AL-JALES AUTOMOTIVE · كوريا · السعودية · اليمن</p>
            <h1 className="reveal-up mt-5 text-4xl font-bold leading-[1.15] [animation-delay:120ms] md:text-6xl">
              سيارتك القادمة،
              <br />
              من المصدر إلى بابك.
            </h1>
            <p className="reveal-up mt-5 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:220ms]">
              نختار السيارات من السوق الكوري ونعرضها مع سيارات معرضي السعودية واليمن، بأسعار واضحة بالريال السعودي.
            </p>
            <div className="reveal-up mt-8 flex flex-wrap gap-3 [animation-delay:320ms]">
              <Button asChild variant="hero" size="xl">
                <Link to="/korea/showrooms">
                  <Building2 /> المعارض الكورية
                </Link>
              </Button>
              <Button asChild variant="ink" size="xl">
                <Link to="/korea/auctions">
                  <Gavel /> المزادات
                </Link>
              </Button>
              <Button asChild variant="surface" size="xl">
                <Link to="/our-showrooms">
                  <Car /> سياراتنا
                </Link>
              </Button>
            </div>
          </div>

          <ul className="reveal-up mt-12 grid max-w-3xl grid-cols-1 gap-3 [animation-delay:420ms] sm:grid-cols-3">
            {[
              { icon: Globe2, t: "ثلاثة أسواق", d: "كوريا للاستيراد، والسعودية واليمن معارض محلية." },
              { icon: Coins, t: "عملة موحدة SAR", d: "كل الأسعار المعروضة بالريال السعودي." },
              { icon: ShieldCheck, t: "شفافية في البيانات", d: "لا نعرض سعراً أو فحصاً غير مؤكد." },
            ].map((c) => (
              <li key={c.t} className="notch bg-card/90 p-4 shadow-card backdrop-blur">
                <c.icon className="mb-2 size-5 text-accent-text" aria-hidden />
                <p className="font-display text-sm font-semibold">{c.t}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{c.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <BrandMarquee />

      {/* LATEST */}
      <section className="container-site py-20">
        <SectionHead eyebrow="أضيفت حديثاً" title="أحدث السيارات" action={<Link to="/cars" search={{ sort: "latest" }}>عرض كل السيارات</Link>} />
        <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {latest.map((v) => (
            <li key={v.id}>
              <VehicleCard vehicle={v} className="h-full" />
            </li>
          ))}
        </ul>
      </section>

      {/* MARKETS */}
      <section className="bg-card/60 py-20">
        <div className="container-site">
          <SectionHead eyebrow="اختر السوق" title="ثلاثة معارض، تجربة واحدة" />
          <ul className="mt-8 grid gap-5 md:grid-cols-3">
            {MARKET_LIST.map((m) => {
              const cfg = MARKETS[m];
              const Icon = PORTAL_ICON[m];
              const count = VEHICLES.filter((v) => v.market === m).length;
              return (
                <li key={m}>
                  <Link
                    to={cfg.path}
                    className="group relative flex h-full flex-col justify-between gap-10 overflow-hidden rounded-lg bg-background p-7 shadow-card transition-shadow hover:shadow-lift"
                  >
                    <div className="flex items-start justify-between">
                      <span className="ltr-iso font-display text-6xl font-bold text-muted-foreground/30">{m}</span>
                      <Icon className="size-6 text-accent-text" aria-hidden />
                    </div>
                    <div>
                      <p className="eyebrow">{cfg.roleAr}</p>
                      <h3 className="mt-2 text-2xl font-bold">{cfg.nameAr}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{cfg.descriptionAr}</p>
                      <p className="mt-5 flex items-center justify-between text-sm font-semibold">
                        <span>
                          {formatNumber(count)} سيارات تجريبية <DemoBadge className="ms-1" />
                        </span>
                        <ArrowLeft className="size-5 transition-transform group-hover:-translate-x-1" aria-hidden />
                      </p>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* FEATURED */}
      {featured && (
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
      )}

      {/* JOURNEY */}
      <section className="container-site py-20">
        <SectionHead eyebrow="من كوريا إليك" title="رحلة الاستيراد بخمس مراحل" action={<Link to="/cars/korea">سيارات كوريا</Link>} />
        <div className="mt-10">
          <ImportJourney />
        </div>
      </section>

      {/* PRICING */}
      <section className="bg-card/60 py-20">
        <div className="container-site grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">تسعير شفاف</p>
            <h2 className="mt-3 text-3xl font-bold md:text-4xl">كيف نعرض سعر السيارة الكورية؟</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              نعرض كل المبالغ بالريال السعودي. نحوّل سعر المصدر الكوري بمعدل توضيحي، ونترك كل بند غير مؤكد — كالشحن والجمارك — خارج الإجمالي حتى يُحدَّد فعلياً.
            </p>
            <p className="mt-4 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <DemoBadge /> معدل التحويل التوضيحي <bdi className="ltr-iso font-semibold text-foreground">{DEMO_KRW_TO_SAR} SAR / KRW</bdi> — ليس سعر صرف حياً.
            </p>
          </div>
          <div className="rounded-lg bg-background p-6 shadow-card">
            <p className="mb-4 flex items-center justify-between text-sm font-semibold">
              مثال توضيحي
              <DemoBadge />
            </p>
            <ul className="divide-y text-sm">
              <li className="flex justify-between gap-4 py-3">
                <span>سعر المصدر <span className="ltr-iso text-muted-foreground">({formatNumber(sampleKrw)} KRW × {DEMO_KRW_TO_SAR})</span></span>
                <bdi className="font-semibold">{formatSAR(krwToSarDemo(sampleKrw))}</bdi>
              </li>
              {["الفحص ووثائق التصدير", "الشحن", "الجمارك والتخليص", "أتعاب الخدمة"].map((l) => (
                <li key={l} className="flex justify-between gap-4 py-3">
                  <span>{l}</span>
                  <span className="text-muted-foreground">يُحدَّد عند الطلب</span>
                </li>
              ))}
              <li className="flex justify-between gap-4 py-3 font-display">
                <span className="font-semibold">الإجمالي التقديري</span>
                <bdi className="text-lg font-bold">{formatSAR(krwToSarDemo(sampleKrw))}</bdi>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container-site py-20">
        <div className="notch relative overflow-hidden rounded-lg bg-secondary p-10 text-secondary-foreground md:p-14">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold md:text-4xl">لم تجد سيارتك؟ اطلبها الآن.</h2>
            <p className="mt-3 leading-relaxed opacity-80">أخبرنا بالعلامة والموديل والميزانية، وسنبحث لك في الأسواق الثلاثة.</p>
            <Button asChild variant="hero" size="xl" className="mt-6">
              <Link to="/request-car">
                اطلب سيارة <ArrowLeft />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="container-site grid gap-10 pb-4 md:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow">عن الجالس</p>
          <h2 className="mt-3 text-3xl font-bold">نربطك بالسيارة المناسبة، بوضوح.</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            الجالس للسيارات تعرض سيارات من السوق الكوري ومن معرضيها في السعودية واليمن، مع اهتمام بوضوح السعر ودقة البيانات.
          </p>
          <Button asChild variant="link" className="mt-2 px-0">
            <Link to="/about">
              اقرأ المزيد عنا <ArrowLeft />
            </Link>
          </Button>
        </div>
        <ul className="grid grid-cols-2 gap-3 self-end">
          {(
            [
              { to: "/faq", label: "الأسئلة الشائعة" },
              { to: "/reviews", label: "تقييمات العملاء" },
              { to: "/locations", label: "الفروع والمواقع" },
              { to: "/contact", label: "تواصل معنا" },
            ] as const
          ).map((l) => (
            <li key={l.to}>
              <Link to={l.to} className="flex items-center justify-between rounded-md border bg-card px-4 py-4 text-sm font-semibold transition-colors hover:bg-accent">
                {l.label}
                <ArrowLeft className="size-4" aria-hidden />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

function SectionHead({ eyebrow, title, action }: { eyebrow: string; title: string; action?: React.ReactNode | undefined }) {
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
